import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const includeAll = searchParams.get('all') === 'true'

    const where: any = {}
    if (userId) {
      where.OR = [
        { isSentToAll: true },
        { targetUserId: userId },
      ]
    }
    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: includeAll ? 100 : 30,
    })
    const unreadCount = notifications.filter(n => !n.isRead).length
    return NextResponse.json({ notifications, unreadCount })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, title, message, isCustom, isSentToAll, targetUserId } = await req.json()
    if (!title || !message) return NextResponse.json({ error: 'Title and message required' }, { status: 400 })
    const notification = await db.notification.create({
      data: {
        type: type || 'admin',
        title,
        message,
        isCustom: isCustom !== false,
        isSentToAll: isSentToAll !== false,
        targetUserId: targetUserId || null,
        isRead: false,
      },
    })
    return NextResponse.json({ notification })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
