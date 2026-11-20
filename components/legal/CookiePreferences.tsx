'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'tbi.cookie-consent'

type Prefs = { necessary: true; analytics: boolean; advertising: boolean }

const DEFAULTS: Prefs = { necessary: true, analytics: false, advertising: false }

// Read once per render; no subscription, matching the old read-on-mount behaviour.
const noSubscribe = () => () => {}
const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null // Storage unavailable — fall back to defaults.
  }
}
// undefined on the server and during hydration = not ready yet.
const readStoredOnServer = () => undefined

const CATEGORIES = [
  {
    key: 'necessary' as const,
    name: 'Strictly necessary',
    description:
      'Required for the site to work — security and basic preferences. These cannot be turned off.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    name: 'Analytics',
    description:
      'Helps us see which articles are read and where people get stuck, so we can improve them. Aggregated.',
    locked: false,
  },
  {
    key: 'advertising' as const,
    name: 'Advertising',
    description:
      'Used to measure and, in some cases, personalise the advertising you see on this site.',
    locked: false,
  },
]

/**
 * A minimal, working preference store. It persists the choice and exposes it on
 * `window` for any consent-aware script to read.
 *
 * This is not a full CMP. Before launching in the EU/UK, wire this to a
 * certified consent platform (or a TCF-compliant equivalent) and make analytics
 * and ad scripts actually gate on it.
 */
export function CookiePreferences() {
  const stored = useSyncExternalStore(noSubscribe, readStored, readStoredOnServer)
  const ready = stored !== undefined
  const storedPrefs = useMemo<Prefs>(() => {
    try {
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS
    } catch {
      return DEFAULTS // Corrupt storage — fall back to defaults.
    }
  }, [stored])
  const [chosen, setChosen] = useState<Prefs | null>(null)
  const prefs = chosen ?? storedPrefs
  const [saved, setSaved] = useState(false)

  function save(next: Prefs) {
    setChosen(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Storage blocked; the in-memory choice still applies for this page view.
    }
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mt-8">
      <ul className="border-rule border-t">
        {CATEGORIES.map((c) => (
          <li
            key={c.key}
            className="border-rule flex items-start justify-between gap-6 border-b py-5"
          >
            <div>
              <h2 className="text-ink font-sans text-[0.95rem] font-bold">{c.name}</h2>
              <p className="text-ink-muted mt-1.5 max-w-[42rem] text-[0.85rem] leading-relaxed">
                {c.description}
              </p>
            </div>
            <label className="flex shrink-0 items-center gap-2 text-[0.8rem]">
              <input
                type="checkbox"
                checked={c.locked ? true : prefs[c.key]}
                disabled={c.locked || !ready}
                onChange={(e) => save({ ...prefs, [c.key]: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-ink-muted">{c.locked ? 'Always on' : 'Allow'}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => save({ necessary: true, analytics: true, advertising: true })}
          className="bg-ink text-paper hover:bg-accent px-6 py-2.5 text-[0.82rem] font-bold"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => save(DEFAULTS)}
          className="border-ink text-ink hover:bg-ink hover:text-paper border px-6 py-2.5 text-[0.82rem] font-bold"
        >
          Reject non-essential
        </button>
        <span aria-live="polite" className="text-accent min-h-[1.25rem] text-[0.8rem]">
          {saved ? 'Preferences saved.' : ''}
        </span>
      </div>
    </div>
  )
}
