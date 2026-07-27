import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Article } from '@/lib/content'
import { getArticle } from '@/lib/content'
import { siteConfig } from '@/data/siteConfig'
import { OwnershipDisclosure } from '@/components/disclosure/OwnershipDisclosure'
import { cn } from '@/lib/cn'

/* ------------------------------------------------------------------ Callout */

const calloutStyles = {
  info: { border: 'border-accent', bg: 'bg-accent-tint', label: 'Note' },
  warning: { border: 'border-cta', bg: 'bg-cta/5', label: 'Important' },
  tip: { border: 'border-cat-milestones', bg: 'bg-cat-milestones/5', label: 'Tip' },
  doctor: { border: 'border-cat-health', bg: 'bg-cat-health/5', label: "Doctor's note" },
} as const

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: keyof typeof calloutStyles
  title?: string
  children: ReactNode
}) {
  const style = calloutStyles[type] ?? calloutStyles.info
  return (
    <aside className={cn('rounded-card my-7 border-l-[3px] p-4 sm:p-5', style.border, style.bg)}>
      <p className="text-ink-muted font-sans text-[0.68rem] font-bold tracking-[0.1em] uppercase">
        {title ?? style.label}
      </p>
      <div className="mt-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:my-2 [&>p]:text-[0.92rem] [&>p]:leading-relaxed">
        {children}
      </div>
    </aside>
  )
}

/* ------------------------------------------------------------ KeyTakeaways */

/** Summary box near the top of an article. Frequently earns featured snippets. */
export function KeyTakeaways({
  children,
  title = 'Key takeaways',
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <aside className="border-rule bg-surface rounded-card my-8 border p-5 sm:p-6">
      <h2 className="text-accent font-sans text-[0.72rem] font-bold tracking-[0.12em] uppercase">
        {title}
      </h2>
      <div className="mt-3 [&_li]:mt-2 [&_li]:text-[0.92rem] [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </aside>
  )
}

/* ---------------------------------------------------------------------- FAQ */

/**
 * Renders the article's `faq` frontmatter. This is the single source of truth
 * for both the visible accordion and the FAQPage JSON-LD, so the two can never
 * disagree — which is what Google's structured-data policy requires.
 */
export function FAQ({
  items,
  title = 'Frequently asked questions',
}: {
  items: { q: string; a: string }[]
  title?: string
}) {
  if (!items?.length) return null

  return (
    <section className="my-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-ink font-display text-xl font-semibold">
        {title}
      </h2>
      <div className="border-rule mt-4 border-t">
        {items.map((item) => (
          <details key={item.q} className="group border-rule border-b">
            <summary className="text-ink hover:text-accent flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.95rem] font-bold marker:hidden">
              {item.q}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                aria-hidden="true"
                className="shrink-0 transition-transform group-open:rotate-45"
              >
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </summary>
            <p className="text-ink-muted pb-4 text-[0.92rem] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ ProductRoundup */

type Product = Article['products'][number]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${rating} out of 5`}>
      <span aria-hidden="true" className="text-accent">
        {'★'.repeat(Math.round(rating))}
        <span className="text-rule">{'★'.repeat(5 - Math.round(rating))}</span>
      </span>
      <span className="text-ink-muted text-[0.75rem]">{rating.toFixed(1)}</span>
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="border-rule bg-paper rounded-card border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-ink font-display text-lg font-semibold">
          {product.rank != null && <span className="text-ink-faint mr-2">#{product.rank}</span>}
          {product.name}
        </h3>
        {product.award && (
          <span className="bg-accent px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.08em] text-white uppercase">
            {product.award}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {product.rating != null && <Stars rating={product.rating} />}
        {product.price != null && (
          <span className="text-ink-muted text-[0.8rem]">
            from {product.currency === 'USD' ? '$' : ''}
            {product.price}
          </span>
        )}
      </div>

      {product.image && (
        <Image
          src={product.image.src}
          alt={product.name}
          width={product.image.width}
          height={product.image.height}
          sizes="(max-width: 640px) 100vw, 320px"
          placeholder="blur"
          blurDataURL={product.image.blurDataURL}
          className="mt-4 aspect-[4/3] w-full object-cover"
        />
      )}

      {product.summary && (
        <p className="text-ink-muted mt-3 text-[0.9rem] leading-relaxed">{product.summary}</p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {product.pros.length > 0 && (
          <div>
            <h4 className="text-cat-milestones text-[0.68rem] font-bold tracking-[0.1em] uppercase">
              Pros
            </h4>
            <ul className="mt-2 space-y-1.5">
              {product.pros.map((p) => (
                <li key={p} className="text-ink text-[0.85rem] leading-snug">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
        {product.cons.length > 0 && (
          <div>
            <h4 className="text-cat-health text-[0.68rem] font-bold tracking-[0.1em] uppercase">
              Cons
            </h4>
            <ul className="mt-2 space-y-1.5">
              {product.cons.map((c) => (
                <li key={c} className="text-ink text-[0.85rem] leading-snug">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {product.url && (
        <p className="mt-5">
          <a
            href={product.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="bg-ink text-paper hover:bg-accent rounded-pill inline-block px-6 py-2.5 text-[0.82rem] font-bold transition-colors"
          >
            Visit {product.name}
          </a>
        </p>
      )}
    </article>
  )
}

export function ProductRoundup({ products }: { products: Product[] }) {
  if (!products?.length) return null
  const ordered = [...products].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  return (
    <div className="my-10 space-y-6">
      {ordered.map((p) => (
        <ProductCard key={p.name} product={p} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------- InlineArticleLink */

/**
 * Contextual internal link. The content build fails if `slug` does not resolve,
 * so the internal link graph cannot rot silently.
 */
export function InlineArticleLink({ slug, children }: { slug: string; children?: ReactNode }) {
  const target = getArticle(slug)
  if (!target) return <>{children}</>

  return (
    <Link
      href={target.permalink}
      className="text-accent decoration-accent/40 hover:decoration-accent underline underline-offset-2"
    >
      {children ?? target.title}
    </Link>
  )
}

/* ------------------------------------------------------------ BabyLeapPromo */

/**
 * The app CTA. It renders its own ownership disclosure — there is deliberately
 * no prop to turn that off, so a promotional placement cannot exist on this
 * site without the relationship being stated next to it.
 */
export function BabyLeapPromo({ headline, body }: { headline?: string; body?: string }) {
  const { productName, productUrl } = siteConfig.ownership

  return (
    <aside className="my-10">
      <div className="border-rule bg-surface rounded-card border p-6">
        <p className="text-ink-muted font-sans text-[0.68rem] font-bold tracking-[0.1em] uppercase">
          From our team
        </p>
        <h2 className="text-ink mt-2 font-display text-xl font-semibold">
          {headline ?? `Track your baby's development with ${productName}`}
        </h2>
        <p className="text-ink-muted mt-2.5 text-[0.9rem] leading-relaxed">
          {body ??
            `A weekly, age-appropriate plan with milestones shown as ranges rather than deadlines, plus feed, sleep and nappy logging in one place.`}
        </p>
        <p className="mt-4">
          <a
            href={productUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="bg-accent hover:bg-accent-dark rounded-pill inline-block px-6 py-2.5 text-[0.82rem] font-bold text-white transition-colors"
          >
            Try {productName} free for 7 days
          </a>
        </p>
      </div>
      <OwnershipDisclosure variant="inline" className="mt-0" />
    </aside>
  )
}
