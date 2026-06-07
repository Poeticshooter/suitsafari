import { Button } from './button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref}>{actionLabel}</Button>
      )}
    </div>
  )
}
