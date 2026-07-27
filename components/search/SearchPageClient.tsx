'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const SearchModal = dynamic(() => import('./SearchModal').then((m) => m.SearchModal), {
  ssr: false,
})

/**
 * The modal is the primary search UX. This page exists so `/search?q=` is a
 * valid, linkable target — which is what the WebSite SearchAction points at.
 */
export function SearchPageClient() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-rule text-ink-faint hover:border-ink flex w-full max-w-[28rem] items-center gap-3 border px-4 py-3 text-left"
      >
        <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Search articles…
      </button>
      <p className="text-ink-faint mt-2 text-[0.78rem]">
        Tip: press <kbd className="font-sans font-bold">⌘K</kbd> anywhere on the site.
      </p>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </div>
  )
}
