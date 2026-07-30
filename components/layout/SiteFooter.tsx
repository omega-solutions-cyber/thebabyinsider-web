import Link from 'next/link'
import { Container } from './Container'
import { Logo } from './Logo'
import { siteConfig } from '@/data/siteConfig'
import { categories } from '@/lib/content'

function LinkColumn({
  heading,
  links,
}: {
  heading: string
  links: { title: string; href: string }[]
}) {
  return (
    <div>
      <h2 className="text-accent-on-dark font-sans text-[0.7rem] font-bold tracking-[0.1em] uppercase">
        {heading}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-paper/75 hover:text-paper text-[0.8rem] transition-colors"
            >
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  const half = Math.ceil(categories.length / 2)
  const catLinks = categories.map((c) => ({ title: c.name, href: `/${c.slug}` }))

  return (
    <footer className="bg-footer text-paper mt-16">
      <Container width="wide">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="paper" />
            <p className="text-paper/70 mt-5 max-w-[22rem] text-[0.8rem] leading-relaxed">
              {siteConfig.tagline}. Every clinical article is reviewed by a licensed practitioner
              before publication.
            </p>
          </div>

          <LinkColumn heading="Categories" links={catLinks.slice(0, half)} />
          <LinkColumn heading="More topics" links={catLinks.slice(half)} />
          <LinkColumn heading={siteConfig.name} links={[...siteConfig.footerBrandLinks]} />
        </div>

        {/* No sitewide ownership statement here by product decision. The
            disclosure that carries the legal weight is the in-article one,
            which renders on any article discussing our own product and is
            enforced at build time. See /about and /advertising-disclosure. */}
        <div className="border-paper/12 border-t py-7">
          <p className="text-paper/70 text-[0.75rem]">
            © {siteConfig.founded}–{new Date().getFullYear()} {siteConfig.name}. Information on this
            site is for general education and is not a substitute for advice from your own
            healthcare provider.
          </p>
        </div>
      </Container>
    </footer>
  )
}
