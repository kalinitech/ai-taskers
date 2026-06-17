import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { taskerId, planId } = await req.json()
    if (!taskerId || !planId) {
      return NextResponse.json({ error: 'taskerId and planId required' }, { status: 400 })
    }
    const plan = await db.plan.findUnique({ where: { id: planId } })
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date()
    if (plan.duration === 'hour') endDate.setHours(endDate.getHours() + 1)
    else if (plan.duration === 'day') endDate.setDate(endDate.getDate() + 1)
    else if (plan.duration === 'week') endDate.setDate(endDate.getDate() + 7)
    else if (plan.duration === 'month') endDate.setMonth(endDate.getMonth() + 1)

    const subscription = await db.subscription.create({
      data: {
        taskerId,
        planId,
        startDate,
        endDate,
        isActive: true,
      },
    })

    // Update tasker profile flags
    const update: any = {}
    if (plan.name === 'featured') {
      update.isFeatured = true
      update.featuredExpiresAt = endDate
    } else if (plan.name === 'premium') {
      update.isPremium = true
      update.isFeatured = true
      update.premiumExpiresAt = endDate
      update.featuredExpiresAt = endDate
    }
    await db.taskerProfile.update({ where: { id: taskerId }, data: update })

    // Award achievement badge
    if (plan.name === 'featured') {
      const exists = await db.achievement.findFirst({ where: { taskerId, badgeType: 'featured_pro' } })
      if (!exists) {
        await db.achievement.create({
          data: {
            taskerId,
            badgeType: 'featured_pro',
            title: 'Featured Pro',
            description: 'Subscribed to Featured plan',
            icon: '⭐',
          },
        })
      }
    } else if (plan.name === 'premium') {
      const exists = await db.achievement.findFirst({ where: { taskerId, badgeType: 'premium_member' } })
      if (!exists) {
        await db.achievement.create({
          data: {
            taskerId,
            badgeType: 'premium_member',
            title: 'Premium Member',
            description: 'Subscribed to Premium plan',
            icon: '👑',
          },
        })
      }
    }

    return NextResponse.json({ subscription, plan })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
