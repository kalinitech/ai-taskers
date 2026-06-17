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
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        taskerProfile: true,
        employerProfile: true,
      },
    })
    if (!user || user.passwordHash !== simpleHash(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    return NextResponse.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      taskerProfile: user.taskerProfile,
      employerProfile: user.employerProfile,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
