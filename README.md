# 🤖 AI Taskers Platform

### The Largest Verified AI Training Talent Directory

A production-ready, full-stack web application and PWA that connects employers with verified AI trainers, data annotators, and RLHF specialists worldwide. Built as a **directory** — not a marketplace — with no payment processing, no disputes, and no middlemen.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Quick Start (Local Development)](#quick-start-local-development)
5. [Demo Accounts](#demo-accounts)
6. [System Walkthrough](#system-walkthrough)
7. [Admin Dashboard Guide](#admin-dashboard-guide)
8. [PWA Installation](#pwa-installation)
9. [Deployment Guide](#deployment-guide)
10. [Database Schema](#database-schema)
11. [API Reference](#api-reference)
12. [Security & Legal](#security--legal)
13. [Customization](#customization)
14. [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

AI Taskers solves a real industry problem: employers struggle to find verified AI training taskers across platforms like Outlier, Handshake, RWS, Alignerr, Appen, UHRS, Scale AI, and DataAnnotation. Currently, people rely on scattered WhatsApp groups with no professional directory.

**Our positioning:** A professional talent directory that lets employers browse and contact verified taskers directly via WhatsApp. We do **not**:
- Handle payments between employers and taskers
- Act as an escrow agent
- Mediate disputes
- Guarantee the legitimacy of every user
- Pay taskers — employers handle all payments directly

---

## ✨ Key Features

### For Taskers (Free & Paid Tiers)
- **Basic (Free):** Complete profile, bio, photo, languages, skills, WhatsApp contact, proof of work, ratings
- **Verified (Free):** Verification badge after admin review of dashboard screenshots and project samples
- **Featured ($2-$25):** Top of search results, homepage placement, highlighted card
- **Premium ($100/mo):** Employer listings access, vendor directory, AI training guides, all Featured benefits

### For Employers (Free)
- Post unlimited work opportunities for free
- Browse taskers with advanced filters (platform, country, skill, verification)
- Contact taskers directly via WhatsApp
- Build reputation through tasker reviews → earn "legit employer" badge

### Gamification
- 🏆 **Leaderboard** — Top taskers ranked by points, ratings, and streaks
- ⚡ **Points System** — Earn points for profile updates, ratings, achievements
- 🎯 **Profile Completion** — Visual progress bar with milestone rewards
- 🏅 **Achievement Badges** — Verified, Top Rated, 7/30-day Streaks, Early Adopter, etc.
- 📈 **Levels** — Progress from Level 1 to Level 10+ as you accumulate points
- 🔥 **Streak Tracking** — Daily profile updates build your streak

### Admin Dashboard (Full CRUD)
- **Tasker Management** — View, edit, verify, feature, premium, suspend, delete taskers
- **Employer Management** — Verify, edit, delete employer profiles
- **Platform & Project Management** — Add/edit/delete AI platforms and their projects
- **Plans & Pricing** — Create, update, delete subscription plans
- **Notification System** — Broadcast custom messages to all users or target individuals
- **Analytics Dashboard** — Real-time charts for signups, revenue, geographic distribution, platform popularity, tier distribution

### PWA Support
- Installable on mobile devices (Android, iOS)
- Offline caching via service worker
- Push notification support
- App-like splash screen and icons
- Mobile-optimized interface

### Animations & UX
- Framer Motion throughout — page transitions, hover effects, card animations
- Gradient hero sections with animated blobs
- Smooth tab switching
- Loading skeletons and toasts
- Responsive mobile-first design

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| **Framework** | Next.js 16 (App Router) | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4 + shadcn/ui | New York style components |
| **Database** | Prisma ORM + SQLite | Easy migration to PostgreSQL |
| **Auth** | Custom (email/password) | Upgrade to NextAuth.js for production |
| **Charts** | Recharts | Bar, line, pie, area charts |
| **Animations** | Framer Motion | Page transitions, hover effects |
| **State** | Zustand | Lightweight client state |
| **Icons** | Lucide React | Consistent icon set |
| **PWA** | Web Manifest + Service Worker | Offline support, installable |
| **Payments** | Paystack (UI ready) | Mock flow for demo |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js 18+** (or Bun)
- **npm / bun / pnpm** package manager

### Steps

```bash
# 1. Install dependencies
bun install
# or: npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# 3. Initialize the database
bun run db:push
# or: npx prisma db push

# 4. Seed the database with demo data
bun run scripts/seed.ts
# or: npx tsx scripts/seed.ts

# 5. Start the dev server
bun run dev
# or: npm run dev

# 6. Open in browser
# Visit http://localhost:3000
```

### Environment Variables (.env)

```bash
# Database (SQLite by default - file path)
DATABASE_URL="file:./db/custom.db"

# For production (PostgreSQL via Supabase/Neon)
# DATABASE_URL="postgresql://user:pass@host:5432/aitaskers"

# App config
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_GROUP_LINK="https://chat.whatsapp.com/your-invite-link"
SUPPORT_EMAIL="support@aitaskers.com"

# Payment (Paystack) - for production
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxx"
PAYSTACK_SECRET_KEY="sk_test_xxx"
```

---

## 🔐 Demo Accounts

The seed script creates these demo accounts (use them to explore different roles):

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@aitaskers.com` | `admin123` | Full admin dashboard + CRUD |
| **Tasker** | `alice.mwangi.0@example.com` | `tasker123` | Tasker dashboard + profile editing |
| **Employer** | `techflow.ai@example.com` | `employer123` | Employer dashboard + post creation |

> **Note:** All 24 seeded taskers and 8 employers use the same passwords (`tasker123` and `employer123` respectively).

---

## 🗺️ System Walkthrough

### 1. Homepage (`/`)
The landing page features:
- **Hero section** with animated gradient background, headline, primary CTAs
- **Why Choose Us** section explaining the directory model
- **Platforms grid** showing 14 supported AI training platforms
- **Featured Taskers** carousel showing premium/featured taskers
- **Leaderboard** preview with top 5 taskers
- **Pricing teaser** with Featured ($2+) and Premium ($100/mo)
- **WhatsApp Community** CTA with safety messaging
- **Daily Motivation** quote
- **Stats counters** (taskers, verified, employers, posts)
- **Final CTA** banner

### 2. Find Taskers (`/` → "Find Taskers")
- **Tabs:** All Taskers · Verified · Featured · Premium · Leaderboard
- **Search bar** for full-text search across name, bio, skills, country
- **Filters:** Platform, Country, Verification status, Skill
- **Tasker cards** with photo, name, location, rating, tier badge, skills, platforms, stats, WhatsApp button
- **Leaderboard view** with medal icons and point rankings

### 3. Tasker Profile (`/` → "View")
Detailed profile with:
- **Hero header** with photo, name, tier badge, stats (rating, level, points, streak)
- **Tabs:** About / Proofs / Reviews / Badges
  - **About:** Bio, skills, languages, platforms & projects with status
  - **Proofs:** Carousel of uploaded proof of work (screenshots, links)
  - **Reviews:** Employer ratings with star display and comments
  - **Badges:** Achievement grid with icons and descriptions
- **Sidebar:** Gamification stats card, contact info, subscription status
- **Scam warning** banner with safety reminders
- **Rating form** for employers (if signed in)

### 4. Employer Posts (`/` → "Employer Posts")
- **Scam warning** prominently displayed
- **Premium access notice** for non-authenticated users
- **Post form** for employers (title, description, platform, project, # of taskers, percentage split, work location, account type, WhatsApp)
- **Posts grid** with company info, platform icon, requirements, contact button
- **Search and platform filter**

### 5. Pricing (`/` → "Pricing")
- **Free tier** card (always free)
- **Featured plans** grid ($2/hr, $3/day, $10/week, $25/month)
- **Premium plan** hero card ($100/month) with all benefits
- **Comparison table** showing features across tiers
- **Subscribe flow** (simulated Paystack payment for demo)

### 6. Dashboard (`/` → user menu → "Dashboard")
- **Tasker dashboard:** Gamification stats (level, points, streak, rating), profile completion progress bar, edit profile form, subscription status
- **Employer dashboard:** Company stats, edit profile form, quick actions
- Both dashboards award points for profile updates (gamification)

### 7. Admin Panel (`/` → user menu → "Admin Panel" — admin only)
- **Sidebar navigation:** Dashboard / Analytics / Taskers / Employers / Platforms / Plans / Notifications
- **Dashboard tab:** KPI cards, charts (signups trend, tier distribution, country distribution, platform popularity), quick actions
- **Analytics tab:** Full charts dashboard with KPIs and detailed statistics
- **Taskers tab:** Searchable table with verify/feature/premium/suspend/edit/delete actions
- **Employers tab:** Similar table with verify/edit/delete
- **Platforms tab:** Card grid with add/edit/delete platforms
- **Plans tab:** Card grid with add/edit/delete pricing plans
- **Notifications tab:** Compose custom notifications, quick motivational quotes, view/delete recent notifications

### 8. Auth (`/` → "Sign in" / "Get Started")
- **Login/Signup tabs** with role selection (Tasker / Employer)
- **Quick demo logins** for Admin, Tasker, Employer
- **Terms acceptance** checkbox on signup
- **Scam warning** displayed prominently

### 9. Legal Pages (`/` → footer links)
- **Terms of Use** — 15 sections covering acceptance, platform description, accounts, prohibited conduct, employer-tasker relationship, payments, verification badges, disclaimers, liability, indemnification, termination, changes, governing law, contact
- **Privacy Policy** — 11 sections covering data collection, usage, sharing, security, retention, cookies, user rights, children's privacy, third-party links, changes, contact

### 10. Community (`/` → "Community")
- WhatsApp community landing page
- Community purpose (6 cards)
- Rules with severity indicators
- Member benefits
- Step-by-step joining instructions

### 11. How It Works (`/` → "How It Works")
- Step-by-step guides for Taskers and Employers
- Verification process walkthrough
- Gamification features overview
- User tiers explained (Basic, Verified, Featured, Premium)

---

## 🎛️ Admin Dashboard Guide

### Accessing the Admin Panel
1. Sign in with `admin@aitaskers.com` / `admin123`
2. Click the avatar menu (top right) → "Admin Panel"

### Managing Taskers
- **Verify a tasker:** Click the shield icon → awards verification badge
- **Make Featured:** Click the sparkles icon → 7-day featured subscription
- **Make Premium:** Click the crown icon → 30-day premium subscription (also enables Featured)
- **Suspend:** Click the ban icon → marks status as "suspended"
- **Edit:** Click the pencil icon → modal with editable fields
- **Delete:** Click the trash icon → permanent deletion (with confirmation)

### Managing Employers
- Verify (toggle verification badge)
- Edit (company name, contact, WhatsApp, country, description, status)
- Delete (also deletes all their posts)

### Managing Platforms
- Add new platform (name + emoji icon)
- Edit existing (name, icon, active status)
- Delete (also deletes all projects under it)

### Managing Plans
- Add new plan (Featured or Premium, hourly/daily/weekly/monthly, price, features)
- Edit existing plans
- Toggle active/inactive
- Delete (existing subscriptions remain but no new ones can be created)

### Sending Notifications
- Choose type (System, Admin, Marketing, Motivational)
- Enter title and message
- Send to all users or specific user
- Use quick motivational quotes from the library
- View and delete recent notifications

### Viewing Analytics
- **KPI cards:** Total taskers, active employers, monthly revenue, average rating
- **Signups & Posts chart:** 7-day trend (area chart)
- **Tier Distribution:** Pie chart (Basic / Verified / Featured / Premium)
- **Geographic Distribution:** Bar chart by country
- **Platform Popularity:** Horizontal bar chart
- **Detailed Statistics:** Grid of all key metrics

---

## 📱 PWA Installation

### On Android (Chrome)
1. Visit the deployed URL
2. Tap the menu (⋮) → "Install app" or "Add to Home screen"
3. Confirm installation
4. App icon appears on home screen

### On iOS (Safari)
1. Visit the deployed URL
2. Tap the Share button (📤)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"
5. App icon appears on home screen

### On Desktop (Chrome/Edge)
1. Visit the deployed URL
2. Click the install icon (⊕) in the address bar
3. Click "Install"
4. App opens in its own window

### PWA Features
- ✅ Installable on all platforms
- ✅ Offline support via service worker (cached static assets)
- ✅ Push notification support (code ready, requires push service for production)
- ✅ App icons (192px, 512px, maskable variants)
- ✅ Splash screen with brand colors
- ✅ Standalone display mode

---

## 🚢 Deployment Guide

### Option A: Vercel (Recommended — Free Tier)

#### Step 1: Prepare Your Code
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: AI Taskers Platform"

# Push to GitHub
git remote add origin https://github.com/your-username/ai-taskers.git
git branch -M main
git push -u origin main
```

#### Step 2: Set Up Database (Supabase — Free Tier)
1. Go to [supabase.com](https://supabase.com) → Sign up
2. Create a new project
3. Wait for provisioning (~2 minutes)
4. Go to **Settings → API**:
   - Copy `Project URL` → this is your `DATABASE_URL` host
   - Copy `anon public` key
   - Copy `service_role` key
5. Go to **SQL Editor** → New query
6. Run the Prisma migration SQL (run `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` to generate)

Or, switch to PostgreSQL in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Then run `npx prisma db push` against your Supabase database.

#### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "New Project" → Import your AI Taskers repo
3. Configure environment variables (see below)
4. Click "Deploy"
5. Wait ~2-3 minutes for build to complete
6. Your app is live at `https://your-project.vercel.app`!

#### Step 4: Set Environment Variables in Vercel
Go to Project Settings → Environment Variables:
```
DATABASE_URL=postgresql://...@db.xxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
NEXT_PUBLIC_WHATSAPP_GROUP_LINK=https://chat.whatsapp.com/your-invite
SUPPORT_EMAIL=support@aitaskers.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx
```

#### Step 5: Run Database Migration on Production
After first deploy, run:
```bash
# Set DATABASE_URL to production value locally
npx prisma db push
bun run scripts/seed.ts  # Optional: seed production data
```

### Option B: Self-Hosted (Docker)

#### Dockerfile
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

Build & run:
```bash
docker build -t ai-taskers .
docker run -p 3000:3000 --env-file .env ai-taskers
```

### Option C: Other Platforms (Netlify, Railway, Render)

The app is a standard Next.js application — it deploys to any platform that supports Node.js. Follow platform-specific Next.js deployment guides.

### Post-Deployment Checklist
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS active (Vercel does this automatically)
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Seed data loaded (optional, for demo)
- [ ] Admin account created (change default password!)
- [ ] Paystack webhook configured: `https://your-domain.com/api/payments/webhook`
- [ ] WhatsApp group link updated
- [ ] Support email configured
- [ ] PWA manifest icons accessible
- [ ] Service worker registering (check DevTools → Application → Service Workers)

---

## 🗄️ Database Schema

### Models Overview

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User` | Authentication & role | email, passwordHash, role (tasker/employer/admin) |
| `TaskerProfile` | Tasker directory data | fullName, bio, photoUrl, country, whatsapp, percentageShare, isVerified, isFeatured, isPremium, points, level, streak |
| `TaskerPlatform` | Tasker ↔ Platform mapping | platformName, projectName, status (interested/working_on/completed) |
| `TaskerProof` | Proof of work uploads | proofType (screenshot/link/file), title, description, fileUrl |
| `TaskerRating` | Employer reviews | rating (1-5), comment, employerName |
| `EmployerProfile` | Employer directory data | companyName, contactName, whatsapp, country, isVerified |
| `EmployerPost` | Job postings | title, description, platform, # of taskers, percentage split, workLocation, accountType |
| `PlatformCategory` | AI training platforms | name (unique), icon, isActive |
| `ProjectCategory` | Projects under platforms | platformId, name, isActive |
| `Plan` | Subscription plans | name (featured/premium), duration (hour/day/week/month), price, features |
| `Subscription` | Active subscriptions | taskerId, planId, startDate, endDate, isActive |
| `Notification` | System/admin notifications | type, title, message, isSentToAll, targetUserId, isRead |
| `Achievement` | Gamification badges | taskerId, badgeType, title, description, icon |

### Migration Commands
```bash
# Push schema changes (development)
bun run db:push

# Create a migration (production)
bun run db:migrate

# Reset database (caution!)
bun run db:reset

# Generate Prisma Client
bun run db:generate
```

---

## 🔌 API Reference

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create new user (tasker or employer) |
| `/api/auth/login` | POST | Sign in with email/password |

### Taskers
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/taskers` | GET | List taskers with filters (platform, country, verification, skill, search) |
| `/api/tasker/[id]` | GET | Get single tasker with all related data |
| `/api/tasker/[id]` | PUT | Update tasker (admin or self) |
| `/api/tasker/[id]` | DELETE | Delete tasker (admin) |

### Employers
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/employers` | GET / POST | List all employers / Create new employer |
| `/api/employer/[id]` | GET / PUT / DELETE | CRUD single employer |

### Employer Posts
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/employer-posts` | GET / POST | List posts / Create new post |

### Platforms
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/platforms` | GET / POST | List / Create platforms |
| `/api/platform/[id]` | PUT / DELETE | Update / Delete platform |

### Plans
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plans` | GET / POST | List / Create plans |
| `/api/plan/[id]` | PUT / DELETE | Update / Delete plan |

### Notifications
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET / POST | List notifications / Send new notification |
| `/api/notification/[id]` | PUT / DELETE | Mark read / Delete notification |

### Other
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics` | GET | Get comprehensive platform analytics |
| `/api/leaderboard` | GET | Get top taskers by points |
| `/api/ratings` | POST | Submit a new employer rating |
| `/api/subscribe` | POST | Activate a subscription (featured/premium) |

---

## 🔒 Security & Legal

### Security Notes
- **Demo passwords use a simple hash function** — replace with bcrypt/argon2 before production
- **No JWT/session management** — implement NextAuth.js or similar for production
- **No rate limiting** — add rate limiting middleware for production
- **No CSRF protection** — add CSRF tokens for form submissions
- **Row Level Security** — enable in Supabase/Postgres for production

### Critical Scam Warnings (Displayed Throughout)
1. **Never pay an employer for an account** — immediate ban for violators
2. **Not every employer is legit** — taskers must perform due diligence
3. **We do not handle disputes** — only directory listings
4. **We do not pay taskers** — employers handle all payments directly
5. **Verification badges indicate evidence review only** — not a guarantee of trustworthiness

### Legal Pages
- `/terms` — Comprehensive Terms of Use (15 sections)
- `/privacy` — Privacy Policy (11 sections)
- Both pages linked in footer and during signup
- Signup requires explicit agreement checkbox

### Recommended Production Hardening
1. **Replace simpleHash with bcrypt** (use `bcryptjs` package)
2. **Add NextAuth.js** for proper session management
3. **Enable Supabase RLS** with proper policies
4. **Add rate limiting** (e.g., `@upstash/ratelimit`)
5. **Add CSRF protection** (built into NextAuth)
6. **Add input validation** with Zod (already a dependency)
7. **Add file upload validation** for proof of work
8. **Set up error monitoring** (Sentry, LogRocket)
9. **Add analytics** (Vercel Analytics, PostHog)
10. **Regular database backups** (Supabase does this automatically)

---

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.ts` and `src/app/globals.css`:
```css
:root {
  --primary: oklch(0.205 0 0);  /* Change to your brand color */
}
```

### Logo
Replace `public/icons/icon-*.png` files with your brand icons. Regenerate using `scripts/generate-icons.py` (modify colors in the script).

### Platforms List
Edit `src/lib/constants.ts` → `PLATFORMS` and `PROJECTS_BY_PLATFORM` arrays.

### Pricing Plans
Edit `src/lib/constants.ts` → `PLANS` array, or manage via admin dashboard.

### WhatsApp Group Link
Set `NEXT_PUBLIC_WHATSAPP_GROUP_LINK` environment variable.

### Achievement Badges
Edit `src/lib/constants.ts` → `ACHIEVEMENT_BADGES` object.

---

## 🐛 Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Clear Next.js cache
rm -rf .next
bun install
bun run dev
```

#### Database connection issues
```bash
# Verify DATABASE_URL in .env
# For SQLite: file:./db/custom.db
# For Postgres: postgresql://user:pass@host:5432/db

# Reset database
bun run db:reset
bun run scripts/seed.ts
```

#### Prisma Client not generated
```bash
bun run db:generate
# or: npx prisma generate
```

#### PWA not installing
- Check that `/manifest.json` is accessible
- Verify `/sw.js` is registering (DevTools → Application → Service Workers)
- Ensure HTTPS (required for PWA)
- Check icons exist in `/public/icons/`

#### Build fails on Vercel
- Verify all environment variables are set
- Check that `DATABASE_URL` points to production database
- Run `npx prisma generate` as part of build (already in `postinstall`)

#### Charts not rendering
- Check browser console for errors
- Verify Recharts is installed: `bun add recharts`
- Ensure container has explicit height

#### Login fails
- Verify seeded users exist: `bun run scripts/seed.ts`
- Check that `simpleHash` function is consistent (don't change after seeding)
- For production: replace with bcrypt and re-hash all passwords

---

## 📦 Project Structure

```
ai-taskers/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   ├── icons/                     # PWA icons (192, 512, maskable)
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   └── favicon.ico
├── scripts/
│   ├── seed.ts                    # Database seeder
│   └── generate-icons.py          # PWA icon generator
├── src/
│   ├── app/
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Login, signup
│   │   │   ├── tasker/            # Tasker CRUD
│   │   │   ├── taskers/           # List taskers
│   │   │   ├── employer/          # Employer CRUD
│   │   │   ├── employers/         # List employers
│   │   │   ├── employer-posts/    # Job posts
│   │   │   ├── platform/          # Platform CRUD
│   │   │   ├── platforms/         # List platforms
│   │   │   ├── plan/              # Plan CRUD
│   │   │   ├── plans/             # List plans
│   │   │   ├── notification/      # Notification CRUD
│   │   │   ├── notifications/     # List notifications
│   │   │   ├── analytics/         # Platform analytics
│   │   │   ├── leaderboard/       # Top taskers
│   │   │   ├── ratings/           # Submit ratings
│   │   │   └── subscribe/         # Activate subscription
│   │   ├── globals.css            # Tailwind + theme
│   │   ├── layout.tsx             # Root layout with PWA meta
│   │   └── page.tsx               # Main SPA router
│   ├── components/
│   │   ├── admin/                 # Admin CRUD components
│   │   │   ├── analytics.tsx
│   │   │   ├── employer-crud.tsx
│   │   │   ├── notification-sender.tsx
│   │   │   ├── plan-crud.tsx
│   │   │   ├── platform-crud.tsx
│   │   │   └── tasker-crud.tsx
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── footer.tsx
│   │   ├── navbar.tsx
│   │   └── tasker-card.tsx
│   ├── lib/
│   │   ├── constants.ts           # Platforms, plans, badges
│   │   ├── db.ts                  # Prisma client
│   │   ├── store.ts               # Zustand stores (nav, auth, notifications)
│   │   └── utils.ts               # Utilities
│   ├── views/                     # Page views (SPA)
│   │   ├── admin.tsx
│   │   ├── auth.tsx
│   │   ├── community.tsx
│   │   ├── dashboard.tsx
│   │   ├── employer-posts.tsx
│   │   ├── home.tsx
│   │   ├── how-it-works.tsx
│   │   ├── pricing.tsx
│   │   ├── privacy.tsx
│   │   ├── tasker-detail.tsx
│   │   ├── taskers.tsx
│   │   └── terms.tsx
│   └── hooks/                     # React hooks
├── .env                           # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md                      # This file
```

---

## 📈 Recommended Enhancements (Future)

1. **Real-time notifications** via WebSocket / Supabase Realtime
2. **AI-powered tasker matching** for employers
3. **In-app messaging** between taskers and employers (Premium feature)
4. **Advanced analytics** with cohort retention, conversion funnels
5. **Two-factor authentication** via WhatsApp or TOTP
6. **Referral system** with bonus points for both parties
7. **Multi-language support** (i18n) — Spanish, French, Swahili, Hindi
8. **Mobile native apps** (React Native / Expo)
9. **Calendar integration** for tasker availability
10. **Video call integration** for interviews (Premium feature)

---

## 📞 Support

- **Documentation:** This README
- **Issues:** Open a GitHub issue
- **Email:** support@aitaskers.com
- **WhatsApp Community:** [Join link](https://chat.whatsapp.com/your-invite-link)

---

## 📄 License

This project is provided as-is for the AI Taskers platform. Customize and deploy freely for your AI training talent directory.

---

**Built with ❤️ for the global AI training community.**

> ⚠️ **Reminder:** AI Taskers is a directory only. We do not handle disputes, process payments, or verify every user. Always perform due diligence and never pay anyone for account access.
