import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: {
    default: 'Suitsafari — लातूरमध्ये चांगला दर्जी | Good Clothes, Guaranteed',
    template: '%s | Suitsafari',
  },
  description:
    'Suitsafari connects you with trusted local tailors in Latur. Custom shirts, pants, kurtas, and suits stitched by expert tailors. Order online, get delivery via WhatsApp.',
  keywords: [
    'tailor in Latur',
    'best tailor Latur',
    'custom shirt Latur',
    'online tailoring India',
    'suitsafari',
    'लातूर दर्जी',
    'लातूर टेलर',
  ],
  openGraph: {
    title: 'Suitsafari — Good Clothes, Guaranteed',
    description:
      'Connect with trusted local tailors in Latur. Custom-made shirts, pants, kurtas and suits.',
    siteName: 'Suitsafari',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
