import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const platforms = await db.platformCategory.findMany({
      include: { projects: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ platforms })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, icon, isActive } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const platform = await db.platformCategory.create({
      data: { name, icon: icon || '📝', isActive: isActive !== false },
    })
    return NextResponse.json({ platform })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
