'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNav, useAuth } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft, Star, MapPin, MessageCircle, BadgeCheck, Crown, Sparkles,
  Trophy, Zap, Flame, Award, FileText, ExternalLink, AlertTriangle,
  ChevronLeft, ChevronRight, Briefcase, Globe, Languages, Heart,
} from 'lucide-react'
import { getTaskerTier, PLATFORMS, getPlatformColor } from '@/lib/constants'

export function TaskerDetailPage({ taskerId }: { taskerId: string }) {
  const { navigate } = useNav()
  const { isAuthenticated, role, userId } = useAuth()
  const { toast } = useToast()
  const [tasker, setTasker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeProofIndex, setActiveProofIndex] = useState(0)
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '', employerName: '' })

  useEffect(() => {
    fetch(`/api/tasker/${taskerId}`)
      .then(r => r.json())
      .then(d => setTasker(d.tasker))
      .finally(() => setLoading(false))
  }, [taskerId])

  const submitRating = async () => {
    if (!ratingForm.employerName.trim()) {
      toast({ title: 'Name required', description: 'Please enter your name or company.', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskerId, ...ratingForm }),
    })
    if (res.ok) {
      toast({ title: 'Rating submitted!', description: 'Thank you for your feedback.' })
      setShowRatingForm(false)
      setRatingForm({ rating: 5, comment: '', employerName: '' })
      // Refresh tasker
      fetch(`/api/tasker/${taskerId}`).then(r => r.json()).then(d => setTasker(d.tasker))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (!tasker) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Tasker not found</h2>
        <Button onClick={() => navigate({ name: 'taskers' })}>Back to taskers</Button>
      </div>
    )
  }

  const tier = getTaskerTier(tasker)
  const skills = tasker.skills?.split(',').filter(Boolean) || []
  const languages = tasker.languages?.split(',').filter(Boolean) || []
  const avgRating = tasker.avgRating || 0
  const proofs = tasker.proofs || []
  const ratings = tasker.ratings || []
  const achievements = tasker.achievements || []
  const platforms = tasker.platforms || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'taskers' })} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Taskers
      </Button>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-3xl border-2 overflow-hidden mb-6 ${
          tasker.isPremium ? 'border-violet-300 bg-gradient-to-br from-violet-50 to-fuchsia-50' :
          tasker.isFeatured ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50' :
          tasker.isVerified ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50' :
          'border-border bg-card'
        }`}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-xl">
                  <AvatarImage src={tasker.photoUrl} alt={tasker.fullName} />
                  <AvatarFallback className="text-4xl">{tasker.fullName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {tasker.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-4 border-white shadow-lg">
                    <BadgeCheck className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{tasker.fullName}</h1>
                <Badge
                  className="text-xs font-semibold"
                  style={{ backgroundColor: tier.color, color: 'white' }}
                >
                  {tier.icon} {tier.name}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {tasker.city ? `${tasker.city}, ` : ''}{tasker.country || 'Unknown'}
                </span>
                {avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {avgRating.toFixed(1)} ({ratings.length} reviews)
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Level {tasker.level}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-violet-500" />
                  {tasker.points} pts
                </span>
                {tasker.streak > 0 && (
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {tasker.streak}-day streak
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">{tasker.bio || 'No bio provided yet.'}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {tasker.whatsappNumber && (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    onClick={() => window.open(`https://wa.me/${tasker.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact via WhatsApp
                  </Button>
                )}
                {isAuthenticated && role === 'employer' && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowRatingForm(!showRatingForm)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Leave Rating
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scam warning */}
      <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Due Diligence Required</p>
          <p className="text-amber-800 dark:text-amber-200 text-xs mt-1">
            The platform does not vet employers or guarantee tasker reliability beyond the badge system. Never send money to anyone for account access. Engage in small test tasks before committing to large projects.
          </p>
        </div>
      </div>

      {/* Rating form */}
      {showRatingForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 bg-card border rounded-xl p-6"
        >
          <h3 className="font-semibold text-lg mb-4">Leave a Rating for {tasker.fullName}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="employerName">Your Name / Company</Label>
              <Input
                id="employerName"
                value={ratingForm.employerName}
                onChange={(e) => setRatingForm({ ...ratingForm, employerName: e.target.value })}
                placeholder="e.g. TechFlow AI"
              />
            </div>
            <div>
              <Label>Rating (1-5 stars)</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setRatingForm({ ...ratingForm, rating: n })}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star className={`h-7 w-7 ${n <= ratingForm.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={ratingForm.comment}
                onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                placeholder="Share your experience working with this tasker..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={submitRating}>Submit Rating</Button>
            <Button variant="ghost" onClick={() => setShowRatingForm(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="proofs">Proofs ({proofs.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({ratings.length})</TabsTrigger>
              <TabsTrigger value="badges">Badges ({achievements.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4 mt-4">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-3">About {tasker.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tasker.bio || 'No bio provided.'}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tasker.city}, {tasker.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{tasker.percentageShare}% tasker share</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{tasker.canWorkAtStation ? 'Can work at workstation' : 'Remote only'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{tasker.availability}</span>
                  </div>
                </div>
              </div>

              {skills.length > 0 && (
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-violet-500" />
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <Badge key={s} variant="secondary">{s.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {languages.length > 0 && (
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-blue-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(l => (
                      <Badge key={l} variant="outline">{l.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {platforms.length > 0 && (
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    Platforms & Projects
                  </h3>
                  <div className="space-y-2">
                    {platforms.map((p: any, i: number) => {
                      const platform = PLATFORMS.find(pl => pl.name === p.platformName)
                      return (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{platform?.icon || '📝'}</span>
                            <div>
                              <div className="font-medium text-sm">{p.platformName}</div>
                              {p.projectName && <div className="text-xs text-muted-foreground">{p.projectName}</div>}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {p.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="proofs" className="mt-4">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Proof of Work
                </h3>
                {proofs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No proof of work uploaded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {/* Proof carousel */}
                    <div className="relative">
                      <div className="bg-muted rounded-xl aspect-video flex items-center justify-center overflow-hidden">
                        {proofs[activeProofIndex]?.fileUrl ? (
                          <div className="text-center p-8">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">{proofs[activeProofIndex].title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{proofs[activeProofIndex].proofType}</p>
                          </div>
                        ) : (
                          <div className="text-center p-8">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm">{proofs[activeProofIndex]?.title}</p>
                          </div>
                        )}
                      </div>
                      {proofs.length > 1 && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                            onClick={() => setActiveProofIndex((activeProofIndex - 1 + proofs.length) % proofs.length)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                            onClick={() => setActiveProofIndex((activeProofIndex + 1) % proofs.length)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {proofs.map((p: any, i: number) => (
                        <button
                          key={p.id}
                          onClick={() => setActiveProofIndex(i)}
                          className={`flex-shrink-0 p-3 rounded-lg border text-left min-w-[180px] ${
                            i === activeProofIndex ? 'border-violet-500 bg-violet-50' : 'bg-muted/50'
                          }`}
                        >
                          <div className="font-medium text-sm truncate">{p.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 truncate">{p.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Employer Reviews
                </h3>
                {ratings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No reviews yet. Be the first to leave one!</p>
                ) : (
                  <div className="space-y-3">
                    {ratings.map((r: any) => (
                      <div key={r.id} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{r.employerName}</div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="badges" className="mt-4">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-4 w-4 text-violet-500" />
                  Achievements & Badges
                </h3>
                {achievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No achievements yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {achievements.map((a: any) => (
                      <motion.div
                        key={a.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-amber-50 to-violet-50 dark:from-amber-950/30 dark:to-violet-950/30 border rounded-xl p-4 text-center"
                      >
                        <div className="text-3xl mb-1">{a.icon}</div>
                        <div className="text-sm font-semibold">{a.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{a.description}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - stats sidebar */}
        <div className="space-y-4">
          {/* Gamification card */}
          <div className="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Gamification Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Level</span>
                <span className="font-bold text-lg">{tasker.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Points</span>
                <span className="font-bold text-lg">{tasker.points}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Streak</span>
                <span className="font-bold text-lg flex items-center gap-1">
                  <Flame className="h-4 w-4" /> {tasker.streak} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Badges</span>
                <span className="font-bold text-lg">{achievements.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/90">Reviews</span>
                <span className="font-bold text-lg">{ratings.length}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-xs text-white/80 mb-1">Profile Completion</div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tasker.profileCompletion}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <div className="text-xs text-white/90 mt-1">{tasker.profileCompletion}% complete</div>
            </div>
          </div>

          {/* Quick contact info */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-mono">{tasker.whatsappNumber || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{tasker.country || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-500" />
                <span>{tasker.percentageShare}% tasker / {100 - tasker.percentageShare}% employer</span>
              </div>
            </div>
            {tasker.whatsappNumber && (
              <Button
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => window.open(`https://wa.me/${tasker.whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Now
              </Button>
            )}
          </div>

          {/* Subscription status */}
          {(tasker.isFeatured || tasker.isPremium) && (
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Subscription Status</h3>
              {tasker.isPremium && (
                <Badge className="bg-violet-500 text-white mb-2"><Crown className="h-3 w-3 mr-1" /> Premium Active</Badge>
              )}
              {tasker.isFeatured && !tasker.isPremium && (
                <Badge className="bg-amber-500 text-white mb-2"><Sparkles className="h-3 w-3 mr-1" /> Featured Active</Badge>
              )}
              {tasker.featuredExpiresAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Featured expires: {new Date(tasker.featuredExpiresAt).toLocaleDateString()}
                </p>
              )}
              {tasker.premiumExpiresAt && (
                <p className="text-xs text-muted-foreground">
                  Premium expires: {new Date(tasker.premiumExpiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
