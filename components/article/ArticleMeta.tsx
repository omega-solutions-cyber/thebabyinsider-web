import { formatDate, isoDate, formatCount, readingTimeLabel } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * The card/byline meta line.
 *
 * `views` and `comments` are optional and render nothing when absent. We do not
 * ship invented engagement numbers: on a health-adjacent site that is both an
 * FTC exposure and trivially detectable, and a brand-new site advertising
 * "47 views" actively costs more trust than showing nothing.
 *
 * Real counts arrive later from the nightly analytics sync, and are only shown
 * once they clear VIEW_DISPLAY_THRESHOLD.
 */
export const VIEW_DISPLAY_THRESHOLD = 1000

export function ArticleMeta({
  updatedAt,
  readingTime,
  views,
  comments,
  className,
  prefix = 'Last update',
}: {
  updatedAt: string
  readingTime: number
  views?: number
  comments?: number
  className?: string
  prefix?: string
}) {
  const showViews = typeof views === 'number' && views >= VIEW_DISPLAY_THRESHOLD
  const showComments = typeof comments === 'number' && comments > 0

  return (
    <p
      className={cn(
        'text-ink-faint flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem]',
        className
      )}
    >
      <span>
        {prefix}: <time dateTime={isoDate(updatedAt)}>{formatDate(updatedAt)}</time>
      </span>

      {showComments && (
        <>
          <span aria-hidden="true">•</span>
          <span>
            {formatCount(comments)} comment{comments === 1 ? '' : 's'}
          </span>
        </>
      )}

      {showViews && (
        <>
          <span aria-hidden="true">•</span>
          <span>{formatCount(views)} views</span>
        </>
      )}

      <span aria-hidden="true">•</span>
      <span>{readingTimeLabel(readingTime)}</span>
    </p>
  )
}
