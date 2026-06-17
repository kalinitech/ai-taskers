'use client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useNav } from '@/lib/store'
import { HomePage } from '@/views/home'
import { TaskersPage } from '@/views/taskers'
import { TaskerDetailPage } from '@/views/tasker-detail'
import { EmployerPostsPage } from '@/views/employer-posts'
import { PricingPage } from '@/views/pricing'
import { DashboardPage } from '@/views/dashboard'
import { AdminPage } from '@/views/admin'
import { AuthPage } from '@/views/auth'
import { TermsPage } from '@/views/terms'
import { PrivacyPage } from '@/views/privacy'
import { CommunityPage } from '@/views/community'
import { HowItWorksPage } from '@/views/how-it-works'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
  const { route } = useNav()

  const renderView = () => {
    switch (route.name) {
      case 'home': return <HomePage />
      case 'taskers': return <TaskersPage />
      case 'tasker-detail': return <TaskerDetailPage taskerId={route.id} />
      case 'employer-posts': return <EmployerPostsPage />
      case 'pricing': return <PricingPage />
      case 'dashboard': return <DashboardPage />
      case 'admin': return <AdminPage />
      case 'auth': return <AuthPage />
      case 'terms': return <TermsPage />
      case 'privacy': return <PrivacyPage />
      case 'community': return <CommunityPage />
      case 'how-it-works': return <HowItWorksPage />
      default: return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name + ('id' in route ? route.id : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
