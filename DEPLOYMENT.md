# 🚀 AI Taskers Platform — Deployment Guide

This guide walks you through deploying the AI Taskers Platform to production using free-tier services.

## 📋 Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Vercel account created (https://vercel.com)
- [ ] Supabase account created (https://supabase.com)
- [ ] Paystack account created (https://paystack.com) — for payments
- [ ] WhatsApp group created and invite link ready
- [ ] Custom domain purchased (optional)

---

## 🗄️ Step 1: Set Up Supabase Database (Free Tier)

### 1.1 Create a Supabase Project
1. Go to https://supabase.com → Sign up
2. Click "New Project"
3. Fill in:
   - **Name:** `ai-taskers-prod`
   - **Database Password:** Generate a strong password and SAVE it
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier
4. Click "Create new project" — wait ~2 minutes

### 1.2 Get Database Credentials
1. Go to **Project Settings** (gear icon) → **Database**
2. Copy the **Connection string** → "URI" format
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. This is your `DATABASE_URL`

### 1.3 Switch Prisma to PostgreSQL
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 1.4 Push Schema to Supabase
```bash
# Set DATABASE_URL to your Supabase connection string
export DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxxx.supabase.co:5432/postgres"

# Push the schema
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Optional: Seed production database
npx tsx scripts/seed.ts
```

### 1.5 Enable Row Level Security (Recommended)
In Supabase Dashboard → **Authentication** → **Policies**:
- Enable RLS on all tables
- Create policies:
  - `tasker_profiles`: SELECT for all (public directory), UPDATE for owner, all for admin
  - `employer_posts`: SELECT for premium users, INSERT for owner, all for admin
  - `notifications`: SELECT for owner or sent_to_all, INSERT for admin
  - Other tables: similar patterns

---

## 💳 Step 2: Set Up Paystack (For Payments)

### 2.1 Get API Keys
1. Go to https://dashboard.paystack.com → Sign up
2. Go to **Settings** → **API Keys & Webhooks**
3. Copy:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2.2 Configure Webhook
1. In Paystack dashboard, set Webhook URL to:
   ```
   https://your-domain.vercel.app/api/payments/webhook
   ```
2. Save changes

---

## 🚀 Step 3: Deploy to Vercel (Free Tier)

### 3.1 Push Code to GitHub
```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: AI Taskers Platform"

# Create a new GitHub repo at https://github.com/new
# Then push:
git remote add origin https://github.com/your-username/ai-taskers.git
git branch -M main
git push -u origin main
```
https://github.com/kalinitech/ai-taskers.git
### 3.2 Import to Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New" → "Project"
3. Import your `ai-taskers` repository
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (or `bun install`)

### 3.3 Set Environment Variables
In Vercel project settings → "Environment Variables", add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres:PASSWORD@db.xxxxxx.supabase.co:5432/postgres` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` (use your Vercel URL) |
| `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` | `https://chat.whatsapp.com/your-invite` |
| `SUPPORT_EMAIL` | `support@aitaskers.com` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | `pk_live_xxxxxxxx` |
| `PAYSTACK_SECRET_KEY` | `sk_live_xxxxxxxx` |

### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app is live at `https://your-project.vercel.app` 🎉

### 3.5 Verify Deployment
- [ ] Homepage loads without errors
- [ ] Can sign in with admin@aitaskers.com / admin123
- [ ] Admin dashboard works
- [ ] PWA installable (check address bar for install icon)
- [ ] Service worker registered (DevTools → Application → Service Workers)

---

## 🌐 Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel
1. Go to Project Settings → "Domains"
2. Click "Add" → enter your domain (e.g., `aitaskers.com`)
3. Choose whether to use apex domain or www subdomain

### 4.2 Configure DNS
At your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
- Add CNAME record: `www` → `cname.vercel-dns.com`
- Add A record: `@` → `76.76.21.21` (Vercel's IP)

### 4.3 Update Environment Variables
After custom domain is live:
1. Update `NEXT_PUBLIC_SITE_URL` to `https://aitaskers.com`
2. Update Paystack webhook URL to `https://aitaskers.com/api/payments/webhook`
3. Redeploy

---

## 🔒 Step 5: Production Hardening

### 5.1 Change Admin Password
After deployment, IMMEDIATELY:
1. Sign in with default admin credentials
2. Update admin password via API or database directly
3. Or create a new admin user and delete the default one

### 5.2 Replace Demo Hash with bcrypt
The demo uses a simple hash function. For production:

```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```

Update `src/app/api/auth/login/route.ts` and `src/app/api/auth/signup/route.ts`:
```typescript
import bcrypt from 'bcryptjs'

// In signup:
const passwordHash = await bcrypt.hash(password, 12)

// In login:
const isValid = await bcrypt.compare(password, user.passwordHash)
if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
```

### 5.3 Add Rate Limiting (Recommended)
```bash
bun add @upstash/ratelimit @upstash/redis
```

Create `src/lib/rate-limit.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
})
```

Use in API routes:
```typescript
import { ratelimit } from "@/lib/rate-limit"

const { success } = await ratelimit.limit(ip)
if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
```

### 5.4 Add Error Monitoring
```bash
bun add @sentry/nextjs
```

Follow Sentry's Next.js setup guide.

### 5.5 Enable Vercel Analytics
1. Go to Vercel project → "Analytics" tab
2. Enable Web Analytics (free tier)
3. No code changes needed

---

## 📊 Step 6: Post-Deployment Operations

### 6.1 Database Backups
Supabase Free tier includes daily backups (7-day retention).
For more frequent backups, upgrade to Pro tier.

### 6.2 Monitor Usage
- **Vercel:** Bandwidth, function executions
- **Supabase:** Database size, API requests, auth users

### 6.3 Regular Maintenance
- Update dependencies monthly: `bun update`
- Review admin actions weekly
- Audit user-generated content for scams/fraud
- Backup database before major changes

---

## 🆘 Troubleshooting Deployment

### Build fails on Vercel
1. Check Vercel build logs
2. Common issues:
   - Missing environment variables
   - Prisma client not generated (add `postinstall` script: `prisma generate`)
   - TypeScript errors (run `bun run lint` locally)

### Database connection issues
1. Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/db`
2. Check Supabase project is not paused (free tier pauses after 7 days inactivity)
3. Ensure IP is not blocked (Supabase allows all IPs by default)

### PWA not working
1. Verify `manifest.json` is accessible at `/manifest.json`
2. Check service worker registration in browser DevTools
3. Ensure HTTPS (Vercel provides this automatically)
4. Verify icons exist in `/public/icons/`

### Paystack webhook not receiving events
1. Verify webhook URL is publicly accessible
2. Check Paystack dashboard for failed webhook attempts
3. Verify `PAYSTACK_SECRET_KEY` is set correctly

---

## 💰 Cost Estimate (Free Tier)

| Service | Free Tier Limits | This App Usage |
|---------|-----------------|----------------|
| **Vercel** | 100GB bandwidth, 1000 builds/month | Well under limits |
| **Supabase** | 500MB database, 50MB file storage, 50k monthly active users | Sufficient for ~1000 users |
| **Paystack** | No monthly fees, 3.9% + $0.50 per transaction | Only when payments occur |
| **GitHub** | Unlimited public repos, 2000 actions min/month | Sufficient |
| **Total monthly cost** | **$0** for first 1000 users | Upgrade only when scaling |

---

## 🎯 Production URL Examples

After deployment, your app will be accessible at:
- **Vercel subdomain:** `https://ai-taskers.vercel.app`
- **Custom domain:** `https://aitaskers.com` (if configured)

Share these URLs with:
- Taskers looking to register
- Employers looking to hire
- Admin users for dashboard access

---

## ✅ Final Verification

After completing all steps, verify these work:

- [ ] Visit homepage — hero, featured taskers, leaderboard render
- [ ] Sign in as admin — admin dashboard accessible
- [ ] Sign in as tasker — dashboard shows profile stats
- [ ] Sign in as employer — can post jobs
- [ ] Browse taskers — filters and search work
- [ ] View tasker detail — all tabs (About, Proofs, Reviews, Badges) populate
- [ ] Pricing page — Featured and Premium plans visible
- [ ] Subscribe to a plan (test mode) — tasker profile updates
- [ ] Admin sends notification — appears in user's notification bell
- [ ] Install PWA on mobile — works offline
- [ ] Terms and Privacy pages accessible from footer
- [ ] WhatsApp community link works

---

**🎉 Congratulations! Your AI Taskers Platform is now live in production.**

For support: support@aitaskers.com
