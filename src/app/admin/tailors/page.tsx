'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Modal } from '@/components/ui/modal'
import { ReviewStars } from '@/components/shared/review-stars'
import type { Tailor } from '@/lib/types'

export default function AdminTailorsPage() {
  const [tailors, setTailors] = useState<Tailor[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', shop_name: '', address: '',
    base_price_shirt: '400', base_price_pant: '500',
  })

  useEffect(() => {
    loadTailors()
  }, [])

  async function loadTailors() {
    try {
      const { data } = await supabaseAdmin
        .from('tailors')
        .select('*')
        .order('created_at', { ascending: false })

      setTailors(data || [])
    } catch (err) {
      console.error('Error loading tailors:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addTailor(e: React.FormEvent) {
    e.preventDefault()

    const { error } = await supabaseAdmin
      .from('tailors')
      .insert({
        name: form.name,
        phone: form.phone,
        shop_name: form.shop_name || null,
        address: form.address || null,
        base_price_shirt: parseInt(form.base_price_shirt),
        base_price_pant: parseInt(form.base_price_pant),
      })

    if (!error) {
      setShowModal(false)
      setForm({ name: '', phone: '', shop_name: '', address: '', base_price_shirt: '400', base_price_pant: '500' })
      loadTailors()
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await supabaseAdmin
      .from('tailors')
      .update({ is_active: !current })
      .eq('id', id)

    setTailors(tailors.map((t) => (t.id === id ? { ...t, is_active: !current } : t)))
  }

  if (loading) {
    return <Skeleton className="h-64" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">दर्जी व्यवस्थापन</h1>
        <Button onClick={() => setShowModal(true)} size="sm">नवीन दर्जी</Button>
      </div>

      {tailors.length === 0 ? (
        <EmptyState
          title="अजून दर्जी नाहीत"
          description="नवीन दर्जी नोंदणी करा."
          actionLabel="नवीन दर्जी"
        />
      ) : (
        <div className="space-y-3">
          {tailors.map((tailor) => (
            <Card key={tailor.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg shrink-0">
                    👨‍🔧
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{tailor.name}</span>
                      <Badge className={tailor.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {tailor.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{tailor.phone}</p>
                    {tailor.shop_name && <p className="text-xs text-gray-400">{tailor.shop_name}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <ReviewStars rating={tailor.rating} />
                      <span className="text-xs text-gray-400">{tailor.total_orders} ऑर्डर</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(tailor.id, tailor.is_active)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    tailor.is_active
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {tailor.is_active ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="नवीन दर्जी नोंदणी">
        <form onSubmit={addTailor} className="space-y-4">
          <Input label="नाव" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="मोबाईल नंबर" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="दुकानाचे नाव" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} />
          <Input label="पत्ता" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="शर्ट किंमत (₹)" type="number" value={form.base_price_shirt} onChange={(e) => setForm({ ...form, base_price_shirt: e.target.value })} />
            <Input label="पॅन्ट किंमत (₹)" type="number" value={form.base_price_pant} onChange={(e) => setForm({ ...form, base_price_pant: e.target.value })} />
          </div>
          <Button type="submit" className="w-full">नोंदणी करा</Button>
        </form>
      </Modal>
    </div>
  )
}
