import {
  articles as allArticles,
  authors as allAuthors,
  categories as allCategories,
  pages as allPages,
  type Article,
  type Author,
  type Category,
  type Page,
} from '#site/content'
import { siteConfig } from '@/data/siteConfig'

export type { Article, Author, Category, Page }

/* --------------------------------------------------------------------------
 * Base sets
 * ------------------------------------------------------------------------ */

/** Drafts are stripped from production builds in velite's prepare(). */
export const articles: Article[] = [...allArticles].sort(
  (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
)

export const categories: Category[] = [...allCategories].sort((a, b) => a.order - b.order)

export const authors: Author[] = [...allAuthors]

export const pages: Page[] = [...allPages]

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
const authorBySlug = new Map(authors.map((a) => [a.slug, a]))
const articleBySlug = new Map(articles.map((a) => [a.slug, a]))

/* --------------------------------------------------------------------------
 * Lookups
 * ------------------------------------------------------------------------ */

export const getCategory = (slug: string) => categoryBySlug.get(slug)
export const getAuthor = (slug: string) => authorBySlug.get(slug)
export const getArticle = (slug: string) => articleBySlug.get(slug)
export const getPage = (path: string) => pages.find((p) => p.path.replace(/^\//, '') === path)

/** Only clinicians, for the medical review team page. */
export const medicalReviewers = authors.filter((a) => a.role === 'medical-reviewer')

/** Writers and editors, for the masthead. */
export const editorialStaff = authors.filter((a) => a.role !== 'medical-reviewer')

/* --------------------------------------------------------------------------
 * Article queries
 * ------------------------------------------------------------------------ */

/** Pinned articles float to the top, then `priority`, then recency. */
function rank(a: Article, b: Article): number {
  if (a.pinnedInCategory !== b.pinnedInCategory) return a.pinnedInCategory ? -1 : 1
  if (a.priority !== b.priority) return b.priority - a.priority
  return +new Date(b.publishedAt) - +new Date(a.publishedAt)
}

export function getArticlesByCategory(slug: string): Article[] {
  return articles.filter((a) => a.category === slug).sort(rank)
}

export function getArticlesByAuthor(slug: string): Article[] {
  return articles.filter((a) => a.author === slug || a.contributors.includes(slug))
}

/** Articles a clinician has signed off on — shown on reviewer profiles. */
export function getArticlesReviewedBy(slug: string): Article[] {
  return articles.filter((a) => a.medicalReviewer === slug)
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter((a) => a.tags.includes(tag))
}

/** The three-panel mosaic, in slot order. Falls back to newest if unfilled. */
export function getHeroArticles(): Article[] {
  const slotted = [1, 2, 3]
    .map((slot) => articles.find((a) => a.heroSlot === slot))
    .filter((a): a is Article => a != null)

  if (slotted.length === 3) return slotted

  const used = new Set(slotted.map((a) => a.slug))
  const fill = articles.filter((a) => !used.has(a.slug)).slice(0, 3 - slotted.length)
  return [...slotted, ...fill]
}

/** The TOP ARTICLES row. */
export function getFeatured(limit = 4): Article[] {
  const heroSlugs = new Set(getHeroArticles().map((a) => a.slug))
  const featured = articles.filter((a) => a.featured && !heroSlugs.has(a.slug))
  if (featured.length >= limit) return featured.slice(0, limit)

  // Top up with the newest non-hero articles rather than rendering a short row.
  const used = new Set([...heroSlugs, ...featured.map((a) => a.slug)])
  return [...featured, ...articles.filter((a) => !used.has(a.slug))].slice(0, limit)
}

export function getRelated(article: Article, limit = 3): Article[] {
  return article.related
    .map((slug) => articleBySlug.get(slug))
    .filter((a): a is Article => a != null)
    .slice(0, limit)
}

/** Every tag with a count, most-used first. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const a of articles) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/**
 * Tag archives with almost nothing on them are thin content. We keep them
 * crawlable for link flow but out of the index.
 */
export const THIN_TAG_THRESHOLD = 3

/* --------------------------------------------------------------------------
 * Derived display helpers
 * ------------------------------------------------------------------------ */

export const paginate = <T>(items: T[], page: number, perPage = siteConfig.pageSize) => ({
  items: items.slice((page - 1) * perPage, page * perPage),
  page,
  totalPages: Math.max(1, Math.ceil(items.length / perPage)),
  total: items.length,
})

/**
 * `NewsArticle` is only appropriate while a news piece is actually timely.
 * Applying it to evergreen guides misrepresents the content type.
 */
export function isCurrentlyNewsworthy(article: Article): boolean {
  if (article.type !== 'news') return false
  if (!article.newsworthyUntil) return false
  return new Date(article.newsworthyUntil).getTime() > Date.now()
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString()
