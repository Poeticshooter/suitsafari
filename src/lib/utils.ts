export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-teal-100 text-teal-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'रखडलेले',
    assigned: 'नियुक्त',
    accepted: 'स्वीकारले',
    in_progress: 'शिवण सुरू',
    completed: 'तयार',
    delivered: 'वितरित',
    cancelled: 'रद्द',
  }
  return labels[status] || status
}

export function getGarmentIcon(type: string): string {
  const icons: Record<string, string> = {
    shirt: '👔',
    pant: '👖',
    kurta: '🥻',
    suit: '🤵',
    sherwani: '🧥',
    other: '👕',
  }
  return icons[type] || '👕'
}
