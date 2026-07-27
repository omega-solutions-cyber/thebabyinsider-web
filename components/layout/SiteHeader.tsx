import { Container } from './Container'
import { Logo } from './Logo'
import { CategoryNav } from './CategoryNav'
import { MobileNav } from './MobileNav'
import { SearchTrigger } from '@/components/search/SearchTrigger'
import { categories } from '@/lib/content'

/**
 * Sticky masthead. Server component; only the drawer and the search trigger
 * ship JavaScript.
 *
 * Height is fixed at every breakpoint so the sticky bar can never resize and
 * shift the page beneath it.
 */
export function SiteHeader() {
  const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name, color: c.color }))

  return (
    <header className="border-rule bg-surface/95 sticky top-0 z-40 border-b backdrop-blur-sm">
      <Container width="wide">
        <div className="flex h-[3.5rem] items-center justify-between gap-4">
          <Logo />

          <CategoryNav className="hidden lg:flex" />

          <div className="flex items-center gap-1">
            <span className="border-rule text-ink-muted hidden items-center gap-1 border-r pr-3 text-[0.7rem] font-bold tracking-[0.06em] uppercase lg:flex">
              EN
            </span>
            <SearchTrigger />
            <MobileNav categories={navCategories} />
          </div>
        </div>
      </Container>
    </header>
  )
}
