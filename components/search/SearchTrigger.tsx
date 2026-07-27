'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Modal code and the search index both stay out of the initial bundle.
const SearchModal = dynamic(() => import('./SearchModal').then((m) => m.SearchModal), {
  ssr: false,
})

export function SearchTrigger() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search articles"
        className="text-ink hover:text-accent grid h-9 w-9 place-items-center transition-colors"
      >
        <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
          <path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      {open && <SearchModal onClose={close} />}
    </>
  )
}
