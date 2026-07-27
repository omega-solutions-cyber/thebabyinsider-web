import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * Path-based pagination. Page 1 always lives at the bare path, never at
 * `/page/1`, so there is exactly one URL per page of results.
 */
export function Pagination({
  basePath,
  page,
  totalPages,
}: {
  basePath: string
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null

  const href = (p: number) => (p === 1 ? basePath : `${basePath}/page/${p}`)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          rel="prev"
          className="border-rule hover:border-ink border px-4 py-2 text-[0.8rem] font-bold"
        >
          Previous
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'min-w-[2.5rem] border px-3 py-2 text-center text-[0.8rem] font-bold',
            p === page ? 'border-ink bg-ink text-paper' : 'border-rule hover:border-ink'
          )}
        >
          {p}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={href(page + 1)}
          rel="next"
          className="border-rule hover:border-ink border px-4 py-2 text-[0.8rem] font-bold"
        >
          Next
        </Link>
      )}
    </nav>
  )
}
