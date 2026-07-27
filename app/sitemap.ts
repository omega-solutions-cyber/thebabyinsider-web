import type { MetadataRoute } from 'next'
import {
  articles,
  categories,
  authors,
  pages,
  getAllTags,
  getArticlesByCategory,
  getArticlesByTag,
  THIN_TAG_THRESHOLD,
} from '@/lib/content'
import { siteConfig } from '@/data/siteConfig'

const url = (path: string) => new URL(path, siteConfig.url).toString()

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const home: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: url('/authors'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: url('/tags'), lastModified: now, changeFrequency: 'weekly', priority: 0.3 },
  ]

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((c) => {
    const items = getArticlesByCategory(c.slug)
    const newest = items[0]
    const base = {
      url: url(`/${c.slug}`),
      lastModified: newest ? new Date(newest.updatedAt) : now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }

    const pageCount = Math.ceil(items.length / siteConfig.pageSize)
    const paged = Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
      url: url(`/${c.slug}/page/${i + 2}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    }))

    return [base, ...paged]
  })

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter((a) => !a.seo.noindex)
    .map((a) => ({
      url: url(a.permalink),
      // Real modification dates only — inflated freshness signals are a known
      // trust penalty.
      lastModified: new Date(a.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [url(a.heroImage.src)],
    }))

  const authorEntries: MetadataRoute.Sitemap = authors.map((a) => ({
    url: url(a.permalink),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.4,
  }))

  // Thin tag archives are noindexed, so they do not belong in the sitemap.
  const tagEntries: MetadataRoute.Sitemap = getAllTags()
    .filter(({ tag }) => getArticlesByTag(tag).length >= THIN_TAG_THRESHOLD)
    .map(({ tag }) => ({
      url: url(`/tags/${tag}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.3,
    }))

  const pageEntries: MetadataRoute.Sitemap = pages
    .filter((p) => !p.seo.noindex)
    .map((p) => ({
      url: url(p.permalink),
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'yearly',
      priority: 0.5,
    }))

  return [
    ...home,
    ...categoryEntries,
    ...articleEntries,
    ...authorEntries,
    ...tagEntries,
    ...pageEntries,
  ]
}
