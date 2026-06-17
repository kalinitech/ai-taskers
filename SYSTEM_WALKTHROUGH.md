# 🗺️ AI Taskers Platform — System Walkthrough

This document provides a complete walkthrough of every feature in the AI Taskers Platform, organized by user role and feature area.

---

## 👥 User Roles

The platform has **three primary user roles**, each with different capabilities:

| Role | Capabilities |
|------|--------------|
| **Tasker** (Free/Paid) | Create profile, list platforms, upload proof, receive ratings, contact employers, browse job posts (Premium only) |
| **Employer** (Free) | Create company profile, post unlimited jobs, browse taskers, contact taskers via WhatsApp, leave ratings |
| **Admin** | Full CRUD on all entities, send notifications, view analytics, verify users, manage platforms/plans |

---

## 🏠 Homepage Walkthrough

### Sections (top to bottom):

1. **Hero Section**
   - Animated gradient background with floating blobs
   - Headline: "Find Verified AI Trainers, Data Annotators & RLHF Specialists"
   - Subheadline emphasizing no middlemen, no fees, no disputes
   - Two CTAs: "Find Taskers" and "Create Profile"
   - Trust indicators (verified taskers, employers, open positions, avg rating)

2. **Why AI Taskers?**
   - 4 feature cards: Verified Profiles, Proven Experience, Direct Contact, Global Talent
   - Each with icon, title, description

3. **Supported Platforms Grid**
   - 14 AI training platforms with icons
   - Outlier, Handshake, RWS, AfterQuery, Micro1, Mercor, Amazon Turk, Alignerr, Appen, UHRS, Scale AI, DataAnnotation, OneForma, TELUS Digital

4. **Featured Taskers Carousel**
   - Top 6 featured taskers
   - Tasker cards with photo, name, location, rating, tier badge, skills, stats
   - WhatsApp contact + View Profile buttons

5. **Leaderboard Section**
   - Top 5 taskers with medals (🥇🥈🥉)
   - Points, level, rating, country displayed

6. **Pricing Teaser**
   - Featured (from $2/hr) and Premium ($100/mo) cards
   - CTA to pricing page

7. **WhatsApp Community CTA**
   - Green gradient banner
   - Lists benefits (peer support, scam alerts, quality standards)
   - Join button

8. **Daily Motivation**
   - Rotating quote based on day of week
   - From 8 curated motivational quotes

9. **Stats Counters**
   - Total Taskers, Verified Taskers, Active Employers, Open Positions

10. **Final CTA Banner**
    - Gradient banner with two CTAs

---

## 🔍 Find Taskers Page

### Layout:
- **Title bar** with tasker count
- **Tab navigation:** All Taskers · Verified · Featured · Premium · 🏆 Leaderboard
- **Search bar** with full-text search
- **Filters button** (toggles filter panel)
- **Filter panel:** Platform, Country, Verification status, Skill

### Tasker Card Components:
- Profile photo with verification badge overlay
- Name and location (city, country)
- Star rating with review count
- Bio (truncated)
- Skills badges (top 3)
- Platform tags (top 3)
- Stats row: percentage share, level, points, streak
- WhatsApp + View buttons

### Leaderboard View:
- Full-screen leaderboard with top 10 taskers
- Medal icons for top 3
- Points, level, streak, rating displayed
- Click any row to view profile

---

## 👤 Tasker Profile Detail Page

### Hero Header:
- Large profile photo (128-160px) with verification badge
- Name with tier badge (Basic/Verified/Featured/Premium)
- Location, rating, level, points, streak stats
- Bio paragraph
- WhatsApp contact + Leave Rating buttons (rating for employers only)
- Tier-specific gradient background

### Tab Navigation:
1. **About Tab:**
   - Bio text
   - Quick stats grid (location, percentage, work preference, availability)
   - Skills & Expertise badges
   - Languages badges
   - Platforms & Projects list with status (interested/working_on/completed)

2. **Proofs Tab:**
   - Carousel of uploaded proof of work
   - Each proof has: title, description, type (screenshot/link/file)
   - Navigation arrows for multiple proofs
   - Thumbnail strip below main view

3. **Reviews Tab:**
   - List of employer ratings
   - Star display (1-5) per review
   - Employer name, comment, date
   - Empty state when no reviews

4. **Badges Tab:**
   - Grid of achievement badges
   - Each badge: icon, title, description
   - Gradient background for visual appeal
   - Examples: Profile Complete, Verified, 7-day Streak, 30-day Streak, Featured Pro, Premium Member, Early Adopter, Five Reviews

### Sidebar (Right Column):
- **Gamification Stats Card:** Level, points, streak, badges count, reviews count, profile completion progress bar
- **Contact Information:** WhatsApp, country, percentage split
- **Subscription Status:** Active Featured/Premium badges with expiry dates

