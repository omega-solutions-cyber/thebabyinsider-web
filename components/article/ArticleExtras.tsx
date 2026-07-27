import Link from 'next/link'
import type { Article } from '@/lib/content'
import { ArticleCard } from './ArticleCard'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'

export function Breadcrumbs({ trail }: { trail: { name: string; url?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-ink-muted flex flex-wrap items-center gap-1.5 text-[0.75rem]">
        {trail.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-ink-faint">
                ›
              </span>
            )}
            {item.url ? (
              <Link href={item.url} className="hover:text-accent hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-ink-faint line-clamp-1">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Numbered citation list. Visible sourcing is an E-E-A-T signal in itself. */
export function SourcesList({ sources }: { sources: Article['sources'] }) {
  if (!sources.length) return null

  return (
    <section className="border-rule mt-12 border-t pt-6" aria-labelledby="sources-heading">
      <h2
        id="sources-heading"
        className="text-ink-muted font-sans text-[0.72rem] font-bold tracking-[0.12em] uppercase"
      >
        Sources
      </h2>
      <ol className="mt-3 space-y-2.5">
        {sources.map((s, i) => (
          <li key={s.url} className="text-ink-muted flex gap-2 text-[0.82rem] leading-relaxed">
            <span className="text-ink-faint shrink-0">{i + 1}.</span>
            <span>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-accent underline underline-offset-2"
              >
                {s.title}
              </a>
              {s.publisher && <span> — {s.publisher}</span>}
              {s.accessed && (
                <span className="text-ink-faint"> (accessed {formatDate(s.accessed)})</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null

  return (
    <section className="mt-14" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-ink font-display text-xl font-semibold">
        <span>Related reading</span>
      </h2>
      <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} showMeta={false} />
        ))}
      </div>
    </section>
  )
}

export function TableOfContents({
  toc,
  className,
}: {
  toc: { title: string; url: string; items?: unknown[] }[]
  className?: string
}) {
  if (toc.length < 3) return null

  return (
    <nav
      aria-labelledby="toc-heading"
      className={cn('border-rule bg-surface rounded-card border p-5', className)}
    >
      <h2
        id="toc-heading"
        className="text-ink-muted font-sans text-[0.68rem] font-bold tracking-[0.12em] uppercase"
      >
        On this page
      </h2>
      <ol className="mt-3 space-y-2">
        {toc.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              className="text-ink-muted hover:text-accent text-[0.82rem] leading-snug"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
