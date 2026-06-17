'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNav, useAuth } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import {
  Trophy, Zap, Flame, Award, Crown, Sparkles, Star, TrendingUp,
  Pencil, Save, X, Building2, MessageCircle, Briefcase, AlertTriangle,
} from 'lucide-react'

export function DashboardPage() {
  const { navigate } = useNav()
  const { isAuthenticated, role, userId, name, email } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [employerProfile, setEmployerProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ name: 'auth' })
      return
    }
    loadData()
  }, [isAuthenticated, userId])

  const loadData = async () => {
    try {
      if (role === 'tasker') {
        const res = await fetch('/api/taskers?limit=1000')
        const data = await res.json()
        const myProfile = data.taskers?.find((t: any) => t.userId === userId)
        if (myProfile) {
          setProfile(myProfile)
          setEditForm({
            fullName: myProfile.fullName,
            bio: myProfile.bio,
            country: myProfile.country,
            city: myProfile.city,
            languages: myProfile.languages,
            skills: myProfile.skills,
            whatsappNumber: myProfile.whatsappNumber,
            percentageShare: myProfile.percentageShare,
            canWorkAtStation: myProfile.canWorkAtStation,
            availability: myProfile.availability,
            photoUrl: myProfile.photoUrl,
          })
        }
      } else if (role === 'employer') {
        const res = await fetch('/api/employers')
        const data = await res.json()
        const myProfile = data.employers?.find((e: any) => e.userId === userId)
        if (myProfile) {
          setEmployerProfile(myProfile)
          setEditForm({
            companyName: myProfile.companyName,
            contactName: myProfile.contactName,
            whatsappNumber: myProfile.whatsappNumber,
            country: myProfile.country,
            description: myProfile.description,
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    // Recompute profile completion
    const completion = Math.min(100, Math.floor(
      (editForm.bio?.length > 20 ? 15 : 0) +
      (editForm.photoUrl ? 10 : 0) +
      (editForm.country ? 10 : 0) +
      (editForm.city ? 5 : 0) +
      (editForm.whatsappNumber ? 15 : 0) +
      (editForm.languages ? 10 : 0) +
      (editForm.skills ? 10 : 0) +
      (editForm.percentageShare >= 20 && editForm.percentageShare <= 80 ? 5 : 0) +
      20 // assume proofs/platforms
    ))
    const res = await fetch(`/api/tasker/${profile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, profileCompletion: completion, points: profile.points + 5 }),
    })
    if (res.ok) {
      const data = await res.json()
      setProfile({ ...profile, ...data.tasker })
      setEditing(false)
      toast({ title: 'Profile updated!', description: 'You earned 5 points for keeping your profile fresh.' })
    }
  }

  const saveEmployer = async () => {
    if (!employerProfile) return
    const res = await fetch(`/api/employer/${employerProfile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) {
      const data = await res.json()
      setEmployerProfile(data.employer)
      setEditing(false)
      toast({ title: 'Employer profile updated!' })
    }
  }

  if (!isAuthenticated) {
    return <div className="container mx-auto px-4 py-16 text-center">Redirecting to sign in...</div>
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading dashboard...</div>
  }

  if (role === 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Admin Account</h2>
        <p className="text-muted-foreground mb-4">Use the Admin Panel for full CRUD access.</p>
        <Button onClick={() => navigate({ name: 'admin' })}>Open Admin Panel</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {name}</h1>
          <p className="text-muted-foreground">{email} · <Badge variant="secondary" className="capitalize">{role}</Badge></p>
        </div>
        {role === 'tasker' && profile && (
          <Button variant={editing ? 'default' : 'outline'} onClick={() => setEditing(!editing)}>
            {editing ? <><Save className="h-4 w-4 mr-1" /> Save Changes</> : <><Pencil className="h-4 w-4 mr-1" /> Edit Profile</>}
          </Button>
        )}
        {role === 'employer' && employerProfile && (
          <Button variant={editing ? 'default' : 'outline'} onClick={() => setEditing(!editing)}>
            {editing ? <><Save className="h-4 w-4 mr-1" /> Save Changes</> : <><Pencil className="h-4 w-4 mr-1" /> Edit Profile</>}
          </Button>
        )}
      </div>

      {role === 'tasker' && !profile && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No tasker profile found for your account.</p>
          <Button onClick={() => navigate({ name: 'auth' })}>Sign out and create a new account</Button>
        </div>
      )}

      {role === 'employer' && !employerProfile && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No employer profile found.</p>
          <Button onClick={() => navigate({ name: 'employer-posts' })}>Browse employer posts</Button>
        </div>
      )}

      {role === 'tasker' && profile && (
        <>
          {/* Gamification stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Trophy} label="Level" value={profile.level} color="text-brand-teal" />
            <StatCard icon={Zap} label="Points" value={profile.points} color="text-brand-navy" />
            <StatCard icon={Flame} label="Day Streak" value={profile.streak} color="text-brand-teal" />
            <StatCard icon={Star} label="Avg Rating" value={profile.ratings?.length ? (profile.ratings.reduce((s: number, r: any) => s + r.rating, 0) / profile.ratings.length).toFixed(1) : '—'} color="text-brand-navy" />
          </div>

          {/* Profile completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-brand-navy via-brand-navyLight to-brand-teal rounded-2xl p-6 text-white mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" /> Profile Completion
                </h3>
                <p className="text-sm text-white/90">Complete your profile to earn badges and boost visibility</p>
              </div>
              <div className="text-4xl font-bold">{profile.profileCompletion}%</div>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile.profileCompletion}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            {profile.profileCompletion < 100 && (
              <p className="text-xs text-white/80 mt-2">+5 points each time you update your profile!</p>
            )}
          </motion.div>

          {/* Edit form / Display */}
          {editing ? (
            <div className="bg-card border rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-4">Edit Your Profile</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
                </div>
                <div>
                  <Label>Photo URL</Label>
                  <Input value={editForm.photoUrl} onChange={e => setEditForm({ ...editForm, photoUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <Label>Bio</Label>
                  <Textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} />
                </div>
                <div>
                  <Label>Languages (comma-separated)</Label>
                  <Input value={editForm.languages} onChange={e => setEditForm({ ...editForm, languages: e.target.value })} placeholder="English, Spanish" />
                </div>
                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Input value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} placeholder="Coding, Math, RLHF" />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={editForm.whatsappNumber} onChange={e => setEditForm({ ...editForm, whatsappNumber: e.target.value })} placeholder="+1234567890" />
                </div>
                <div>
                  <Label>Percentage Share (20-80)</Label>
                  <Input type="number" min={20} max={80} value={editForm.percentageShare}
                    onChange={e => setEditForm({ ...editForm, percentageShare: Math.min(80, Math.max(20, parseInt(e.target.value) || 40)) })} />
                </div>
                <div>
                  <Label>Availability</Label>
                  <select
                    value={editForm.availability}
                    onChange={e => setEditForm({ ...editForm, availability: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border bg-background"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="canWork" checked={editForm.canWorkAtStation}
                    onChange={e => setEditForm({ ...editForm, canWorkAtStation: e.target.checked })} />
                  <Label htmlFor="canWork">Can work at workstation</Label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={saveProfile}>Save Changes</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-3">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <Field label="Full Name" value={profile.fullName} />
                <Field label="Country" value={profile.country || 'Not set'} />
                <Field label="City" value={profile.city || 'Not set'} />
                <Field label="WhatsApp" value={profile.whatsappNumber || 'Not set'} />
                <Field label="Languages" value={profile.languages || 'Not set'} />
                <Field label="Skills" value={profile.skills || 'Not set'} />
                <Field label="Percentage Share" value={`${profile.percentageShare}%`} />
                <Field label="Availability" value={profile.availability} />
              </div>
              <div className="mt-3">
                <Label>Bio</Label>
                <p className="text-sm text-muted-foreground mt-1">{profile.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
              </div>
            </div>
          )}

          {/* Subscription status */}
          <div className="bg-card border rounded-2xl p-6 mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-brand-navy" />
              Subscription Status
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {profile.isPremium && <Badge className="bg-brand-navy"><Crown className="h-3 w-3 mr-1" /> Premium</Badge>}
              {profile.isFeatured && <Badge className="bg-brand-teal text-brand-navy"><Sparkles className="h-3 w-3 mr-1" /> Featured</Badge>}
              {profile.isVerified && <Badge className="bg-brand-tealLight text-brand-navy"><Star className="h-3 w-3 mr-1" /> Verified</Badge>}
              {!profile.isPremium && !profile.isFeatured && (
                <p className="text-sm text-muted-foreground">Free tier · Upgrade for more visibility</p>
              )}
            </div>
            <Button className="mt-4" onClick={() => navigate({ name: 'pricing' })}>
              View Pricing Plans
            </Button>
          </div>

          {/* Scam warning */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Stay Safe</p>
              <p className="text-amber-800 dark:text-amber-200 text-xs mt-1">
                Never pay an employer for account access. Report suspicious activity to admins.
              </p>
            </div>
          </div>
        </>
      )}

      {role === 'employer' && employerProfile && (
        <>
          {/* Employer stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Building2} label="Company" value={employerProfile.companyName?.slice(0, 10) || '—'} color="text-blue-500" />
            <StatCard icon={Briefcase} label="Status" value={employerProfile.isVerified ? 'Verified' : 'Pending'} color="text-emerald-500" />
            <StatCard icon={MessageCircle} label="WhatsApp" value={employerProfile.whatsappNumber ? 'Set' : 'Not set'} color="text-emerald-500" />
            <StatCard icon={TrendingUp} label="Country" value={employerProfile.country || '—'} color="text-violet-500" />
          </div>

          {/* Edit form / Display */}
          {editing ? (
            <div className="bg-card border rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-4">Edit Employer Profile</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Company Name</Label>
                  <Input value={editForm.companyName} onChange={e => setEditForm({ ...editForm, companyName: e.target.value })} />
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <Input value={editForm.contactName} onChange={e => setEditForm({ ...editForm, contactName: e.target.value })} />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={editForm.whatsappNumber} onChange={e => setEditForm({ ...editForm, whatsappNumber: e.target.value })} />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={editForm.country} onChange={e => setEditForm({ ...editForm, country: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={saveEmployer}>Save Changes</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-3">Employer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <Field label="Company Name" value={employerProfile.companyName} />
                <Field label="Contact Name" value={employerProfile.contactName || 'Not set'} />
                <Field label="WhatsApp" value={employerProfile.whatsappNumber || 'Not set'} />
                <Field label="Country" value={employerProfile.country || 'Not set'} />
              </div>
              <div className="mt-3">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{employerProfile.description || 'No description set.'}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate({ name: 'employer-posts' })}>
              <MessageCircle className="h-4 w-4 mr-1" /> View / Post Jobs
            </Button>
            <Button variant="outline" onClick={() => navigate({ name: 'taskers' })}>
              Browse Taskers
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-2xl p-4 text-center"
    >
      <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
      <div className="text-2xl font-bold truncate">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