### Scam Warning Banner:
- Amber-colored warning at top of page
- Reminds users about due diligence
- Specific warning about paying for accounts

---

## 💼 Employer Posts Page

### Header Section:
- Title and description
- "Post Work (Free)" button (employers only)
- **Critical Scam Warning banner** (red/amber gradient) with bullet points:
  - Never pay employer for account access
  - Engage in small test tasks first
  - Report suspicious activity
  - Use WhatsApp community to verify

### Premium Access Notice:
- For non-authenticated users
- Locks full employer contact details
- CTA to upgrade to Premium

### Post Form (Employers only):
- Title, Description
- Platform (dropdown), Project name
- Number of taskers needed
- Tasker percentage (20-80% slider), Auto-calculated employer percentage
- Work location (Remote/Workstation/Physical)
- Account type (Ready to Task/Assessment Needed)
- WhatsApp contact

### Posts Grid:
- Post cards with:
  - Platform icon
  - Title
  - Company name + verified badge
  - Date posted
  - Description (truncated)
  - Stats grid (# taskers, %, work location, country)
  - Account type badge
  - WhatsApp contact button (auth users) or "Sign in to contact" (visitors)

---

## 💰 Pricing Page

### Layout:
1. **Free Tier Card** — Always free, basic profile features
2. **Featured Plans Grid** — 4 cards:
   - $2/hour, $3/day, $10/week, $25/month
   - Each with feature list
3. **Premium Plan Hero** — $100/month with:
   - Gradient violet/fuchsia background
   - All Featured benefits PLUS:
     - Employer Listings Access
     - Legit Employer Verification
     - Vendor Access
     - Resume/CV reviewers
     - AI Training Guides
4. **Comparison Table** — All features side-by-side across tiers
5. **Subscribe Flow** — Simulated Paystack payment

### Subscribe Process:
1. User clicks "Get Featured" or "Upgrade to Premium"
2. System verifies authentication and role
3. Finds user's tasker profile
4. Shows "Processing payment..." toast (simulating Paystack)
5. Calls `/api/subscribe` API
6. Updates tasker profile (isFeatured/isPremium flags, expiry dates)
7. Awards achievement badge
8. Success toast with confirmation

---

## 🔐 Authentication Page

### Login Tab:
- Email and password fields with icons
- "Sign In" button
- Quick demo logins: Admin, Tasker, Employer (one-click fill)

### Signup Tab:
- Role selector: Tasker / Employer
- Full Name (or Company Name for employers)
- Email, Password
- Terms acceptance checkbox with links to Terms and Privacy
- "Create Account" button

### Security Banner:
- Amber warning at bottom
- Explains platform is directory only
- Never pay for account access

---

## 📊 User Dashboard

### Tasker Dashboard:
1. **Welcome header** with name, email, role badge
2. **Edit Profile button** (toggles edit form)
3. **Gamification Stats Grid:**
   - Level, Points, Day Streak, Avg Rating
4. **Profile Completion Card:**
   - Gradient violet/fuchsia/amber background
   - Progress bar showing completion %
   - "Earn 5 points for updating profile" prompt
5. **Edit Form (when active):**
   - Full Name, Photo URL, Bio, Country, City
   - Languages (comma-separated), Skills (comma-separated)
   - WhatsApp, Percentage Share (20-80)
   - Availability dropdown, Workstation checkbox
6. **Profile Information Card:**
   - Read-only display of all profile fields
7. **Subscription Status Card:**
   - Active badges (Premium, Featured, Verified)
   - "View Pricing Plans" button
8. **Scam Warning Reminder**

### Employer Dashboard:
1. Welcome header
2. Stats grid: Company, Status (Verified/Pending), WhatsApp, Country
3. Edit form: Company Name, Contact Name, WhatsApp, Country, Description
4. Quick action buttons: View/Post Jobs, Browse Taskers

---

## 🛠️ Admin Panel

### Access Control:
- Only users with `role === 'admin'` can access
- Sidebar navigation with 7 tabs
- Each tab is a separate CRUD interface

### 1. Dashboard Tab
- **8 KPI cards:** Total Taskers, Total Employers, Active Subscriptions, Monthly Revenue, Verified Taskers, Featured Taskers, Premium Taskers, Active Posts
- **Charts:**
  - Taskers by Country (bar chart)
  - Platform Popularity (horizontal bar chart)
- **Quick Actions:** Send Notification, Manage Taskers, Manage Platforms

### 2. Analytics Tab
- **4 KPI cards:** Total Taskers (with new this week), Active Employers (with verified count), Monthly Revenue, Average Rating
- **Charts:**
  - Signups & Posts 7-day trend (area chart)
  - Tasker Tier Distribution (pie chart: Basic/Verified/Featured/Premium)
  - Geographic Distribution (bar chart)
  - Platform Popularity (horizontal bar chart)
- **Detailed Statistics Grid:** 8 stats in grid format

### 3. Taskers Tab (CRUD)
- **Admin Warning:** Reminder about verification rigor
- **Search bar** to filter taskers
- **Table with columns:**
  - Tasker (photo, name, bio preview)
  - Location (city, country)
  - Tier (Premium/Featured/Verified badges)
  - Stats (Level, Points, Streak)
  - Status (active/suspended)
  - Actions
- **Action buttons per tasker:**
  - Verify (toggle verification badge)
  - Featured (toggle 7-day featured)
  - Premium (toggle 30-day premium)
  - Suspend (toggle active/suspended)
  - Edit (modal with all fields)
  - Delete (with confirmation)
- **Pagination** (10 per page)

### 4. Employers Tab (CRUD)
- Similar table layout
- Actions: Verify, Edit, Delete
- Edit modal: Company Name, Contact, WhatsApp, Country, Description, Status

### 5. Platforms Tab (CRUD)
- Card grid layout
- Each card: icon, name, project count, active status, toggle button
- "Add Platform" form (name + emoji icon)
- Edit modal and delete per platform

### 6. Plans Tab (CRUD)
- Card grid showing all plans (Featured + Premium)
- Each card: name badge, duration badge, price, features list, active toggle
- "Add Plan" form: name, duration, price, features (one per line)
- Edit modal and delete per plan

### 7. Notifications Tab
- **Compose Form:**
  - Type selector (System/Admin/Marketing/Motivational)
  - Title and Message fields
  - "Send to all users" checkbox
  - Send button
- **Quick Motivational Quotes:** Click to auto-fill form
- **Admin Reminder:** Never claim "we guarantee payment"
- **Recent Notifications List:**
  - Type badge, title, message preview
  - Date/time, target audience, read status
  - Delete button per notification

---

## 🔔 Notification System

### How It Works:
1. Admin composes notification via admin panel
2. Notification saved to database with type, title, message, target
3. All users see notifications in the bell icon (top right)
4. Unread count badge shows on bell
5. Click bell to expand dropdown with recent notifications
6. Notifications marked as read when bell is opened

### Notification Types:
- **System:** Welcome messages, verification reminders
- **Admin:** Custom admin broadcasts (platform updates, policy changes)
- **Marketing:** Premium plan promotions, new features
- **Motivational:** Daily AI training quotes, success stories

### Sample Notifications (Seeded):
1. Welcome to AI Taskers!
2. Daily Motivation quote
3. Premium Plan Available announcement
4. Platform Update (14 platforms supported)
5. Verification Reminder
6. You Got This! motivation
7. Scam Warning alert

---

## 🏆 Gamification System

### Points System:
- **+5 points** for each profile update
- **+10 points** for each rating received
- **Level up** every 200 points (Level 1 → Level 10+)

### Achievement Badges:
| Badge | Icon | How to Earn |
|-------|------|-------------|
| Profile Complete | 🎯 | Reach 90%+ profile completion |
| Verified Tasker | ✓ | Get verified by admin |
| Top Rated | 🏆 | Maintain 4.5+ avg rating |
| 7-Day Streak | 🔥 | Update profile 7 days in a row |
| 30-Day Streak | 💎 | Update profile 30 days in a row |
| Early Adopter | 🚀 | Join during launch period |
| Featured Pro | ⭐ | Subscribe to Featured plan |
| Premium Member | 👑 | Subscribe to Premium plan |
| Five Reviews | 💬 | Receive 5 employer reviews |
| Helpful Member | 🤝 | Active in WhatsApp community |

### Leaderboard Ranking:
Taskers are ranked by:
1. Total points (descending)
2. Average rating (descending)
3. Number of ratings (descending)

Top 3 receive medal emojis: 🥇 🥈 🥉

### Profile Completion Calculation:
- Bio (15%) — must be 20+ characters
- Photo (10%)
- Country (10%)
- City (5%)
- WhatsApp number (15%)
- Languages (10%)
- Skills (10%)
- Percentage share valid (5%)
- Proofs + platforms (20%) — assumed when present

---

## 📱 PWA Features

### Installation:
- **Android (Chrome):** Menu → "Install app"
- **iOS (Safari):** Share → "Add to Home Screen"
- **Desktop (Chrome/Edge):** Install icon in address bar

### Offline Support:
- Service worker caches:
  - Static assets (HTML, CSS, JS, images)
  - API responses (dynamic cache)
- Offline behavior:
  - Cached pages load instantly
  - API requests fall back to cached data
  - User can browse taskers offline (last fetched data)

### Push Notifications:
- Code is ready in `public/sw.js`
- Requires push service (OneSignal, Firebase Cloud Messaging) for production
- Configure in service worker `push` event listener

### App Icons:
- 192x192 PNG (standard)
- 512x512 PNG (high-res)
- 192x192 maskable (adaptive icon for Android)
- 512x512 maskable
- Apple touch icon (180x180)
- Favicon (32x32 + ICO format)

### Splash Screen:
- Background color: white (#ffffff)
- Theme color: violet (#8b5cf6)
- App name: "AI Taskers"
- Standalone display mode

---

## ⚖️ Legal Pages

### Terms of Use (`/terms`):
- 15 sections covering all aspects
- **Critical Scam Warning** prominently displayed at top
- Sections include:
  1. Acceptance of Terms
  2. Description of Platform (directory only)
  3. User Accounts
  4. User Responsibilities
  5. Prohibited Conduct
  6. Employer-Tasker Relationship
  7. Payments to Platform
  8. Verification Badges
  9. Disclaimer of Warranties
  10. Limitation of Liability
  11. Indemnification
  12. Termination
  13. Changes to Terms
  14. Governing Law
  15. Contact

### Privacy Policy (`/privacy`):
- 11 sections covering data handling
- **Privacy at a Glance** summary at top
- Sections include:
  1. Information We Collect
  2. How We Use Information
  3. Sharing Information
  4. Data Security
  5. Data Retention
  6. Cookies
  7. Your Rights
  8. Children's Privacy
  9. Third-Party Links
  10. Changes to Policy
  11. Contact

Both pages are linked in the **footer** and during **signup** (with required checkbox).

---

## 🛡️ Safety Features

### Scam Warnings Displayed:
1. **Footer banner** on every page (amber)
2. **Employer Posts page** (prominent red/amber banner with bullet points)
3. **Tasker Profile page** (amber reminder)
4. **Auth page** (amber box at bottom)
5. **Admin Notification composer** (reminder to never claim "we guarantee payment")
6. **Admin Tasker Management** (reminder about verification rigor)

### Critical Safety Rules:
- Never pay an employer for account access (immediate ban)
- Not every employer is legit — perform due diligence
- We do not handle disputes — only directory listings
- Verification badges indicate evidence review only
- Engage in small test tasks before large commitments

### Reporting Mechanism:
- Users can report suspicious activity via support email
- Admin reviews and takes action (suspend/delete)
- WhatsApp community for peer-based scam alerts

---

## 🎨 Design System

### Color Palette:
- **Primary:** Violet (#8b5cf6)
- **Secondary:** Fuchsia (#d946ef)
- **Accent:** Amber (#f59e0b)
- **Success:** Emerald (#10b981)
- **Warning:** Amber (#f59e0b)
- **Danger:** Red (#ef4444)
- **Info:** Blue (#3b82f6)

### Typography:
- **Sans-serif:** Geist Sans (system default)
- **Monospace:** Geist Mono (code blocks)
- Consistent hierarchy: H1 (4xl), H2 (3xl), H3 (lg), body (sm)

### Component Library:
- **shadcn/ui** (New York style) — 50+ components
- All components support dark mode
- Consistent border radius (lg = 0.625rem)
- Tailwind utility classes throughout

### Animations:
- **Framer Motion** for page transitions, hover effects, card animations
- Page transitions: fade + slide (200ms)
- Card hover: lift + shadow
- Notification badge: scale-in
- Progress bars: animated width fill
- Achievement badges: scale-in with stagger

---

## 📈 Analytics & Reporting

### Admin Analytics Dashboard Shows:
1. **KPIs:**
   - Total Taskers, Active Employers, Monthly Revenue, Average Rating
   - Verified/Featured/Premium tasker counts
   - Recent signups (7 days), Recent posts (7 days)
2. **Charts:**
   - Signups & Posts 7-day trend (area chart)
   - Tasker Tier Distribution (pie chart)
   - Geographic Distribution (bar chart by country)
   - Platform Popularity (horizontal bar chart)
3. **Detailed Statistics Grid:**
   - Total Notifications, Active Subscriptions, Total Reviews, Active Posts
   - Featured Taskers, Premium Taskers, Verified Employers, Total Platforms

### Real-time Updates:
- All admin changes immediately reflected on frontend (next page load)
- Notifications appear in user bells in real-time (via API polling or Supabase Realtime)
- No redeployment required for content changes

---

This walkthrough covers every feature of the AI Taskers Platform. For technical implementation details, see the README.md. For deployment instructions, see DEPLOYMENT.md.
