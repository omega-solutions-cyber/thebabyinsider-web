import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { getAllTags, getArticlesByTag, THIN_TAG_THRESHOLD } from '@/lib/content'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }))
}

type Params = Promise<{ tag: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { tag } = await params
  const items = getArticlesByTag(tag)

  return {
    title: `${tag} articles`,
    description: `Every article on The Baby Insider tagged ${tag}.`,
    alternates: { canonical: `/tags/${tag}` },
    // A handful of articles is thin content. Keep the links flowing, keep the
    // page out of the index.
    robots:
      items.length < THIN_TAG_THRESHOLD
        ? { index: false, follow: true }
        : { index: true, follow: true },
  }
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params
  const items = getArticlesByTag(tag)
  if (items.length === 0) notFound()

  return (
    <Container width="wide" className="pt-6 pb-4">
      <Breadcrumbs
        trail={[{ name: 'Home', url: '/' }, { name: 'Topics', url: '/tags' }, { name: tag }]}
      />

      <header className="border-rule mt-5 border-b pb-7">
        <h1 className="text-ink font-sans text-[1.9rem] font-extrabold uppercase sm:text-[2.3rem]">
          {tag}
        </h1>
        <p className="text-ink-muted mt-2 text-[0.9rem]">
          {items.length} article{items.length === 1 ? '' : 's'}
        </p>
      </header>

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.slug} article={a} showSummary />
        ))}
      </div>
    </Container>
  )
}
