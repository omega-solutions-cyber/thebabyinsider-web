import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { CookiePreferences } from '@/components/legal/CookiePreferences'

export const metadata: Metadata = {
  title: 'Cookie Settings',
  description: 'Manage your cookie preferences for The Baby Insider.',
  alternates: { canonical: '/legal/cookie-settings' },
  // A preferences screen has no search value and should not compete with the
  // cookie policy for the query.
  robots: { index: false, follow: true },
}

export default function CookieSettingsPage() {
  return (
    <>
      <Container width="wide" className="pt-6">
        <Breadcrumbs
          trail={[
            { name: 'Home', url: '/' },
            { name: 'Cookie Policy', url: '/legal/cookie-policy' },
            { name: 'Cookie Settings' },
          ]}
        />
      </Container>

      <Container className="mt-5 pb-8">
        <h1 className="text-ink font-display text-[1.95rem] font-semibold sm:text-[2.3rem]">
          Cookie Settings
        </h1>
        <p className="text-ink-muted mt-3 text-[0.95rem] leading-relaxed">
          Choose which categories of cookies this site may use. Your choice is stored on this device
          and you can change it at any time.
        </p>

        <CookiePreferences />
      </Container>
    </>
  )
}
