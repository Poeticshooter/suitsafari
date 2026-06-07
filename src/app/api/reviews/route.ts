import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { ApiResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, customer_phone, rating, comment } = body

    if (!order_id || !customer_phone || !rating) {
      return NextResponse.json(
        { success: false, error: 'ऑर्डर आयडी, फोन आणि रेटिंग आवश्यक आहे' } satisfies ApiResponse,
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'रेटिंग १ ते ५ दरम्यान असावे' } satisfies ApiResponse,
        { status: 400 }
      )
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({ order_id, customer_phone, rating, comment: comment || null })
      .select()
      .single()

    if (error) throw error

    // Update tailor rating
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('tailor_id')
      .eq('id', order_id)
      .single()

    if (order?.tailor_id) {
      const { data: reviews } = await supabaseAdmin
        .from('reviews')
        .select('rating')
        .eq('order_id', order_id)

      const ratings = reviews?.map((r) => r.rating) || []
      const avgRating = ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : rating

      await supabaseAdmin
        .from('tailors')
        .update({ rating: Math.round(avgRating * 10) / 10 })
        .eq('id', order.tailor_id)
    }

    return NextResponse.json({ success: true, data: review } satisfies ApiResponse)
  } catch (err) {
    console.error('POST /api/reviews error:', err)
    return NextResponse.json(
      { success: false, error: 'समीक्षा जतन करताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*, order:orders(customer_name)')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ success: true, data: reviews } satisfies ApiResponse)
  } catch (err) {
    console.error('GET /api/reviews error:', err)
    return NextResponse.json(
      { success: false, error: 'समीक्षा मिळवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
