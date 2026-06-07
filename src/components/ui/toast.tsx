'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
}

export function Toast({ message, type = 'info', show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm`}>
        {message}
      </div>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }

  const hideToast = () => setToast(null)

  const toastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} show={!!toast} onClose={hideToast} />
  ) : null

  return { showToast, toastComponent }
}
