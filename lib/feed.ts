import { Feed } from 'feed'
import type { Article } from '@/lib/content'
import { getAuthor, getCategory, absoluteUrl } from '@/lib/content'
import { siteConfig } from '@/data/siteConfig'

/**
 * Builds a feed for the whole site or a single category. Full content is
 * included — aggregators and newsletter tools pick items up far more reliably
 * with `content:encoded` present than with a summary alone.
 */
export function buildFeed(articles: Article[], category?: { name: string; slug: string }) {
  const title = category ? `${siteConfig.name} — ${category.name}` : siteConfig.name
  const link = category ? absoluteUrl(`/${category.slug}`) : siteConfig.url
  const selfPath = category ? `/${category.slug}/rss.xml` : '/rss.xml'

  const feed = new Feed({
    title,
    description: category ? undefined : siteConfig.description,
    id: link,
    link,
    language: siteConfig.language,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    updated: articles[0] ? new Date(articles[0].updatedAt) : new Date(),
    feedLinks: {
      rss: absoluteUrl(selfPath),
      json: absoluteUrl('/feed.json'),
    },
    author: {
      name: siteConfig.name,
      email: siteConfig.editorialEmail,
      link: siteConfig.url,
    },
  })

  for (const a of articles.slice(0, 50)) {
    const author = getAuthor(a.author)
    const cat = getCategory(a.category)

    feed.addItem({
      title: a.title,
      id: absoluteUrl(a.permalink),
      link: absoluteUrl(a.permalink),
      description: a.summary,
      date: new Date(a.updatedAt),
      published: new Date(a.publishedAt),
      image: absoluteUrl(a.heroImage.src),
      ...(cat ? { category: [{ name: cat.name }] } : {}),
      ...(author ? { author: [{ name: author.name, link: absoluteUrl(author.permalink) }] } : {}),
    })
  }

  return feed
}

export const feedHeaders = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600',
}
