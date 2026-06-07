import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type { ApiResponse } from '@/lib/types'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')

    let query = supabaseAdmin
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (action) query = query.eq('action', action)

    const { data: logs, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, data: logs } satisfies ApiResponse)
  } catch (err) {
    console.error('Admin logs error:', err)
    return NextResponse.json(
      { success: false, error: 'लॉग मिळवताना त्रुटी' } satisfies ApiResponse,
      { status: 500 }
    )
  }
}
