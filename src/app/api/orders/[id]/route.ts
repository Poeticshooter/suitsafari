import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsAppMessage, confirmationCustomerMessage, completionMessage } from '@/lib/whatsapp'
import type { ApiResponse } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, tailor_id } = body

    // Get current order
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*, tailor:tailors(*)')
      .eq('id', id)
      .single()

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'ऑर्डर सापडली नाही' } satisfies ApiResponse,
        { status: 404 }
      )
    }

    // Update order
    const updateData: Record<string, unknown> = { status }
    if (tailor_id) updateData.tailor_id = tailor_id

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    // Send WhatsApp notifications based on status change
    try {
      if (status === 'accepted' && order.tailor) {
        const msg = confirmationCustomerMessage(
          order.tailor.name,
          order.tailor.phone,
          order.tailor.address
        )
        await sendWhatsAppMessage(order.customer_phone, msg)
      } else if (status === 'completed') {
        await sendWhatsAppMessage(order.customer_phone, completionMessage())
      }
    } catch (waError) {
      console.error('WhatsApp notification failed:', waError)
    }

    return NextResponse.json({ success: true } satisfies ApiResponse)
  } catch (err) {
    console.error('PATCH /api/orders/[id] error:', err)
    return NextResponse.json(
      { success: false, error: 'ऑर्डर अपडेट करताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, tailor:tailors(*)')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: 'ऑर्डर सापडली नाही' } satisfies ApiResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: order } satisfies ApiResponse)
  } catch (err) {
    console.error('GET /api/orders/[id] error:', err)
    return NextResponse.json(
      { success: false, error: 'ऑर्डर मिळवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
