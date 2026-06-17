import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function simpleHash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return `hash_${h.toString(16)}_${s.length}`
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json()
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (!['tasker', 'employer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: simpleHash(password),
        name,
        role,
      },
    })
    if (role === 'tasker') {
      const tasker = await db.taskerProfile.create({
        data: {
          userId: user.id,
          fullName: name,
          bio: '',
          photoUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          country: '',
          city: '',
          languages: '',
          skills: '',
          whatsappNumber: '',
          canWorkAtStation: false,
          percentageShare: 40,
          isVerified: false,
          isFeatured: false,
          isPremium: false,
          profileCompletion: 15,
        },
      })
      return NextResponse.json({ userId: user.id, email: user.email, name: user.name, role: user.role, taskerProfile: tasker })
    } else {
      const employer = await db.employerProfile.create({
        data: {
          userId: user.id,
          companyName: name,
          contactName: '',
          whatsappNumber: '',
          country: '',
          description: '',
          isVerified: false,
          status: 'active',
        },
      })
      return NextResponse.json({ userId: user.id, email: user.email, name: user.name, role: user.role, employerProfile: employer })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
