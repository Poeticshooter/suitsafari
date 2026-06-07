import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Suitsafari</h3>
            <p className="text-sm text-gray-400">
              चांगलं कपडं, हमखास.
              <br />
              Good clothes, guaranteed.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">दुवे</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link href="/" className="block hover:text-white">मुखपृष्ठ</Link>
              <Link href="/order" className="block hover:text-white">ऑर्डर द्या</Link>
              <Link href="/tailors" className="block hover:text-white">दर्जी शोधा</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">संपर्क</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>फोन: +91 95791 71771</p>
              <p>पत्ता: खडगाव रोड, लातूर</p>
              <div className="flex gap-4 mt-3">
                <a href="https://instagram.com/suitsafari_india" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                <a href="https://facebook.com/suitsafari.in" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Suitsafari. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
