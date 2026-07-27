import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { rehypeOutboundLinks } from './lib/rehype/outbound-links'

/* --------------------------------------------------------------------------
 * Guards
 * ------------------------------------------------------------------------ */

/** Top-level app routes a category slug must never shadow. */
const RESERVED_SEGMENTS = [
  'about',
  'contact',
  'authors',
  'tags',
  'search',
  'api',
  'legal',
  'static',
  '_next',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  'editorial-process',
  'medical-review-team',
  'how-we-evaluate',
  'advertising-disclosure',
  'page',
]

const ARTICLE_TYPES = ['article', 'news', 'review', 'roundup', 'guide', 'comparison'] as const

const NEW_BADGE_DAYS = 14

/* --------------------------------------------------------------------------
 * Shared field builders
 * ------------------------------------------------------------------------ */

const seo = s
  .object({
    title: s.string().max(70).optional(),
    description: s.string().max(180).optional(),
    canonical: s.string().url().optional(),
    noindex: s.boolean().default(false),
  })
  .default({ noindex: false })

const source = s.object({
  title: s.string(),
  url: s.string().url(),
  publisher: s.string().optional(),
  accessed: s.isodate().optional(),
})

const faqItem = s.object({
  q: s.string(),
  a: s.string(),
})

const product = s.object({
  name: s.string(),
  rank: s.number().optional(),
  award: s.string().optional(),
  price: s.number().optional(),
  currency: s.string().default('USD'),
  url: s.string().url().optional(),
  image: s.image().optional(),
  rating: s.number().min(0).max(5).optional(),
  summary: s.string().optional(),
  pros: s.array(s.string()).default([]),
  cons: s.array(s.string()).default([]),
})

/* --------------------------------------------------------------------------
 * Collections
 * ------------------------------------------------------------------------ */

const categories = defineCollection({
  name: 'Category',
  pattern: 'categories/**/*.yml',
  schema: s.object({
    slug: s.slug('categories', RESERVED_SEGMENTS),
    name: s.string(),
    order: s.number().default(99),
    color: s.string().regex(/^#[0-9A-Fa-f]{6}$/),
    colorVar: s.string(),
    tagline: s.string(),
    description: s.string(),
    seo: seo,
  }),
})

const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/**/*.mdx',
  schema: s
    .object({
      slug: s.slug('authors'),
      name: s.string(),
      role: s.enum(['writer', 'editor', 'medical-reviewer']),
      /** Post-nominals rendered after the name, e.g. "MD, FAAP". */
      credentials: s.string().optional(),
      /** Job title, e.g. "Board-certified paediatrician". */
      title: s.string(),
      avatar: s.image().optional(),
      /** Short one-liner for bylines and cards. */
      shortBio: s.string(),
      bio: s.mdx(),
      expertise: s.array(s.string()).default([]),
      education: s.array(s.string()).default([]),
      /** Entity-disambiguation signals for Person JSON-LD. */
      sameAs: s.array(s.string().url()).default([]),
      email: s.string().email().optional(),
      joinedAt: s.isodate().optional(),
      seo: seo,
    })
    .transform((data) => ({
      ...data,
      permalink: `/authors/${data.slug}`,
    })),
})

/** Static pages (about, editorial process, legal…) authored as MDX. */
const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s
    .object({
      /** Full route path, e.g. "about" or "legal/terms". */
      path: s.string(),
      title: s.string(),
      summary: s.string(),
      updatedAt: s.isodate(),
      body: s.mdx(),
      toc: s.toc(),
      seo: seo,
    })
    .transform((data) => ({
      ...data,
      permalink: `/${data.path.replace(/^\//, '')}`,
    })),
})

