'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'लॉगिन करताना त्रुटी')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-[#1A1A2E] mb-1">Suitsafari अ‍ॅडमिन</h1>
        <p className="text-sm text-gray-500 mb-6">कृपया लॉगिन करा</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="ईमेल"
            type="email"
            placeholder="admin@suitsafari.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="पासवर्ड"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'लॉगिन होत आहे...' : 'लॉगिन'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
