import { Container } from '@/components/layout/Container'
import { HeroMosaic } from '@/components/home/HeroMosaic'
import { SectionHeading, ViewMoreButton } from '@/components/home/SectionHeading'
import { AdSlot } from '@/components/home/AdSlot'
import { ArticleCard } from '@/components/article/ArticleCard'
import { NewsletterBand } from '@/components/newsletter/NewsletterBand'
import { JsonLd } from '@/components/seo/JsonLd'
import { homeGraph } from '@/lib/schema'
import { getHeroArticles, getFeatured, getArticlesByCategory, categories } from '@/lib/content'

export default function HomePage() {
  const hero = getHeroArticles()
  const featured = getFeatured(4)

  const sections = categories
    .map((category) => ({ category, items: getArticlesByCategory(category.slug).slice(0, 3) }))
    .filter((s) => s.items.length > 0)

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
