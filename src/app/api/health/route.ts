import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const whatsappConfigured = !!(
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN
    )

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: supabaseUrl ? 'configured' : 'missing',
        whatsapp: whatsappConfigured ? 'configured' : 'missing',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { status: 'unhealthy', error: String(err) },
      { status: 500 }
    )
  }
}
