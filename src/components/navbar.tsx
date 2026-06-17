'use client'
import { motion } from 'framer-motion'
import { useNav, useAuth, useNotifications } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Bell, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

const NAV_LINKS: { label: string; route: any }[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Find Taskers', route: { name: 'taskers' } },
  { label: 'Employer Posts', route: { name: 'employer-posts' } },
  { label: 'Pricing', route: { name: 'pricing' } },
  { label: 'Leaderboard', route: { name: 'taskers' } },
  { label: 'How It Works', route: { name: 'how-it-works' } },
  { label: 'Community', route: { name: 'community' } },
]

export function Navbar() {
  const { route, navigate, back, forward, canGoBack, canGoForward } = useNav()
  const { isAuthenticated, role, name, email, logout } = useAuth()
  const { unreadCount, isBellOpen, toggleBell, setBell } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/notifications')
        .then(r => r.json())
        .then(data => {
          setNotifications(data.notifications || [])
        })
        .catch(() => {})
    }
  }, [isAuthenticated, unreadCount])

  const handleLogout = () => {
    logout()
    toast({ title: 'Logged out', description: 'You have been signed out.' })
    navigate({ name: 'home' })
  }

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    for (const n of unread) {
      await fetch(`/api/notification/${n.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    useNotifications.setState({ unreadCount: 0 })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-navy/20 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:border-brand-teal/20 dark:bg-brand-navy/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + Nav buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={back}
                disabled={!canGoBack()}
                className="h-8 w-8 text-brand-navy hover:bg-brand-teal/10 dark:text-white dark:hover:bg-brand-teal/20"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={forward}
                disabled={!canGoForward()}
                className="h-8 w-8 text-brand-navy hover:bg-brand-teal/10 dark:text-white dark:hover:bg-brand-teal/20"
                aria-label="Go forward"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="flex items-center gap-2 group"
            >
              <Image
                src="/brand-logo.svg"
                alt="AI Taskers Logo"
                width={36}
                height={36}
                className="w-9 h-9 group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <div className="text-base font-bold leading-none tracking-tight text-brand-navy dark:text-white">AI Taskers</div>
                <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Verified Talent Directory</div>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => navigate(link.route)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:bg-brand-teal/10 hover:text-brand-teal ${
                  route.name === link.route.name ? 'bg-brand-teal/10 text-brand-teal' : 'text-brand-navy/80 dark:text-white/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    toggleBell()
                    if (!isBellOpen && unreadCount > 0) markAllRead()
                  }}
                  className="relative h-9 w-9 text-brand-navy hover:bg-brand-teal/10 dark:text-white dark:hover:bg-brand-teal/20"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-teal text-brand-navy text-[10px] font-bold flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </Button>
                {isBellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-brand-teal/20 bg-white dark:bg-brand-navy shadow-lg z-50"
                  >
                    <div className="p-3 border-b border-brand-teal/20 font-semibold text-sm flex items-center justify-between">
                      <span className="text-brand-navy dark:text-white">Notifications</span>
                      <Badge className="bg-brand-teal text-brand-navy text-xs">{notifications.length}</Badge>
                    </div>
                    <div className="divide-y divide-brand-teal/10 max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div key={n.id} className={`p-3 text-sm ${!n.isRead ? 'bg-brand-teal/10' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-brand-navy text-white text-[10px] px-1.5 py-0">{n.type}</Badge>
                              <span className="font-medium text-brand-navy dark:text-white">{n.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border border-brand-teal/20">
                      <AvatarImage src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name || '')}`} />
                      <AvatarFallback className="bg-brand-teal text-brand-navy">{name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-brand-teal/20">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-brand-navy dark:text-white">{name}</span>
                      <span className="text-xs text-muted-foreground">{email}</span>
                      <Badge className="mt-1 w-fit text-[10px] capitalize bg-brand-teal text-brand-navy">{role}</Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="border-brand-teal/20" />
                  <DropdownMenuItem onClick={() => navigate({ name: 'dashboard' })} className="text-brand-navy hover:bg-brand-teal/10 dark:text-white">
                    Dashboard
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate({ name: 'admin' })} className="text-brand-navy hover:bg-brand-teal/10 dark:text-white">
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate({ name: 'pricing' })} className="text-brand-navy hover:bg-brand-teal/10 dark:text-white">
                    Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-brand-teal/20" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ name: 'auth' })}
                  className="hidden sm:inline-flex text-brand-navy hover:bg-brand-teal/10 dark:text-white dark:hover:bg-brand-teal/20"
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate({ name: 'auth' })}
                  className="bg-brand-navy hover:bg-brand-navyLight text-white"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-brand-navy hover:bg-brand-teal/10 dark:text-white dark:hover:bg-brand-teal/20"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden border-t border-brand-teal/20 py-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  navigate(link.route)
                  setMobileOpen(false)
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors hover:bg-brand-teal/10 ${
                  route.name === link.route.name ? 'bg-brand-teal/10 text-brand-teal' : 'text-brand-navy/80 dark:text-white/80'
                }`}
              >
                {link.label}
              </button>
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  navigate({ name: 'auth' })
                  setMobileOpen(false)
                }}
                className="px-3 py-2 text-sm font-medium rounded-lg text-left text-brand-navy/80 hover:bg-brand-teal/10 dark:text-white/80"
              >
                Sign in
              </button>
            )}
          </motion.nav>
        )}
      </div>
    </header>
  )
}
