'use client'

import { useRef, useState, type FormEvent } from 'react'

type Status = 'idle' | 'pending' | 'success' | 'error'

/**
 * Every state occupies the same vertical space, so the teal band never resizes
 * between idle, pending, success and error.
 */
export function NewsletterForm({
  source,
  categoryInterest,
}: {
  /** Which placement converted — used for attribution in Klaviyo. */
  source: string
  categoryInterest?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const mountedAt = useRef(Date.now())

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'pending') return

    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('pending')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(data.get('email') ?? ''),
          // Honeypot: a real user never fills this.
          company: String(data.get('company') ?? ''),
          elapsedMs: Date.now() - mountedAt.current,
          source,
          categoryInterest,
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      })

      const json = (await res.json()) as { ok?: boolean; message?: string }

      if (res.ok && json.ok) {
        setStatus('success')
        // We are not subscribing anyone yet, so this must not say they are
        // subscribed or that a confirmation email is coming.
        setMessage(
          "Thanks — we've got your email and will be in touch when the newsletter launches."
        )
        form.reset()
      } else {
        setStatus('error')
        setMessage(json.message ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          disabled={status === 'pending'}
          className="text-ink placeholder:text-ink-faint h-11 w-full bg-white px-4 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
        />

        {/* Honeypot — visually and semantically hidden from real users. */}
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <label htmlFor={`nl-company-${source}`}>Company</label>
          <input
            id={`nl-company-${source}`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'pending'}
          className="bg-cta hover:bg-cta-dark h-11 shrink-0 px-7 text-sm font-bold text-white transition-colors disabled:opacity-70"
        >
          {status === 'pending' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {/* Always present so the block height is constant across states. */}
      <p
        aria-live="polite"
        className={`mt-2 min-h-[1.25rem] text-[0.75rem] ${
          status === 'error' ? 'text-amber-200' : 'text-white/85'
        }`}
      >
        {message}
      </p>
    </form>
  )
}
