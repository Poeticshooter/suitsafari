import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Static pages
  const staticPages = ['', '/order', '/tailors'].map(
    (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
  )

  // Tailor pages (dynamic)
  let tailorUrls = ''
  try {
    const { data: tailors } = await supabaseAdmin
      .from('tailors')
      .select('id, updated_at')
      .eq('is_active', true)

    if (tailors) {
      tailorUrls = tailors
        .map(
          (t) => `
  <url>
    <loc>${baseUrl}/tailors/${t.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
        )
        .join('')
    }
  } catch {
    // Ignore errors — sitemap still works with static pages
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.join('')}
  ${tailorUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
