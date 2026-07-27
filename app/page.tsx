import { Container } from '@/components/layout/Container'
import { HeroMosaic } from '@/components/home/HeroMosaic'
import { SectionHeading, ViewMoreButton } from '@/components/home/SectionHeading'
import { AdSlot } from '@/components/home/AdSlot'
import { ArticleCard } from '@/components/article/ArticleCard'
import { NewsletterBand } from '@/components/newsletter/NewsletterBand'
import { JsonLd } from '@/components/seo/JsonLd'
import { homeGraph } from '@/lib/schema'
import {
  getHeroArticles,
  getFeatured,
  getArticlesByCategory,
  categories,
  articles,
} from '@/lib/content'

export default function HomePage() {
  const hero = getHeroArticles()
  const featured = getFeatured(4)

  // The homepage section is a three-up row. A category with one or two articles
  // renders as a single card marooned in a three-column grid, which reads as
  // broken rather than sparse — so a category earns a homepage section only
  // once it can fill the row. It stays reachable from the nav and footer
  // regardless.
  const SECTION_MIN = 3

  const sections = categories
    .map((category) => ({ category, items: getArticlesByCategory(category.slug) }))
    .filter((s) => s.items.length >= SECTION_MIN)
    .map((s) => ({ ...s, items: s.items.slice(0, 3) }))

  // Until enough categories qualify, a single cross-category "Latest" grid
  // carries the page. This is what keeps the homepage looking finished at ten
  // articles and at a thousand, without a hand-edit at the crossover.
  const sectionSlugs = new Set(sections.flatMap((s) => s.items.map((a) => a.slug)))
  const heroSlugs = new Set(hero.map((a) => a.slug))
  const latest = articles
    .filter((a) => !heroSlugs.has(a.slug) && !sectionSlugs.has(a.slug))
    .slice(0, 6)
  const showLatest = sections.length < 2 && latest.length > 0

  return (
    <>
      <JsonLd data={homeGraph([...hero, ...featured])} />

      <Container width="wide" className="pt-6">
        <HeroMosaic articles={hero} />
      </Container>

      {featured.length > 0 && (
        <section className="bg-surface mt-14 py-12">
          <Container width="wide">
            <SectionHeading title="Top Articles" centered />
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="compact" showMeta={false} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <Container width="wide" className="mt-14">
        <NewsletterBand source="home_top" />
        <AdSlot />
      </Container>

      <Container width="wide">
        {showLatest && (
          <section className="mt-4">
            <SectionHeading title="Latest" href="/tags" />
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {sections.map(({ category, items }, i) => (
          <section key={category.slug} className="mt-10 first:mt-4">
            <SectionHeading title={category.name} href={`/${category.slug}`} />
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
            <ViewMoreButton href={`/${category.slug}`} />
            {i === Math.floor(sections.length / 2) && <AdSlot className="mt-10" />}
          </section>
        ))}
      </Container>

      <Container width="wide" className="mt-16">
        <NewsletterBand source="home_bottom" />
        <AdSlot />
      </Container>
    </>
  )
}
