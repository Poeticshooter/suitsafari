'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

const garmentTypes = [
  { value: 'shirt', label: 'शर्ट', icon: '👔', price: 400 },
  { value: 'pant', label: 'पॅन्ट', icon: '👖', price: 500 },
  { value: 'kurta', label: 'कुर्ता', icon: '🥻', price: 400 },
  { value: 'suit', label: 'सूट', icon: '🤵', price: 1200 },
  { value: 'sherwani', label: 'शेरवानी', icon: '🧥', price: 1500 },
  { value: 'other', label: 'इतर', icon: '👕', price: 300 },
]

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 0) return 'मोबाईल नंबर आवश्यक आहे'
  if (cleaned.length < 10) return 'कृपया १० अंकी मोबाईल नंबर टाका'
  if (cleaned.length > 12) return 'नंबर खूप मोठा आहे'
  return null
}

export default function OrderPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    garment_type: '',
    fabric_description: '',
    fabric_provided: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const selectedGarment = garmentTypes.find((g) => g.value === form.garment_type)
  const finalPrice = selectedGarment?.price || 400

  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {}

    if (s === 1 && !form.garment_type) {
      newErrors.garment_type = 'कृपया कपड्याचा प्रकार निवडा'
    }
    if (s === 2) {
      if (!form.customer_name.trim()) newErrors.customer_name = 'नाव आवश्यक आहे'
      const phoneErr = validatePhone(form.customer_phone)
      if (phoneErr) newErrors.customer_phone = phoneErr
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function goToStep(s: number) {
    if (s > step && !validateStep(step)) return
    setStep(s)
    setServerError('')
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setSubmitting(true)
    setServerError('')

    try {
      const phone = form.customer_phone.replace(/\D/g, '')
      const phoneWithCode = phone.length === 10 ? `91${phone}` : phone

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          customer_phone: phoneWithCode,
          customer_address: form.customer_address.trim() || null,
          garment_type: form.garment_type,
          fabric_description: form.fabric_description.trim() || null,
          fabric_provided: form.fabric_provided,
          price: finalPrice,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'काहीतरी चूक झाली.')
      }

      router.push(`/success?order=${data.data?.order_number || ''}`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">नवीन ऑर्डर</h1>
      <p className="text-gray-500 text-sm mb-6">तुमच्या आवडीचे कपडे ऑर्डर करा</p>

      {/* Steps indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => s < step ? setStep(s) : null}
            className={`flex-1 h-2 rounded-full transition-colors ${step >= s ? 'bg-[#E94560]' : 'bg-gray-200'} ${s < step ? 'cursor-pointer' : ''}`}
          />
        ))}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
          {serverError}
        </div>
      )}

      {/* Step 1: Garment Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">कोणत्या प्रकारचे कपडे हवे आहेत?</h2>
          <p className="text-sm text-gray-500">एक पर्याय निवडा</p>
          <div className="grid grid-cols-2 gap-3">
            {garmentTypes.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  form.garment_type === g.value
                    ? 'border-[#E94560] bg-[#E94560]/5 ring-2 ring-[#E94560]/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setForm({ ...form, garment_type: g.value })}
              >
                <div className="text-3xl mb-1">{g.icon}</div>
                <div className="text-sm font-medium">{g.label}</div>
                <div className="text-xs text-gray-400 mt-1">₹{g.price}</div>
              </button>
            ))}
          </div>
          {errors.garment_type && <p className="text-sm text-red-500">{errors.garment_type}</p>}
          <div className="pt-4">
            <Button onClick={() => goToStep(2)} disabled={!form.garment_type} className="w-full">
              पुढे →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Customer Info */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">तुमची माहिती</h2>
          <Input
            label="तुमचे नाव"
            placeholder="उदा. रमेश पाटील"
            value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            error={errors.customer_name}
          />
          <Input
            label="मोबाईल नंबर"
            type="tel"
            placeholder="९८७६५४३२१०"
            value={form.customer_phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '')
              setForm({ ...form, customer_phone: digits })
            }}
            error={errors.customer_phone}
            maxLength={10}
          />
          <Input
            label="पत्ता (पर्यायी)"
            placeholder="शिवाजी चौक, लातूर"
            value={form.customer_address}
            onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
          />
          <div className="pt-4 flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">← मागे</Button>
            <Button onClick={() => goToStep(3)} className="flex-1">पुढे →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">ऑर्डरची पुष्टी</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{selectedGarment?.icon}</span>
              <div>
                <p className="font-medium">{selectedGarment?.label}</p>
                <p className="text-sm text-gray-500">{form.customer_name}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-[#E94560]">₹{finalPrice}</p>
                <p className="text-xs text-gray-400">शिवणकाम</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium mb-1">तपशील</p>
              <p className="text-gray-500">📞 {form.customer_phone}</p>
              {form.customer_address && <p className="text-gray-500">📍 {form.customer_address}</p>}
              {form.fabric_description && <p className="text-gray-500">🧵 {form.fabric_description}</p>}
              <p className="text-gray-500">{form.fabric_provided ? '✅ माझ्याकडे कापड आहे' : '🔴 कापड नाही'}</p>
            </div>

            <p className="text-xs text-gray-400">* पैसे थेट दर्जीकडे द्यायचे (UPI/रोख)</p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">← मागे</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4 text-white" /> पाठवत आहे...
                </span>
              ) : (
                'ऑर्डर पाठवा'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
