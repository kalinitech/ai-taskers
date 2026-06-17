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
  LayoutDashboard, Users, Building2, Globe, CreditCard, Bell,
  BarChart3, ShieldCheck, Star, Crown, Sparkles, Trash2, Pencil,
  Ban, CheckCircle, Plus, X, AlertTriangle, TrendingUp, DollarSign,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts'
import { TaskerCRUD } from '@/components/admin/tasker-crud'
import { EmployerCRUD } from '@/components/admin/employer-crud'
import { PlatformCRUD } from '@/components/admin/platform-crud'
import { PlanCRUD } from '@/components/admin/plan-crud'
import { NotificationSender } from '@/components/admin/notification-sender'
import { Analytics } from '@/components/admin/analytics'

type Tab = 'dashboard' | 'taskers' | 'employers' | 'platforms' | 'plans' | 'notifications' | 'analytics'

export function AdminPage() {
  const { navigate } = useNav()
  const { isAuthenticated, role, userId, name } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate({ name: 'auth' })
    }
  }, [isAuthenticated, role, navigate])

  if (!isAuthenticated || role !== 'admin') {
    return <div className="container mx-auto px-4 py-16 text-center">Admin access required. Redirecting...</div>
  }

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'taskers', label: 'Taskers', icon: Users },
    { id: 'employers', label: 'Employers', icon: Building2 },
    { id: 'platforms', label: 'Platforms', icon: Globe },
    { id: 'plans', label: 'Plans', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-card border-r lg:min-h-screen">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm">Admin Panel</div>
              <div className="text-xs text-muted-foreground">{name}</div>
            </div>
          </div>
        </div>
        <nav className="p-2 flex lg:flex-col gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 bg-muted/30">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'taskers' && <TaskerCRUD />}
          {activeTab === 'employers' && <EmployerCRUD />}
          {activeTab === 'platforms' && <PlatformCRUD />}
          {activeTab === 'plans' && <PlanCRUD />}
          {activeTab === 'notifications' && <NotificationSender />}
        </motion.div>
      </main>
    </div>
  )
}

function AdminDashboard({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setStats)
  }, [])

  if (!stats) return <div>Loading dashboard...</div>

  const { counts, revenue, rating, countryDistribution, platformPopularity } = stats

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox icon={Users} label="Total Taskers" value={counts.totalTaskers} color="bg-violet-500" onClick={() => onNavigate('taskers')} />
        <StatBox icon={Building2} label="Total Employers" value={counts.totalEmployers} color="bg-blue-500" onClick={() => onNavigate('employers')} />
        <StatBox icon={CreditCard} label="Active Subscriptions" value={counts.totalSubscriptions} color="bg-amber-500" onClick={() => onNavigate('plans')} />
        <StatBox icon={DollarSign} label="Monthly Revenue" value={`$${revenue.monthly}`} color="bg-emerald-500" onClick={() => onNavigate('analytics')} />
        <StatBox icon={ShieldCheck} label="Verified Taskers" value={counts.verifiedTaskers} color="bg-emerald-500" />
        <StatBox icon={Sparkles} label="Featured Taskers" value={counts.featuredTaskers} color="bg-amber-500" />
        <StatBox icon={Crown} label="Premium Taskers" value={counts.premiumTaskers} color="bg-violet-500" />
        <StatBox icon={TrendingUp} label="Active Posts" value={counts.activePosts} color="bg-blue-500" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Taskers by Country</h3>
          {countryDistribution.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Platform Popularity</h3>
          {platformPopularity.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" />
                <YAxis dataKey="platform" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction icon={Bell} label="Send Notification" desc="Broadcast to all users" onClick={() => onNavigate('notifications')} />
        <QuickAction icon={Users} label="Manage Taskers" desc={`${counts.totalTaskers} profiles`} onClick={() => onNavigate('taskers')} />
        <QuickAction icon={Globe} label="Manage Platforms" desc={`${counts.totalPlatforms} platforms`} onClick={() => onNavigate('platforms')} />
      </div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color, onClick }: any) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`bg-card border rounded-2xl p-4 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  )
}

function QuickAction({ icon: Icon, label, desc, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-card border rounded-2xl p-4 text-left hover:shadow-md transition-shadow"
    >
      <Icon className="h-6 w-6 text-violet-500 mb-2" />
      <div className="font-semibold">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </button>
  )
}
