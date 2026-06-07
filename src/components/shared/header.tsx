'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-[#1A1A2E]">
            Suitsafari
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-[#E94560]">मुखपृष्ठ</Link>
            <Link href="/order" className="text-sm text-gray-600 hover:text-[#E94560]">ऑर्डर द्या</Link>
            <Link href="/tailors" className="text-sm text-gray-600 hover:text-[#E94560]">दर्जी शोधा</Link>
          </nav>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>मुखपृष्ठ</Link>
            <Link href="/order" className="block px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>ऑर्डर द्या</Link>
            <Link href="/tailors" className="block px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50" onClick={() => setMenuOpen(false)}>दर्जी शोधा</Link>
          </div>
        )}
      </div>
    </header>
  )
}
