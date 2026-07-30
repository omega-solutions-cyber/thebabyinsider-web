import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Article } from '@/lib/content'
import { getArticle, getAuthor } from '@/lib/content'
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

      {(product.url || product.storeLinks.length > 0) && (
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {product.storeLinks.map((link, i) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              // Only our own product carries a commercial relationship; a
              // competitor's store listing is a plain reference.
              rel={
                link.sponsored
                  ? 'sponsored nofollow noopener noreferrer'
                  : 'nofollow noopener noreferrer'
              }
              className={cn(
                'rounded-pill inline-block px-5 py-2.5 text-[0.8rem] font-bold transition-colors',
                i === 0
                  ? 'bg-ink text-paper hover:bg-accent'
                  : 'border-rule text-ink hover:border-accent hover:text-accent border font-semibold'
              )}
            >
              Get it on {link.platform === 'App Store' ? 'the App Store' : link.platform}
            </a>
          ))}
          {/* Website link only stands in when there is no store listing. */}
          {product.url && product.storeLinks.length === 0 && (
            <a
              href={product.url}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="bg-ink text-paper hover:bg-accent rounded-pill inline-block px-6 py-2.5 text-[0.82rem] font-bold transition-colors"
            >
              Visit {product.name}
            </a>
          )}
        </div>
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

/* ---------------------------------------------------------------- TestScores */

type TestScore = Article['scores'][number]

/**
 * Per-dimension scoring for a review or roundup. Every row carries the reason
 * for its score, because a bare number tells a reader nothing about what we
 * actually deducted for.
 */
export function TestScores({
  scores,
  title = 'How it scored',
}: {
  scores: TestScore[]
  title?: string
}) {
  if (!scores?.length) return null

  const total = scores.reduce((sum, s) => sum + s.score, 0)
  const outOf = scores.reduce((sum, s) => sum + s.max, 0)
  const overall = outOf > 0 ? (total / outOf) * 5 : 0

  return (
    <section className="border-rule bg-surface rounded-card my-10 border p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-accent font-sans text-[0.72rem] font-bold tracking-[0.12em] uppercase">
          {title}
        </h2>
        <p className="text-ink-muted text-[0.78rem]">
          Overall <strong className="text-ink font-bold">{overall.toFixed(1)}</strong> / 5
        </p>
      </div>

      <dl className="mt-4 space-y-4">
        {scores.map((s) => (
          <div key={s.dimension} className="border-rule/60 border-t pt-3 first:border-t-0 first:pt-0">
            <dt className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-ink font-display text-[1rem] font-semibold">{s.dimension}</span>
              <span className="text-accent font-sans text-[0.95rem] font-bold tabular-nums">
                {s.score}
                <span className="text-ink-faint font-normal">/{s.max}</span>
              </span>
            </dt>
            <dd className="text-ink-muted mt-1.5 text-[0.88rem] leading-relaxed">{s.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------ ComparisonTable */

/**
 * Head-to-head matrix built from `products[]`. Rows are attributes, columns are
 * products, so adding a product to frontmatter adds a column here.
 */
export function ComparisonTable({
  products,
  winnerLabel = 'Our pick',
}: {
  products: Product[]
  winnerLabel?: string
}) {
  if (!products?.length) return null
  const ordered = [...products].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  const cell = 'border-rule border-t px-3 py-3 align-top text-[0.85rem] leading-snug'
  const rowLabel =
    'border-rule text-ink-muted border-t px-3 py-3 text-left align-top font-sans text-[0.68rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap'

  return (
    <div className="-mx-gutter px-gutter my-10 overflow-x-auto md:mx-0 md:px-0">
      <table className="w-full min-w-[48rem] border-collapse">
        <caption className="sr-only">Milestone tracker comparison</caption>
        <thead>
          <tr>
            <td className="px-3 py-2" />
            {ordered.map((p, i) => (
              <th key={p.name} scope="col" className="px-3 py-2 text-left align-bottom">
                {i === 0 && (
                  <span className="bg-accent mb-1.5 inline-block px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.08em] text-white uppercase">
                    {winnerLabel}
                  </span>
                )}
                <span className="text-ink block font-display text-[1rem] font-semibold">
                  {p.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className={rowLabel}>
              Our score
            </th>
            {ordered.map((p) => (
              <td key={p.name} className={cell}>
                {p.rating != null ? (
                  <Stars rating={p.rating} />
                ) : (
                  <span className="text-ink-faint">Not scored</span>
                )}
              </td>
            ))}
          </tr>
          {ordered.some((p) => p.storeRatings.length > 0) && (
            <tr>
              <th scope="row" className={rowLabel}>
                Store ratings
              </th>
              {ordered.map((p) => (
                <td key={p.name} className={cell}>
                  {p.storeRatings.length > 0 ? (
                    <ul className="space-y-1.5">
                      {p.storeRatings.map((r) => (
                        <li key={r.source}>
                          <strong className="font-semibold">{r.score.toFixed(1)}</strong> / 5
                          <span className="text-ink-faint block text-[0.75rem]">
                            {r.source}
                            {r.count ? `, ${r.count.toLocaleString('en-US')} ratings` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-ink-faint">Not published</span>
                  )}
                </td>
              ))}
            </tr>
          )}
          <tr>
            <th scope="row" className={rowLabel}>
              Price
            </th>
            {ordered.map((p) => (
              <td key={p.name} className={cell}>
                {p.price != null ? (
                  <>
                    {`${p.currency === 'USD' ? '$' : ''}${p.price}${p.per ? ` / ${p.per}` : ''}`}
                    {p.priceNote && (
                      <span className="text-ink-faint block text-[0.75rem]">{p.priceNote}</span>
                    )}
                  </>
                ) : (
                  '—'
                )}
              </td>
            ))}
          </tr>
          {ordered.some((p) => p.features.length > 0) && (
            <tr>
              <th scope="row" className={rowLabel}>
                Key features
              </th>
              {ordered.map((p) => (
                <td key={p.name} className={cell}>
                  <ul className="space-y-1">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          )}
          <tr>
            <th scope="row" className={rowLabel}>
              Pros
            </th>
            {ordered.map((p) => (
              <td key={p.name} className={cell}>
                <ul className="space-y-1">
                  {p.pros.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className={rowLabel}>
              Cons
            </th>
            {ordered.map((p) => (
              <td key={p.name} className={cell}>
                <ul className="space-y-1">
                  {p.cons.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ----------------------------------------------------------------- ExpertNote */

/**
 * Inset commentary from a named clinician. Distinct from `Callout type="doctor"`
 * in that it attributes to a real person in the `authors` collection, so the
 * credentials shown are the ones we publish elsewhere on the site.
 */
export function ExpertNote({
  author,
  title = 'A word from our medical reviewer',
  children,
}: {
  author?: string
  title?: string
  children: ReactNode
}) {
  const person = author ? getAuthor(author) : undefined

  return (
    <aside className="border-cat-health/40 bg-cat-health/5 rounded-card my-10 border-l-[3px] p-5 sm:p-6">
      <p className="text-ink-muted font-sans text-[0.68rem] font-bold tracking-[0.1em] uppercase">
        {title}
      </p>
      <div className="mt-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:my-2.5 [&>p]:text-[0.92rem] [&>p]:leading-relaxed">
        {children}
      </div>
      {person && (
        <p className="border-rule/60 text-ink-muted mt-4 border-t pt-3 text-[0.8rem]">
          <Link
            href={person.permalink}
            className="text-ink hover:text-accent font-semibold underline underline-offset-2"
          >
            {person.name}
            {person.credentials ? `, ${person.credentials}` : ''}
          </Link>
          {person.title ? ` · ${person.title}` : ''}
        </p>
      )}
    </aside>
  )
}

/* -------------------------------------------------------------- AppDownload */

/**
 * Compact store-download block for repeat placement inside an article.
 *
 * Like BabyLeapPromo, it renders its own disclosure and offers no prop to
 * suppress it — a placement that sends readers to our paid product always says
 * whose product it is. This variant keeps that to a single line so the block can
 * appear more than once without the page turning into a disclosure sandwich.
 */
export function AppDownload({ headline }: { headline?: string }) {
  const { productName, appStoreUrl, playStoreUrl } = siteConfig.ownership
  const stores = [
    { platform: 'the App Store', url: appStoreUrl },
    { platform: 'Google Play', url: playStoreUrl },
  ].filter((s) => Boolean(s.url))

  if (stores.length === 0) return null

  return (
    <aside className="border-rule bg-surface rounded-card my-8 border p-5">
      <p className="text-ink font-display text-[1.05rem] font-semibold">
        {headline ?? `Get ${productName}`}
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
        {stores.map((s, i) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className={cn(
              'rounded-pill inline-block px-5 py-2.5 text-[0.8rem] font-bold transition-colors',
              i === 0
                ? 'bg-accent hover:bg-accent-dark text-white'
                : 'border-rule text-ink hover:border-accent hover:text-accent border'
            )}
          >
            Get it on {s.platform}
          </a>
        ))}
      </div>
      <OwnershipDisclosure variant="bar" className="mt-4 border-t border-b-0 pt-3 pb-0" />
    </aside>
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
