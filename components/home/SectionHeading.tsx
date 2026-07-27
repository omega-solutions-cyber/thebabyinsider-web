import Link from 'next/link'
import { cn } from '@/lib/cn'

/** Uppercase heading with the hairline rule running to the right margin. */
export function SectionHeading({
  title,
  href,
  centered = false,
  as: Tag = 'h2',
  className,
}: {
  title: string
  href?: string
  centered?: boolean
  as?: 'h1' | 'h2'
  className?: string
}) {
  const heading = (
    <Tag className="text-ink font-serif text-[1.5rem] font-semibold tracking-[-0.01em] sm:text-[1.75rem]">
      {href ? (
        <Link href={href} className="hover:text-accent">
          {title}
        </Link>
      ) : (
        title
      )}
    </Tag>
  )

  if (centered) {
    return (
      <div className={cn('text-center', className)}>
        {heading}
        <span aria-hidden="true" className="bg-accent mx-auto mt-3 block h-[3px] w-12" />
      </div>
    )
  }

  return (
    <div className={className}>
      {heading}
      <span aria-hidden="true" className="bg-accent mt-3 block h-[3px] w-12" />
    </div>
  )
}

/** Outlined "View more" button used at the foot of every homepage section. */
export function ViewMoreButton({ href, label = 'View more' }: { href: string; label?: string }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="border-ink text-ink hover:bg-ink hover:text-paper rounded-pill border px-7 py-2.5 text-[0.8rem] font-bold transition-colors"
      >
        {label}
      </Link>
    </div>
  )
}
