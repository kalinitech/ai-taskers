import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const update: any = {}
    if (body.name !== undefined) update.name = body.name
    if (body.duration !== undefined) update.duration = body.duration
    if (body.price !== undefined) update.price = parseFloat(body.price)
    if (body.currency !== undefined) update.currency = body.currency
    if (body.features !== undefined) {
      update.features = Array.isArray(body.features) ? body.features.join('\n') : body.features
    }
    if (body.isActive !== undefined) update.isActive = body.isActive
    const updated = await db.plan.update({ where: { id }, data: update })
    return NextResponse.json({ plan: updated })
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
    await db.plan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
