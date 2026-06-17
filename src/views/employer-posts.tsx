'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNav, useAuth } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  AlertTriangle, Lock, MessageCircle, MapPin, Clock, Users, Percent,
  Briefcase, Building2, Crown, Sparkles, ShieldCheck, X,
} from 'lucide-react'
import { PLATFORMS, getPlatformColor, getPlatformIcon } from '@/lib/constants'

export function EmployerPostsPage() {
  const { navigate } = useNav()
  const { isAuthenticated, role, userId, name } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [showPostForm, setShowPostForm] = useState(false)
  const [postForm, setPostForm] = useState({
    title: '', description: '', platformName: '', projectName: '',
    numberOfTaskersNeeded: 5, taskerPercentage: 40, employerPercentage: 60,
    workLocation: 'remote', accountType: 'ready_to_task',
    contactWhatsapp: '', expiresAt: '',
  })

  const isPremiumOrAdmin = isAuthenticated && (role === 'employer' || role === 'admin' || role === 'tasker')
  // Note: In a real app, tasker should only see this if premium. For demo, all authed users can view.

  const fetchPosts = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (platformFilter) params.set('platform', platformFilter)
    fetch(`/api/employer-posts?${params.toString()}`)
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [search, platformFilter])

  const submitPost = async () => {
    if (!postForm.title || !postForm.contactWhatsapp) {
      toast({ title: 'Missing fields', description: 'Title and WhatsApp contact are required.', variant: 'destructive' })
      return
    }
    // Need to get the employer profile for this user
    const profileRes = await fetch(`/api/employers`)
    const profileData = await profileRes.json()
    const myProfile = profileData.employers?.find((e: any) => e.userId === userId)
    if (!myProfile) {
      toast({ title: 'No employer profile', description: 'Please sign in as an employer to post.', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/employer-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...postForm,
        employerId: myProfile.id,
        expiresAt: postForm.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    })
    if (res.ok) {
      toast({ title: 'Post created!', description: 'Your job posting is now live.' })
      setShowPostForm(false)
      setPostForm({
        title: '', description: '', platformName: '', projectName: '',
        numberOfTaskersNeeded: 5, taskerPercentage: 40, employerPercentage: 60,
        workLocation: 'remote', accountType: 'ready_to_task',
        contactWhatsapp: '', expiresAt: '',
      })
      fetchPosts()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Employer Posts</h1>
          <p className="text-muted-foreground">
            Active AI training job opportunities from verified employers worldwide.
          </p>
        </div>
        {isAuthenticated && role === 'employer' && (
          <Button onClick={() => setShowPostForm(!showPostForm)}>
            {showPostForm ? 'Cancel' : '+ Post Work (Free)'}
          </Button>
        )}
      </div>

      {/* Scam warning banner */}
      <div className="mb-6 bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-950/30 dark:to-red-950/30 border border-amber-300 dark:border-amber-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">⚠️ Important Safety Warning</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
              The platform does not vet employers. Not every employer who contacts you from AI Taskers is legit — be vigilant and do your due diligence.
            </p>
            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 ml-4 list-disc">
              <li>Never pay an employer for an account, project access, or "processing fee". This is always a scam.</li>
              <li>Engage in small test tasks before committing to large projects.</li>
              <li>Report any suspicious activity to admins immediately.</li>
              <li>Use the WhatsApp community to verify employer reputation with peers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Premium notice for non-premium taskers */}
      {!isAuthenticated && (
        <div className="mb-6 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 flex items-center gap-4">
          <Lock className="h-8 w-8 text-violet-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-violet-900 dark:text-violet-100">Premium Access Required</h3>
            <p className="text-sm text-violet-800 dark:text-violet-200 mt-1">
              Full employer contact details are visible to Premium taskers only. Upgrade to Premium ($100/mo) to unlock direct contact, vendor access, and AI training guides.
            </p>
          </div>
          <Button onClick={() => navigate({ name: 'pricing' })} className="bg-violet-600 hover:bg-violet-700">
            Upgrade
          </Button>
        </div>
      )}

      {/* Post Form */}
      {showPostForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 bg-card border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Post Work Opportunity</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowPostForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input id="title" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                placeholder="e.g. Looking for 20 Handshake AI taskers for Hedgehog project" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })}
                placeholder="Describe the project, requirements, expectations..." rows={3} />
            </div>
            <div>
              <Label>Platform</Label>
              <select
                value={postForm.platformName}
                onChange={e => setPostForm({ ...postForm, platformName: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background"
              >
                <option value="">Select platform</option>
                {PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input id="projectName" value={postForm.projectName} onChange={e => setPostForm({ ...postForm, projectName: e.target.value })}
                placeholder="e.g. Hedgehog, Aether, Diamond" />
            </div>
            <div>
              <Label htmlFor="num">Number of Taskers Needed</Label>
              <Input id="num" type="number" value={postForm.numberOfTaskersNeeded} onChange={e => setPostForm({ ...postForm, numberOfTaskersNeeded: parseInt(e.target.value) || 1 })} />
            </div>
            <div>
              <Label htmlFor="workLocation">Work Location</Label>
              <select
                value={postForm.workLocation}
                onChange={e => setPostForm({ ...postForm, workLocation: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background"
              >
                <option value="remote">Remote</option>
                <option value="workstation">Workstation</option>
                <option value="physical">Physical</option>
              </select>
            </div>
            <div>
              <Label htmlFor="taskerPct">Tasker %</Label>
              <Input id="taskerPct" type="number" min={20} max={80} value={postForm.taskerPercentage} onChange={e => {
                const v = Math.min(80, Math.max(20, parseInt(e.target.value) || 40))
                setPostForm({ ...postForm, taskerPercentage: v, employerPercentage: 100 - v })
              }} />
              <p className="text-xs text-muted-foreground mt-1">Min 20%, max 80%</p>
            </div>
            <div>
              <Label htmlFor="empPct">Employer %</Label>
              <Input id="empPct" type="number" value={postForm.employerPercentage} disabled className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="acct">Account Type</Label>
              <select
                value={postForm.accountType}
                onChange={e => setPostForm({ ...postForm, accountType: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background"
              >
                <option value="ready_to_task">Ready to Task</option>
                <option value="assessment_needed">Assessment Needed</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="whatsapp">WhatsApp Contact Number *</Label>
              <Input id="whatsapp" value={postForm.contactWhatsapp} onChange={e => setPostForm({ ...postForm, contactWhatsapp: e.target.value })}
                placeholder="+1234567890" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={submitPost} className="bg-emerald-600 hover:bg-emerald-700">Publish Post</Button>
            <Button variant="ghost" onClick={() => setShowPostForm(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search posts by title, project, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="h-10 px-3 rounded-md border bg-background"
        >
          <option value="">All platforms</option>
          {PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="text-center py-16">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-semibold text-lg mb-2">No posts found</h3>
          <p className="text-muted-foreground">Be the first to post a work opportunity!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post, i) => {
            const employer = post.employer
            const platform = PLATFORMS.find(p => p.name === post.platformName)
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="bg-card border rounded-2xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {platform && <div className="text-2xl flex-shrink-0">{platform.icon}</div>}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 line-clamp-2">{post.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {employer?.companyName || 'Anonymous'}
                        </span>
                        {employer?.isVerified && (
                          <Badge variant="secondary" className="text-[10px] py-0 h-4 bg-emerald-100 text-emerald-700">
                            <ShieldCheck className="h-2.5 w-2.5 mr-0.5" /> Verified
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span><strong>{post.numberOfTaskersNeeded}</strong> needed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                    <span><strong>{post.taskerPercentage}%</strong> / {post.employerPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="capitalize">{post.workLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{employer?.country || 'Unknown'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {post.accountType.replace('_', ' ')}
                  </Badge>
                  {isAuthenticated ? (
                    <Button
                      size="sm"
                      className="ml-auto bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => window.open(`https://wa.me/${post.contactWhatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1" />
                      WhatsApp
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto"
                      onClick={() => navigate({ name: 'auth' })}
                    >
                      <Lock className="h-3.5 w-3.5 mr-1" />
                      Sign in to contact
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
