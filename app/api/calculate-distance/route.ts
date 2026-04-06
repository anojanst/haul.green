import { NextRequest, NextResponse } from 'next/server'
import { calculateDistance } from '@/lib/distance'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { destination } = body as { destination: string }

    if (!destination || typeof destination !== 'string') {
      return NextResponse.json({ error: 'destination is required' }, { status: 400 })
    }

    const result = await calculateDistance(destination)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
