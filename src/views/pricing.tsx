'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNav, useAuth } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Check, Crown, Sparkles, Zap, ShieldCheck, Star, X } from 'lucide-react'
import { PLANS } from '@/lib/constants'

export function PricingPage() {
  const { navigate } = useNav()
  const { isAuthenticated, userId, role } = useAuth()
  const { toast } = useToast()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/plans').then(r => r.json()).then(d => {
      setPlans(d.plans || [])
      setLoading(false)
    })
  }, [])

  const handleSubscribe = async (planId: string, planName: string, price: number) => {
    if (!isAuthenticated) {
      toast({ title: 'Sign in required', description: 'Please sign in to subscribe.', variant: 'destructive' })
      navigate({ name: 'auth' })
      return
    }
    if (role !== 'tasker') {
      toast({ title: 'Tasker only', description: 'Only tasker accounts can subscribe to plans.', variant: 'destructive' })
      return
    }
    setSubscribingTo(planId)
    // Get the tasker profile
    const profileRes = await fetch(`/api/taskers?search=${userId}`)
    const profileData = await profileRes.json()
    // For demo: get the first tasker for this user
    const meRes = await fetch('/api/employers').catch(() => null) // placeholder
    // Better: fetch tasker by user — let's add a quick lookup
    const allTaskersRes = await fetch('/api/taskers?limit=1000')
    const allTaskersData = await allTaskersRes.json()
    const myTasker = allTaskersData.taskers?.find((t: any) => t.userId === userId)
    if (!myTasker) {
      toast({ title: 'No tasker profile', description: 'Please create a tasker profile first.', variant: 'destructive' })
      setSubscribingTo(null)
      return
    }
    // Simulate payment flow (in production, redirect to Paystack)
    toast({ title: 'Processing payment...', description: `Simulating Paystack payment for ${planName} ($${price}).` })
    setTimeout(async () => {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskerId: myTasker.id, planId }),
      })
      if (res.ok) {
        toast({
          title: '🎉 Subscription activated!',
          description: `Your ${planName} plan is now active. Enjoy the benefits!`,
        })
      } else {
        toast({ title: 'Subscription failed', description: 'Please try again.', variant: 'destructive' })
      }
      setSubscribingTo(null)
    }, 1500)
  }

  const featuredPlans = plans.filter(p => p.name === 'featured')
  const premiumPlans = plans.filter(p => p.name === 'premium')

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Badge variant="outline" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> Pricing & Plans</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Boost Your Visibility</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Basic profiles are always free. Upgrade to Featured for top placement or Premium for employer listings access, vendor contacts, and AI training guides.
        </p>
      </motion.div>

      {/* Free Tier Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-card border rounded-2xl p-6 mb-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
          <ShieldCheck className="h-3 w-3" /> Always Free
        </div>
        <h3 className="text-2xl font-bold mb-1">Basic Tasker Profile</h3>
        <div className="text-4xl font-bold mb-1">$0<span className="text-base font-normal text-muted-foreground">/forever</span></div>
        <p className="text-sm text-muted-foreground mb-4">Everything you need to be discovered by employers</p>
        <ul className="text-sm text-left space-y-2 mb-4">
          {[
            'Complete profile with bio, photo, languages',
            'List platforms, projects, skills',
            'Upload proof of work (screenshots, links)',
            'WhatsApp contact button visible to all',
            'Set percentage share rate (20-80%)',
            'Eligible for verification badge (free)',
            'Receive employer ratings & reviews',
          ].map(f => (
            <li key={f} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate({ name: 'auth' })}
        >
          {isAuthenticated ? 'View Dashboard' : 'Create Free Profile'}
        </Button>
      </motion.div>

      {/* Featured Plans */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <Badge className="bg-amber-500 hover:bg-amber-500 mb-2"><Sparkles className="h-3 w-3 mr-1" /> Featured Plans</Badge>
          <h2 className="text-2xl font-bold">Top of Search Results</h2>
          <p className="text-sm text-muted-foreground mt-1">Get featured placement across the platform</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex flex-col"
            >
              <div className="text-3xl mb-2">{plan.duration === 'hour' ? '⏱️' : plan.duration === 'day' ? '📅' : plan.duration === 'week' ? '🗓️' : '📆'}</div>
              <div className="text-xs uppercase text-muted-foreground font-semibold mb-1">{plan.duration}</div>
              <div className="text-3xl font-bold mb-1">${plan.price}<span className="text-sm font-normal text-muted-foreground">/{plan.duration}</span></div>
              <ul className="text-xs space-y-1.5 mt-3 mb-4 flex-1">
                {plan.features.split('\n').map((f: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => handleSubscribe(plan.id, `Featured (${plan.duration})`, plan.price)}
                disabled={subscribingTo === plan.id}
              >
                {subscribingTo === plan.id ? 'Processing...' : 'Get Featured'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Plan */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <Badge className="bg-violet-600 hover:bg-violet-600 mb-2"><Crown className="h-3 w-3 mr-1" /> Premium Plan</Badge>
          <h2 className="text-2xl font-bold">Full Employer Listings Access</h2>
          <p className="text-sm text-muted-foreground mt-1">Unlock everything + direct employer contact</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-300 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-5xl mb-1">👑</div>
                <h3 className="text-3xl font-bold">Premium Tasker</h3>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">$100<span className="text-base font-normal">/mo</span></div>
                <div className="text-xs text-white/80">cancel anytime</div>
              </div>
            </div>
            <p className="text-white/90 mb-6">All Featured benefits PLUS exclusive access to employer listings, vendor contacts, and AI training guides.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {[
                'All Featured tasker benefits',
                'Employer Listings Access (view contact details)',
                'Legit Employer Verification system',
                'Vendor Access (BMS, tools, accounts)',
                'Resume/CV reviewers directory',
                'AI Training Guides (Outlier, RWS, Alignerr)',
                'Priority WhatsApp support',
                'Featured placement on homepage',
              ].map(f => (
                <div key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="w-full text-violet-700 hover:bg-white/90"
              onClick={() => premiumPlans[0] && handleSubscribe(premiumPlans[0].id, 'Premium (month)', 100)}
              disabled={subscribingTo === premiumPlans[0]?.id || !premiumPlans[0]}
            >
              {subscribingTo === premiumPlans[0]?.id ? 'Processing payment...' : 'Upgrade to Premium'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-sm font-semibold">Feature</th>
              <th className="p-3 text-sm font-semibold">Basic</th>
              <th className="p-3 text-sm font-semibold bg-amber-50">Featured</th>
              <th className="p-3 text-sm font-semibold bg-violet-50">Premium</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Profile creation', basic: true, featured: true, premium: true },
              { feature: 'WhatsApp contact button', basic: true, featured: true, premium: true },
              { feature: 'Proof of work upload', basic: true, featured: true, premium: true },
              { feature: 'Verification badge (admin review)', basic: true, featured: true, premium: true },
              { feature: 'Top of search results', basic: false, featured: true, premium: true },
              { feature: 'Homepage featured placement', basic: false, featured: true, premium: true },
              { feature: 'Highlighted profile card', basic: false, featured: true, premium: true },
              { feature: 'Employer listings access', basic: false, featured: false, premium: true },
              { feature: 'Legit employer verification', basic: false, featured: false, premium: true },
              { feature: 'Vendor directory access', basic: false, featured: false, premium: true },
              { feature: 'AI Training Guides', basic: false, featured: false, premium: true },
            ].map((row, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 text-sm">{row.feature}</td>
                <td className="p-3 text-center">{row.basic ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />}</td>
                <td className="p-3 text-center bg-amber-50/50">{row.featured ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />}</td>
                <td className="p-3 text-center bg-violet-50/50">{row.premium ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-8 text-xs text-muted-foreground max-w-2xl mx-auto">
        <ShieldCheck className="h-4 w-4 inline mr-1 text-emerald-500" />
        All payments are processed securely via Paystack. Subscriptions can be cancelled anytime.
        Featured/Premium status does not guarantee tasker quality — verification badges are awarded separately based on admin review of evidence.
      </div>
    </div>
  )
}
