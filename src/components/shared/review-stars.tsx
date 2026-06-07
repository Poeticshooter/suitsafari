export function ReviewStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' }

  return (
    <span className={sizes[size]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-3xl transition-colors ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
