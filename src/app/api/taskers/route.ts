import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform')
    const country = searchParams.get('country')
    const verification = searchParams.get('verification') // 'verified', 'featured', 'premium', 'basic'
    const skill = searchParams.get('skill')
    const search = searchParams.get('search')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 50

    const where: any = { status: 'active' }
    if (platform) {
      where.platforms = { some: { platformName: platform } }
    }
    if (country) where.country = country
    if (skill) {
      where.skills = { contains: skill }
    }
    if (verification === 'verified') where.isVerified = true
    if (verification === 'featured') where.isFeatured = true
    if (verification === 'premium') where.isPremium = true
    if (verification === 'basic') {
      where.isVerified = false
      where.isFeatured = false
      where.isPremium = false
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { bio: { contains: search } },
        { skills: { contains: search } },
        { languages: { contains: search } },
        { country: { contains: search } },
        { city: { contains: search } },
      ]
    }

    const taskers = await db.taskerProfile.findMany({
      where,
      include: {
        platforms: true,
        ratings: true,
        achievements: true,
      },
      orderBy: [
        { isPremium: 'desc' },
        { isFeatured: 'desc' },
        { isVerified: 'desc' },
        { points: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    const enriched = taskers.map((t) => {
      const avgRating = t.ratings.length > 0
        ? t.ratings.reduce((sum, r) => sum + r.rating, 0) / t.ratings.length
        : 0
      return {
        ...t,
        avgRating,
        ratingsCount: t.ratings.length,
      }
    })

    return NextResponse.json({ taskers: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
