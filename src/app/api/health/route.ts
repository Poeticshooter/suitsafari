import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const whatsappId = process.env.WHATSAPP_PHONE_NUMBER_ID

  return NextResponse.json({
    status: 'healthy',
    live: true,
    timestamp: new Date().toISOString(),
    checks: {
      database: supabaseUrl && supabaseKey ? 'configured' : 'pending',
      whatsapp: whatsappId ? 'configured' : 'pending',
    },
  })
}
