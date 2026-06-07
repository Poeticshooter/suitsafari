export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#E94560] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-gray-500">लोड होत आहे...</p>
      </div>
    </div>
  )
}
