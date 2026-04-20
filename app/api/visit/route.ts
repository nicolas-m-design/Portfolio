import { NextRequest, NextResponse } from 'next/server'

function countryFlag(code: string): string {
  const upper = code.toUpperCase()
  return Array.from(upper)
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('')
}

function parseDevice(ua: string | null): string {
  if (!ua) return '🖥️ Unknown'
  if (/iPhone/i.test(ua)) return '📱 iPhone'
  if (/iPad/i.test(ua)) return '📱 iPad'
  if (/Android.*Mobile/i.test(ua)) return '📱 Android'
  if (/Android/i.test(ua)) return '📱 Android Tablet'
  if (/Macintosh/i.test(ua)) return '🖥️ Mac'
  if (/Windows/i.test(ua)) return '🖥️ Windows'
  if (/Linux/i.test(ua)) return '🖥️ Linux'
  return '🖥️ Unknown'
}

function parseBrowser(ua: string | null): string {
  if (!ua) return 'Unknown'
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR\//i.test(ua)) return 'Opera'
  if (/Chrome\//i.test(ua)) return 'Chrome'
  if (/Firefox\//i.test(ua)) return 'Firefox'
  if (/Safari\//i.test(ua)) return 'Safari'
  return 'Unknown'
}

async function sendTelegramNotification(country: string | null, city: string | null, page: string | null, ua: string | null) {
  const flag = country ? countryFlag(country) : '🌐'
  const location = [city, country].filter(Boolean).join(', ') || 'Unknown'
  const path = page || '/'
  const device = parseDevice(ua)
  const browser = parseBrowser(ua)

  const text = `${flag} <b>Portfolio visit</b>\n📍 ${location}\n📄 ${path}\n${device} · ${browser}`

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

    const country = request.headers.get('x-vercel-ip-country')
    const city = request.headers.get('x-vercel-ip-city')
      ? decodeURIComponent(request.headers.get('x-vercel-ip-city')!)
      : null

    let page: string | null = null
    try {
      const body = await request.json()
      page = body?.page ?? null
    } catch { /* body optional */ }

    const ua = request.headers.get('user-agent')
    await sendTelegramNotification(country, city, page, ua)

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
