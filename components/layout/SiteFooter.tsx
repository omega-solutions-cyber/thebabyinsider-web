import Link from 'next/link'
import { Container } from './Container'
import { Logo } from './Logo'
import { siteConfig } from '@/data/siteConfig'
import { categories } from '@/lib/content'

const socialIcons: Record<string, { label: string; path: string }> = {
  facebook: {
    label: 'Facebook',
    path: 'M13 7h3V4h-3a4 4 0 00-4 4v2H7v3h2v7h3v-7h3l1-3h-4V8a1 1 0 011-1z',
  },
  x: {
    label: 'X',
    path: 'M4 3l6.5 8.5L4.3 21h2l5.2-6.9L16.7 21H21l-6.9-9L20.6 3h-2l-4.8 6.4L9 3H4z',
  },
  pinterest: {
    label: 'Pinterest',
    path: 'M12 3a9 9 0 00-3.3 17.4c-.1-.8-.1-2 .1-2.8l1.2-4.9s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2-1.4-3.6-3.9-3.6a4.5 4.5 0 00-4.7 4.5c0 .9.3 1.5.7 2 .1.2.2.3.1.6l-.2.8c-.1.3-.3.4-.5.2-1.1-.5-1.7-1.9-1.7-3.4 0-2.6 2.2-5.7 6.5-5.7 3.5 0 5.8 2.5 5.8 5.2 0 3.5-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.8-.7 1.7-1.1 2.3A9 9 0 1012 3z',
  },
  instagram: {
    label: 'Instagram',
    path: 'M7.5 3h9A4.5 4.5 0 0121 7.5v9A4.5 4.5 0 0116.5 21h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3zm0 2A2.5 2.5 0 005 7.5v9A2.5 2.5 0 007.5 19h9a2.5 2.5 0 002.5-2.5v-9A2.5 2.5 0 0016.5 5h-9zM12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 6a1 1 0 110 2 1 1 0 010-2z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5 3-5 3z',
  },
}

function LinkColumn({
  heading,
  links,
}: {
  heading: string
  links: { title: string; href: string }[]
}) {
  return (
    <div>
      <h2 className="text-accent font-sans text-[0.7rem] font-bold tracking-[0.1em] uppercase">
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
            <p className="text-paper/60 mt-5 max-w-[22rem] text-[0.8rem] leading-relaxed">
              {siteConfig.tagline}. Every clinical article is reviewed by a licensed practitioner
              before publication.
            </p>
            <ul className="mt-6 flex items-center gap-4">
              {Object.entries(siteConfig.social).map(([key, href]) => {
                const icon = socialIcons[key]
                if (!icon) return null
                return (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={icon.label}
                      className="text-paper/70 hover:text-paper block transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={icon.path} />
                      </svg>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <LinkColumn heading="Categories" links={catLinks.slice(0, half)} />
          <LinkColumn heading="More topics" links={catLinks.slice(half)} />
          <LinkColumn heading={siteConfig.name} links={[...siteConfig.footerBrandLinks]} />
        </div>

        {/* Ownership stated in plain language, on every page. */}
        <div className="border-paper/12 border-t py-7">
          <p className="text-paper/55 max-w-[52rem] text-[0.75rem] leading-relaxed">
            {siteConfig.ownership.statement}
          </p>
          <p className="text-paper/45 mt-4 text-[0.75rem]">
            © {siteConfig.founded}–{new Date().getFullYear()} {siteConfig.name}. Information on this
            site is for general education and is not a substitute for advice from your own
            healthcare provider.
          </p>
        </div>
      </Container>
    </footer>
  )
}
