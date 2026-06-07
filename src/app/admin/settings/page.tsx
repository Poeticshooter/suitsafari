'use client'

import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export default function AdminSettingsPage() {
  const [testPhone, setTestPhone] = useState('')
  const [testMessage, setTestMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success?: boolean; message?: string }>({})
  const [logs, setLogs] = useState<{ action: string; created_at: string; details: unknown }[]>([])
  const [loadingLogs, setLoadingLogs] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      const { data } = await supabaseAdmin
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      setLogs(data || [])
    } catch {
      // API route fallback
    } finally {
      setLoadingLogs(false)
    }
  }

  async function sendTest() {
    if (!testPhone || !testMessage) return
    setSending(true)
    setSendResult({})

    try {
      const res = await fetch('/api/admin/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testPhone.replace(/\D/g, ''), message: testMessage }),
      })
      const data = await res.json()
      setSendResult(data)
    } catch {
      setSendResult({ success: false, message: 'Network error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">सेटिंग्ज</h1>

      {/* WhatsApp Test */}
      <Card className="mb-6">
        <h2 className="font-semibold mb-1">WhatsApp चाचणी</h2>
        <p className="text-xs text-gray-400 mb-4">एक चाचणी मेसेज पाठवा</p>
        <div className="space-y-3">
          <Input
            label="फोन नंबर (९१ नंतर १० अंक)"
            type="tel"
            placeholder="९१XXXXXXXXXX"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value.replace(/\D/g, ''))}
          />
          <Input
            label="मेसेज"
            placeholder="नमस्कार, ही Suitsafari ची चाचणी आहे."
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
          />
          <Button onClick={sendTest} disabled={sending || !testPhone || !testMessage}>
            {sending ? <span className="flex items-center gap-2"><Spinner className="h-4 w-4 text-white" /> पाठवत आहे...</span> : 'मेसेज पाठवा'}
          </Button>
          {sendResult.success === true && (
            <p className="text-sm text-green-600">✅ मेसेज पाठवला गेला!</p>
          )}
          {sendResult.success === false && (
            <p className="text-sm text-red-600">❌ {sendResult.message || 'चूक झाली'}</p>
          )}
        </div>
      </Card>

      {/* Configuration */}
      <Card className="mb-6">
        <h2 className="font-semibold mb-4">कॉन्फिगरेशन</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Supabase URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL || '—' },
            { label: 'WhatsApp API', value: process.env.WHATSAPP_PHONE_NUMBER_ID ? '✓ Configured' : '— Setup pending' },
            { label: 'WhatsApp Webhook', value: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/webhook/whatsapp` },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b last:border-0">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-mono text-xs text-gray-700 truncate max-w-[300px]">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Log */}
      <Card>
        <h2 className="font-semibold mb-4">क्रियाकलाप लॉग</h2>
        {loadingLogs ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">अजून क्रियाकलाप नाहीत</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-xs flex items-start gap-2 pb-2 border-b last:border-0">
                <span className="shrink-0 mt-0.5">
                  {log.action === 'whatsapp_received' ? '📩' : log.action === 'whatsapp_sent' ? '📤' : log.action === 'whatsapp_error' ? '❌' : '📋'}
                </span>
                <div>
                  <p className="text-gray-700">{log.action}</p>
                  <p className="text-gray-400">{new Date(log.created_at).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
