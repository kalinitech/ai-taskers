# 🚀 AI Taskers Platform - Production Deployment Guide

**Version:** 2.0 (Production Ready)
**Last Updated:** June 2026
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Deployment to Vercel](#deployment-to-vercel)
6. [Payment Gateway Setup](#payment-gateway-setup)
7. [PWA Configuration](#pwa-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Development (Local)

```bash
# 1. Clone or extract the project
cd ai-taskers-platform

# 2. Install dependencies
npm install
# or
bun install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
# or
bun run dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

### For Production (Vercel)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect to Vercel
# Visit https://vercel.com/new
# Select your GitHub repository
# Vercel will auto-detect Next.js configuration

# 3. Configure environment variables in Vercel dashboard
# Add all variables from .env.example

# 4. Deploy
# Automatic deployment on every push to main
```

---

## Prerequisites

### Required Software

- **Node.js**: v18.17 or higher
- **npm** or **bun**: Latest version
- **Git**: For version control
- **GitHub Account**: For hosting code
- **Vercel Account**: For deployment (free tier available)
- **Supabase Account**: For database (free tier: 500 MB storage)
- **Paystack Account**: For payments (register at https://paystack.com)

### Recommended Tools

- **VS Code**: Code editor
- **Postman**: API testing
- **Database Viewer**: pgAdmin or similar for Supabase

---

## Environment Setup

### Step 1: Create `.env.local` File

```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Fill in Environment Variables

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================
# PAYSTACK PAYMENT GATEWAY
# ============================================
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxx (test mode)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxx (test mode)

# For production, use live keys:
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
# PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxx

# ============================================
# WHATSAPP COMMUNITY
# ============================================
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/EtCHmPZWKtO800idJ2MNd9

# ============================================
# APPLICATION SETTINGS
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000 (dev) or https://your-domain.com (prod)
NEXT_PUBLIC_APP_NAME=AITaskers Platform
NODE_ENV=development

# ============================================
# ADMIN SETTINGS
# ============================================
ADMIN_EMAIL=admin@aitaskers.com
```

### Step 3: Verify Configuration

```bash
# Test that all environment variables are accessible
npm run verify-env
```

---

## Database Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project name: `ai-taskers-platform`
4. Create a strong database password
5. Wait for project to be created (2-3 minutes)

### Step 2: Get Connection Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Create Database Tables

The schema is in `prisma/schema.prisma`. Run migrations:

```bash
# Install Prisma
npm install -D prisma @prisma/client

# Generate Prisma client
npx prisma generate

# Create tables (using SQL)
# Copy SQL from prisma/schema.prisma and execute in Supabase SQL Editor
```

**Alternative: Use Supabase SQL Editor**

1. Go to Supabase Dashboard → **SQL Editor**
2. Create new query
3. Copy and paste the SQL schema from the file: `supabase-schema.sql`
4. Run the query

### Step 4: Enable Row Level Security (RLS)

For security, enable RLS on all tables:

```sql
-- Example for tasker_profiles table
ALTER TABLE tasker_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own profiles
CREATE POLICY "Users can view own profile"
ON tasker_profiles FOR SELECT
USING (auth.uid() = id);

-- Create policy for admins to see all
CREATE POLICY "Admins can view all profiles"
ON tasker_profiles FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');
```

### Step 5: Enable Real-time Updates

For live notifications and updates:

1. Go to **Database** → **Replication**
2. Enable replication for tables:
   - `tasker_profiles`
   - `employer_posts`
   - `notifications`
   - `ratings`

---

## Deployment to Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Production ready: Theme updated, all features implemented"
git push origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js configuration
5. Click "Import"

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_WHATSAPP_GROUP_LINK`
   - `NEXT_PUBLIC_APP_URL`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Get your URL: `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `aitaskers.com`)
3. Update DNS records according to Vercel instructions
4. SSL certificate is auto-generated (free)

---

## Payment Gateway Setup

### Paystack Integration

#### Test Mode (Development)

1. Go to https://paystack.com
2. Sign up for an account
3. Go to **Settings** → **API Keys**
4. Use **Test Keys**:
   - Public Key: `pk_test_...`
   - Secret Key: `sk_test_...`
5. Add to `.env.local`

#### Production Mode (Live)

1. Complete Paystack verification
2. Get **Live Keys**:
   - Public Key: `pk_live_...`
   - Secret Key: `sk_live_...`
3. Update in Vercel environment variables
4. Configure webhook: `https://your-domain.com/api/payments/webhook`

### Test Payments

**Test Card Details** (in test mode):
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

---

## PWA Configuration

### Manifest File

Located at `public/manifest.json`. Ensures the app can be installed:

```json
{
  "name": "AITaskers Platform",
  "short_name": "AITaskers",
  "description": "Find Verified AI Trainers & Data Annotators Worldwide",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1E2A5E",
  "background_color": "#ffffff"
}
```

### Service Worker

Located at `public/sw.js`. Handles offline functionality:

- Caches essential files on first load
- Serves cached files when offline
- Shows offline page if network unavailable

### Install Prompts

To install on home screen:
- **iOS**: Open in Safari → Share → Add to Home Screen
- **Android**: Three dots menu → Install app (or "Add to Home Screen")
- **Desktop**: Address bar → Install icon

---

## Post-Deployment Verification

### Checklist

Run these tests after deployment:

```bash
# 1. Check website loads
curl https://your-domain.com

# 2. Verify environment variables are accessible
# Try logging in - if it fails, env vars might be missing

# 3. Test database connection
# Create a test tasker profile via admin dashboard

# 4. Test payments (test mode)
# Try to upgrade to premium with test card

# 5. Check PWA installability
# Run Lighthouse in Chrome DevTools
# Target score: > 90 on Performance and PWA

# 6. Test real-time updates
# Open app in 2 browser tabs
# Update a profile in one tab - should reflect in other without reload

# 7. Mobile responsiveness
# Test on iOS and Android devices
# Check all pages are responsive and functional
```

### Performance Monitoring

1. **Vercel Analytics**: https://vercel.com/analytics
   - Monitor page load times
   - Track Web Vitals
   - Identify bottlenecks

2. **Supabase Monitoring**: https://supabase.com/studio
   - Monitor database queries
   - Check storage usage
   - View realtime connections

3. **Google PageSpeed Insights**: https://pagespeed.web.dev
   - Test performance
   - Check SEO
   - Get optimization suggestions

---

## Monitoring & Maintenance

### Daily Tasks

- Monitor error logs (Vercel dashboard)
- Check database health (Supabase)
- Verify backups are running

### Weekly Tasks

- Review analytics
- Check for security updates
- Monitor payment processing

### Monthly Tasks

- Database optimization
- User feedback review
- Performance tuning
- Security audit

### Backup Strategy

**Supabase** automatically backs up daily. To manually backup:

```bash
# Export database
pg_dump --host=your-db-host --username=postgres your_db > backup.sql

# Import backup
psql --host=new-db-host --username=postgres your_db < backup.sql
```

---

## Troubleshooting

### Common Issues

#### 1. "Database Connection Error"

**Solution:**
```bash
# Check Supabase credentials
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify in .env.local - no extra spaces
# Restart development server
npm run dev
```

#### 2. "Payment Gateway Not Responding"

**Solution:**
```bash
# Check Paystack credentials (test vs live keys)
# Verify webhook URL is correct
# Test with Paystack test card
# Check Paystack status page: status.paystack.com
```

#### 3. "PWA Not Installing"

**Solution:**
- Ensure HTTPS is enabled (Vercel does this automatically)
- Check manifest.json is valid: `curl https://your-domain.com/manifest.json`
- Run Lighthouse audit
- Clear browser cache and try again

#### 4. "Real-time Updates Not Working"

**Solution:**
```bash
# Ensure Supabase Replication is enabled
# Check WebSocket connection in browser DevTools
# Verify RLS policies allow real-time reads
# Restart Supabase connection
```

#### 5. "Users Seeing Old Content"

**Solution:**
```bash
# Clear Vercel cache
# In Vercel dashboard: Settings → Deployments → Redeploy

# Or rebuild:
git commit --allow-empty -m "Redeploy to clear cache"
git push origin main
```

### Getting Help

- **Documentation**: Read SYSTEM_WALKTHROUGH.md
- **GitHub Issues**: Create an issue with error details
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Paystack Support**: https://paystack.com/contact

---

## Performance Optimization

### Lighthouse Targets

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95
- **PWA**: > 95

### Optimization Tips

1. **Image Optimization**:
   ```jsx
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     priority
   />
   ```

2. **Code Splitting**:
   ```jsx
   import dynamic from 'next/dynamic';
   
   const AdminDashboard = dynamic(
     () => import('@/components/admin/dashboard'),
     { loading: () => <Loading /> }
   );
   ```

3. **Caching**:
   - Supabase caches queries automatically
   - Set appropriate cache headers for static content
   - Use Vercel's Edge Caching for dynamic content

### Monitoring

```bash
# Generate Lighthouse report
npm run lighthouse

# Bundle analysis
npm run analyze
```

---

## Security Checklist

- [ ] All environment variables are hidden (not in git)
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Supabase RLS policies are configured
- [ ] Database backups are tested
- [ ] Payment credentials are in test mode initially
- [ ] API rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] SQL injection prevention (using Supabase parameterized queries)
- [ ] XSS prevention (React auto-escapes by default)

---

## Next Steps

1. **Monitor Performance**: Watch Vercel analytics for first week
2. **Gather Feedback**: Collect user feedback and iterate
3. **Scale**: Upgrade Supabase tier if needed (when > 1000 users)
4. **Expand**: Add more features based on user requests
5. **Monetize**: Optimize pricing based on user behavior

---

## Support & Documentation

- 📖 **System Walkthrough**: See `SYSTEM_WALKTHROUGH.md`
- 🔧 **Quick Start**: See `QUICK_START.txt`
- 📝 **Features List**: See `FEATURES.md`
- 🐛 **Issue Tracking**: GitHub Issues
- 💬 **Community**: WhatsApp Group (linked in app)

---

**Last Updated**: June 17, 2026
**Status**: ✅ Production Ready
**Version**: 2.0
