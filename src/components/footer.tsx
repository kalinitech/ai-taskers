'use client'
import { useNav } from '@/lib/store'
import { motion } from 'framer-motion'
import { ShieldCheck, AlertTriangle, Heart } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Taskers', route: { name: 'taskers' as const } },
      { label: 'Employer Posts', route: { name: 'employer-posts' as const } },
      { label: 'Pricing', route: { name: 'pricing' as const } },
      { label: 'How It Works', route: { name: 'how-it-works' as const } },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'WhatsApp Group', route: { name: 'community' as const } },
      { label: 'Leaderboard', route: { name: 'taskers' as const } },
      { label: 'Become a Tasker', route: { name: 'auth' as const } },
      { label: 'Post Work (Employers)', route: { name: 'auth' as const } },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use', route: { name: 'terms' as const } },
      { label: 'Privacy Policy', route: { name: 'privacy' as const } },
      { label: 'Scam Safety Guide', route: { name: 'terms' as const } },
      { label: 'Verification Process', route: { name: 'how-it-works' as const } },
    ],
  },
] as const

export function Footer() {
  const { navigate } = useNav()
  return (
    <footer className="mt-auto border-t bg-gradient-to-br from-background via-background to-muted/30">
      {/* Scam warning banner */}
      <div className="border-b bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">Scam Warning</p>
              <p className="text-amber-800 dark:text-amber-200 text-xs mt-1">
                AI Taskers never asks for payment to access accounts. If an employer asks you to pay them for an account, project, or processing fee — it is a scam. Report them immediately and avoid at all costs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-navy via-brand-navyLight to-brand-teal p-0.5">
                <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center">
                  <span className="text-lg font-black bg-gradient-to-br from-brand-navy to-brand-teal bg-clip-text text-transparent">AI</span>
                </div>
              </div>
              <div>
                <div className="font-bold leading-none text-brand-navy dark:text-white">AI Taskers</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Verified Talent Directory</div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground max-w-xs">
              The largest verified AI training talent directory. Find verified AI trainers, data annotators, and RLHF specialists worldwide.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-brand-teal" />
              <span>Directory only · No middlemen · No disputes</span>
            </div>
          </div>
          {FOOTER_LINKS.map(group => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-3">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.route)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Taskers Platform. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            <span>for the global AI training community</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
