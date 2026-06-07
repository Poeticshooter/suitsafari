'use client'

export function ErrorState({ error, reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">काहीतरी चूक झाली</h3>
      <p className="text-sm text-gray-500 mb-4">
        {error?.message || 'Something went wrong. Please try again.'}
      </p>
      {reset && (
        <button
          onClick={reset}
          className="text-sm text-[#E94560] hover:underline"
        >
          पुन्हा प्रयत्न करा
        </button>
      )}
    </div>
  )
}
