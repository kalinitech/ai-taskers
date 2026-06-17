'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, Pencil, X, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlanCRUD() {
  const { toast } = useToast()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newPlan, setNewPlan] = useState({
    name: 'featured', duration: 'week', price: 10, currency: 'USD', features: '',
  })

  const load = () => {
    setLoading(true)
    fetch('/api/plans').then(r => r.json()).then(d => setPlans(d.plans || [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const addPlan = async () => {
    if (!newPlan.name || !newPlan.duration || newPlan.price === undefined) {
      toast({ title: 'Missing fields', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlan),
    })
    if (res.ok) {
      toast({ title: 'Plan added' })
      setNewPlan({ name: 'featured', duration: 'week', price: 10, currency: 'USD', features: '' })
      setShowAdd(false)
      load()
    }
  }

  const updatePlan = async (id: string, updates: any) => {
    const res = await fetch(`/api/plan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      toast({ title: 'Plan updated' })
      load()
    }
  }

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan? Existing subscriptions will remain but no new ones can be created.')) return
    const res = await fetch(`/api/plan/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Plan deleted', variant: 'destructive' })
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Plans & Pricing Management</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" /> Add Plan
        </Button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card border rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div>
            <Label>Name</Label>
            <select value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
              <option value="featured">Featured</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <Label>Duration</Label>
            <select value={newPlan.duration} onChange={e => setNewPlan({ ...newPlan, duration: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div>
            <Label>Price ($)</Label>
            <Input type="number" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="md:col-span-3">
            <Label>Features (one per line)</Label>
            <Textarea
              value={newPlan.features}
              onChange={e => setNewPlan({ ...newPlan, features: e.target.value })}
              placeholder="Featured listing for 7 days&#10;Top of search results&#10;Homepage featured placement"
              rows={4}
            />
          </div>
          <div className="md:col-span-3 flex gap-2">
            <Button onClick={addPlan}>Add Plan</Button>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.id} className={`bg-card border-2 rounded-2xl p-5 ${
              p.name === 'premium' ? 'border-violet-300' : 'border-amber-300'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {p.name === 'premium' ? '👑' : '⭐'}
                    <Badge variant="outline" className="text-[10px] capitalize">{p.name}</Badge>
                    <Badge variant="outline" className="text-[10px] capitalize">{p.duration}</Badge>
                  </div>
                  <div className="text-2xl font-bold mt-2">${p.price}<span className="text-sm font-normal text-muted-foreground">/{p.duration}</span></div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="p-1.5 rounded-md text-muted-foreground hover:bg-accent">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deletePlan(p.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {p.features && (
                <ul className="text-xs space-y-1 mt-3">
                  {p.features.split('\n').filter(Boolean).slice(0, 4).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3">
                <Badge variant={p.isActive ? 'default' : 'destructive'} className="text-[10px]">{p.isActive ? 'Active' : 'Inactive'}</Badge>
                <button
                  onClick={() => updatePlan(p.id, { isActive: !p.isActive })}
                  className="text-xs text-violet-600 hover:underline ml-2"
                >
                  Toggle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditPlanModal plan={editing} onClose={() => setEditing(null)} onSave={(updates) => {
          updatePlan(editing.id, updates)
          setEditing(null)
        }} />
      )}
    </div>
  )
}

function EditPlanModal({ plan, onClose, onSave }: any) {
  const [form, setForm] = useState({
    name: plan.name,
    duration: plan.duration,
    price: plan.price,
    features: plan.features,
    isActive: plan.isActive,
  })
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Plan</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <select value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
              <option value="featured">Featured</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <Label>Duration</Label>
            <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div>
            <Label>Price ($)</Label>
            <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={5} />
          </div>
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
