'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, getGarmentIcon } from '@/lib/utils'
import type { Order } from '@/lib/types'

interface Stats {
  orders_today: number
  orders_month: number
  active_tailors: number
  pending_orders: number
  completed_today: number
  revenue_today: number
  revenue_month: number
  total_orders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*, tailor:tailors(*)')
        .order('created_at', { ascending: false })
        .limit(10)

      const { data: tailorsData } = await supabaseAdmin
        .from('tailors')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)

      const allOrders = orders || []

      const todayOrders = allOrders.filter((o) => o.created_at >= todayStart)
      const monthOrders = allOrders.filter((o) => o.created_at >= monthStart)

      setStats({
        orders_today: todayOrders.length,
        orders_month: monthOrders.length + Math.max(0, allOrders.length - monthOrders.length),
        active_tailors: (tailorsData as unknown as { count: number } | null)?.count || 0,
        pending_orders: allOrders.filter((o) => o.status === 'pending' || o.status === 'assigned').length,
        completed_today: todayOrders.filter((o) => o.status === 'completed' || o.status === 'delivered').length,
        revenue_today: todayOrders.reduce((s, o) => s + (o.commission || 0), 0),
        revenue_month: monthOrders.reduce((s, o) => s + (o.commission || 0), 0),
        total_orders: allOrders.length,
      })

      setRecentOrders(allOrders.slice(0, 8))
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [loadData])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  const statCards = [
    { label: 'आजचे ऑर्डर', value: stats?.orders_today || 0, icon: '📦', sub: `पूर्ण: ${stats?.completed_today || 0}` },
    { label: 'या महिन्याचे ऑर्डर', value: stats?.orders_month || 0, icon: '📊', sub: `एकूण: ${stats?.total_orders || 0}` },
    { label: 'सक्रिय दर्जी', value: stats?.active_tailors || 0, icon: '👨‍🔧', sub: 'ऑनलाईन' },
    { label: 'प्रलंबित', value: stats?.pending_orders || 0, icon: '⏳', sub: 'असाइन केलेले' },
    { label: 'आजचे उत्पन्न', value: formatCurrency(stats?.revenue_today || 0), icon: '💰', sub: 'कमिशन' },
    { label: 'महिन्याचे उत्पन्न', value: formatCurrency(stats?.revenue_month || 0), icon: '💵', sub: 'एकूण कमिशन' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">डॅशबोर्ड</h1>
          <p className="text-sm text-gray-500">Suitsafari व्यवस्थापन पॅनल</p>
        </div>
        <div className="flex gap-2">
          <Button href="/admin/orders" size="sm">सर्व ऑर्डर</Button>
          <Button href="/admin/tailors" variant="secondary" size="sm">दर्जी</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {statCards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                {card.sub && <p className="text-[10px] text-gray-400">{card.sub}</p>}
              </div>
              <span className="text-xl">{card.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="font-semibold text-[#1A1A2E] mb-3">अलीकडील ऑर्डर</h2>
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <Card key={order.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">{getGarmentIcon(order.garment_type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">
                      {order.order_number} — {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-gray-500">{formatCurrency(order.price)}</span>
                  <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                </div>
              </div>
            </Card>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">अजून ऑर्डर नाहीत.</p>
          )}
        </div>
      </div>
    </div>
  )
}
