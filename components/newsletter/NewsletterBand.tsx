import { NewsletterForm } from './NewsletterForm'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/lib/cn'

export function NewsletterBand({
  source,
  categoryInterest,
  className,
}: {
  source: string
  categoryInterest?: string
  className?: string
}) {
  const { heading, blurb } = siteConfig.newsletter

  return (
    <section
      aria-labelledby={`nl-${source}`}
      className={cn('bg-accent rounded-card text-white', className)}
    >
      <div className="grid items-center gap-6 px-6 py-8 sm:px-10 md:grid-cols-2 md:gap-12">
        <div>
          <h2
            id={`nl-${source}`}
            className="flex items-center gap-3 font-serif text-2xl font-semibold tracking-[-0.01em]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
            {heading}
          </h2>
          <p className="mt-3 max-w-md text-[0.82rem] leading-relaxed text-white/90">{blurb}</p>
        </div>

        <NewsletterForm source={source} categoryInterest={categoryInterest} />
      </div>
    </section>
  )
}
