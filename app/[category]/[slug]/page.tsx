import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { MDXContent } from '@/components/mdx/MDXContent'
import { FAQ, ProductRoundup } from '@/components/mdx/blocks'
import { CategoryEyebrow } from '@/components/article/CategoryEyebrow'
import { ArticleMeta } from '@/components/article/ArticleMeta'
import { AuthorByline, MedicalReviewBadge } from '@/components/article/AuthorByline'
import {
  Breadcrumbs,
  SourcesList,
  RelatedArticles,
  TableOfContents,
} from '@/components/article/ArticleExtras'
import {
  OwnershipDisclosure,
  AffiliateDisclosure,
} from '@/components/disclosure/OwnershipDisclosure'
import { NewsletterBand } from '@/components/newsletter/NewsletterBand'
import { AdSlot } from '@/components/home/AdSlot'

import {
  articles,
  getArticle,
  getAuthor,
  getCategory,
  getRelated,
  absoluteUrl,
} from '@/lib/content'
import { articleGraph } from '@/lib/schema'

export const dynamicParams = false

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.category, slug: a.slug }))
}

type Params = Promise<{ category: string; slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, category } = await params
  const article = getArticle(slug)
  if (!article || article.category !== category) return {}

  const author = getAuthor(article.author)
  const description = article.seo.description ?? article.summary

  return {
    title: article.seo.title ?? article.title,
    description,
    alternates: { canonical: article.seo.canonical ?? article.permalink },
    robots: article.seo.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      title: article.seo.title ?? article.title,
      description,
      url: absoluteUrl(article.permalink),
      publishedTime: new Date(article.publishedAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      section: getCategory(article.category)?.name,
      tags: [...article.tags],
      ...(author ? { authors: [absoluteUrl(author.permalink)] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo.title ?? article.title,
      description,
    },
  }
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug, category } = await params
  const article = getArticle(slug)
  if (!article || article.category !== category) notFound()

  const cat = getCategory(article.category)
  const author = getAuthor(article.author)
  const reviewer = article.medicalReviewer ? getAuthor(article.medicalReviewer) : undefined
  const contributors = article.contributors
    .map((c) => getAuthor(c))
    .filter((a): a is NonNullable<typeof a> => a != null)
  const related = getRelated(article)

  return (
    <>
      <JsonLd data={articleGraph(article)} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs
          trail={[
            { name: 'Home', url: '/' },
            { name: cat?.name ?? article.category, url: `/${article.category}` },
            { name: article.title },
          ]}
        />
      </Container>

      <Container className="mt-5">
        <article>
          <header>
            <CategoryEyebrow slug={article.category} />
            <h1 className="text-ink mt-2 font-display text-[1.9rem] leading-[1.12] font-semibold sm:text-[2.25rem]">
              {article.title}
            </h1>
            <p className="text-ink-muted mt-4 text-[1.05rem] leading-relaxed">{article.summary}</p>

            <div className="border-rule mt-5 flex flex-wrap items-center justify-between gap-3 border-y py-4">
              {author && (
                <AuthorByline author={author} reviewer={reviewer} contributors={contributors} />
              )}
              <ArticleMeta updatedAt={article.updatedAt} readingTime={article.readingTime} />
            </div>
          </header>

          <figure className="mt-7">
            <div className="bg-surface relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={article.heroImage.src}
                alt={article.heroImageAlt}
                fill
                sizes="(max-width: 720px) 100vw, 720px"
                priority
                fetchPriority="high"
                placeholder="blur"
                blurDataURL={article.heroImage.blurDataURL}
                className="object-cover"
              />
            </div>
            {article.heroImageCredit && (
              <figcaption className="text-ink-faint mt-2 text-[0.72rem]">
                {article.heroImageCredit}
              </figcaption>
            )}
          </figure>

          {/* Disclosure sits above the body, before any claim it applies to. */}
          {article.ownershipDisclosure && <OwnershipDisclosure />}
          {article.affiliate && !article.ownershipDisclosure && (
            <AffiliateDisclosure note={article.disclosureNote} />
          )}
          {reviewer && (
            <MedicalReviewBadge reviewer={reviewer} reviewedAt={article.medicallyReviewedAt} />
          )}

          <TableOfContents toc={article.toc} className="my-8" />

          <div className="prose prose-editorial prose-headings:font-display prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-[1.4rem] prose-h3:text-[1.1rem] prose-a:font-medium prose-li:leading-relaxed max-w-none">
            <MDXContent
              code={article.body}
              components={{
                // Bound to this article's frontmatter so the visible FAQ and
                // the FAQPage JSON-LD can never drift apart.
                FAQ: () => <FAQ items={[...article.faq]} />,
                ProductRoundup: () => <ProductRoundup products={[...article.products]} />,
              }}
            />
          </div>

          <SourcesList sources={article.sources} />
        </article>

        <NewsletterBand
          source="article_foot"
          categoryInterest={article.category}
          className="mt-14"
        />

        <RelatedArticles articles={related} />

        <AdSlot className="mt-12" />
      </Container>
    </>
  )
}
