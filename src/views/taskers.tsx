'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { TaskerCard } from '@/components/tasker-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, SlidersHorizontal, X, Trophy, Crown, Sparkles, Users, Star } from 'lucide-react'
import { PLATFORMS, COUNTRIES, SKILLS, TASKER_TIERS } from '@/lib/constants'

export function TaskersPage() {
  const { navigate } = useNav()
  const [taskers, setTaskers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('')
  const [country, setCountry] = useState('')
  const [verification, setVerification] = useState('')
  const [skill, setSkill] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'featured' | 'premium' | 'leaderboard'>('all')

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams()
    if (platform) params.set('platform', platform)
    if (country) params.set('country', country)
    if (verification) params.set('verification', verification)
    if (skill) params.set('skill', skill)
    if (search) params.set('search', search)
    setLoading(true)
    fetch(`/api/taskers?${params.toString()}`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setTaskers(d.taskers || []) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [platform, country, verification, skill, search])

  useEffect(() => {
    fetch('/api/leaderboard?limit=10').then(r => r.json()).then(d => setLeaderboard(d.leaderboard || []))
  }, [])

  const clearFilters = () => {
    setPlatform(''); setCountry(''); setVerification(''); setSkill(''); setSearch('')
  }

  const filteredTaskers = useMemo(() => {
    if (activeTab === 'leaderboard') return []
    if (activeTab === 'all') return taskers
    return taskers.filter(t => {
      if (activeTab === 'verified') return t.isVerified
      if (activeTab === 'featured') return t.isFeatured
      if (activeTab === 'premium') return t.isPremium
      return true
    })
  }, [taskers, activeTab])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Verified AI Taskers</h1>
        <p className="text-muted-foreground">
          Browse {taskers.length}+ taskers across {PLATFORMS.length} platforms. Use filters to narrow your search.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Taskers', icon: Users },
          { id: 'verified', label: 'Verified', icon: Star, color: 'text-emerald-500' },
          { id: 'featured', label: 'Featured', icon: Sparkles, color: 'text-amber-500' },
          { id: 'premium', label: 'Premium', icon: Crown, color: 'text-violet-500' },
          { id: 'leaderboard', label: '🏆 Leaderboard', icon: Trophy, color: 'text-yellow-500' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? '' : tab.color || ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl border shadow-sm overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-b">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Top Taskers Leaderboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Based on points, ratings, and activity streaks</p>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            leaderboard.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate({ name: 'tasker-detail', id: t.id })}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-accent transition-colors border-b last:border-b-0 ${
                  i === 0 ? 'bg-amber-50/50' : i === 1 ? 'bg-slate-50/50' : i === 2 ? 'bg-orange-50/30' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 ${
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 overflow-hidden flex-shrink-0">
                  {t.photoUrl && <img src={t.photoUrl} alt={t.fullName} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-1">
                    {t.fullName}
                    {t.isVerified && <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />}
                    {t.isPremium && <Crown className="h-3 w-3 text-violet-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {t.country} · Lvl {t.level} · {t.streak}🔥 streak
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-violet-600">{t.points}</div>
                  <div className="text-[10px] text-muted-foreground">points</div>
                </div>
                {t.avgRating > 0 && (
                  <div className="flex items-center gap-1 text-sm flex-shrink-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{t.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      ) : (
        <>
          {/* Search + Filter Toggle */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skill, country, or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(platform || country || verification || skill) && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {[platform, country, verification, skill].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {(platform || country || verification || skill || search) && (
              <Button variant="ghost" onClick={clearFilters} size="icon">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Platform</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue placeholder="All platforms" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="">All platforms</SelectItem>
                    {PLATFORMS.map(p => <SelectItem key={p.name} value={p.name}>{p.icon} {p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue placeholder="All countries" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="">All countries</SelectItem>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Verification</label>
                <Select value={verification} onValueChange={setVerification}>
                  <SelectTrigger><SelectValue placeholder="All taskers" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All taskers</SelectItem>
                    <SelectItem value="verified">Verified only</SelectItem>
                    <SelectItem value="featured">Featured only</SelectItem>
                    <SelectItem value="premium">Premium only</SelectItem>
                    <SelectItem value="basic">Basic only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Skill</label>
                <Select value={skill} onValueChange={setSkill}>
                  <SelectTrigger><SelectValue placeholder="All skills" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="">All skills</SelectItem>
                    {SKILLS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : filteredTaskers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">No taskers found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search.</p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-3">
                Showing <span className="font-semibold text-foreground">{filteredTaskers.length}</span> tasker{filteredTaskers.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTaskers.map((t, i) => (
                  <TaskerCard key={t.id} tasker={t} index={i} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
