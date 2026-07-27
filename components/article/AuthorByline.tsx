import Link from 'next/link'
import Image from 'next/image'
import type { Author } from '@/lib/content'
import { formatDate, isoDate } from '@/lib/format'

export function AuthorByline({
  author,
  reviewer,
  contributors = [],
}: {
  author: Author
  reviewer?: Author
  contributors?: Author[]
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.85rem]">
      {author.avatar && (
        <Image
          src={author.avatar.src}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-full object-cover"
        />
      )}
      <p className="text-ink-muted">
        By{' '}
        <Link href={author.permalink} className="text-ink hover:text-accent font-bold">
          {author.name}
        </Link>
        {contributors.length > 0 && (
          <>
            {' and '}
            {contributors.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ', '}
                <Link href={c.permalink} className="text-ink hover:text-accent font-bold">
                  {c.name}
                </Link>
              </span>
            ))}
          </>
        )}
        {reviewer && (
          <>
            {' · Medically reviewed by '}
            <Link href={reviewer.permalink} className="text-ink hover:text-accent font-bold">
              {reviewer.name}
              {reviewer.credentials ? `, ${reviewer.credentials}` : ''}
            </Link>
          </>
        )}
      </p>
    </div>
  )
}

/**
 * The clinical sign-off callout. Deliberately explicit that review means
 * accuracy checking, not endorsement of any product mentioned.
 */
export function MedicalReviewBadge({
  reviewer,
  reviewedAt,
}: {
  reviewer: Author
  reviewedAt?: string
}) {
  return (
    <aside className="border-cat-milestones/30 bg-cat-milestones/5 rounded-card my-6 flex gap-3 border p-4">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
        className="text-cat-milestones mt-0.5 shrink-0"
      >
        <circle cx="9" cy="9" r="8" fill="currentColor" />
        <path d="M5 9l2.6 2.6L13 6.5" stroke="#fff" strokeWidth="1.8" fill="none" />
      </svg>
      <div>
        <p className="text-ink text-[0.85rem] leading-relaxed">
          <strong className="font-bold">Medically reviewed</strong>
          {reviewedAt && (
            <>
              {' on '}
              <time dateTime={isoDate(reviewedAt)}>{formatDate(reviewedAt)}</time>
            </>
          )}
          {' by '}
          <Link href={reviewer.permalink} className="font-bold underline underline-offset-2">
            {reviewer.name}
            {reviewer.credentials ? `, ${reviewer.credentials}` : ''}
          </Link>
          , {reviewer.title.toLowerCase()}.
        </p>
        <p className="text-ink-muted mt-1.5 text-[0.78rem] leading-relaxed">
          Medical review checks clinical accuracy and safety. It is not an endorsement of any
          product mentioned, and our reviewers hold no financial interest in them.
        </p>
      </div>
    </aside>
  )
}
