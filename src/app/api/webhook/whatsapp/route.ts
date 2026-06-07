import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWhatsAppMessage, confirmationCustomerMessage, completionMessage, reviewRequestMessage } from '@/lib/whatsapp'

function verifySignature(_req: NextRequest): boolean {
  return true // Meta signature verification is optional for MVP
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'suitsafari-webhook-token'

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Verification failed', { status: 403 })
}

export async function POST(req: NextRequest) {
  if (!verifySignature(req)) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const entry = body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const messages = value?.messages

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'ok' })
    }

    for (const msg of messages) {
      const from = msg.from
      const msgType = msg.type

      // Log incoming message
      try {
        await supabaseAdmin.from('admin_logs').insert({
          action: 'whatsapp_received',
          details: { from, msgType, msgId: msg.id },
        })
      } catch { /* log silently */ }

      // Handle button replies (accept/reject)
      if (msgType === 'button' || msgType === 'interactive') {
        const buttonId = msgType === 'button'
          ? msg.button?.payload
          : msg.interactive?.button_reply?.id

        if (!buttonId) continue

        const { data: pendingOrders } = await supabaseAdmin
          .from('orders')
          .select('*, tailor:tailors(*)')
          .eq('status', 'assigned')
          .order('created_at', { ascending: false })
          .limit(5)

        const order = pendingOrders?.find((o) => o.tailor?.phone === from)
        if (!order) continue

        if (buttonId === 'accept') {
          await supabaseAdmin.from('orders').update({ status: 'accepted' }).eq('id', order.id)

          if (order.tailor) {
            try {
              await sendWhatsAppMessage(
                order.customer_phone,
                confirmationCustomerMessage(order.tailor.name, order.tailor.phone, order.tailor.address || '')
              )
            } catch (e) {
              console.error('Failed to send confirmation to customer:', e)
            }
          }
        } else if (buttonId === 'reject') {
          await supabaseAdmin.from('orders').update({ status: 'cancelled' }).eq('id', order.id)

          // Try to find another tailor
          const { data: altTailors } = await supabaseAdmin
            .from('tailors')
            .select('*')
            .eq('is_active', true)
            .neq('id', order.tailor_id)
            .order('total_orders', { ascending: true })
            .limit(1)

          if (altTailors?.[0]) {
            await supabaseAdmin.from('orders').update({
              tailor_id: altTailors[0].id,
              status: 'assigned',
            }).eq('id', order.id)

            try {
              const { newOrderTailorMessage } = await import('@/lib/whatsapp')
              const msg = newOrderTailorMessage(
                order.customer_name, order.garment_type, order.price, order.customer_address || ''
              )
              await sendWhatsAppMessage(altTailors[0].phone, '', 'interactive', msg.interactive as Record<string, unknown>)
            } catch (e) {
              console.error('Failed to reassign order:', e)
            }
          } else {
            await supabaseAdmin.from('orders').update({ tailor_id: null, status: 'pending' }).eq('id', order.id)
          }
        }
      }

      // Handle text replies
      if (msgType === 'text') {
        const text = msg.text?.body?.trim().toLowerCase() || ''

        // Tailor: "done" / "तयार" / "होय"
        if (['done', 'तयार', 'होय', 'ha', 'yes'].includes(text)) {
          const { data: tailor } = await supabaseAdmin
            .from('tailors')
            .select('id')
            .eq('phone', from)
            .single()

          if (tailor) {
            const { data: activeOrders } = await supabaseAdmin
              .from('orders')
              .select('*')
              .eq('tailor_id', tailor.id)
              .in('status', ['accepted', 'in_progress'])
              .order('created_at', { ascending: false })
              .limit(1)

            if (activeOrders?.[0]) {
              await supabaseAdmin.from('orders').update({ status: 'completed' }).eq('id', activeOrders[0].id)

              try {
                await sendWhatsAppMessage(activeOrders[0].customer_phone, completionMessage())
              } catch (e) {
                console.error('Failed to send completion message:', e)
              }

              try {
                await sendWhatsAppMessage(activeOrders[0].customer_phone, reviewRequestMessage())
              } catch (e) {
                console.error('Failed to send review request:', e)
              }
            }
          }
        }

        // Customer: rating 1-5
        if (/^[1-5]$/.test(text)) {
          const rating = parseInt(text)
          const { data: completedOrders } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('customer_phone', from)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(1)

          if (completedOrders?.[0]) {
            const order = completedOrders[0]

            try {
              await supabaseAdmin.from('reviews').upsert({
                order_id: order.id,
                customer_phone: from,
                rating,
              }, { onConflict: 'order_id', ignoreDuplicates: false })
            } catch { /* log silently */ }

            if (order.tailor_id) {
              const { data: reviews } = await supabaseAdmin
                .from('reviews')
                .select('rating')
                .eq('order_id', order.id)

              const ratings = reviews?.map((r) => r.rating) || [rating]
              const avg = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10

              await supabaseAdmin.from('tailors').update({ rating: avg }).eq('id', order.tailor_id)
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    try {
      await supabaseAdmin.from('admin_logs').insert({
        action: 'whatsapp_error',
        details: { error: String(err) },
      })
    } catch { /* log silently */ }
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
