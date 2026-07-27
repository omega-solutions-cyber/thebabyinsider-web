import Link from 'next/link'
import { getCategory } from '@/lib/content'
import { cn } from '@/lib/cn'

/**
 * The category label above every headline.
 *
 * Rendered as a filled pill rather than the plain coloured uppercase text this
 * genre defaults to. Colour comes from the category definition, so adding a
 * category needs no code change — and every category colour is verified to
 * clear 4.5:1 against white, since the label sits on the fill.
 */
export function CategoryEyebrow({
  slug,
  className,
  tone = 'color',
  asLink = true,
}: {
  slug: string
  className?: string
  /** `paper` for use over darkened hero imagery. */
  tone?: 'color' | 'paper'
  asLink?: boolean
}) {
  const category = getCategory(slug)
  if (!category) return null

  const classes = cn(
    'rounded-pill inline-block px-2.5 py-[0.2rem] font-sans text-[0.6rem] font-bold tracking-[0.09em] uppercase',
    tone === 'paper' ? 'bg-white/18 text-white backdrop-blur-[2px]' : 'text-white',
    className
  )
  const style = tone === 'color' ? { backgroundColor: category.color } : undefined

  if (!asLink) {
    return (
      <span className={classes} style={style}>
        {category.name}
      </span>
    )
  }

  return (
    <Link
      href={`/${category.slug}`}
      className={cn(classes, 'transition-opacity hover:opacity-85')}
      style={style}
    >
      {category.name}
    </Link>
  )
}

export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'rounded-pill bg-cta inline-block px-3.5 py-1.5 font-sans text-[0.68rem] font-bold tracking-[0.12em] text-white uppercase',
        className
      )}
    >
      New
    </span>
  )
}
