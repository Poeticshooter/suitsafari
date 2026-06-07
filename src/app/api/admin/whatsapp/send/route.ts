import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import type { ApiResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'फोन नंबर आणि मेसेज आवश्यक आहे' } satisfies ApiResponse,
        { status: 400 }
      )
    }

    await sendWhatsAppMessage(to, message)

    return NextResponse.json({ success: true } satisfies ApiResponse)
  } catch (err) {
    console.error('Admin WhatsApp send error:', err)
    return NextResponse.json(
      { success: false, error: 'WhatsApp मेसेज पाठवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
