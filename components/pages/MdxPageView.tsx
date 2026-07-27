import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { MDXContent } from '@/components/mdx/MDXContent'
import { Breadcrumbs, TableOfContents } from '@/components/article/ArticleExtras'
import { getPage } from '@/lib/content'
import { pageGraph } from '@/lib/schema'
import { formatDate, isoDate } from '@/lib/format'

/**
 * Shared renderer for every static page in the `pages` MDX collection, so
 * editors can change About or the legal copy without touching a route file.
 */
export function mdxPageMetadata(path: string): Metadata {
  const page = getPage(path)
  if (!page) return {}

  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description ?? page.summary,
    alternates: { canonical: page.permalink },
    robots: page.seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: { type: 'article', title: page.title, description: page.summary },
  }
}

export function MdxPageView({
  path,
  parent,
}: {
  path: string
  parent?: { name: string; url: string }
}) {
  const page = getPage(path)
  if (!page) notFound()

  return (
    <>
      <JsonLd data={pageGraph(page.title, page.permalink, page.updatedAt)} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs
          trail={[{ name: 'Home', url: '/' }, ...(parent ? [parent] : []), { name: page.title }]}
        />
      </Container>

      <Container className="mt-5 pb-6">
        <header className="border-rule border-b pb-6">
          <h1 className="text-ink font-display text-[1.95rem] leading-tight font-semibold sm:text-[2.3rem]">
            {page.title}
          </h1>
          <p className="text-ink-muted mt-3 text-[0.95rem] leading-relaxed">{page.summary}</p>
          <p className="text-ink-faint mt-4 text-[0.72rem]">
            Last updated{' '}
            <time dateTime={isoDate(page.updatedAt)}>{formatDate(page.updatedAt)}</time>
          </p>
        </header>

        <TableOfContents toc={page.toc} className="my-8" />

        <div className="prose prose-editorial prose-headings:font-display prose-headings:font-semibold prose-h2:mt-9 prose-h2:text-[1.3rem] mt-8 max-w-none">
          <MDXContent code={page.body} />
        </div>
      </Container>
    </>
  )
}
