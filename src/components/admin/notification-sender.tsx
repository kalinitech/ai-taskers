'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Send, Bell, Trash2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOTIVATIONAL_QUOTES } from '@/lib/constants'

export function NotificationSender() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    type: 'admin',
    title: '',
    message: '',
    isSentToAll: true,
  })

  const load = () => {
    setLoading(true)
    fetch('/api/notifications?all=true').then(r => r.json()).then(d => setNotifications(d.notifications || [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const send = async () => {
    if (!form.title || !form.message) {
      toast({ title: 'Title and message required', variant: 'destructive' })
      return
    }
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast({ title: 'Notification sent!', description: `${form.isSentToAll ? 'All users' : 'Target user'} will receive it.` })
      setForm({ type: 'admin', title: '', message: '', isSentToAll: true })
      load()
    }
  }

  const deleteNotif = async (id: string) => {
    if (!confirm('Delete this notification?')) return
    await fetch(`/api/notification/${id}`, { method: 'DELETE' })
    toast({ title: 'Notification deleted', variant: 'destructive' })
    load()
  }

  const applyQuote = (q: any) => {
    setForm({
      type: 'motivational',
      title: `Daily Motivation: ${q.author}`,
      message: `"${q.quote}"`,
      isSentToAll: true,
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notification Management</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Send className="h-4 w-4 text-violet-500" /> Compose Notification
          </h3>
          <div className="grid gap-3">
            <div>
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background"
              >
                <option value="system">System</option>
                <option value="admin">Admin (Custom)</option>
                <option value="marketing">Marketing</option>
                <option value="motivational">Motivational</option>
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Notification title" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Notification message..." />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isSentToAll} onChange={e => setForm({ ...form, isSentToAll: e.target.checked })} />
              <span>Send to all users</span>
            </label>
            <Button onClick={send} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
              <Send className="h-4 w-4 mr-1" /> Send Notification
            </Button>
          </div>

          {/* Quick motivational quotes */}
          <div className="mt-6 pt-4 border-t">
            <Label className="text-xs text-muted-foreground">Quick Motivational Quotes</Label>
            <div className="space-y-1 mt-2 max-h-40 overflow-y-auto">
              {MOTIVATIONAL_QUOTES.slice(0, 5).map((q, i) => (
                <button
                  key={i}
                  onClick={() => applyQuote(q)}
                  className="block w-full text-left text-xs p-2 rounded hover:bg-accent transition-colors"
                >
                  "{q.quote}" — {q.author}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-200">
            <strong>⚠️ Admin reminder:</strong> Never claim the platform "guarantees payment" or "verifies every employer" —
            we only connect users. Always remind taskers to be vigilant and perform due diligence.
          </div>
        </div>

        {/* Recent notifications */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-500" /> Recent Notifications ({notifications.length})
          </h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {notifications.map(n => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge variant="outline" className="text-[10px] capitalize">{n.type}</Badge>
                      <span className="font-medium truncate">{n.title}</span>
                    </div>
                    <button onClick={() => deleteNotif(n.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {n.isSentToAll ? <Badge variant="secondary" className="text-[10px]">All users</Badge> : <Badge variant="secondary" className="text-[10px]">Targeted</Badge>}
                    {n.isRead && <Check className="h-3 w-3 text-emerald-500" />}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
