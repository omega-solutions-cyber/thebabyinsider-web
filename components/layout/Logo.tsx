import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Wordmark: a solid accent tile carrying the monogram, with the masthead set
 * in two tight uppercase lines beside it. `iconOnly` is the sticky/mobile
 * variant. Drawn as markup rather than an image file so it stays crisp, costs
 * no request, and recolours for the dark footer.
 */
export function Logo({
  className,
  iconOnly = false,
  tone = 'ink',
}: {
  className?: string
  iconOnly?: boolean
  tone?: 'ink' | 'paper'
}) {
  return (
    <Link
      href="/"
      aria-label="The Baby Insider — home"
      className={cn('inline-flex items-center gap-2.5', className)}
    >
      <span
        aria-hidden="true"
        className="bg-accent grid h-9 w-9 shrink-0 place-items-center font-sans text-[1.4rem] leading-none font-black text-white"
      >
        b
      </span>
      {!iconOnly && (
        <span
          aria-hidden="true"
          className={cn(
            'font-sans text-[0.68rem] leading-[1.15] font-black tracking-[0.08em] uppercase',
            tone === 'paper' ? 'text-paper' : 'text-ink'
          )}
        >
          The Baby
          <br />
          Insider
        </span>
      )}
    </Link>
  )
}
