'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">ऑर्डर पाठवली!</h1>
      <p className="text-gray-500 mb-2">
        तुमची ऑर्डर दर्जीकडे पाठवली गेली आहे. ते लवकरच WhatsApp वर संपर्क करतील.
      </p>
      {orderNumber && (
        <p className="text-sm text-gray-400 mb-6">
          ऑर्डर क्र. {orderNumber}
        </p>
      )}
      <div className="flex gap-3 justify-center">
        <Button href="/">मुखपृष्ठ</Button>
        <Button href="/order" variant="secondary">नवीन ऑर्डर</Button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
