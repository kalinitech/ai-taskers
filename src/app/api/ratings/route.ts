import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { taskerId, employerName, rating, comment } = await req.json()
    if (!taskerId || !employerName || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }
    const newRating = await db.taskerRating.create({
      data: {
        taskerId,
        employerName,
        rating,
        comment: comment || '',
      },
    })
    // Recompute points for the tasker (gamification: +10 points per rating)
    const tasker = await db.taskerProfile.findUnique({ where: { id: taskerId }, include: { ratings: true } })
    if (tasker) {
      const newPoints = tasker.points + 10
      const newLevel = Math.floor(newPoints / 200) + 1
      await db.taskerProfile.update({
        where: { id: taskerId },
        data: { points: newPoints, level: newLevel },
      })
      // Award "Five Reviews" achievement if applicable
      if (tasker.ratings.length + 1 >= 5) {
        const existing = await db.achievement.findFirst({
          where: { taskerId, badgeType: 'five_ratings' },
        })
        if (!existing) {
          await db.achievement.create({
            data: {
              taskerId,
              badgeType: 'five_ratings',
              title: 'Five Reviews',
              description: 'Received 5 employer reviews',
              icon: '💬',
            },
          })
        }
      }
    }
    return NextResponse.json({ rating: newRating })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