const articles = defineCollection({
  name: 'Article',
  pattern: 'articles/**/*.mdx',
  schema: s
    .object({
      // ── identity ──────────────────────────────────────────────────────
      title: s.string().max(120),
      slug: s.slug('articles', RESERVED_SEGMENTS),
      category: s.string(),
      tags: s.array(s.string()).default([]),

      // ── dates ─────────────────────────────────────────────────────────
      publishedAt: s.isodate(),
      updatedAt: s.isodate().optional(),

      // ── people (E-E-A-T) ──────────────────────────────────────────────
      author: s.string(),
      contributors: s.array(s.string()).default([]),
      medicalReviewer: s.string().optional(),
      medicallyReviewedAt: s.isodate().optional(),

      // ── summary / SEO ─────────────────────────────────────────────────
      summary: s.string().max(300),
      seo: seo,

      // ── imagery ───────────────────────────────────────────────────────
      heroImage: s.image(),
      heroImageAlt: s.string(),
      heroImageCredit: s.string().optional(),
      cardImage: s.image().optional(),

      // ── merchandising ─────────────────────────────────────────────────
      featured: s.boolean().default(false),
      heroSlot: s.number().min(1).max(3).optional(),
      pinnedInCategory: s.boolean().default(false),
      priority: s.number().default(0),

      // ── type → drives JSON-LD selection ───────────────────────────────
      type: s.enum(ARTICLE_TYPES).default('article'),
      newsworthyUntil: s.isodate().optional(),

      // ── disclosure / compliance ───────────────────────────────────────
      affiliate: s.boolean().default(false),
      ownershipDisclosure: s.boolean().default(false),
      sponsored: s.boolean().default(false),
      disclosureNote: s.string().optional(),

      // ── structured data extras ────────────────────────────────────────
      faq: s.array(faqItem).default([]),
      products: s.array(product).default([]),
      sources: s.array(source).default([]),

      // ── routing ───────────────────────────────────────────────────────
      redirectFrom: s.array(s.string()).default([]),
      /** Manual override; otherwise computed in prepare(). */
      related: s.array(s.string()).default([]),

      draft: s.boolean().default(false),

      // ── compiled ──────────────────────────────────────────────────────
      body: s.mdx(),
      raw: s.raw(),
      toc: s.toc(),
      metadata: s.metadata(),
    })
    .transform((data) => {
      const updated = data.updatedAt ?? data.publishedAt
      const ageDays = (Date.now() - new Date(data.publishedAt).getTime()) / 86_400_000

      return {
        ...data,
        updatedAt: updated,
        permalink: `/${data.category}/${data.slug}`,
        isNew: ageDays <= NEW_BADGE_DAYS,
        readingTime: data.metadata.readingTime,
        wordCount: data.metadata.wordCount,
      }
    }),
})

