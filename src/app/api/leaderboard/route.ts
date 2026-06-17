import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Top-rated leaderboard
    const taskers = await db.taskerProfile.findMany({
      where: { status: 'active' },
      include: { ratings: true },
    })

    const leaderboard = taskers
      .map(t => {
        const avgRating = t.ratings.length > 0
          ? t.ratings.reduce((sum, r) => sum + r.rating, 0) / t.ratings.length
          : 0
        return {
          id: t.id,
          fullName: t.fullName,
          photoUrl: t.photoUrl,
          country: t.country,
          points: t.points,
          level: t.level,
          streak: t.streak,
          avgRating,
          ratingsCount: t.ratings.length,
          isVerified: t.isVerified,
          isFeatured: t.isFeatured,
          isPremium: t.isPremium,
        }
      })
      .sort((a, b) => {
        // Sort by points, then by rating, then by rating count
        if (b.points !== a.points) return b.points - a.points
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating
        return b.ratingsCount - a.ratingsCount
      })
      .slice(0, limit)

    return NextResponse.json({ leaderboard })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
