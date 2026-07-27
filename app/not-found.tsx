import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ArticleCard } from '@/components/article/ArticleCard'
import { SectionHeading } from '@/components/home/SectionHeading'
import { articles, categories } from '@/lib/content'

export default function NotFound() {
  const popular = articles.filter((a) => a.featured).slice(0, 3)

  return (
    <Container width="wide" className="py-14">
      <p className="text-accent font-sans text-[0.7rem] font-bold tracking-[0.12em] uppercase">
        404
      </p>
      <h1 className="text-ink mt-2 font-serif text-[2.1rem] font-semibold sm:text-[2.3rem]">
        We couldn&rsquo;t find that page
      </h1>
      <p className="text-ink-muted mt-3 max-w-[38rem] text-[0.95rem] leading-relaxed">
        The link may be out of date, or we may have moved the article. Try a category below, or
        search from the header.
      </p>

      <ul className="mt-7 flex flex-wrap gap-2.5">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="border-rule hover:border-ink inline-block border px-3.5 py-2 text-[0.8rem] font-bold uppercase"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>

      {popular.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Popular right now" />
          <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            {popular.map((a) => (
              <ArticleCard key={a.slug} article={a} showMeta={false} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
