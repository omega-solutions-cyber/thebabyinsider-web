'use client'

import { useRef } from 'react'
import { siteConfig } from '@/data/siteConfig'

/** "Advertising Disclosure" link that opens the full ownership statement on click. */
export function DisclosureDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const { productName } = siteConfig.ownership

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="text-ink-muted hover:text-ink text-[0.72rem] underline underline-offset-2"
      >
        Advertising Disclosure
      </button>
      <dialog
        ref={ref}
        aria-labelledby="ad-disclosure-title"
        // Clicking the backdrop (the dialog element itself) closes it too.
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="rounded-card bg-paper m-auto max-w-md p-6 shadow-xl backdrop:bg-black/40"
      >
        <h2 id="ad-disclosure-title" className="text-ink font-display text-lg font-bold">
          Advertising Disclosure
        </h2>
        <p className="text-ink-muted mt-3 text-[0.9rem] leading-relaxed">
          {siteConfig.name} is owned and operated by the team behind {productName}, the app ranked
          #1 on this page. We may also earn money from other products featured.
        </p>
        <form method="dialog" className="mt-5 text-right">
          <button className="bg-accent hover:bg-accent-dark rounded-pill px-5 py-2 text-[0.85rem] font-bold text-white">
            Got it
          </button>
        </form>
      </dialog>
    </>
  )
}
