import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ReviewStars } from '@/components/shared/review-stars'

async function getTailors() {
  const { data } = await supabaseAdmin
    .from('tailors')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
  return data || []
}

export default async function TailorsPage() {
  const tailors = await getTailors()

  const specialtyLabels: Record<string, string> = {
    shirt: 'शर्ट', pant: 'पॅन्ट', kurta: 'कुर्ता', suit: 'सूट', sherwani: 'शेरवानी',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">आमचे दर्जी</h1>
      <p className="text-gray-500 text-sm mb-8">लातूरमधील विश्वासू दर्जी</p>

      {tailors.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">👨‍🔧</div>
          <p className="text-gray-500">लवकरच नवीन दर्जी उपलब्ध होतील.</p>
          <Button href="/order" className="mt-4">आता ऑर्डर द्या</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {tailors.map((tailor) => (
            <Link key={tailor.id} href={`/tailors/${tailor.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl shrink-0">
                    👨‍🔧
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1A1A2E]">{tailor.name}</h3>
                    {tailor.shop_name && <p className="text-xs text-gray-500">{tailor.shop_name}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{tailor.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <ReviewStars rating={tailor.rating} />
                      <span className="text-xs text-gray-400">({tailor.total_orders} ऑर्डर)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tailor.specialties?.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                          {specialtyLabels[s] || s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-gray-400">
                      <span>शर्ट: ₹{tailor.base_price_shirt}</span>
                      <span>पॅन्ट: ₹{tailor.base_price_pant}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center border-t pt-8 mt-8">
        <p className="text-sm text-gray-500 mb-3">
          तुम्ही दर्जी आहात? Suitsafari नेटवर्कमध्ये सामील व्हा.
        </p>
        <Button href="https://wa.me/919579171771" variant="secondary">
          WhatsApp वर संपर्क करा
        </Button>
      </div>
    </div>
  )
}
