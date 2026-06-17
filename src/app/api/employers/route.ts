import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const employers = await db.employerProfile.findMany({
      include: {
        posts: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ employers })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyName, contactName, whatsappNumber, country, description, isVerified } = body
    if (!companyName) return NextResponse.json({ error: 'Company name required' }, { status: 400 })
    // Need a user account
    const { userId } = body
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const employer = await db.employerProfile.create({
      data: {
        userId,
        companyName,
        contactName: contactName || '',
        whatsappNumber: whatsappNumber || '',
        country: country || '',
        description: description || '',
        isVerified: isVerified || false,
        verificationBadgeAwardedAt: isVerified ? new Date() : null,
        status: 'active',
      },
    })
    return NextResponse.json({ employer })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
