'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">काहीतरी चूक झाली</h1>
      <p className="text-gray-500 mb-6">कृपया पुन्हा प्रयत्न करा.</p>
      <button
        onClick={reset}
        className="text-[#E94560] hover:underline text-sm"
      >
        पुन्हा प्रयत्न करा
      </button>
    </div>
  )
}
