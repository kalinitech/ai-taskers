import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tasker = await db.taskerProfile.findUnique({
      where: { id },
      include: {
        platforms: true,
        proofs: { orderBy: { createdAt: 'desc' } },
        ratings: { orderBy: { createdAt: 'desc' } },
        achievements: { orderBy: { awardedAt: 'desc' } },
        subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
        user: { select: { email: true, name: true } },
      },
    })
    if (!tasker) return NextResponse.json({ error: 'Tasker not found' }, { status: 404 })
    const avgRating = tasker.ratings.length > 0
      ? tasker.ratings.reduce((sum, r) => sum + r.rating, 0) / tasker.ratings.length
      : 0
    return NextResponse.json({ tasker: { ...tasker, avgRating } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const update: any = {}
    const allowed = [
      'fullName', 'bio', 'photoUrl', 'country', 'city', 'languages',
      'skills', 'whatsappNumber', 'canWorkAtStation', 'percentageShare',
      'availability', 'isVerified', 'isFeatured', 'isPremium',
      'featuredExpiresAt', 'premiumExpiresAt', 'status',
      'profileCompletion', 'streak', 'points', 'level',
    ]
    for (const k of allowed) {
      if (body[k] !== undefined) update[k] = body[k]
    }
    const updated = await db.taskerProfile.update({ where: { id }, data: update })
    return NextResponse.json({ tasker: updated })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.taskerProfile.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
