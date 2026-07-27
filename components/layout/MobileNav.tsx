'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/data/siteConfig'

type NavCategory = { slug: string; name: string; color: string }

export function MobileNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="text-ink -mr-2 grid h-10 w-10 place-items-center lg:hidden"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true" fill="currentColor">
          <rect width="20" height="2" y="0" />
          <rect width="20" height="2" y="6" />
          <rect width="20" height="2" y="12" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="bg-ink/50 absolute inset-0"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="bg-paper absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto shadow-xl"
          >
            <div className="border-rule flex items-center justify-between border-b px-5 py-4">
              <span className="text-ink-muted text-[0.7rem] font-bold tracking-[0.08em] uppercase">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-ink grid h-9 w-9 place-items-center"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            <nav aria-label="Categories" className="px-5 py-2">
              <ul>
                {categories.map((c) => (
                  <li key={c.slug} className="border-rule/70 border-b last:border-0">
                    <Link
                      href={`/${c.slug}`}
                      className="text-ink flex items-center gap-3 py-3.5 text-sm font-bold tracking-[0.04em] uppercase"
                    >
                      <span
                        aria-hidden="true"
                        className="h-3 w-1"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-rule mt-auto border-t px-5 py-5">
              <ul className="space-y-2.5">
                {siteConfig.footerBrandLinks.slice(0, 5).map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-ink-muted hover:text-accent text-sm">
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
