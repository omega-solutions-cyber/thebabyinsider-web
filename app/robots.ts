import type { MetadataRoute } from 'next'
import { siteConfig } from '@/data/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          // Explicitly allowed: a blanket block on /_next/ is a common
          // misconfiguration that silently kills image indexing.
          '/_next/image',
        ],
        disallow: ['/api/', '/search'],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteConfig.url).toString(),
    host: siteConfig.url,
  }
}
