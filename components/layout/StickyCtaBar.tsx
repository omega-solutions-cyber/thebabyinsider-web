'use client'

import { useEffect } from 'react'
import { Container } from './Container'
import { siteConfig } from '@/data/siteConfig'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Funnel bar that sticks under the header on paid-traffic landing articles
 * (frontmatter `stickyCta`). Rendered in flow at a fixed height, so it never
 * covers the H1 or shifts the page; the article page adds a pre-paint script
 * that hides it when dismissed earlier in the session.
 *
 * Clicks are tracked by the delegated listener in GoogleTag via
 * data-cta-location. It also sends scroll-depth events, since only pages
 * carrying this bar need them (GA4 enhanced measurement only reports 90%).
 */
export function StickyCtaBar({ text, button }: { text: string; button: string }) {
  useEffect(() => {
    const sent = new Set<number>()
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark - 0.5 && !sent.has(mark)) {
          sent.add(mark)
          window.gtag?.('event', 'scroll_depth', { percent_scrolled: mark })
        }
      }
      if (sent.size === 4) window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = () => {
    document.getElementById('sticky-cta')?.setAttribute('hidden', '')
    try {
      sessionStorage.setItem('stickyCta', '1') // read by the pre-paint script on the article page
    } catch {}
  }

  return (
    <div
      id="sticky-cta"
      suppressHydrationWarning
      className="border-rule bg-paper sticky top-[3.5rem] z-30 border-b print:hidden"
    >
      <Container width="wide">
        <div className="flex h-14 items-center gap-2 sm:h-12 sm:gap-3">
          <div className="flex min-w-0 flex-1 flex-col justify-center leading-tight">
            <p className="text-ink-muted text-[0.65rem] font-bold tracking-[0.08em] uppercase sm:text-[0.7rem]">
              From our team
            </p>
            <p className="text-ink line-clamp-2 text-[0.75rem] font-medium sm:truncate sm:text-[0.8rem]">
              {text}
            </p>
          </div>
          <a
            href={siteConfig.ownership.funnelUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            data-cta-location="sticky_top"
            className="bg-accent hover:bg-accent-dark rounded-pill inline-flex min-h-9 shrink-0 items-center px-3.5 text-[0.75rem] font-bold text-white transition-colors sm:px-4 sm:text-[0.8rem]"
          >
            {button}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss this banner"
            className="text-ink-muted hover:text-ink -mr-3 grid size-11 shrink-0 place-items-center"
          >
            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </Container>
    </div>
  )
}
