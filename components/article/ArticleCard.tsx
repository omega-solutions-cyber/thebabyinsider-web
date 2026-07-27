import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/content'
import { CategoryEyebrow } from './CategoryEyebrow'
import { ArticleMeta } from './ArticleMeta'
import { cn } from '@/lib/cn'

type Variant = 'default' | 'compact' | 'horizontal' | 'large'

const imageSizes: Record<Variant, string> = {
  default: '(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 340px',
  compact: '(max-width: 640px) 100vw, (max-width: 1100px) 25vw, 260px',
  horizontal: '(max-width: 640px) 40vw, 200px',
  large: '(max-width: 640px) 100vw, 50vw',
}

/**
 * The workhorse card. The image sits in a fixed-ratio box so the grid's
 * geometry is settled before any image loads — no cumulative layout shift.
 */
export function ArticleCard({
  article,
  variant = 'default',
  showSummary = false,
  showMeta = true,
  className,
}: {
  article: Article
  variant?: Variant
  showSummary?: boolean
  showMeta?: boolean
  className?: string
}) {
  const image = article.cardImage ?? article.heroImage
  const horizontal = variant === 'horizontal'

  return (
    <article className={cn('group', horizontal && 'flex gap-4', className)}>
      <Link
        href={article.permalink}
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          'bg-surface rounded-card relative block overflow-hidden',
          horizontal ? 'aspect-[4/3] w-[7.5rem] shrink-0' : 'aspect-[4/3] w-full'
        )}
      >
        <Image
          src={image.src}
          alt=""
          fill
          sizes={imageSizes[variant]}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className={cn(horizontal ? 'min-w-0' : 'mt-3.5')}>
        <CategoryEyebrow slug={article.category} />

        {/* Headline first, metadata under it. Putting the date above the
            title made two small grey lines compete before the reader ever
            reached the thing they are choosing between. */}
        <h3
          className={cn(
            'text-ink font-display mt-2.5 text-balance',
            variant === 'large' && 'text-[1.4rem] leading-[1.15] font-extrabold tracking-[-0.02em] sm:text-[1.6rem]',
            variant === 'default' && 'text-[1.05rem] leading-[1.25] font-bold tracking-[-0.012em]',
            variant === 'compact' && 'text-[0.98rem] leading-[1.25] font-bold tracking-[-0.01em]',
            variant === 'horizontal' && 'text-[0.92rem] leading-[1.3] font-bold'
          )}
        >
          <Link href={article.permalink} className="hover:text-accent">
            {article.title}
          </Link>
        </h3>

        {showSummary && (
          <p className="text-ink-muted mt-2 line-clamp-2 text-[0.86rem] leading-relaxed">
            {article.summary}
          </p>
        )}

        {showMeta && (
          <ArticleMeta
            updatedAt={article.updatedAt}
            readingTime={article.readingTime}
            className="mt-2.5"
          />
        )}

        {!horizontal && (
          <p className="mt-3">
            <Link
              href={article.permalink}
              className="text-ink-muted hover:text-accent inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-bold tracking-[0.14em] uppercase"
              tabIndex={-1}
              aria-hidden="true"
            >
              Read more
              <svg width="6" height="10" viewBox="0 0 6 10" aria-hidden="true" fill="none">
                <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </Link>
          </p>
        )}
      </div>
    </article>
  )
}
