import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ReviewStars } from '@/components/shared/review-stars'
import { formatCurrency } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

async function getTailor(id: string) {
  const { data } = await supabaseAdmin
    .from('tailors')
    .select('*, orders:orders(count)')
    .eq('id', id)
    .single()
  return data
}

async function getTailorReviews(id: string) {
  const { data } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })
    .limit(10)
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const tailor = await getTailor(id)
  if (!tailor) return { title: 'दर्जी सापडला नाही' }

  return {
    title: `${tailor.name} — Suitsafari`,
    description: `${tailor.name} ${tailor.shop_name ? `- ${tailor.shop_name}` : ''} | लातूरमधील दर्जी. शर्ट, पॅन्ट, कुर्ता, सूट.`,
  }
}

export default async function TailorPublicPage({ params }: Props) {
  const { id } = await params
  const tailor = await getTailor(id)

  if (!tailor) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold mb-2">दर्जी सापडला नाही</h1>
        <Link href="/tailors" className="text-[#E94560] hover:underline text-sm">सर्व दर्जी पाहा</Link>
      </div>
    )
  }

  const specialtyLabels: Record<string, string> = {
    shirt: 'शर्ट', pant: 'पॅन्ट', kurta: 'कुर्ता', suit: 'सूट', sherwani: 'शेरवानी',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/tailors" className="text-sm text-gray-500 hover:text-[#E94560] mb-6 inline-block">← सर्व दर्जी</Link>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl shrink-0">
            👨‍🔧
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#1A1A2E]">{tailor.name}</h1>
            {tailor.shop_name && <p className="text-gray-500">{tailor.shop_name}</p>}
            <p className="text-sm text-gray-400 mt-0.5">{tailor.address}</p>
            <div className="flex items-center gap-3 mt-2">
              <ReviewStars rating={tailor.rating} size="md" />
              <span className="text-sm text-gray-500">{tailor.rating}</span>
              <span className="text-sm text-gray-400">| {tailor.total_orders} ऑर्डर</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tailor.specialties?.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                  {specialtyLabels[s] || s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-xs text-gray-400">शर्ट शिवणकाम</p>
            <p className="font-semibold">{formatCurrency(tailor.base_price_shirt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">पॅन्ट शिवणकाम</p>
            <p className="font-semibold">{formatCurrency(tailor.base_price_pant)}</p>
          </div>
        </div>

        <div className="mt-6">
          <Button href={`https://wa.me/${tailor.phone.replace(/^0/, '')}?text=नमस्कार,%20मला%20Suitsafari%20वरून%20ऑर्डर%20द्यायची%20आहे.`} className="w-full">
            WhatsApp वर संपर्क करा
          </Button>
        </div>
      </div>
    </div>
  )
}
