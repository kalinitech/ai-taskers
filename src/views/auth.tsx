'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNav, useAuth } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Mail, Lock, User, Briefcase, Check, AlertTriangle } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@aitaskers.com', password: 'admin123', color: 'bg-brand-navy' },
  { label: 'Tasker', email: 'alice.mwangi.0@example.com', password: 'tasker123', color: 'bg-brand-teal' },
  { label: 'Employer', email: 'techflow.ai@example.com', password: 'employer123', color: 'bg-brand-tealLight' },
]

export function AuthPage() {
  const { navigate } = useNav()
  const { login } = useAuth()
  const { toast } = useToast()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [signupRole, setSignupRole] = useState<'tasker' | 'employer'>('tasker')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast({ title: 'Missing fields', description: 'Email and password required.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Login failed', description: data.error || 'Invalid credentials', variant: 'destructive' })
        return
      }
      login({
        userId: data.userId,
        role: data.role,
        email: data.email,
        name: data.name,
      })
      toast({ title: `Welcome back, ${data.name}!`, description: `Signed in as ${data.role}.` })
      navigate({ name: data.role === 'admin' ? 'admin' : 'dashboard' })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.name) {
      toast({ title: 'Missing fields', description: 'All fields are required.', variant: 'destructive' })
      return
    }
    if (!agreed) {
      toast({ title: 'Please accept the Terms', description: 'You must agree to the Terms of Use and Privacy Policy.', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: signupRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Signup failed', description: data.error || 'Try again', variant: 'destructive' })
        return
      }
      login({
        userId: data.userId,
        role: data.role,
        email: data.email,
        name: data.name,
      })
      toast({ title: 'Account created!', description: `Welcome to AI Taskers, ${data.name}!` })
      navigate({ name: 'dashboard' })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setForm({ email: acc.email, password: acc.password, name: '' })
    setMode('login')
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-3xl p-8 shadow-lg"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-navy via-brand-navyLight to-brand-teal p-0.5 mx-auto mb-3">
            <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
              <span className="text-2xl font-black bg-gradient-to-br from-brand-navy to-brand-teal bg-clip-text text-transparent">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'login' ? 'Sign in to your AI Taskers account' : 'Join the AI training talent directory'}
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-9"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-brand-navy to-brand-teal hover:from-brand-navyLight hover:to-brand-tealLight"
              onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div>
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setSignupRole('tasker')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    signupRole === 'tasker' ? 'border-brand-teal bg-brand-teal/10' : 'border-border'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Tasker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupRole('employer')}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    signupRole === 'employer' ? 'border-brand-teal bg-brand-teal/10' : 'border-border'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm font-medium">Employer</span>
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="name">{signupRole === 'tasker' ? 'Full Name' : 'Company Name'}</Label>
              <Input id="name" placeholder={signupRole === 'tasker' ? 'Jane Doe' : 'Acme AI Corp'}
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email-su">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email-su" type="email" placeholder="you@example.com" className="pl-9"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="password-su">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password-su" type="password" placeholder="••••••••" className="pl-9"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
              <span className="text-muted-foreground">
                I have read and agree to the{' '}
                <button onClick={() => navigate({ name: 'terms' })} className="text-brand-teal hover:underline">Terms of Use</button>
                {' '}and{' '}
                <button onClick={() => navigate({ name: 'privacy' })} className="text-brand-teal hover:underline">Privacy Policy</button>.
              </span>
            </label>
            <Button className="w-full bg-gradient-to-r from-brand-navy to-brand-teal hover:from-brand-navyLight hover:to-brand-tealLight"
              onClick={handleSignup} disabled={loading}>
              {loading ? 'Creating account...' : `Create ${signupRole === 'tasker' ? 'Tasker' : 'Employer'} Account`}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Demo accounts */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground mb-3">⚡ Quick demo logins:</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.label}
                onClick={() => fillDemo(acc)}
                className="text-xs p-2 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${acc.color} mx-auto mb-1`} />
                <div className="font-semibold">{acc.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Scam warning */}
        <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 dark:text-amber-200">
            AI Taskers is a directory only. We do not process payments, handle disputes, or verify every user. Never pay anyone for account access.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
