'use client'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle, Shield, Users, AlertTriangle, Check, X,
  Heart, HandHeart, Star, Sparkles,
} from 'lucide-react'
import { WHATSAPP_GROUP_LINK } from '@/lib/constants'

export function CommunityPage() {
  const { navigate } = useNav()

  const purpose = [
    { icon: Users, title: 'Taskers-Only Membership', desc: 'A safe space exclusively for verified AI trainers, data annotators, and RLHF specialists.' },
    { icon: Shield, title: 'Protection Against Exploitation', desc: 'Collective defense against scam employers, unfair rates, and abusive practices.' },
    { icon: AlertTriangle, title: 'Scam Employer Exposure', desc: 'Share and learn from others\' experiences with fraudulent or unreliable employers.' },
    { icon: HandHeart, title: 'Peer Support & Collaboration', desc: 'Get help with platform-specific questions, project guidance, and career advice.' },
    { icon: Star, title: 'Quality Work Standards', desc: 'Promote and maintain high-quality annotation standards across the community.' },
    { icon: Sparkles, title: 'Strengthen the Industry', desc: 'Build a professional, trustworthy AI training workforce for the future.' },
  ]

  const rules = [
    { text: 'Taskers-only membership — no employers or recruiters allowed.', severity: 'high' },
    { text: 'No spamming or advertisements of any kind.', severity: 'high' },
    { text: 'Respect all members and admins at all times.', severity: 'medium' },
    { text: 'No false or unverified accusations against employers or taskers.', severity: 'high' },
    { text: 'Follow admin guidance and decisions.', severity: 'medium' },
    { text: 'No sharing of confidential project details under NDA.', severity: 'high' },
    { text: 'No solicitation of payment for account access (immediate ban).', severity: 'critical' },
    { text: 'Use the report function for any suspicious activity.', severity: 'medium' },
  ]

  const benefits = [
    'Real-time scam alerts from peers',
    'Project and platform recommendations',
    'Rate negotiation advice',
    'Mentorship from senior taskers',
    'Early access to employer post notifications',
    'Community-only featured tasker discounts',
    'Direct line to platform admins',
    'Quality work recognition',
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-8 md:p-12 text-white text-center mb-8"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-300 blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-4">
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">Taskers-Only WhatsApp Community</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Join the AI Taskers Community</h1>
          <p className="text-emerald-50 max-w-2xl mx-auto mb-6 text-lg">
            Connect with fellow taskers, protect yourself from scams, share verified employer experiences, and grow your AI training career together.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              Join WhatsApp Group
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Purpose */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Community Purpose</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purpose.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border rounded-2xl p-5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-3">
                <p.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section className="mb-12">
        <div className="bg-card border rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Community Rules
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Violations lead to removal from the group. Repeat or severe violations may result in permanent platform ban.
          </p>
          <div className="space-y-2">
            {rules.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  r.severity === 'critical' ? 'bg-red-500' :
                  r.severity === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm flex-1">{r.text}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{r.severity}</Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Member Benefits</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-4 bg-card border rounded-xl"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-sm">{b}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to join */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border-2 border-violet-200 dark:border-violet-800 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="h-6 w-6 text-violet-600" />
            How to Join
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
              <div>
                <strong>Create a tasker account</strong> on AI Taskers platform.
                <Button variant="link" className="h-auto p-0 ml-2" onClick={() => navigate({ name: 'auth' })}>Sign up →</Button>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
              <div>
                <strong>Complete your profile</strong> with bio, photo, skills, and platforms you work on.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
              <div>
                <strong>Click the WhatsApp invite link</strong> and request to join.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
              <div>
                <strong>Admin will verify your tasker profile</strong> and approve your request (usually within 24 hours).
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <div className="text-center">
        <Button
          size="lg"
          asChild
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5 mr-2" />
            Join the Community Now
          </a>
        </Button>
      </div>
    </div>
  )
}
