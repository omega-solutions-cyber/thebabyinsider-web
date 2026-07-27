import Link from 'next/link'
import { Container } from './Container'
import { siteConfig } from '@/data/siteConfig'

/**
 * Persistent affiliate disclosure, directly under the header on every page.
 *
 * The FTC requires a material connection to be disclosed "clearly and
 * conspicuously" — near the claim, not buried in a footer. This bar is the
 * site-wide baseline; individual articles add their own in-context disclosure
 * on top of it.
 *
 * Fixed height, rendered server-side: it must never appear after hydration and
 * push the hero down.
 */
export function DisclosureBar() {
  const { text, linkText, href } = siteConfig.disclosureBar

  return (
    <div className="border-rule bg-paper border-b">
      <Container>
        <p className="text-ink-muted py-2.5 text-[0.75rem] leading-tight">
          {text}{' '}
          <Link href={href} className="hover:text-accent underline underline-offset-2">
            {linkText}
          </Link>
          .
        </p>
      </Container>
    </div>
  )
}
