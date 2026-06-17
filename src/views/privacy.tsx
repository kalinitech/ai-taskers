'use client'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Shield, FileText, Mail, Cookie, Lock, Eye, Baby, ExternalLink } from 'lucide-react'
import { SUPPORT_EMAIL } from '@/lib/constants'

export function PrivacyPage() {
  const { navigate } = useNav()

  const sections = [
    {
      icon: Eye,
      title: '4.1 Information We Collect',
      content: [
        'Account details: name, email, password, country, city.',
        'Profile information: bio, profile photo, WhatsApp number, platforms/projects, proof of work (screenshots, links), percentage share.',
        'Employer posts: job descriptions, contact details, screenshots.',
        'Payment information: processed via our third-party payment provider (Paystack); we do not store full card details.',
        'Automatically collected: log data (IP address, browser type, pages visited, time stamps), device and usage data for PWA functionality, cookies and similar tracking technologies.',
      ],
    },
    {
      icon: Shield,
      title: '4.2 How We Use Your Information',
      content: [
        'To create and manage your account.',
        'To display your profile or posts to other users.',
        'To enable communication between employers and taskers (via WhatsApp or other means).',
        'To send notifications (system, admin, motivational) as described in the platform design.',
        'To process payments for featured/premium subscriptions.',
        'To improve and optimise the Platform.',
        'To enforce our Terms of Use and prevent fraud/abuse.',
      ],
    },
    {
      icon: ExternalLink,
      title: '4.3 Sharing Your Information',
      content: [
        'With other users: Your profile (name, photo, skills, WhatsApp number, ratings, and proof of work) is visible to all visitors. Your contact details (WhatsApp) are visible to everyone — this is the core of the directory.',
        'Employer posts are visible to premium taskers (paid subscribers) and admins.',
        'We may share aggregated, anonymised data with partners for analytics.',
        'We do NOT sell your personal data to third parties.',
      ],
    },
    {
      icon: Lock,
      title: '4.4 Data Security',
      content: [
        'We implement reasonable security measures to protect your information. However, no online service is 100% secure.',
        'You are responsible for safeguarding your login credentials.',
        'We use HTTPS/SSL encryption for all data transmission.',
        'Sensitive payment data is handled exclusively by our PCI-DSS compliant payment processor (Paystack).',
      ],
    },
    {
      icon: FileText,
      title: '4.5 Data Retention',
      content: [
        'We keep your data as long as your account is active.',
        'If you delete your account, we will remove your personal information within a reasonable time.',
        'We may retain certain data where required by law or for legitimate business purposes (e.g., fraud prevention).',
      ],
    },
    {
      icon: Cookie,
      title: '4.6 Cookies',
      content: [
        'We use cookies to enhance user experience, remember preferences, and analyse site usage.',
        'You can control cookie settings in your browser, but disabling them may affect some functionality.',
        'Essential cookies are required for the platform to function (authentication, session management).',
        'Analytics cookies help us understand how the platform is used (optional).',
      ],
    },
    {
      icon: Shield,
      title: '4.7 Your Rights',
      content: [
        'Access: You can request a copy of the data we hold about you.',
        'Correction: You can update your profile information directly.',
        'Deletion: You may delete your account via the settings page.',
        'Restriction: You can object to certain processing, subject to legal limitations.',
        `To exercise these rights, please contact us at ${SUPPORT_EMAIL}.`,
      ],
    },
    {
      icon: Baby,
      title: "4.8 Children's Privacy",
      content: [
        'The Platform is not intended for individuals under 18.',
        'We do not knowingly collect data from minors.',
        'If you believe a minor has provided us with personal data, please contact us immediately for removal.',
      ],
    },
    {
      icon: ExternalLink,
      title: '4.9 Third-Party Links',
      content: [
        'We may include links to external sites (e.g., WhatsApp group, payment gateway).',
        'We are not responsible for the privacy practices of those sites.',
        'Please review the privacy policies of any third-party sites you visit.',
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <FileText className="h-4 w-4" />
          Legal Document · Last updated: {new Date().toLocaleDateString()}
        </div>
        <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share your information when you use the AI Taskers Platform.
        </p>
      </motion.div>

      {/* Quick summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30 border-2 border-violet-200 dark:border-violet-800 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-violet-600" />
          Privacy at a Glance
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-violet-900 dark:text-violet-100">What we collect:</strong>
            <p className="text-violet-800 dark:text-violet-200 mt-1">Account info, profile data, posts, usage logs, cookies.</p>
          </div>
          <div>
            <strong className="text-violet-900 dark:text-violet-100">Why we collect:</strong>
            <p className="text-violet-800 dark:text-violet-200 mt-1">To operate the directory, enable contact, send notifications, process payments.</p>
          </div>
          <div>
            <strong className="text-violet-900 dark:text-violet-100">Who sees it:</strong>
            <p className="text-violet-800 dark:text-violet-200 mt-1">Profile info is public; posts visible to premium taskers; admin-only data stays private.</p>
          </div>
          <div>
            <strong className="text-violet-900 dark:text-violet-100">Your control:</strong>
            <p className="text-violet-800 dark:text-violet-200 mt-1">Edit your profile anytime, delete account, request data export.</p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((s, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <s.icon className="h-5 w-5 text-violet-500" />
              {s.title}
            </h2>
            <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
              {s.content.map((c, j) => <li key={j}>{c}</li>)}
            </ul>
          </motion.section>
        ))}

        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">4.10 Changes to This Privacy Policy</h2>
          <p className="text-sm text-muted-foreground">
            We may update this policy periodically. The latest version will always be posted on the Platform with an updated "Last updated" date. Continued use of the Platform after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-3">4.11 Contact Us</h2>
          <p className="text-sm text-muted-foreground mb-3">
            If you have any questions or concerns about this Privacy Policy or your personal data, please contact us:
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-violet-500" />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-violet-600 hover:underline">{SUPPORT_EMAIL}</a>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => navigate({ name: 'terms' })}>
          Read Terms of Use
        </Button>
        <Button onClick={() => navigate({ name: 'auth' })}>
          I Understand — Create Account
        </Button>
      </div>
    </div>
  )
}
