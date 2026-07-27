import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { MDXContent } from '@/components/mdx/MDXContent'
import { ArticleCard } from '@/components/article/ArticleCard'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { SectionHeading } from '@/components/home/SectionHeading'

import { authors, getAuthor, getArticlesByAuthor, getArticlesReviewedBy } from '@/lib/content'
import { authorGraph } from '@/lib/schema'

export const dynamicParams = false

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }))
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) return {}

  const name = author.credentials ? `${author.name}, ${author.credentials}` : author.name

  return {
    title: `${name} — ${author.title}`,
    description: author.seo.description ?? author.shortBio,
    alternates: { canonical: author.permalink },
    openGraph: { type: 'profile', title: name, description: author.shortBio },
  }
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { slug } = await params
  const author = getAuthor(slug)
  if (!author) notFound()

  const written = getArticlesByAuthor(author.slug)
  const reviewed = getArticlesReviewedBy(author.slug)

  return (
    <>
      <JsonLd data={authorGraph(author, written.length ? written : reviewed)} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs
          trail={[
            { name: 'Home', url: '/' },
            { name: 'Authors', url: '/authors' },
            { name: author.name },
          ]}
        />
      </Container>

      <Container className="mt-6">
        <header className="border-rule flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-start">
          {author.avatar && (
            <Image
              src={author.avatar.src}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-accent font-sans text-[0.68rem] font-bold tracking-[0.12em] uppercase">
              {author.role === 'medical-reviewer' ? 'Medical review team' : 'Editorial team'}
            </p>
            <h1 className="text-ink mt-1.5 font-sans text-[1.75rem] font-extrabold sm:text-[2.1rem]">
              {author.name}
              {author.credentials && <span className="text-ink-muted">, {author.credentials}</span>}
            </h1>
            <p className="text-ink-muted mt-1 text-base">{author.title}</p>

            {author.expertise.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {author.expertise.map((e) => (
                  <li
                    key={e}
                    className="border-rule text-ink-muted border px-2.5 py-1 text-[0.72rem]"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="prose prose-editorial mt-8 max-w-none">
          <MDXContent code={author.bio} />
        </div>

        {author.education.length > 0 && (
          <section className="border-rule mt-8 border-t pt-6">
            <h2 className="text-ink-muted font-sans text-[0.7rem] font-bold tracking-[0.12em] uppercase">
              Education
            </h2>
            <ul className="mt-3 space-y-1.5">
              {author.education.map((e) => (
                <li key={e} className="text-ink-muted text-[0.88rem]">
                  {e}
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>

      <Container width="wide" className="mt-14">
        {written.length > 0 && (
          <section>
            <SectionHeading title={`Articles by ${author.name}`} />
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {written.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {reviewed.length > 0 && (
          <section className="mt-14">
            <SectionHeading title={`Reviewed by ${author.name}`} />
            <p className="text-ink-muted mt-3 max-w-[46rem] text-[0.85rem]">
              These articles were checked for clinical accuracy before publication. Medical review
              is not an endorsement of any product mentioned.
            </p>
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {reviewed.map((a) => (
                <ArticleCard key={a.slug} article={a} showMeta={false} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  )
}
