import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { DisclosureBar } from '@/components/layout/DisclosureBar'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { siteConfig } from '@/data/siteConfig'
import { JsonLd } from '@/components/seo/JsonLd'
import { rootGraph } from '@/lib/schema'

// Two families, self-hosted by next/font with automatic metric-compatible
// fallbacks so the swap costs no layout shift.
const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

// Manrope for headlines: geometric and even, with none of the quirks a display
// serif brings. Pairs invisibly with Inter for body copy.
const display = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700', '800'],
  variable: '--font-headline',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${siteConfig.name} — all articles` }],
      'application/feed+json': [{ url: '/feed.json', title: siteConfig.name }],
    },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thebabyinsider',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Enables large thumbnails in Google Discover, which is a major traffic
      // source for parenting content.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language} className={`${body.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Organization + WebSite, defined once; page graphs reference them by @id. */}
        <JsonLd data={rootGraph()} />
        <a
          href="#main"
          className="focus:bg-accent focus:text-paper sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <DisclosureBar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  )
}
