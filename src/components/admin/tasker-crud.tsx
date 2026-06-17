'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import {
  Star, Crown, Sparkles, ShieldCheck, Ban, Trash2, Pencil, Search,
  CheckCircle, X, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react'

export function TaskerCRUD() {
  const { toast } = useToast()
  const [taskers, setTaskers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<any>(null)
  const pageSize = 10

  const load = () => {
    setLoading(true)
    fetch('/api/taskers?limit=1000')
      .then(r => r.json())
      .then(d => setTaskers(d.taskers || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = taskers.filter(t =>
    !search ||
    t.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    t.country?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  )
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const updateTasker = async (id: string, updates: any) => {
    const res = await fetch(`/api/tasker/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      toast({ title: 'Tasker updated', description: 'Changes saved successfully.' })
      load()
    } else {
      toast({ title: 'Update failed', variant: 'destructive' })
    }
  }

  const deleteTasker = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This action cannot be undone.`)) return
    const res = await fetch(`/api/tasker/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Tasker deleted', description: `${name} has been removed.`, variant: 'destructive' })
      load()
    }
  }

  const toggleVerified = (t: any) => {
    updateTasker(t.id, {
      isVerified: !t.isVerified,
      verificationBadgeAwardedAt: !t.isVerified ? new Date().toISOString() : null,
    })
  }

  const toggleFeatured = (t: any) => {
    updateTasker(t.id, {
      isFeatured: !t.isFeatured,
      featuredExpiresAt: !t.isFeatured ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    })
  }

  const togglePremium = (t: any) => {
    updateTasker(t.id, {
      isPremium: !t.isPremium,
      isFeatured: !t.isPremium ? true : t.isFeatured,
      premiumExpiresAt: !t.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      featuredExpiresAt: !t.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    })
  }

  const toggleSuspend = (t: any) => {
    updateTasker(t.id, { status: t.status === 'active' ? 'suspended' : 'active' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Tasker Management</h1>
        <Badge variant="secondary">{filtered.length} taskers</Badge>
      </div>

      {/* Admin warning */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-xs flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-amber-800 dark:text-amber-200">
          <strong>Admin reminder:</strong> Verification/Featured/Premium badges are for visibility only and do not guarantee tasker trustworthiness.
          Always verify evidence (dashboard screenshots, project samples, employer feedback) before awarding the Verified badge.
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search taskers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div>Loading taskers...</div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card border rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold">Tasker</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Tier</th>
                  <th className="text-left p-3 font-semibold">Stats</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(t => (
                  <tr key={t.id} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={t.photoUrl} />
                          <AvatarFallback>{t.fullName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{t.fullName}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{t.bio}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs">{t.city}, {t.country}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {t.isPremium && <Badge className="bg-violet-500 text-[10px] py-0"><Crown className="h-2.5 w-2.5 mr-0.5" />Premium</Badge>}
                        {t.isFeatured && <Badge className="bg-amber-500 text-[10px] py-0"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Featured</Badge>}
                        {t.isVerified && <Badge className="bg-emerald-500 text-[10px] py-0"><ShieldCheck className="h-2.5 w-2.5 mr-0.5" />Verified</Badge>}
                        {!t.isVerified && !t.isFeatured && !t.isPremium && <Badge variant="outline" className="text-[10px] py-0">Basic</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-xs">
                      <div>Lvl {t.level} · {t.points} pts</div>
                      <div className="text-muted-foreground">{t.streak}🔥 streak</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={t.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                        {t.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <IconBtn title={t.isVerified ? 'Remove verified' : 'Verify'} onClick={() => toggleVerified(t)} active={t.isVerified} icon={ShieldCheck} />
                        <IconBtn title={t.isFeatured ? 'Remove featured' : 'Make featured'} onClick={() => toggleFeatured(t)} active={t.isFeatured} icon={Sparkles} />
                        <IconBtn title={t.isPremium ? 'Remove premium' : 'Make premium'} onClick={() => togglePremium(t)} active={t.isPremium} icon={Crown} />
                        <IconBtn title={t.status === 'active' ? 'Suspend' : 'Reactivate'} onClick={() => toggleSuspend(t)} icon={Ban} danger={t.status === 'active'} />
                        <IconBtn title="Edit" onClick={() => setEditing(t)} icon={Pencil} />
                        <IconBtn title="Delete" onClick={() => deleteTasker(t.id, t.fullName)} icon={Trash2} danger />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button variant="outline" size="sm" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage(p => p + 1)}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit modal */}
      {editing && (
        <EditModal tasker={editing} onClose={() => setEditing(null)} onSave={(updates) => {
          updateTasker(editing.id, updates)
          setEditing(null)
        }} />
      )}
    </div>
  )
}

function IconBtn({ title, onClick, icon: Icon, active, danger }: any) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors ${
        danger ? 'text-red-500 hover:bg-red-50' :
        active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
        'text-muted-foreground hover:bg-accent'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}

function EditModal({ tasker, onClose, onSave }: any) {
  const [form, setForm] = useState({
    fullName: tasker.fullName,
    bio: tasker.bio,
    country: tasker.country,
    city: tasker.city,
    whatsappNumber: tasker.whatsappNumber,
    percentageShare: tasker.percentageShare,
    languages: tasker.languages,
    skills: tasker.skills,
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Tasker: {tasker.fullName}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-3">
          <div>
            <Label>Full Name</Label>
            <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <Label>Bio</Label>
            <Input value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Country</Label>
              <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} />
          </div>
          <div>
            <Label>Percentage Share (20-80)</Label>
            <Input type="number" min={20} max={80} value={form.percentageShare}
              onChange={e => setForm({ ...form, percentageShare: Math.min(80, Math.max(20, parseInt(e.target.value) || 40)) })} />
          </div>
          <div>
            <Label>Languages</Label>
            <Input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} />
          </div>
          <div>
            <Label>Skills</Label>
            <Input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onSave(form)}>Save Changes</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </div>
  )
}
