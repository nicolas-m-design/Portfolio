import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: 'ratelimit:visitor-alerts',
})

function countryFlag(code: string): string {
  const upper = code.toUpperCase()
  return Array.from(upper)
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('')
}

async function sendTelegramNotification(country: string | null, city: string | null, page: string | null) {
  const flag = country ? countryFlag(country) : '🌐'
  const location = [city, country].filter(Boolean).join(', ') || 'Unknown'
  const path = page || '/'

  const text = `${flag} <b>Portfolio visit</b>\n📍 ${location}\n📄 ${path}`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    )

    if (!response.ok) {
      console.error('Telegram API error:', await response.text())
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ success: true, reason: 'skipped' })
    }

    const visitorKey = `visitor:${ip}`
    const seen = await redis.get(visitorKey)

    if (seen) {
      return NextResponse.json({ success: true, reason: 'returning' })
    }

    const country = request.headers.get('x-vercel-ip-country')
    const city = request.headers.get('x-vercel-ip-city')
      ? decodeURIComponent(request.headers.get('x-vercel-ip-city')!)
      : null

    let page: string | null = null
    try {
      const body = await request.json()
      page = body?.page ?? null
    } catch { /* body optional */ }

    const { success: withinLimit } = await ratelimit.limit('global')

    if (withinLimit) {
      await sendTelegramNotification(country, city, page)
    }

    await redis.set(visitorKey, '1', { ex: 2592000 })

    return NextResponse.json({ success: true, reason: 'new' })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    return NextResponse.json({ success: true, reason: 'error' })
  }
}

// Also handle GET requests (just return success, no tracking)
export async function GET() {
  return NextResponse.json({ success: true, message: 'Visitor tracking endpoint' })
}
