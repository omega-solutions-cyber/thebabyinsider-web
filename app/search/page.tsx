import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { SearchPageClient } from '@/components/search/SearchPageClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search every article on The Baby Insider.',
  alternates: { canonical: '/search' },
  // Search result pages carry no standalone value and are the classic source
  // of index bloat.
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <>
      <Container width="wide" className="pt-6">
        <Breadcrumbs trail={[{ name: 'Home', url: '/' }, { name: 'Search' }]} />
      </Container>
      <Container className="mt-5 pb-10">
        <h1 className="text-ink font-display text-[1.95rem] font-semibold sm:text-[2.3rem]">
          Search
        </h1>
        <SearchPageClient />
      </Container>
    </>
  )
}
