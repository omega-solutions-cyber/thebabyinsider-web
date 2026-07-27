import Link from 'next/link'
import { getCategory } from '@/lib/content'
import { cn } from '@/lib/cn'

/**
 * The small uppercase category label above every headline. Colour comes from
 * the category definition, so adding a category needs no code change.
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
    'inline-block font-sans text-[0.65rem] font-bold tracking-[0.1em] uppercase',
    className
  )
  const style = tone === 'color' ? { color: category.color } : undefined

  if (!asLink) {
    return (
      <span className={cn(classes, tone === 'paper' && 'text-amber-300')} style={style}>
        {category.name}
      </span>
    )
  }

  return (
    <Link
      href={`/${category.slug}`}
      className={cn(classes, tone === 'paper' ? 'text-amber-300' : 'hover:underline')}
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
        'bg-accent inline-grid h-14 w-24 place-items-center font-sans text-lg font-black tracking-[0.08em] text-white uppercase sm:h-16 sm:w-28 sm:text-xl',
        className
      )}
    >
      New
    </span>
  )
}
