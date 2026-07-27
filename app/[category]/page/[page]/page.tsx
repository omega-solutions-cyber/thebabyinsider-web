import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { Pagination } from '@/components/article/Pagination'

import { categories, getCategory, getArticlesByCategory, paginate } from '@/lib/content'
import { categoryGraph } from '@/lib/schema'
import { siteConfig } from '@/data/siteConfig'

export const dynamicParams = false

export function generateStaticParams() {
  return categories.flatMap((c) => {
    const total = Math.ceil(getArticlesByCategory(c.slug).length / siteConfig.pageSize)
    // Page 1 lives at the bare category path, so start at 2.
    return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
      category: c.slug,
      page: String(i + 2),
    }))
  })
}

type Params = Promise<{ category: string; page: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, page } = await params
  const cat = getCategory(category)
  if (!cat) return {}

  return {
    title: `${cat.name} — page ${page}`,
    description: cat.seo.description ?? cat.description,
    // Self-referencing canonical. Pointing paginated pages at page 1 hides
    // their articles from the index entirely.
    alternates: { canonical: `/${cat.slug}/page/${page}` },
  }
}

export default async function CategoryPagePaginated({ params }: { params: Params }) {
  const { category, page: pageParam } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  const page = Number(pageParam)
  if (!Number.isInteger(page) || page < 1) notFound()
  if (page === 1) redirect(`/${cat.slug}`)

  const all = getArticlesByCategory(cat.slug)
  const { items, totalPages } = paginate(all, page)
  if (items.length === 0) notFound()

  return (
    <>
      <JsonLd data={categoryGraph(cat, items)} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs
          trail={[
            { name: 'Home', url: '/' },
            { name: cat.name, url: `/${cat.slug}` },
            { name: `Page ${page}` },
          ]}
        />

        <header className="border-rule mt-5 border-b pb-7">
          <h1 className="text-ink font-display text-[2.1rem] font-semibold sm:text-[2.5rem]">
            {cat.name}
          </h1>
          <p className="text-ink-muted mt-2 text-sm">
            Page {page} of {totalPages}
          </p>
        </header>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <ArticleCard key={a.slug} article={a} showSummary />
          ))}
        </div>

        <Pagination basePath={`/${cat.slug}`} page={page} totalPages={totalPages} />
      </Container>
    </>
  )
}
