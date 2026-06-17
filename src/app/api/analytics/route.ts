import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const [
      totalTaskers,
      verifiedTaskers,
      featuredTaskers,
      premiumTaskers,
      totalEmployers,
      verifiedEmployers,
      totalPosts,
      activePosts,
      totalPlatforms,
      totalSubscriptions,
      totalRatings,
      notifications,
    ] = await Promise.all([
      db.taskerProfile.count(),
      db.taskerProfile.count({ where: { isVerified: true } }),
      db.taskerProfile.count({ where: { isFeatured: true } }),
      db.taskerProfile.count({ where: { isPremium: true } }),
      db.employerProfile.count(),
      db.employerProfile.count({ where: { isVerified: true } }),
      db.employerPost.count(),
      db.employerPost.count({ where: { isActive: true } }),
      db.platformCategory.count(),
      db.subscription.count({ where: { isActive: true } }),
      db.taskerRating.count(),
      db.notification.count(),
    ])

    // Revenue from subscriptions (sum of plan prices)
    const subs = await db.subscription.findMany({ where: { isActive: true }, include: { plan: true } })
    const monthlyRevenue = subs.reduce((sum, s) => sum + (s.plan?.price || 0), 0)

    // Country distribution
    const countryDistribution = await db.taskerProfile.groupBy({
      by: ['country'],
      _count: true,
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    })

    // Platform popularity
    const platformPopularity = await db.taskerPlatform.groupBy({
      by: ['platformName'],
      _count: true,
      orderBy: { _count: { platformName: 'desc' } },
      take: 10,
    })

    // Recent taskers (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentTaskers = await db.taskerProfile.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    // Recent posts (last 7 days)
    const recentPosts = await db.employerPost.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    // Rating distribution
    const allRatings = await db.taskerRating.findMany({ select: { rating: true } })
    const avgRating = allRatings.length > 0
      ? allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length
      : 0

    return NextResponse.json({
      counts: {
        totalTaskers,
        verifiedTaskers,
        featuredTaskers,
        premiumTaskers,
        totalEmployers,
        verifiedEmployers,
        totalPosts,
        activePosts,
        totalPlatforms,
        totalSubscriptions,
        totalRatings,
        totalNotifications: notifications,
        recentTaskers,
        recentPosts,
      },
      revenue: {
        monthly: monthlyRevenue,
        currency: 'USD',
      },
      rating: {
        average: avgRating,
        total: allRatings.length,
      },
      countryDistribution: countryDistribution.map(c => ({ country: c.country || 'Unknown', count: c._count })),
      platformPopularity: platformPopularity.map(p => ({ platform: p.platformName, count: p._count })),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
