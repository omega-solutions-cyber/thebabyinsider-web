import Link from 'next/link'
import { categories } from '@/lib/content'
import { cn } from '@/lib/cn'

/**
 * Desktop category bar. Every category is one click from every page, which is
 * most of what makes the internal link graph work.
 */
export function CategoryNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Categories" className={cn('flex items-center', className)}>
      <ul className="flex items-center gap-x-5 xl:gap-x-6">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="text-ink hover:text-accent block py-2 text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap uppercase transition-colors"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
