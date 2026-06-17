'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ShieldCheck, Trash2, Pencil, Search, X, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function EmployerCRUD() {
  const { toast } = useToast()
  const [employers, setEmployers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<any>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/employers').then(r => r.json()).then(d => setEmployers(d.employers || [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const filtered = employers.filter(e =>
    !search || e.companyName?.toLowerCase().includes(search.toLowerCase()) || e.contactName?.toLowerCase().includes(search.toLowerCase())
  )

  const updateEmployer = async (id: string, updates: any) => {
    const res = await fetch(`/api/employer/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      toast({ title: 'Employer updated' })
      load()
    }
  }

  const deleteEmployer = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This will also delete all their posts.`)) return
    const res = await fetch(`/api/employer/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: 'Employer deleted', variant: 'destructive' })
      load()
    }
  }

  const toggleVerified = (e: any) => {
    updateEmployer(e.id, { isVerified: !e.isVerified })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Employer Management</h1>
        <Badge variant="secondary">{filtered.length} employers</Badge>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search employers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-3 font-semibold">Company</th>
                <th className="text-left p-3 font-semibold">Contact</th>
                <th className="text-left p-3 font-semibold">Country</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Posts</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{e.companyName}</div>
                        {e.isVerified && <Badge className="bg-emerald-500 text-[10px] py-0"><ShieldCheck className="h-2.5 w-2.5 mr-0.5" />Verified</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs">
                    <div>{e.contactName || '—'}</div>
                    <div className="text-muted-foreground">{e.whatsappNumber || '—'}</div>
                  </td>
                  <td className="p-3 text-xs">{e.country || '—'}</td>
                  <td className="p-3">
                    <Badge variant={e.status === 'active' ? 'default' : 'destructive'} className="text-xs">{e.status}</Badge>
                  </td>
                  <td className="p-3 text-xs">{e.posts?.length || 0}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button title="Toggle Verified" onClick={() => toggleVerified(e)}
                        className={`p-1.5 rounded-md ${e.isVerified ? 'bg-emerald-100 text-emerald-700' : 'text-muted-foreground hover:bg-accent'}`}>
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </button>
                      <button title="Edit" onClick={() => setEditing(e)} className="p-1.5 rounded-md text-muted-foreground hover:bg-accent">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button title="Delete" onClick={() => deleteEmployer(e.id, e.companyName)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditEmployerModal employer={editing} onClose={() => setEditing(null)} onSave={(updates) => {
          updateEmployer(editing.id, updates)
          setEditing(null)
        }} />
      )}
    </div>
  )
}

function EditEmployerModal({ employer, onClose, onSave }: any) {
  const [form, setForm] = useState({
    companyName: employer.companyName,
    contactName: employer.contactName,
    whatsappNumber: employer.whatsappNumber,
    country: employer.country,
    description: employer.description,
    status: employer.status,
  })
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Edit Employer</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-3">
          <div><Label>Company Name</Label><Input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} /></div>
          <div><Label>Contact Name</Label><Input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} /></div>
          <div><Label>WhatsApp</Label><Input value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} /></div>
          <div><Label>Country</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
          <div>
            <Label>Status</Label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 px-3 rounded-md border bg-background">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => onSave(form)}>Save</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </motion.div>
    </div>
  )
}
