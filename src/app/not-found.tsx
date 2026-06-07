import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">हा पृष्ठ सापडले नाही</h1>
      <p className="text-gray-500 mb-6">तुम्ही शोधत असलेले पृष्ठ अस्तित्वात नाही.</p>
      <Link href="/" className="text-[#E94560] hover:underline text-sm">मुखपृष्ठ</Link>
    </div>
  )
}
