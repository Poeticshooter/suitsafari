import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { ApiResponse } from '@/lib/types'

export async function GET() {
  try {
    const { data: tailors, error } = await supabaseAdmin
      .from('tailors')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: tailors } satisfies ApiResponse)
  } catch (err) {
    console.error('GET /api/tailors error:', err)
    return NextResponse.json(
      { success: false, error: 'दर्जी मिळवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, shop_name, address, specialties, base_price_shirt, base_price_pant } = body

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'नाव आणि मोबाईल नंबर आवश्यक आहे' } satisfies ApiResponse,
        { status: 400 }
      )
    }

    const { data: tailor, error } = await supabaseAdmin
      .from('tailors')
      .insert({
        name,
        phone,
        shop_name: shop_name || null,
        address: address || null,
        specialties: specialties || ['shirt', 'pant'],
        base_price_shirt: base_price_shirt || 300,
        base_price_pant: base_price_pant || 400,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'हा मोबाईल नंबर आधीच नोंदणीकृत आहे' } satisfies ApiResponse,
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, data: tailor } satisfies ApiResponse)
  } catch (err) {
    console.error('POST /api/tailors error:', err)
    return NextResponse.json(
      { success: false, error: 'दर्जी नोंदणी करताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
