import Link from 'next/link'
import type { AnchorHTMLAttributes, ComponentProps } from 'react'
import { Callout, KeyTakeaways, InlineArticleLink, BabyLeapPromo, ProductCard } from './blocks'
import {
  OwnershipDisclosure,
  AffiliateDisclosure,
} from '@/components/disclosure/OwnershipDisclosure'

/**
 * Component map available to every MDX document. Article-specific blocks
 * (Callout, KeyTakeaways, FAQ, ProductRoundup, BabyLeapPromo…) are registered
 * here too so writers can use them without importing anything.
 */

function MdxLink({ href = '', ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // Outbound links already carry rel/target from the build-time rehype plugin.
  const isInternal = href.startsWith('/') || href.startsWith('#')
  if (isInternal) return <Link href={href} {...props} />
  return <a href={href} {...props} />
}

function Table(props: ComponentProps<'table'>) {
  // Wide tables scroll inside their own container — the page body must never
  // scroll horizontally.
  return (
    <div className="-mx-gutter px-gutter my-8 overflow-x-auto md:mx-0 md:px-0">
      <table {...props} />
    </div>
  )
}

export const mdxComponents = {
  a: MdxLink,
  table: Table,
  Callout,
  KeyTakeaways,
  InlineArticleLink,
  BabyLeapPromo,
  ProductCard,
  OwnershipDisclosure,
  AffiliateDisclosure,
  // FAQ and ProductRoundup are bound to the article's frontmatter by the
  // article page, so writers use them with no props.
}
