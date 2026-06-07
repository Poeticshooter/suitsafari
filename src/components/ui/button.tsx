import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#E94560] text-white hover:bg-[#d63d55] focus:ring-[#E94560]',
    secondary: 'bg-white text-[#1A1A2E] border border-gray-300 hover:bg-gray-50 focus:ring-[#1A1A2E]',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