/* --------------------------------------------------------------------------
 * Config
 * ------------------------------------------------------------------------ */

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  collections: { articles, authors, categories, pages },

  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-anchor' } }],
      rehypeOutboundLinks,
    ],
  },

  /**
   * Everything cross-document happens here: validation that a single file
   * cannot do on its own, merchandising slot assignment, the related-article
   * graph, and the two generated artefacts (search index, redirect map).
   */
  prepare: async ({ articles, authors, categories, pages }) => {
    const isProd = process.env.NODE_ENV === 'production'
    const errors: string[] = []
    const warnings: string[] = []

    // Drafts never reach a production build.
    if (isProd) {
      const kept = articles.filter((a) => !a.draft)
      articles.splice(0, articles.length, ...kept)
    }

    const categorySlugs = new Set(categories.map((c) => c.slug))
    const authorSlugs = new Set(authors.map((a) => a.slug))
    const articleSlugs = new Set(articles.map((a) => a.slug))

    // ── referential integrity ────────────────────────────────────────────
    for (const a of articles) {
      if (!categorySlugs.has(a.category)) {
        errors.push(`${a.slug}: unknown category "${a.category}"`)
      }
      if (!authorSlugs.has(a.author)) {
        errors.push(`${a.slug}: unknown author "${a.author}"`)
      }
      if (a.medicalReviewer && !authorSlugs.has(a.medicalReviewer)) {
        errors.push(`${a.slug}: unknown medicalReviewer "${a.medicalReviewer}"`)
      }
      for (const c of a.contributors) {
        if (!authorSlugs.has(c)) errors.push(`${a.slug}: unknown contributor "${c}"`)
      }

      // Any article that names our own product must disclose it. Caught at
      // build time rather than in review.
      const mentionsOwnProduct = /babyleap/i.test(a.raw)
      if (mentionsOwnProduct && !a.ownershipDisclosure) {
        errors.push(
          `${a.slug}: mentions BabyLeap but ownershipDisclosure is false. ` +
            `Set it to true — coverage of our own product must be disclosed.`
        )
      }

      // <InlineArticleLink slug="..."> must point at something real.
      for (const m of a.raw.matchAll(/<InlineArticleLink[^>]*slug=["']([^"']+)["']/g)) {
        const target = m[1]
        if (target && !articleSlugs.has(target)) {
          errors.push(`${a.slug}: InlineArticleLink → unknown article "${target}"`)
        }
      }

      // A roundup with no products, or a review article with an empty rating
      // set, is almost always an authoring mistake.
      if ((a.type === 'roundup' || a.type === 'comparison') && a.products.length === 0) {
        warnings.push(`${a.slug}: type "${a.type}" but no products[] — no ItemList schema emitted`)
      }
    }

    // ── merchandising slots ──────────────────────────────────────────────
    const heroSlots = articles.filter((a) => a.heroSlot != null)
    const seenSlots = new Map<number, string>()
    for (const a of heroSlots) {
      const existing = seenSlots.get(a.heroSlot!)
      if (existing) {
        errors.push(`heroSlot ${a.heroSlot} claimed by both "${existing}" and "${a.slug}"`)
      } else {
        seenSlots.set(a.heroSlot!, a.slug)
      }
    }
    for (const slot of [1, 2, 3]) {
      if (!seenSlots.has(slot)) warnings.push(`hero mosaic slot ${slot} is unfilled`)
    }
    if (articles.filter((a) => a.featured).length < 4) {
      warnings.push('fewer than 4 featured articles — the TOP ARTICLES row will be short')
    }

    // ── related-article graph ────────────────────────────────────────────
    // Score by shared tags, then same category. Manual `related` wins.
    const byNewest = [...articles].sort(
      (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
    )

    for (const a of articles) {
      if (a.related.length > 0) {
        for (const r of a.related) {
          if (!articleSlugs.has(r)) errors.push(`${a.slug}: related → unknown article "${r}"`)
        }
        continue
      }

      const tagSet = new Set(a.tags)
      const scored = byNewest
        .filter((b) => b.slug !== a.slug)
        .map((b) => ({
          slug: b.slug,
          score:
            b.tags.filter((t) => tagSet.has(t)).length * 2 + (b.category === a.category ? 1 : 0),
        }))
        .filter((b) => b.score > 0)
        .sort((x, y) => y.score - x.score)

      a.related = scored.slice(0, 3).map((s) => s.slug)
    }

    // ── orphan check ─────────────────────────────────────────────────────
    const linkedTo = new Set<string>()
    for (const a of articles) {
      for (const m of a.raw.matchAll(/<InlineArticleLink[^>]*slug=["']([^"']+)["']/g)) {
        if (m[1]) linkedTo.add(m[1])
      }
      for (const r of a.related) linkedTo.add(r)
    }
    for (const a of articles) {
      if (!linkedTo.has(a.slug)) {
        warnings.push(`${a.slug}: no inbound internal links — consider linking to it`)
      }
    }

    // ── page path collisions ─────────────────────────────────────────────
    const pagePaths = new Set<string>()
    for (const p of pages) {
      const clean = p.path.replace(/^\//, '')
      if (pagePaths.has(clean)) errors.push(`duplicate page path "${clean}"`)
      pagePaths.add(clean)
      const first = clean.split('/')[0]!
      if (categorySlugs.has(first)) {
        errors.push(`page "${clean}" collides with category route "/${first}"`)
      }
    }

    // ── generated artefacts ──────────────────────────────────────────────
    const write = async (rel: string, contents: string) => {
      const abs = resolve(process.cwd(), rel)
      await mkdir(dirname(abs), { recursive: true })
      await writeFile(abs, contents)
    }

    const redirects = articles.flatMap((a) =>
      a.redirectFrom.map((from) => ({
        source: from.startsWith('/') ? from : `/${from}`,
        destination: a.permalink,
      }))
    )
    await write('data/redirects.generated.json', JSON.stringify(redirects, null, 2) + '\n')

    const categoryNames = new Map(categories.map((c) => [c.slug, c.name]))
    const searchIndex = articles.map((a) => ({
      id: a.slug,
      title: a.title,
      summary: a.summary,
      category: a.category,
      categoryName: categoryNames.get(a.category) ?? a.category,
      tags: a.tags,
      permalink: a.permalink,
      image: (a.cardImage ?? a.heroImage).src,
      updatedAt: a.updatedAt,
      // Strip MDX/JSX/markdown syntax so search matches prose, not markup.
      body: a.raw
        .replace(/^---[\s\S]*?---/, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[#*_`>[\]()|]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1500),
    }))
    await write('public/search-index.json', JSON.stringify(searchIndex))

    // ── report ───────────────────────────────────────────────────────────
    for (const w of warnings) console.warn(`\x1b[33m[content] ${w}\x1b[0m`)
    if (errors.length) {
      for (const e of errors) console.error(`\x1b[31m[content] ${e}\x1b[0m`)
      throw new Error(`${errors.length} content error(s) — see above.`)
    }
  },
})
