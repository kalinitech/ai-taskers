import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const employer = await db.employerProfile.findUnique({
      where: { id },
      include: { posts: true, user: { select: { email: true } } },
    })
    if (!employer) return NextResponse.json({ error: 'Employer not found' }, { status: 404 })
    return NextResponse.json({ employer })
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
      'companyName', 'contactName', 'whatsappNumber', 'country',
      'description', 'isVerified', 'status',
    ]
    for (const k of allowed) {
      if (body[k] !== undefined) {
        if (k === 'isVerified' && body[k] === true) {
          update.isVerified = true
          update.verificationBadgeAwardedAt = new Date()
        } else {
          update[k] = body[k]
        }
      }
    }
    const updated = await db.employerProfile.update({ where: { id }, data: update })
    return NextResponse.json({ employer: updated })
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
    await db.employerProfile.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
