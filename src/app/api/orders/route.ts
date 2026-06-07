import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsAppMessage, newOrderTailorMessage } from '@/lib/whatsapp'
import type { ApiResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer_name, customer_phone, customer_address, garment_type, fabric_description, fabric_provided, price } = body

    if (!customer_name || !customer_phone || !garment_type) {
      return NextResponse.json(
        { success: false, error: 'नाव, मोबाईल नंबर आणि कपड्याचा प्रकार आवश्यक आहे' } satisfies ApiResponse,
        { status: 400 }
      )
    }

    // Find an available tailor (for MVP, assign to first active tailor)
    const { data: tailors } = await supabaseAdmin
      .from('tailors')
      .select('*')
      .eq('is_active', true)
      .order('total_orders', { ascending: true })
      .limit(1)

    const tailor = tailors?.[0] || null

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_address,
        garment_type,
        fabric_description: fabric_description || null,
        fabric_provided,
        price,
        commission: 25,
        tailor_id: tailor?.id || null,
        status: tailor ? 'assigned' : 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { success: false, error: 'ऑर्डर तयार करताना त्रुटी' } satisfies ApiResponse,
        { status: 500 }
      )
    }

    // Notify tailor via WhatsApp
    if (tailor) {
      try {
        const msg = newOrderTailorMessage(
          customer_name,
          garment_type,
          price,
          customer_address || 'निर्दिष्ट नाही'
        )
        await sendWhatsAppMessage(tailor.phone, '', 'interactive', msg.interactive as Record<string, unknown>)
      } catch (waError) {
        console.error('WhatsApp notification failed:', waError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        order_number: order.order_number,
        tailor_assigned: !!tailor,
      },
    } satisfies ApiResponse)
  } catch (err) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json(
      { success: false, error: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const tailorId = searchParams.get('tailor_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('orders')
      .select('*, tailor:tailors(*)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)
    if (tailorId) query = query.eq('tailor_id', tailorId)

    const { data: orders, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data: orders } satisfies ApiResponse)
  } catch (err) {
    console.error('GET /api/orders error:', err)
    return NextResponse.json(
      { success: false, error: 'ऑर्डर्स मिळवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
