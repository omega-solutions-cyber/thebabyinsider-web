'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type MiniSearchType from 'minisearch'

export interface SearchDoc {
  id: string
  title: string
  summary: string
  category: string
  categoryName: string
  tags: string[]
  permalink: string
  image: string
  updatedAt: string
  body: string
}

/**
 * The index is fetched and built on first open only — never on page load — so
 * search costs nothing on the critical path. Both are cached at module scope so
 * reopening is instant.
 */
let indexPromise: Promise<MiniSearchType<SearchDoc>> | null = null

async function loadIndex(): Promise<MiniSearchType<SearchDoc>> {
  if (indexPromise) return indexPromise

  indexPromise = (async () => {
    const [{ default: MiniSearch }, res] = await Promise.all([
      import('minisearch'),
      fetch('/search-index.json'),
    ])
    const docs: SearchDoc[] = await res.json()

    const mini = new MiniSearch<SearchDoc>({
      fields: ['title', 'summary', 'tags', 'categoryName', 'body'],
      storeFields: ['title', 'summary', 'categoryName', 'category', 'permalink', 'image'],
      searchOptions: {
        boost: { title: 4, summary: 2, tags: 2, categoryName: 1.5 },
        fuzzy: 0.2,
        prefix: true,
      },
    })
    mini.addAll(docs)
    return mini
  })()

  return indexPromise
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [mini, setMini] = useState<MiniSearchType<SearchDoc> | null>(null)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    loadIndex()
      .then((m) => alive && setMini(m))
      .catch(() => alive && setMini(null))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input'
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
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  const results = useMemo(() => {
    if (!mini || query.trim().length < 2) return []
    return mini.search(query).slice(0, 8) as unknown as (SearchDoc & { score: number })[]
  }, [mini, query])

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className="bg-ink/50 absolute inset-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search articles"
        className="bg-paper absolute inset-x-0 top-0 mx-auto max-h-[85vh] w-full max-w-[640px] overflow-hidden shadow-2xl sm:top-[10vh]"
      >
        <div className="border-rule flex items-center gap-3 border-b px-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            className="text-ink-faint shrink-0"
          >
            <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 12l4.5 4.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="placeholder:text-ink-faint w-full bg-transparent py-4 text-base outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-accent shrink-0 text-[0.7rem] font-bold tracking-[0.06em] uppercase"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto" aria-live="polite">
          {loading && <p className="text-ink-muted px-4 py-6 text-sm">Loading search…</p>}

          {!loading && query.trim().length < 2 && (
            <p className="text-ink-muted px-4 py-6 text-sm">
              Type at least two characters to search.
            </p>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-ink-muted px-4 py-6 text-sm">
              No articles match “{query}”. Try a broader term.
            </p>
          )}

          <ul>
            {results.map((r) => (
              <li key={r.id} className="border-rule/60 border-b last:border-0">
                <Link
                  href={r.permalink}
                  onClick={onClose}
                  className="hover:bg-surface flex gap-3 px-4 py-3"
                >
                  <Image
                    src={r.image}
                    alt=""
                    width={80}
                    height={60}
                    className="h-[3.25rem] w-[4.5rem] shrink-0 object-cover"
                  />
                  <span className="min-w-0">
                    <span className="text-accent block text-[0.62rem] font-bold tracking-[0.08em] uppercase">
                      {r.categoryName}
                    </span>
                    <span className="text-ink mt-0.5 block text-sm leading-snug font-bold">
                      {r.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
