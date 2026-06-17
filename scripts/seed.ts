/**
 * Seed script for AI Taskers Platform
 * Run: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient } from '@prisma/client'
import { PLATFORMS, PROJECTS_BY_PLATFORM, COUNTRIES, SKILLS, PLANS } from '../src/lib/constants'

const prisma = new PrismaClient()

// Simple hash function (NOT secure - demo only)
function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return `hash_${h.toString(16)}_${s.length}`
}

const SAMPLE_PHOTOS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Charlie&backgroundColor=d1f4d6",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Diana&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Emmanuel&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Grace&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Hassan&backgroundColor=d1f4d6",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Ivan&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Julia&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Kwame&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Lina&backgroundColor=ffdfbf",
]

const TASKER_NAMES = [
  "Alice Mwangi", "Emmanuel Okafor", "Priya Sharma", "Carlos Reyes",
  "Fatima Hassan", "David Kim", "Grace Adeyemi", "Raj Patel",
  "Maria Santos", "James Okello", "Aisha Bello", "Michael Chen",
  "Linda Wanjiru", "Daniel Asare", "Sofia Garcia", "Ahmed Hassan",
  "Blessing Nwosu", "Yuki Tanaka", "Olumide Bakare", "Ananya Gupta",
  "Brian Otieno", "Cynthia Mwangi", "Hiroshi Sato", "Zainab Yusuf",
]

const EMPLOYER_NAMES = [
  "TechFlow AI", "DataMetrics Corp", "CogniLabs", "ScaleUp AI",
  "VertexAI Solutions", "NeuralNet Works", "PromptPros", "AnnotationHub",
]

const BIOS = [
  "Experienced AI trainer specializing in RLHF for large language models. Worked on multiple coding projects with proven track record of high-quality annotations.",
  "Data annotation specialist with 3+ years of experience on Outlier and Handshake platforms. Strong background in linguistics and reasoning tasks.",
  "RLHF expert focused on math and coding domains. Consistently rated top-tier by employers for accuracy and reliability.",
  "Detail-oriented tasker with expertise in physics, chemistry, and biology annotation. Verified across multiple platforms with strong proof of work.",
  "Versatile AI trainer comfortable with creative writing, translation, and fact-checking tasks. Active community member helping newcomers.",
  "Premium tasker with deep experience across Outlier, RWS, and Scale AI. Specializes in coding and reasoning projects with high task acceptance rate.",
  "Dedicated annotator with focus on linguistics and translation. Available for workstation-based projects and flexible remote work.",
  "Verified tasker specializing in image annotation, audio transcription, and multimodal AI training. Top-rated across all engagements.",
]

const EMPLOYER_DESCRIPTIONS = [
  "Leading AI training data company focused on enterprise RLHF and annotation services. We work with Fortune 500 clients.",
  "Innovative AI startup building next-gen language models. We hire verified taskers for high-impact training projects.",
  "Established annotation services provider with global tasker network. Specializing in multilingual and domain-specific projects.",
  "AI research lab developing cutting-edge foundation models. Looking for top talent in coding, math, and reasoning RLHF.",
]

async function main() {
  console.log('🌱 Seeding AI Taskers Platform database...')

  // Clean existing data
  await prisma.achievement.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.taskerRating.deleteMany()
  await prisma.taskerProof.deleteMany()
  await prisma.taskerPlatform.deleteMany()
  await prisma.taskerProfile.deleteMany()
  await prisma.employerPost.deleteMany()
  await prisma.employerProfile.deleteMany()
  await prisma.projectCategory.deleteMany()
  await prisma.platformCategory.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()
  console.log('   ✓ Cleared existing data')

  // Seed platform categories
  for (const p of PLATFORMS) {
    await prisma.platformCategory.create({
      data: {
        name: p.name,
        icon: p.icon,
        isActive: true,
      },
    })
    const projects = PROJECTS_BY_PLATFORM[p.name] ?? []
    const platformRecord = await prisma.platformCategory.findUnique({ where: { name: p.name } })
    if (!platformRecord) continue
    for (const proj of projects) {
      await prisma.projectCategory.create({
        data: {
          platformId: platformRecord.id,
          name: proj,
          isActive: true,
        },
      })
    }
  }
  console.log(`   ✓ Seeded ${PLATFORMS.length} platforms with projects`)

  // Seed plans
  for (const plan of PLANS) {
    await prisma.plan.create({
      data: {
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency,
        features: plan.features.join('\n'),
        isActive: true,
      },
    })
  }
  console.log(`   ✓ Seeded ${PLANS.length} pricing plans`)

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aitaskers.com',
      passwordHash: simpleHash('admin123'),
      name: 'Platform Admin',
      role: 'admin',
    },
  })
  console.log(`   ✓ Created admin user: admin@aitaskers.com / admin123`)

  // Create tasker users and profiles
  const taskers = []
  for (let i = 0; i < 24; i++) {
    const name = TASKER_NAMES[i % TASKER_NAMES.length]
    const country = COUNTRIES[i % COUNTRIES.length]
    const isVerified = i % 3 !== 0
    const isFeatured = i % 4 === 0
    const isPremium = i % 6 === 0
    const percentageShare = [30, 35, 40, 45, 50, 60][i % 6]
    const languages = ['English', 'Spanish', 'French', 'Swahili', 'Hindi', 'Arabic', 'Mandarin', 'Portuguese']
      .slice(i % 4, (i % 4) + 2 + (i % 3))
      .join(', ')
    const skills = SKILLS.slice(i % 8, (i % 8) + 4 + (i % 3)).join(', ')

    const user = await prisma.user.create({
      data: {
        email: name.toLowerCase().replace(/\s+/g, '.') + `.${i}@example.com`,
        passwordHash: simpleHash('tasker123'),
        name,
        role: 'tasker',
      },
    })

    const photoUrl = SAMPLE_PHOTOS[i % SAMPLE_PHOTOS.length]
    const bio = BIOS[i % BIOS.length]
    const profileCompletion = Math.floor(60 + (i * 7) % 40)
    const streak = (i * 3) % 30
    const points = (i * 137) % 1000 + 100
    const level = Math.floor(points / 200) + 1

    const tasker = await prisma.taskerProfile.create({
      data: {
        userId: user.id,
        fullName: name,
        bio,
        photoUrl,
        country,
        city: ['Nairobi', 'Lagos', 'Mumbai', 'Manila', 'Austin', 'London', 'Cape Town', 'Accra', 'Cairo', 'Karachi'][i % 10],
        languages,
        skills,
        whatsappNumber: `+${10000000000 + i * 137}`,
        canWorkAtStation: i % 2 === 0,
        percentageShare,
        availability: ['available', 'busy', 'unavailable'][i % 3],
        isVerified,
        verificationBadgeAwardedAt: isVerified ? new Date(Date.now() - (i + 5) * 24 * 60 * 60 * 1000) : null,
        isFeatured,
        isPremium,
        featuredExpiresAt: isFeatured ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
        premiumExpiresAt: isPremium ? new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) : null,
        status: 'active',
        profileCompletion,
        streak,
        points,
        level,
      },
    })
    taskers.push(tasker)

    // Add platforms for each tasker (2-4 platforms)
    const numPlatforms = 2 + (i % 3)
    for (let j = 0; j < numPlatforms; j++) {
      const platform = PLATFORMS[(i + j) % PLATFORMS.length]
      const projects = PROJECTS_BY_PLATFORM[platform.name] ?? []
      const proj = projects.length > 0 ? projects[j % projects.length] : ''
      const status = ['interested', 'working_on', 'completed'][(i + j) % 3]
      await prisma.taskerPlatform.create({
        data: {
          taskerId: tasker.id,
          platformName: platform.name,
          projectName: proj,
          status,
        },
      })
    }

    // Add proof of work (1-3 proofs)
    const numProofs = 1 + (i % 3)
    for (let k = 0; k < numProofs; k++) {
      await prisma.taskerProof.create({
        data: {
          taskerId: tasker.id,
          proofType: ['screenshot', 'link', 'file'][k % 3],
          title: `Project Sample ${k + 1} - ${['Outlier', 'Handshake', 'RWS'][k % 3]}`,
          description: 'Evidence of completed task work including dashboard screenshots and quality metrics showing top-tier performance.',
          fileUrl: `https://example.com/proofs/${tasker.id}-${k}.png`,
        },
      })
    }

    // Add ratings (0-4 ratings)
    const numRatings = i % 5
    for (let m = 0; m < numRatings; m++) {
      await prisma.taskerRating.create({
        data: {
          taskerId: tasker.id,
          employerName: EMPLOYER_NAMES[m % EMPLOYER_NAMES.length],
          rating: 4 + (m % 2),
          comment: [
            'Excellent work! Delivered high-quality annotations on time.',
            'Very responsive and professional. Will hire again.',
            'Top-tier tasker with great attention to detail.',
            'Consistently produces accurate work. Highly recommended.',
            'Great communication and reliable delivery.',
          ][m % 5],
        },
      })
    }

    // Add achievements based on profile state
    if (profileCompletion >= 90) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'profile_complete', title: 'Profile Complete', description: 'Completed 100% of profile', icon: '🎯' },
      })
    }
    if (isVerified) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'verified', title: 'Verified Tasker', description: 'Awarded verification badge', icon: '✓' },
      })
    }
    if (streak >= 7) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'streak_7', title: '7-Day Streak', description: 'Updated profile 7 days in a row', icon: '🔥' },
      })
    }
    if (streak >= 30) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'streak_30', title: '30-Day Streak', description: 'Updated profile 30 days in a row', icon: '💎' },
      })
    }
    if (isFeatured) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'featured_pro', title: 'Featured Pro', description: 'Subscribed to Featured plan', icon: '⭐' },
      })
    }
    if (isPremium) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'premium_member', title: 'Premium Member', description: 'Subscribed to Premium plan', icon: '👑' },
      })
    }
    if (i < 8) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'early_adopter', title: 'Early Adopter', description: 'Joined during launch period', icon: '🚀' },
      })
    }
    if (numRatings >= 5) {
      await prisma.achievement.create({
        data: { taskerId: tasker.id, badgeType: 'five_ratings', title: 'Five Reviews', description: 'Received 5 employer reviews', icon: '💬' },
      })
    }

    // Add subscriptions for featured/premium taskers
    if (isFeatured) {
      const plan = await prisma.plan.findFirst({ where: { name: 'featured', duration: 'week' } })
      if (plan) {
        await prisma.subscription.create({
          data: {
            taskerId: tasker.id,
            planId: plan.id,
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            isActive: true,
          },
        })
      }
    }
    if (isPremium) {
      const plan = await prisma.plan.findFirst({ where: { name: 'premium', duration: 'month' } })
      if (plan) {
        await prisma.subscription.create({
          data: {
            taskerId: tasker.id,
            planId: plan.id,
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            isActive: true,
          },
        })
      }
    }
  }
  console.log(`   ✓ Created ${taskers.length} tasker profiles with platforms, proofs, ratings, achievements, subscriptions`)

  // Create employer users and profiles
  const employers = []
  for (let i = 0; i < 8; i++) {
    const companyName = EMPLOYER_NAMES[i]
    const user = await prisma.user.create({
      data: {
        email: companyName.toLowerCase().replace(/\s+/g, '.') + '@example.com',
        passwordHash: simpleHash('employer123'),
        name: companyName,
        role: 'employer',
      },
    })
    const employer = await prisma.employerProfile.create({
      data: {
        userId: user.id,
        companyName,
        contactName: ['Sarah Lee', 'Mike Johnson', 'Elena Petrova', 'David Wong', 'Aisha Khan', 'Tom Bradley', 'Lisa Chen', 'Omar Faruk'][i],
        whatsappNumber: `+${20000000000 + i * 137}`,
        country: COUNTRIES[i % COUNTRIES.length],
        description: EMPLOYER_DESCRIPTIONS[i % EMPLOYER_DESCRIPTIONS.length],
        isVerified: i % 3 === 0,
        verificationBadgeAwardedAt: i % 3 === 0 ? new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000) : null,
        status: 'active',
      },
    })
    employers.push(employer)

    // Create 1-3 posts per employer
    const numPosts = 1 + (i % 3)
    for (let j = 0; j < numPosts; j++) {
      const platform = PLATFORMS[(i + j) % PLATFORMS.length]
      const projects = PROJECTS_BY_PLATFORM[platform.name] ?? []
      const proj = projects.length > 0 ? projects[j % projects.length] : ''
      await prisma.employerPost.create({
        data: {
          employerId: employer.id,
          title: `Looking for ${5 + j * 5 + i} ${platform.name} taskers${proj ? ' - ' + proj : ''}`,
          description: `We are hiring ${platform.name} taskers for ${proj || 'an upcoming project'}. Looking for skilled annotators with experience in RLHF, data labeling, or related fields. Verified taskers preferred. Work is remote with flexible hours. Please apply via WhatsApp with your profile link and a brief intro about your experience.`,
          platformName: platform.name,
          projectName: proj,
          numberOfTaskersNeeded: 5 + j * 5 + i,
          taskerPercentage: [40, 45, 50, 35][j % 4],
          employerPercentage: [60, 55, 50, 65][j % 4],
          workLocation: ['remote', 'workstation', 'physical'][j % 3],
          accountType: ['ready_to_task', 'assessment_needed'][j % 2],
          contactWhatsapp: `+${20000000000 + i * 137}`,
          screenshotUrl: '',
          isActive: true,
          createdAt: new Date(Date.now() - j * 12 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
    }
  }
  console.log(`   ✓ Created ${employers.length} employer profiles with posts`)

  // Create notifications (mix of types)
  const notifs = [
    { type: 'system', title: 'Welcome to AI Taskers!', message: 'Complete your profile to start connecting with employers worldwide.', isSentToAll: true },
    { type: 'motivational', title: 'Daily Motivation', message: '"The quality of your work determines the quality of your future." Keep up the great work!', isSentToAll: true },
    { type: 'marketing', title: 'New: Premium Plan Available', message: 'Upgrade to Premium for $100/month and unlock employer listings, vendor access, and AI training guides.', isSentToAll: true },
    { type: 'admin', title: 'Platform Update', message: 'We have added support for 14 platforms including Outlier, Handshake, RWS, and more. Update your profile to showcase your skills!', isSentToAll: true },
    { type: 'system', title: 'Verification Reminder', message: 'Upload proof of work (dashboard screenshots, project samples) to qualify for the verified badge.', isSentToAll: true },
    { type: 'motivational', title: 'You Got This!', message: '"Every annotation shapes the intelligence of tomorrow." Your work matters.', isSentToAll: true },
    { type: 'admin', title: 'Scam Warning', message: 'Never pay an employer for an account. Report any suspicious activity to admins immediately. Stay vigilant!', isSentToAll: true },
  ]
  for (const n of notifs) {
    await prisma.notification.create({
      data: {
        type: n.type,
        title: n.title,
        message: n.message,
        isCustom: n.type === 'admin' || n.type === 'marketing',
        isSentToAll: n.isSentToAll,
        isRead: false,
      },
    })
  }
  console.log(`   ✓ Created ${notifs.length} system notifications`)

  console.log('\n✅ Seed complete!')
  console.log('   Admin login:    admin@aitaskers.com / admin123')
  console.log('   Tasker login:   alice.mwangi.0@example.com / tasker123')
  console.log('   Employer login: techflow.ai@example.com / employer123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
