'use client'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskerCard } from '@/components/tasker-card'
import { useEffect, useState } from 'react'
import {
  ShieldCheck, Sparkles, MessageCircle, Globe, Star, Users, Award,
  TrendingUp, Zap, Heart, ArrowRight, AlertTriangle, CheckCircle2, Trophy,
} from 'lucide-react'
import { PLATFORMS, MOTIVATIONAL_QUOTES, WHATSAPP_GROUP_LINK } from '@/lib/constants'

export function HomePage() {
  const { navigate } = useNav()
  const [featuredTaskers, setFeaturedTaskers] = useState<any[]>([])
  const [topRated, setTopRated] = useState<any[]>([])
  const [stats, setStats] = useState({ taskers: 0, verified: 0, employers: 0, posts: 0 })
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const todayQuote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length]

  useEffect(() => {
    fetch('/api/taskers?verification=featured&limit=6').then(r => r.json()).then(d => setFeaturedTaskers(d.taskers || []))
    fetch('/api/leaderboard?limit=5').then(r => r.json()).then(d => setLeaderboard(d.leaderboard || []))
    fetch('/api/analytics').then(r => r.json()).then(d => {
      if (d.counts) {
        setStats({
          taskers: d.counts.totalTaskers,
          verified: d.counts.verifiedTaskers,
          employers: d.counts.totalEmployers,
          posts: d.counts.totalPosts,
        })
      }
    })
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero section */}
      <section className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50" />
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-fuchsia-200/40 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border text-sm mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-medium">The Largest Verified AI Training Talent Directory</span>
            <Badge variant="secondary" className="text-[10px]">{stats.taskers}+ taskers</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Find Verified{' '}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
              AI Trainers
            </span>
            ,<br />
            Data Annotators & RLHF Specialists
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Stop searching through scattered WhatsApp groups. Connect directly with verified AI trainers worldwide — no middlemen, no fees, no disputes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <Button
              size="lg"
              onClick={() => navigate({ name: 'taskers' })}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 h-12 px-8 text-base"
            >
              <Users className="h-5 w-5 mr-2" />
              Find Taskers
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ name: 'auth' })}
              className="h-12 px-8 text-base"
            >
              Create Profile
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{stats.verified}+ verified taskers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-500" />
              <span>{stats.employers}+ employers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              <span>{stats.posts}+ open positions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" />
              <span>4.7+ avg rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why AI Taskers?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're a professional directory, not a marketplace. No middlemen, no fees, no disputes — just verified talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Verified Profiles', desc: 'Every verified tasker undergoes manual admin review based on dashboard screenshots, project samples, and employer feedback.' },
              { icon: Award, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Proven Experience', desc: 'Portfolio, proof of work, and ratings displayed transparently. See real evidence of completed projects.' },
              { icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Direct Contact', desc: 'No middlemen, no platform fees. Connect directly via WhatsApp with taskers and employers.' },
              { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Global Talent', desc: 'Access skilled AI trainers across Kenya, Nigeria, India, Philippines, USA, UK, and more.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Supporting 14+ AI Training Platforms</h2>
            <p className="text-muted-foreground">Taskers showcase experience across all major AI training platforms</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-card border rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition-all"
                style={{ borderTopColor: p.color, borderTopWidth: '3px' }}
                onClick={() => navigate({ name: 'taskers' })}
              >
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-xs font-medium truncate">{p.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Taskers */}
      <section className="py-16 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Taskers</h2>
              <p className="text-muted-foreground">Top-rated verified talent available now</p>
            </div>
            <Button variant="outline" onClick={() => navigate({ name: 'taskers' })}>
              View all taskers
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {featuredTaskers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTaskers.map((t, i) => (
                <TaskerCard key={t.id} tasker={t} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Loading featured taskers...</div>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3"><Trophy className="h-3 w-3 mr-1 text-amber-500" /> Leaderboard</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Top Performers This Month</h2>
            <p className="text-muted-foreground">Recognizing taskers with the highest points, ratings, and streaks</p>
          </div>

          <div className="max-w-3xl mx-auto bg-card rounded-2xl border shadow-sm overflow-hidden">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>
            ) : (
              leaderboard.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate({ name: 'tasker-detail', id: t.id })}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-accent transition-colors border-b last:border-b-0 ${
                    i === 0 ? 'bg-amber-50/50' : i === 1 ? 'bg-slate-50/50' : i === 2 ? 'bg-orange-50/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 overflow-hidden">
                    {t.photoUrl && <img src={t.photoUrl} alt={t.fullName} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{t.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.country} · {t.ratingsCount} reviews</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Zap className="h-3 w-3 text-violet-500" />
                      {t.points}
                    </div>
                    <div className="text-xs text-muted-foreground">Lvl {t.level}</div>
                  </div>
                  {t.avgRating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{t.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-16 bg-gradient-to-br from-violet-50 to-fuchsia-50">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-3"><Sparkles className="h-3 w-3 mr-1" /> Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Boost Your Visibility</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Free tasker profiles are always free. Upgrade to Featured for top placement or Premium for employer listings access.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="bg-card rounded-xl p-4 border shadow-sm min-w-[180px]">
              <div className="text-xs text-muted-foreground mb-1">Featured (from)</div>
              <div className="text-3xl font-bold">$2<span className="text-base text-muted-foreground">/hr</span></div>
              <div className="text-xs text-muted-foreground mt-1">Top of search results</div>
            </div>
            <div className="bg-card rounded-xl p-4 border-2 border-violet-300 shadow-sm min-w-[180px] relative">
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet-600">Most Popular</Badge>
              <div className="text-xs text-muted-foreground mb-1">Premium</div>
              <div className="text-3xl font-bold">$100<span className="text-base text-muted-foreground">/mo</span></div>
              <div className="text-xs text-muted-foreground mt-1">Employer listings access</div>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => navigate({ name: 'pricing' })}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            See all pricing options
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* WhatsApp Community CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 md:p-12 text-center text-white"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-300 blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-4">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">Taskers-Only Community</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the AI Taskers WhatsApp Community</h2>
              <p className="text-emerald-50 max-w-2xl mx-auto mb-6">
                Protect yourself from scams, get peer support, share verified employer experiences, and stay updated on the best tasking opportunities.
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-8">
                {['Peer support', 'Scam alerts', 'Quality work standards', 'Teamwork'].map(item => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {item}
                  </li>
                ))}
              </ul>
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
        </div>
      </section>

      {/* Daily Motivation */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-3"><Heart className="h-3 w-3 mr-1 text-red-500" /> Daily Motivation</Badge>
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-3">
              "{todayQuote.quote}"
            </blockquote>
            <cite className="text-sm text-muted-foreground">— {todayQuote.author}</cite>
          </motion.div>
        </div>
      </section>

      {/* Stats counter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Registered Taskers', value: stats.taskers, icon: Users, color: 'text-violet-500' },
              { label: 'Verified Taskers', value: stats.verified, icon: ShieldCheck, color: 'text-emerald-500' },
              { label: 'Active Employers', value: stats.employers, icon: TrendingUp, color: 'text-blue-500' },
              { label: 'Open Positions', value: stats.posts, icon: Zap, color: 'text-amber-500' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center border shadow-sm"
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-3xl font-bold">{stat.value}+</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-amber-500 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of AI trainers and employers building the future of AI — together.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate({ name: 'auth' })}
                  className="h-12 px-8 text-base"
                >
                  Create Free Profile
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate({ name: 'taskers' })}
                  className="h-12 px-8 text-base bg-white/20 backdrop-blur hover:bg-white/30"
                >
                  Browse Taskers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
