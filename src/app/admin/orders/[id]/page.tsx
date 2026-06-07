'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel, getGarmentIcon } from '@/lib/utils'
import type { Order } from '@/lib/types'

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrder()
  }, [])

  async function loadOrder() {
    try {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*, tailor:tailors(*)')
        .eq('id', params.id)
        .single()

      setOrder(data)
    } catch (err) {
      console.error('Error loading order:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(status: string) {
    if (!order) return

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', order.id)

    if (!error) {
      setOrder({ ...order, status: status as Order['status'] })
    }
  }

  if (loading) {
    return <Skeleton className="h-64" />
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ऑर्डर सापडली नाही</p>
        <Button href="/admin/orders" variant="ghost" className="mt-4">मागे जा</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Button href="/admin/orders" variant="ghost" className="mb-4">← मागे</Button>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">
              {getGarmentIcon(order.garment_type)} {order.order_number}
            </h1>
            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">ग्राहक</p>
            <p className="font-medium">{order.customer_name}</p>
            <p className="text-gray-400">{order.customer_phone}</p>
            {order.customer_address && <p className="text-gray-400">{order.customer_address}</p>}
          </div>
          <div>
            <p className="text-gray-500">कपडा</p>
            <p className="font-medium">{getGarmentIcon(order.garment_type)} {order.garment_type}</p>
            {order.fabric_description && <p className="text-gray-400">{order.fabric_description}</p>}
            <p className="text-gray-400">{formatCurrency(order.price)}</p>
          </div>
        </div>

        {order.tailor && (
          <div className="mt-4 pt-4 border-t text-sm">
            <p className="text-gray-500">दर्जी</p>
            <p className="font-medium">{order.tailor.name}</p>
            <p className="text-gray-400">{order.tailor.phone}</p>
            <p className="text-gray-400">{order.tailor.address}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
          {order.status === 'assigned' && (
            <Button onClick={() => updateStatus('accepted')}>स्वीकारले म्हणून चिन्हांकित करा</Button>
          )}
          {order.status === 'accepted' && (
            <Button onClick={() => updateStatus('completed')}>पूर्ण झाले म्हणून चिन्हांकित करा</Button>
          )}
          {order.status === 'completed' && (
            <Button onClick={() => updateStatus('delivered')}>वितरित म्हणून चिन्हांकित करा</Button>
          )}
          {!['delivered', 'cancelled'].includes(order.status) && (
            <Button variant="danger" onClick={() => updateStatus('cancelled')}>ऑर्डर रद्द करा</Button>
          )}
        </div>
      </Card>
    </div>
  )
}
