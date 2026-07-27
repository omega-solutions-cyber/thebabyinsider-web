import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/content'
import { CategoryEyebrow, NewBadge } from '@/components/article/CategoryEyebrow'
import { cn } from '@/lib/cn'

/**
 * The three-panel hero.
 *
 * Geometry is the whole game here. Each panel is an explicit aspect-ratio box
 * in a CSS grid, so the mosaic occupies its final size before a single byte of
 * image data arrives. Image height must never determine layout — that is what
 * makes full-bleed magazine heroes the worst CLS offender on the web.
 *
 * Panel 1 carries the only `priority` image on the entire site: it is the LCP
 * element on the highest-traffic page.
 */
function HeroPanel({
  article,
  index,
  showNewBadge,
}: {
  article: Article
  index: number
  showNewBadge: boolean
}) {
  const isLead = index === 0

  return (
    <article
      className={cn(
        'group bg-ink relative overflow-hidden',
        // Fixed ratios per breakpoint. Stacked on mobile, mosaic from md up.
        'aspect-[3/2] sm:aspect-[16/9] md:aspect-auto',
        isLead ? 'md:row-span-2' : ''
      )}
    >
      <Image
        src={article.heroImage.src}
        alt={article.heroImageAlt}
        fill
        sizes={isLead ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
        priority={isLead}
        fetchPriority={isLead ? 'high' : 'auto'}
        placeholder="blur"
        blurDataURL={article.heroImage.blurDataURL}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Legibility scrim. Fixed gradient, no JS, no post-hydration change. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5"
      />

      {showNewBadge && <NewBadge className="absolute top-0 left-0" />}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <CategoryEyebrow slug={article.category} tone="paper" />
        <h2
          className={cn(
            'mt-2 font-sans leading-[1.15] font-bold text-white',
            isLead ? 'text-xl sm:text-2xl lg:text-[1.7rem]' : 'text-lg lg:text-xl'
          )}
        >
          <Link href={article.permalink} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] text-white/90">
          Read more
          <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true" fill="none">
            <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </p>
      </div>
    </article>
  )
}

export function HeroMosaic({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section aria-label="Featured stories" className="bg-paper">
      <div
        className={cn(
          'bg-rule grid gap-px',
          // The lead panel takes the left half and both rows; the two
          // secondaries stack on the right. Row height is fixed, so the box is
          // reserved before paint.
          'md:grid-cols-2 md:grid-rows-[minmax(0,14rem)_minmax(0,14rem)] lg:grid-rows-[minmax(0,16rem)_minmax(0,16rem)]'
        )}
      >
        {articles.slice(0, 3).map((a, i) => (
          <HeroPanel key={a.slug} article={a} index={i} showNewBadge={i === 0 && a.isNew} />
        ))}
      </div>
    </section>
  )
}
