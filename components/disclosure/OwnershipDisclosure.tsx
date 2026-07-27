import Link from 'next/link'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/lib/cn'

/**
 * States, in plain language, that we own the product being discussed.
 *
 * Rendered automatically on any article with `ownershipDisclosure: true`, and
 * embedded inside BabyLeapPromo so a promotional block cannot appear without
 * it. The content layer fails the build if an article mentions our product and
 * has not set the flag, so this is enforced rather than remembered.
 */
export function OwnershipDisclosure({
  variant = 'block',
  className,
}: {
  variant?: 'block' | 'inline'
  className?: string
}) {
  const { parentName, productName } = siteConfig.ownership

  if (variant === 'inline') {
    return (
      <p
        className={cn(
          'border-accent bg-accent-tint text-ink my-6 border-l-2 px-4 py-3 text-[0.85rem] leading-relaxed',
          className
        )}
      >
        <strong className="font-bold">Disclosure:</strong> {productName} is made by {parentName},
        the company that publishes {siteConfig.name}. We earn money if you subscribe. Our{' '}
        <Link href="/how-we-evaluate" className="underline underline-offset-2">
          evaluation criteria
        </Link>{' '}
        were set before testing, and the clinical review was carried out by a reviewer with no
        financial interest in the product.
      </p>
    )
  }

  return (
    <aside
      aria-label="Ownership disclosure"
      className={cn('border-accent/35 bg-accent-tint my-8 border p-5', className)}
    >
      <h2 className="text-accent font-sans text-[0.7rem] font-bold tracking-[0.1em] uppercase">
        Ownership disclosure
      </h2>
      <p className="text-ink mt-2.5 text-[0.88rem] leading-relaxed">
        This article discusses <strong>{productName}</strong>, which is made by {parentName} — the
        same company that publishes {siteConfig.name}. We have a direct financial interest in you
        subscribing to it.
      </p>
      <p className="text-ink mt-2.5 text-[0.88rem] leading-relaxed">
        We handle that by publishing our{' '}
        <Link href="/how-we-evaluate" className="hover:text-accent underline underline-offset-2">
          evaluation criteria
        </Link>{' '}
        in advance, having clinical claims checked by a reviewer with no stake in the product, and
        naming competing products we would recommend instead. You should still weigh this coverage
        accordingly.
      </p>
    </aside>
  )
}

/**
 * Generic affiliate notice for articles with commercial links but no ownership
 * relationship.
 */
export function AffiliateDisclosure({ note, className }: { note?: string; className?: string }) {
  return (
    <aside
      aria-label="Affiliate disclosure"
      className={cn('border-rule bg-surface my-8 border-l-2 px-4 py-3.5', className)}
    >
      <p className="text-ink-muted text-[0.82rem] leading-relaxed">
        {note ??
          `We may earn a commission if you buy through links in this article. That never determines what we recommend or how we rank it — see our evaluation criteria.`}{' '}
        <Link
          href="/advertising-disclosure"
          className="hover:text-accent underline underline-offset-2"
        >
          Advertising disclosure
        </Link>
        .
      </p>
    </aside>
  )
}
