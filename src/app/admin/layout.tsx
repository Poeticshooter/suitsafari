'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin', label: 'डॅशबोर्ड', icon: '📊' },
  { href: '/admin/orders', label: 'ऑर्डर्स', icon: '📦' },
  { href: '/admin/tailors', label: 'दर्जी', icon: '👨‍🔧' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login')
      }
      setLoading(false)
    })
  }, [router])

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-[#E94560] border-t-transparent rounded-full" />
      </div>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-semibold">Suitsafari अ‍ॅडमिन</span>
        <button onClick={handleLogout} className="text-sm text-gray-500">बाहेर पडा</button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white border-r min-h-screen shrink-0`}>
          <div className="p-6">
            <h2 className="font-bold text-[#1A1A2E]">Suitsafari</h2>
            <p className="text-xs text-gray-400">अ‍ॅडमिन पॅनल</p>
          </div>
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-[#E94560]/10 text-[#E94560] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              लॉगआउट
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
