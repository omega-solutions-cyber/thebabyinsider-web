import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { Pagination } from '@/components/article/Pagination'
import { NewsletterBand } from '@/components/newsletter/NewsletterBand'
import { AdSlot } from '@/components/home/AdSlot'

import { categories, getCategory, getArticlesByCategory, paginate } from '@/lib/content'
import { categoryGraph } from '@/lib/schema'

export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

type Params = Promise<{ category: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}

  return {
    title: cat.seo.title ?? `${cat.name} — ${cat.tagline}`,
    description: cat.seo.description ?? cat.description,
    alternates: {
      canonical: `/${cat.slug}`,
      types: {
        'application/rss+xml': [{ url: `/${cat.slug}/rss.xml`, title: `${cat.name} articles` }],
      },
    },
    openGraph: {
      type: 'website',
      title: cat.name,
      description: cat.description,
      url: `/${cat.slug}`,
    },
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const all = getArticlesByCategory(cat.slug)
  const { items, totalPages } = paginate(all, 1)

  return (
    <>
      <JsonLd data={categoryGraph(cat, items)} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs trail={[{ name: 'Home', url: '/' }, { name: cat.name }]} />

        <header className="border-rule mt-5 border-b pb-7">
          <h1 className="text-ink font-display text-[2.1rem] font-semibold tracking-[-0.01em] sm:text-[2.5rem]">
            {cat.name}
          </h1>
          <p className="text-ink-muted mt-2 font-sans text-base">{cat.tagline}</p>
          <p className="text-ink-muted mt-4 max-w-[46rem] text-[0.92rem] leading-relaxed">
            {cat.description}
          </p>
        </header>

        {items.length === 0 ? (
          <p className="text-ink-muted py-16 text-center">
            No articles here yet — we&rsquo;re working on it.
          </p>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <ArticleCard key={a.slug} article={a} showSummary />
            ))}
          </div>
        )}

        <Pagination basePath={`/${cat.slug}`} page={1} totalPages={totalPages} />

        <NewsletterBand source="category_foot" categoryInterest={cat.slug} className="mt-14" />
        <AdSlot />
      </Container>
    </>
  )
}
