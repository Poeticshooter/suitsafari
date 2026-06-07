import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ReviewStars } from '@/components/shared/review-stars'
import { formatCurrency, getGarmentIcon } from '@/lib/utils'
import type { Tailor, Review } from '@/lib/types'

async function getTailors() {
  const { data } = await supabaseAdmin
    .from('tailors')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .limit(20)
  return data || []
}

async function getReviews() {
  const { data } = await supabaseAdmin
    .from('reviews')
    .select('*, order:orders!inner(customer_name)')
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

async function getStats() {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, commission, created_at')

  const totalOrders = orders?.length || 0
  const totalCommission = orders?.reduce((s, o) => s + (o.commission || 0), 0) || 0
  const { count: tailorCount } = await supabaseAdmin
    .from('tailors')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return {
    years: '30+',
    orders: totalOrders > 0 ? `${totalOrders}+` : '100+',
    tailors: tailorCount || 5,
    revenue: totalCommission,
  }
}

export default async function HomePage() {
  const [tailors, reviews, stats] = await Promise.all([
    getTailors(),
    getReviews(),
    getStats(),
  ])

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-[#E94560] font-medium text-sm mb-3">लातूरमध्ये ३० वर्षांपासून</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              चांगलं कपडं,<br />
              <span className="text-[#E94560]">हमखास.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Suitsafari तुम्हाला जोडते लातूरमधील विश्वासू दर्जींशी.
              कस्टम शर्ट, पॅन्ट, कुर्ता आणि सूट — तुमच्या आवडीचे कापड, तुमच्या मापाचे.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/order" size="lg">आता ऑर्डर द्या</Button>
              <Button href="/tailors" variant="secondary" size="lg">दर्जी शोधा</Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1A1A2E]">{stats.years}</div>
              <div className="text-sm text-gray-500 mt-1">वर्षे अनुभव</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A1A2E]">{stats.tailors}</div>
              <div className="text-sm text-gray-500 mt-1">सक्रिय दर्जी</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A1A2E]">{stats.orders}</div>
              <div className="text-sm text-gray-500 mt-1">ऑर्डर पूर्ण</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1A1A2E]">५.०★</div>
              <div className="text-sm text-gray-500 mt-1">सरासरी रेटिंग</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">आमची गोष्ट</h2>
              <div className="space-y-3 text-gray-600">
                <p>गेली ३० वर्षे माझे वडील लातूरमध्ये दर्जी म्हणून काम करत आहेत. त्यांनी हजारो शर्ट, पॅन्ट, कोट आणि कुर्ते शिवले आहेत.</p>
                <p>पण मी पाहिलं की त्यांना ऑनलाईन ऑर्डर मिळवण्यासाठी कोणतेही साधन नव्हते. ग्राहकांनाही जवळचा चांगला दर्जी शोधणं कठीण होतं.</p>
                <p>म्हणून मी Suitsafari बनवलं — एक असा पूल जो ग्राहक आणि दर्जी यांना WhatsApp द्वारे जोडतो. सोपं, जलद आणि विश्वासार्ह.</p>
                <p className="font-medium text-[#1A1A2E]">— श्याम, Suitsafari संस्थापक</p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-5xl mb-2">👨‍👦</div>
                <p className="text-sm">वडील आणि मुलगा — ३० वर्षांचा वारसा</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-[#1A1A2E] mb-12">कसे काम करते?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📝', title: 'ऑर्डर द्या', desc: 'तुमच्या आवडीचे कापड आणि माप ऑनलाईन नोंदवा.' },
              { icon: '🧵', title: 'दर्जी शिवतील', desc: 'जवळचा दर्जी तुमची ऑर्डर WhatsApp वर स्वीकारेल.' },
              { icon: '📦', title: 'तयार!', desc: 'कपडे तयार झाल्यावर WhatsApp वर कळेल. उचलून घ्या.' },
            ].map((step) => (
              <Card key={step.title} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TAILORS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">आमचे दर्जी</h2>
              <p className="text-sm text-gray-500 mt-1">लातूरमधील विश्वासू दर्जी</p>
            </div>
            <Button href="/tailors" variant="ghost">सर्व पाहा →</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tailors.slice(0, 3).map((tailor) => (
              <Link key={tailor.id} href={`/tailors/${tailor.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl shrink-0">
                      👨‍🔧
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{tailor.name}</h3>
                      {tailor.shop_name && <p className="text-xs text-gray-500 truncate">{tailor.shop_name}</p>}
                      <div className="flex items-center gap-1 mt-1">
                        <ReviewStars rating={tailor.rating} />
                        <span className="text-xs text-gray-400">({tailor.total_orders})</span>
                      </div>
                    </div>
                    <div className="ml-auto text-xs text-gray-400 shrink-0">
                      ₹{tailor.base_price_shirt}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            {tailors.length === 0 && (
              <p className="text-gray-400 text-sm col-span-3 text-center py-8">लवकरच दर्जी उपलब्ध होतील.</p>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-[#1A1A2E] mb-8">ग्राहक समीक्षा</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <ReviewStars rating={review.rating} />
                  <p className="text-sm text-gray-600 mt-2">&ldquo;{(review as unknown as { order: { customer_name: string } }).order?.customer_name || 'ग्राहक'}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-2">{review.rating}/5</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FABRIC PARTNERS PLACEHOLDER */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">कापडाची दुकाने</h2>
          <p className="text-gray-500 mb-4">लवकरच — तुमच्या आवडीचे कापड ऑनलाईन निवडा आणि दर्जीकडे पाठवा.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {['सुती', 'लिनन', 'सिल्क', 'सूटिंग'].map((fabric) => (
              <div key={fabric} className="p-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400">
                {fabric}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1A1A2E] text-white text-center">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">तयार आहात?</h2>
          <p className="text-gray-300 mb-6">आजच ऑर्डर द्या आणि फरक अनुभवा.</p>
          <Button href="/order" size="lg">आता ऑर्डर द्या</Button>
        </div>
      </section>
    </>
  )
}
