'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate, formatCurrency, getStatusColor, getStatusLabel, getGarmentIcon } from '@/lib/utils'
import type { Order } from '@/lib/types'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*, tailor:tailors(*)')
        .order('created_at', { ascending: false })
        .limit(100)

      setOrders(data || [])
    } catch (err) {
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: status as Order['status'] } : o)))
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">ऑर्डर्स</h1>
        <div className="flex gap-2">
          <Button href="/order" size="sm">नवीन ऑर्डर</Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['all', 'pending', 'assigned', 'accepted', 'in_progress', 'completed', 'delivered', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-[#1A1A2E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'सर्व' : getStatusLabel(f)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="अजून ऑर्डर नाहीत"
          description="नवीन ऑर्डर तयार करा किंवा फिल्टर बदला."
          actionLabel="नवीन ऑर्डर"
          actionHref="/order"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{getGarmentIcon(order.garment_type)}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{order.customer_name}</span>
                      <span className="text-xs text-gray-400">{order.order_number}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getGarmentIcon(order.garment_type)} {order.garment_type} — {formatCurrency(order.price)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.customer_phone}
                      {order.tailor && ` → ${order.tailor.name}`}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-gray-600 text-sm px-1">⋮</button>
                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg py-1 min-w-[140px] hidden group-hover:block z-10">
                      {order.status === 'assigned' && (
                        <button onClick={() => updateStatus(order.id, 'accepted')} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50">स्वीकारले</button>
                      )}
                      {order.status === 'accepted' && (
                        <button onClick={() => updateStatus(order.id, 'completed')} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50">पूर्ण झाले</button>
                      )}
                      {order.status === 'completed' && (
                        <button onClick={() => updateStatus(order.id, 'delivered')} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50">वितरित</button>
                      )}
                      <button onClick={() => updateStatus(order.id, 'cancelled')} className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">रद्द करा</button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
