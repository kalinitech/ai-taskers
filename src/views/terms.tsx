'use client'
import { motion } from 'framer-motion'
import { useNav } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ShieldCheck, FileText, Mail } from 'lucide-react'
import { SUPPORT_EMAIL } from '@/lib/constants'

export function TermsPage() {
  const { navigate } = useNav()

  const sections = [
    {
      title: '3.1 Acceptance of Terms',
      content: 'By creating an account, browsing, or interacting with the Platform, you accept these Terms in full. If you disagree, you must not use the Platform.',
    },
    {
      title: '3.2 Description of the Platform',
      content: 'AI Taskers is a talent directory that allows employers to find and contact taskers, and allows taskers to showcase their experience. We do not: (a) Handle payments between employers and taskers. (b) Act as an escrow agent. (c) Mediate or resolve disputes. (d) Guarantee the delivery or quality of work. (e) Verify the identity or legitimacy of every user beyond our badge system.',
    },
    {
      title: '3.3 User Accounts',
      content: 'You must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your login credentials. You may only have one active account.',
    },
    {
      title: '3.4 User Responsibilities',
      content: 'Taskers must ensure their profile information (skills, platforms, projects, percentage rates) is truthful and up-to-date. Employers must provide accurate job descriptions and contact details. All users must comply with all applicable laws and regulations.',
    },
    {
      title: '3.5 Prohibited Conduct',
      content: 'You shall not: (a) Post fraudulent, misleading, or false information. (b) Harass, abuse, or intimidate other users. (c) Use the Platform to send spam or unsolicited advertising. (d) Attempt to bypass security measures. (e) Request payment from other users for access to accounts, projects, or any form of "onboarding fee" — this is strictly forbidden and will result in permanent ban. (f) Engage in any activity that could harm the reputation or operation of the Platform.',
    },
    {
      title: '3.6 Employer–Tasker Relationship',
      content: 'Employers and taskers negotiate terms independently. The Platform is not a party to any agreement between them. We do not set rates, enforce deadlines, or guarantee payment. Taskers are strongly advised to perform due diligence before accepting any work.',
    },
    {
      title: '3.7 Payments to the Platform',
      content: 'Taskers may pay for Featured or Premium upgrades via our payment gateway. These payments are for directory services and visibility, not for task execution. Fees are non-refundable unless required by law.',
    },
    {
      title: '3.8 Verification Badges',
      content: 'Verification badges are awarded solely at the discretion of the admin team. They indicate that the user has provided satisfactory evidence of experience and identity, but do not guarantee current reliability or honesty.',
    },
    {
      title: '3.9 Disclaimer of Warranties',
      content: 'The Platform is provided "as is" and "as available." We do not warrant that: (a) The Platform will be uninterrupted or error-free. (b) Any employer or tasker is legitimate, trustworthy, or solvent. (c) Any work will be completed or paid for.',
    },
    {
      title: '3.10 Limitation of Liability',
      content: 'To the fullest extent permitted by law, AI Taskers and its owners, employees, and affiliates shall not be liable for: (a) Any loss of profits, data, or opportunities. (b) Any indirect, incidental, or consequential damages. (c) Any disputes, non-payment, or poor performance between users.',
    },
    {
      title: '3.11 Indemnification',
      content: 'You agree to indemnify and hold us harmless from any claims arising from your use of the Platform, your violation of these Terms, or your interactions with other users.',
    },
    {
      title: '3.12 Termination',
      content: 'We reserve the right to suspend or terminate any account without prior notice if we believe you have violated these Terms or engaged in harmful conduct.',
    },
    {
      title: '3.13 Changes to Terms',
      content: 'We may update these Terms from time to time. Continued use constitutes acceptance of the revised Terms.',
    },
    {
      title: '3.14 Governing Law',
      content: 'These Terms shall be governed by the laws of your applicable jurisdiction, without regard to conflict of law principles.',
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
        <h1 className="text-4xl font-bold mb-3">Terms of Use</h1>
        <p className="text-muted-foreground">
          These Terms of Use govern your access to and use of the AI Taskers Platform (the "Platform"). By registering or using the Platform, you agree to be bound by these terms.
        </p>
      </motion.div>

      {/* Critical scam warning */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border-2 border-red-300 dark:border-red-800 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">⚠️ Critical Scam Warning</h2>
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              If an employer asks you to pay money to receive an account, to access a project, or for any other "processing fee" — it is a scam. Avoid them at all costs and report them immediately.
            </p>
            <p className="text-sm text-red-800 dark:text-red-200">
              AI Taskers is a <strong>directory only</strong>. We do not handle disputes, we do not process payments between employers and taskers, and we do not vet every user. Not every employer who contacts you from this platform is legit — taskers are asked to be vigilant and do their due diligence.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Platform Purpose & Role
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            AI Taskers is a professional talent directory that connects employers with verified AI training taskers. Our role is strictly limited to listing and verification — we are <strong>not</strong> a marketplace, escrow service, payment processor, or dispute resolution body.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
            <li>We do <strong>not</strong> handle payments between employers and taskers.</li>
            <li>We do <strong>not</strong> mediate or resolve disputes.</li>
            <li>We do <strong>not</strong> guarantee the legitimacy of any user.</li>
            <li>We do <strong>not</strong> pay taskers — employers handle all payments directly.</li>
            <li>Verification badges indicate evidence review only, not a guarantee of trustworthiness.</li>
          </ul>
        </section>

        {sections.map((s, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border rounded-2xl p-6"
          >
            <h2 className="text-lg font-bold mb-2">{s.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </motion.section>
        ))}

        <section className="bg-card border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-2">3.15 Contact</h2>
          <p className="text-sm text-muted-foreground mb-3">
            For questions regarding these Terms, please contact us:
          </p>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-violet-500" />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-violet-600 hover:underline">{SUPPORT_EMAIL}</a>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => navigate({ name: 'privacy' })}>
          Read Privacy Policy
        </Button>
        <Button onClick={() => navigate({ name: 'auth' })}>
          I Agree — Create Account
        </Button>
      </div>
    </div>
  )
}
