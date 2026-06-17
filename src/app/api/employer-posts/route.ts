import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get('platform')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const activeOnly = searchParams.get('active') !== 'false'

    const where: any = {}
    if (activeOnly) where.isActive = true
    if (platform) where.platformName = platform
    if (country) where.employer = { country }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { projectName: { contains: search } },
      ]
    }

    const posts = await db.employerPost.findMany({
      where,
      include: {
        employer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ posts })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      employerId, title, description, platformName, projectName,
      numberOfTaskersNeeded, taskerPercentage, employerPercentage,
      workLocation, accountType, contactWhatsapp, screenshotUrl, expiresAt,
    } = body
    if (!employerId || !title || !contactWhatsapp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const post = await db.employerPost.create({
      data: {
        employerId,
        title,
        description: description || '',
        platformName: platformName || '',
        projectName: projectName || '',
        numberOfTaskersNeeded: numberOfTaskersNeeded || 1,
        taskerPercentage: taskerPercentage || 40,
        employerPercentage: employerPercentage || 60,
        workLocation: workLocation || 'remote',
        accountType: accountType || 'ready_to_task',
        contactWhatsapp,
        screenshotUrl: screenshotUrl || '',
        isActive: true,
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
    return NextResponse.json({ post })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
