'use client'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  UserPlus, FileText, ShieldCheck, MessageCircle, Crown, Sparkles,
  Users, Briefcase, Star, Award, Zap, Trophy, ChevronRight,
} from 'lucide-react'

export function HowItWorksPage() {
  const { navigate } = useNav()

  const taskerSteps = [
    { icon: UserPlus, title: 'Create Your Free Profile', desc: 'Sign up as a tasker and complete your profile with bio, photo, country, languages, skills, and WhatsApp number.' },
    { icon: FileText, title: 'Add Platforms & Proof of Work', desc: 'List the AI training platforms you have worked on (Outlier, Handshake, RWS, etc.) and upload proof of work (dashboard screenshots, project samples).' },
    { icon: ShieldCheck, title: 'Get Verified (Optional, Free)', desc: 'Submit your profile for admin review. If your evidence is satisfactory, you receive a verification badge that boosts your visibility.' },
    { icon: MessageCircle, title: 'Connect with Employers', desc: 'Employers contact you directly via WhatsApp. Negotiate terms, percentage share, and project details independently.' },
    { icon: Star, title: 'Build Your Reputation', desc: 'Receive ratings and reviews from employers. Climb the leaderboard. Unlock achievement badges as you grow.' },
    { icon: Sparkles, title: 'Upgrade for More Visibility (Optional)', desc: 'Subscribe to Featured ($2-$25) for top placement or Premium ($100/mo) for employer listings access and AI training guides.' },
  ]

  const employerSteps = [
    { icon: UserPlus, title: 'Create Free Employer Account', desc: 'Sign up with your company name, contact details, and WhatsApp number.' },
    { icon: Briefcase, title: 'Post Work Opportunities (Free)', desc: 'Describe the project, platform, number of taskers needed, percentage split, and account type. Posts are free.' },
    { icon: Users, title: 'Browse Taskers', desc: 'Search verified taskers by platform, country, skill, or verification status. View their proof of work and ratings.' },
    { icon: MessageCircle, title: 'Contact Taskers Directly', desc: 'Reach out via WhatsApp. Negotiate terms. The platform is not involved — you handle everything directly.' },
    { icon: Star, title: 'Leave Reviews', desc: 'After working with a tasker, leave a rating and review to help other employers and recognize quality work.' },
    { icon: ShieldCheck, title: 'Get Verified (Optional)', desc: 'Build a positive reputation through tasker feedback and proof of payment. Admin can award a "legit employer" badge.' },
  ]

  const verificationSteps = [
    'Complete your profile (bio, photo, country, languages, skills)',
    'List platforms you have worked on with project names',
    'Upload proof of work: platform dashboard screenshots, completed project samples',
    'Optional: upload earnings screenshots and employer recommendations',
    'Submit profile for admin review',
    'Admin evaluates evidence and awards verification badge (usually within 48 hours)',
    'Verified badge appears on your profile and in search results',
  ]

  const gamificationFeatures = [
    { icon: Trophy, title: 'Leaderboard', desc: 'Compete with other taskers based on points, ratings, and streaks' },
    { icon: Zap, title: 'Points System', desc: 'Earn points for profile updates, ratings received, and achievements' },
    { icon: Award, title: 'Achievement Badges', desc: 'Unlock badges for milestones like 7-day streak, 5 reviews, profile completion' },
    { icon: Star, title: 'Levels', desc: 'Progress through levels as you accumulate points (Level 1 → Level 10+)' },
    { icon: Sparkles, title: 'Streak Tracking', desc: 'Maintain daily profile updates to build your streak and earn bonus points' },
    { icon: Crown, title: 'Premium Perks', desc: 'Premium subscribers get bonus points and exclusive badges' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> How It Works</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">A Simple, Transparent Process</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI Taskers is a directory — not a marketplace. We connect taskers and employers directly, with no middlemen, no fees on tasks, and no disputes to mediate.
        </p>
      </motion.div>

      {/* For Taskers */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold">For Taskers</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskerSteps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-card border rounded-2xl p-5"
            >
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-violet-500 mb-3" />
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button
            size="lg"
            onClick={() => navigate({ name: 'auth' })}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            Create Tasker Profile
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* For Employers */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-3xl font-bold">For Employers</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employerSteps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-card border rounded-2xl p-5"
            >
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ name: 'employer-posts' })}
          >
            View Employer Posts
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>

      {/* Verification Process */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold">Verification Process</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Verification is free and awarded after manual admin review. It indicates evidence of experience — not a guarantee of future reliability.
          </p>
          <div className="space-y-3">
            {verificationSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm pt-0.5">{step}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200">
            <strong>⚠️ Important:</strong> Verification badges are awarded based on evidence review only. They do NOT guarantee tasker reliability, payment, or quality. Always perform your own due diligence.
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3"><Trophy className="h-3 w-3 mr-1 text-amber-500" /> Gamification</Badge>
          <h2 className="text-3xl font-bold mb-3">Earn While You Learn</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay engaged, build your reputation, and unlock rewards through our gamification system.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamificationFeatures.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <f.icon className="h-7 w-7 text-amber-500 mb-3" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">User Tiers Explained</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Basic', icon: UserPlus, color: 'bg-slate-500', price: 'Free', features: ['Full profile', 'WhatsApp contact', 'Proof of work', 'Ratings & reviews'] },
            { name: 'Verified', icon: ShieldCheck, color: 'bg-emerald-500', price: 'Free', features: ['All Basic features', 'Verification badge', 'Verified filter placement', 'Admin-reviewed evidence'] },
            { name: 'Featured', icon: Sparkles, color: 'bg-amber-500', price: '$2-$25', features: ['Top of search results', 'Homepage placement', 'Highlighted card', 'Priority ranking'] },
            { name: 'Premium', icon: Crown, color: 'bg-violet-500', price: '$100/mo', features: ['All Featured benefits', 'Employer listings access', 'Vendor directory', 'AI Training Guides'] },
          ].map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border-2 rounded-2xl p-5"
              style={{ borderColor: tier.color.replace('bg-', 'border-').replace('-500', '-300') }}
            >
              <div className={`w-10 h-10 rounded-xl ${tier.color} flex items-center justify-center mb-3`}>
                <tier.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">{tier.name}</h3>
              <div className="text-2xl font-bold mb-3">{tier.price}</div>
              <ul className="text-xs space-y-1.5">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button onClick={() => navigate({ name: 'pricing' })}>
            See Full Pricing Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </section>
    </div>
  )
}
