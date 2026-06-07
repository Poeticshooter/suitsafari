'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReviewStars } from '@/components/shared/review-stars'
import { formatDate, formatCurrency, getStatusLabel } from '@/lib/utils'
import type { Tailor, Order } from '@/lib/types'

export default function AdminTailorDetailPage() {
  const params = useParams()
  const [tailor, setTailor] = useState<Tailor | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: tailorData } = await supabaseAdmin
        .from('tailors')
        .select('*')
        .eq('id', params.id)
        .single()

      const { data: ordersData } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('tailor_id', params.id)
        .order('created_at', { ascending: false })
        .limit(50)

      setTailor(tailorData)
      setOrders(ordersData || [])
    } catch (err) {
      console.error('Error loading tailor:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Skeleton className="h-64" />

  if (!tailor) {
    return <div className="text-center py-12 text-gray-500">दर्जी सापडला नाही</div>
  }

  return (
    <div className="max-w-2xl">
      <Button href="/admin/tailors" variant="ghost" className="mb-4">← मागे</Button>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">👨‍🔧</div>
          <div>
            <h1 className="text-xl font-bold">{tailor.name}</h1>
            {tailor.shop_name && <p className="text-sm text-gray-500">{tailor.shop_name}</p>}
            <p className="text-sm text-gray-500">{tailor.phone}</p>
            <p className="text-sm text-gray-400">{tailor.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <ReviewStars rating={tailor.rating} />
              <span className="text-sm text-gray-500">{tailor.rating}</span>
              <span className="text-sm text-gray-400">| {tailor.total_orders} ऑर्डर</span>
            </div>
          </div>
        </div>
      </Card>

      <h2 className="font-semibold mb-3">ऑर्डर इतिहास ({orders.length})</h2>
      <div className="space-y-2">
        {orders.map((order) => (
          <Card key={order.id} className="text-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-gray-500 text-xs">{order.garment_type} — {formatCurrency(order.price)}</p>
                <p className="text-gray-400 text-xs">{formatDate(order.created_at)}</p>
              </div>
              <span className="text-xs text-gray-500">{getStatusLabel(order.status)}</span>
            </div>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">अजून ऑर्डर नाहीत</p>
        )}
      </div>
    </div>
  )
}
