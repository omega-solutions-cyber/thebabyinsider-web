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
    <Tag className="text-ink font-sans text-[1.35rem] font-extrabold tracking-[0.02em] uppercase sm:text-[1.6rem]">
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
    return <div className={cn('text-center', className)}>{heading}</div>
  }

  return <div className={cn('rule-heading', className)}>{heading}</div>
}

/** Outlined "View more" button used at the foot of every homepage section. */
export function ViewMoreButton({ href, label = 'View more' }: { href: string; label?: string }) {
  return (
    <div className="mt-8 flex justify-center">
      <Link
        href={href}
        className="border-ink text-ink hover:bg-ink hover:text-paper border px-7 py-2.5 text-[0.8rem] font-bold transition-colors"
      >
        {label}
      </Link>
    </div>
  )
}
