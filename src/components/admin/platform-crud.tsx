'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Pencil, X, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlatformCRUD() {
  const { toast } = useToast()
  const [platforms, setPlatforms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newPlatform, setNewPlatform] = useState({ name: '', icon: '📝' })

  const load = () => {
    setLoading(true)
    fetch('/api/platforms').then(r => r.json()).then(d => setPlatforms(d.platforms || [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const addPlatform = async () => {
    if (!newPlatform.name) {
      toast({ title: 'Name required', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlatform),
    })
    if (res.ok) {
      toast({ title: 'Platform added' })
      setNewPlatform({ name: '', icon: '📝' })
      setShowAdd(false)
      load()
    }
  }

  const updatePlatform = async (id: string, updates: any) => {
    const res = await fetch(`/api/platform/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      toast({ title: 'Platform updated' })
      load()
    }
  }

  const deletePlatform = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This will also delete all its projects.`)) return
    const res = await fetch(`/api/platform/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Platform deleted', variant: 'destructive' })
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Platform & Project Management</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" /> Add Platform
        </Button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card border rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div>
            <Label>Platform Name</Label>
            <Input value={newPlatform.name} onChange={e => setNewPlatform({ ...newPlatform, name: e.target.value })} placeholder="e.g. Outlier AI" />
          </div>
          <div>
            <Label>Icon (emoji)</Label>
            <Input value={newPlatform.icon} onChange={e => setNewPlatform({ ...newPlatform, icon: e.target.value })} placeholder="🧠" />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={addPlatform}>Add</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(p => (
            <div key={p.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <div className="font-bold">{p.name}</div>
                    <Badge variant="outline" className="text-[10px] mt-1">{p.projects?.length || 0} projects</Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="p-1.5 rounded-md text-muted-foreground hover:bg-accent">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deletePlatform(p.id, p.name)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {p.projects?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.projects.slice(0, 5).map((proj: any) => (
                    <Badge key={proj.id} variant="secondary" className="text-[10px]">{proj.name}</Badge>
                  ))}
                  {p.projects.length > 5 && <Badge variant="outline" className="text-[10px]">+{p.projects.length - 5} more</Badge>}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <Badge variant={p.isActive ? 'default' : 'destructive'} className="text-[10px]">{p.isActive ? 'Active' : 'Inactive'}</Badge>
                <button
                  onClick={() => updatePlatform(p.id, { isActive: !p.isActive })}
                  className="text-xs text-violet-600 hover:underline"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditPlatformModal platform={editing} onClose={() => setEditing(null)} onSave={(updates) => {
          updatePlatform(editing.id, updates)
          setEditing(null)
        }} />
      )}
    </div>
  )
}

function EditPlatformModal({ platform, onClose, onSave }: any) {
  const [form, setForm] = useState({ name: platform.name, icon: platform.icon, isActive: platform.isActive })
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Platform</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-3">
          <div><Label>Platform Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Icon (emoji)</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onSave(form)}>Save</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </div>
  )
}
