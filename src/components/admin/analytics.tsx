'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, Area, AreaChart,
} from 'recharts'

const COLORS = ['#1E2A5E', '#00C2D1', '#2DD4BF', '#2B3B7A', '#20B2AA', '#5F9EA0', '#4682B4', '#191970']

export function Analytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setStats)
  }, [])

  if (!stats) return <div>Loading analytics...</div>

  const { counts, revenue, rating, countryDistribution, platformPopularity } = stats

  // Compose pie data
  const tierData = [
    { name: 'Basic', value: counts.totalTaskers - counts.verifiedTaskers - counts.featuredTaskers - counts.premiumTaskers },
    { name: 'Verified', value: counts.verifiedTaskers - counts.featuredTaskers - counts.premiumTaskers },
    { name: 'Featured', value: counts.featuredTaskers - counts.premiumTaskers },
    { name: 'Premium', value: counts.premiumTaskers },
  ].filter(d => d.value > 0)

  // Mock time series (would be real in production)
  const signupTrend = Array.from({ length: 7 }).map((_, i) => ({
    day: `Day ${i + 1}`,
    signups: Math.floor(Math.random() * 20) + 5,
    posts: Math.floor(Math.random() * 10) + 1,
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Taskers" value={counts.totalTaskers} sub={`${counts.recentTaskers} new this week`} color="bg-[#1E2A5E]" />
        <KPICard label="Active Employers" value={counts.totalEmployers} sub={`${counts.verifiedEmployers} verified`} color="bg-[#00C2D1]" />
        <KPICard label="Monthly Revenue" value={`$${revenue.monthly}`} sub="from subscriptions" color="bg-[#2DD4BF]" />
        <KPICard label="Avg Rating" value={rating.average.toFixed(2)} sub={`${rating.total} reviews`} color="bg-[#2B3B7A]" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Signups trend */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Signups & Posts (7 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={signupTrend}>
              <defs>
                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E2A5E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1E2A5E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2D1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00C2D1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="signups" stroke="#1E2A5E" fillOpacity={1} fill="url(#colorSignups)" />
              <Area type="monotone" dataKey="posts" stroke="#00C2D1" fillOpacity={1} fill="url(#colorPosts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tier distribution */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Tasker Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={(entry: any) => `${entry.name}: ${entry.value}`}
              >
                {tierData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Country distribution */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Geographic Distribution</h3>
          {countryDistribution.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-12">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={countryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C2D1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Platform popularity */}
        <div className="bg-card border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Platform Popularity</h3>
          {platformPopularity.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-12">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={platformPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" />
                <YAxis dataKey="platform" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#2DD4BF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Summary stats table */}
      <div className="bg-card border rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <StatItem label="Total Notifications" value={counts.totalNotifications} />
          <StatItem label="Active Subscriptions" value={counts.totalSubscriptions} />
          <StatItem label="Total Reviews" value={counts.totalRatings} />
          <StatItem label="Active Posts" value={counts.activePosts} />
          <StatItem label="Featured Taskers" value={counts.featuredTaskers} />
          <StatItem label="Premium Taskers" value={counts.premiumTaskers} />
          <StatItem label="Verified Employers" value={counts.verifiedEmployers} />
          <StatItem label="Total Platforms" value={counts.totalPlatforms} />
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, sub, color }: any) {
  return (
    <div className="bg-card border rounded-2xl p-4">
      <div className={`w-8 h-8 rounded-lg ${color} mb-3`} />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}
