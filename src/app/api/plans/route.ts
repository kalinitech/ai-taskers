import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const plans = await db.plan.findMany({ orderBy: [{ name: 'asc' }, { price: 'asc' }] })
    return NextResponse.json({ plans })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, duration, price, currency, features, isActive } = await req.json()
    if (!name || !duration || price === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const plan = await db.plan.create({
      data: {
        name,
        duration,
        price: parseFloat(price),
        currency: currency || 'USD',
        features: Array.isArray(features) ? features.join('\n') : (features || ''),
        isActive: isActive !== false,
      },
    })
    return NextResponse.json({ plan })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
