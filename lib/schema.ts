import type { Article, Author, Category } from '@/lib/content'
import { getAuthor, getCategory, absoluteUrl, isCurrentlyNewsworthy } from '@/lib/content'
import { siteConfig } from '@/data/siteConfig'

/**
 * JSON-LD builders.
 *
 * Everything is emitted as a single `@graph` per page with `@id`
 * cross-references rather than several sibling <script> tags. Google resolves
 * entities more reliably that way, and it keeps Organization/WebSite defined
 * once instead of duplicated into every node.
 */

const ORG_ID = `${siteConfig.url}/#organization`
const SITE_ID = `${siteConfig.url}/#website`

type Node = Record<string, unknown>

export function organizationNode(): Node {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon.png'),
    },
    sameAs: Object.values(siteConfig.social),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: siteConfig.editorialEmail,
    },
    // Stated explicitly so the ownership relationship is machine-readable,
    // not just prose in the footer.
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.ownership.parentName,
      url: siteConfig.ownership.productUrl,
    },
  }
}

export function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function personNode(author: Author): Node {
  return {
    '@type': 'Person',
    '@id': absoluteUrl(`${author.permalink}#person`),
    name: author.credentials ? `${author.name}, ${author.credentials}` : author.name,
    url: absoluteUrl(author.permalink),
    jobTitle: author.title,
    description: author.shortBio,
    knowsAbout: author.expertise,
    ...(author.avatar ? { image: absoluteUrl(author.avatar.src) } : {}),
    ...(author.education.length
      ? { alumniOf: author.education.map((e) => ({ '@type': 'EducationalOrganization', name: e })) }
      : {}),
    ...(author.credentials
      ? {
          hasCredential: {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: author.credentials,
          },
        }
      : {}),
    ...(author.sameAs.length ? { sameAs: author.sameAs } : {}),
    worksFor: { '@id': ORG_ID },
  }
}

export function breadcrumbNode(trail: { name: string; url: string }[]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

export function itemListNode(articles: Article[], name: string): Node {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(a.permalink),
      name: a.title,
    })),
  }
}

function faqNode(article: Article): Node | null {
  if (!article.faq.length) return null
  return {
    '@type': 'FAQPage',
    '@id': absoluteUrl(`${article.permalink}#faq`),
    mainEntity: article.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function productNodes(article: Article): Node | null {
  if (!article.products.length) return null

  const ordered = [...article.products].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))

  return {
    '@type': 'ItemList',
    '@id': absoluteUrl(`${article.permalink}#products`),
    name: article.title,
    numberOfItems: ordered.length,
    itemListElement: ordered.map((p, i) => ({
      '@type': 'ListItem',
      position: p.rank ?? i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        ...(p.image ? { image: absoluteUrl(p.image.src) } : {}),
        ...(p.summary ? { description: p.summary } : {}),
        ...(p.price != null
          ? {
              offers: {
                '@type': 'Offer',
                price: p.price,
                priceCurrency: p.currency,
                ...(p.url ? { url: p.url } : {}),
                availability: 'https://schema.org/InStock',
              },
            }
          : {}),
        ...(p.rating != null
          ? {
              review: {
                '@type': 'Review',
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: p.rating,
                  bestRating: 5,
                  worstRating: 0,
                },
                author: { '@id': ORG_ID },
              },
            }
          : {}),
      },
    })),
  }
}

export function articleNode(article: Article): Node {
  const author = getAuthor(article.author)
  const reviewer = article.medicalReviewer ? getAuthor(article.medicalReviewer) : undefined
  const category = getCategory(article.category)

  // NewsArticle is reserved for genuinely timely reporting. Applying it to
  // evergreen guides misrepresents the content type.
  const type = isCurrentlyNewsworthy(article) ? 'NewsArticle' : 'Article'

  return {
    '@type': type,
    '@id': absoluteUrl(`${article.permalink}#article`),
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: absoluteUrl(article.permalink),
    url: absoluteUrl(article.permalink),
    // Google truncates beyond ~110 characters.
    headline: article.title.slice(0, 110),
    description: article.seo.description ?? article.summary,
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    image: [absoluteUrl(article.heroImage.src)],
    ...(author ? { author: personNode(author) } : {}),
    // The strongest E-E-A-T signal available for health-adjacent content.
    ...(reviewer ? { reviewedBy: personNode(reviewer) } : {}),
    publisher: { '@id': ORG_ID },
    ...(category ? { articleSection: category.name } : {}),
    ...(article.tags.length ? { keywords: article.tags.join(', ') } : {}),
    wordCount: article.wordCount,
    inLanguage: siteConfig.language,
    isAccessibleForFree: true,
    ...(article.sources.length
      ? {
          citation: article.sources.map((s) => ({
            '@type': 'CreativeWork',
            name: s.title,
            url: s.url,
            ...(s.publisher ? { publisher: { '@type': 'Organization', name: s.publisher } } : {}),
          })),
        }
      : {}),
  }
}

/* ------------------------------------------------------------- page graphs */

const graph = (nodes: (Node | null)[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter((n): n is Node => n != null),
})

/**
 * Emitted once from the root layout. Every page-level graph below therefore
 * references `#organization` and `#website` by @id rather than redefining them.
 */
export const rootGraph = () => graph([organizationNode(), websiteNode()])

export const homeGraph = (featured: Article[]) =>
  graph([
    {
      '@type': 'CollectionPage',
      '@id': `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: siteConfig.name,
      isPartOf: { '@id': SITE_ID },
      about: { '@id': ORG_ID },
    },
    itemListNode(featured, 'Featured articles'),
  ])

export const articleGraph = (article: Article) =>
  graph([
    articleNode(article),
    breadcrumbNode([
      { name: 'Home', url: '/' },
      {
        name: getCategory(article.category)?.name ?? article.category,
        url: `/${article.category}`,
      },
      { name: article.title, url: article.permalink },
    ]),
    faqNode(article),
    productNodes(article),
  ])

export const categoryGraph = (category: Category, articles: Article[]) =>
  graph([
    {
      '@type': 'CollectionPage',
      '@id': absoluteUrl(`/${category.slug}#webpage`),
      url: absoluteUrl(`/${category.slug}`),
      name: category.name,
      description: category.description,
      isPartOf: { '@id': SITE_ID },
    },
    breadcrumbNode([
      { name: 'Home', url: '/' },
      { name: category.name, url: `/${category.slug}` },
    ]),
    itemListNode(articles, `${category.name} articles`),
  ])

export const authorGraph = (author: Author, articles: Article[]) =>
  graph([
    {
      '@type': 'ProfilePage',
      '@id': absoluteUrl(`${author.permalink}#webpage`),
      url: absoluteUrl(author.permalink),
      name: author.name,
      isPartOf: { '@id': SITE_ID },
      mainEntity: { '@id': absoluteUrl(`${author.permalink}#person`) },
    },
    personNode(author),
    breadcrumbNode([
      { name: 'Home', url: '/' },
      { name: 'Authors', url: '/authors' },
      { name: author.name, url: author.permalink },
    ]),
    itemListNode(articles, `Articles by ${author.name}`),
  ])

export const pageGraph = (title: string, path: string, updatedAt: string) =>
  graph([
    {
      '@type': 'WebPage',
      '@id': absoluteUrl(`${path}#webpage`),
      url: absoluteUrl(path),
      name: title,
      isPartOf: { '@id': SITE_ID },
      dateModified: new Date(updatedAt).toISOString(),
      publisher: { '@id': ORG_ID },
    },
    breadcrumbNode([
      { name: 'Home', url: '/' },
      { name: title, url: path },
    ]),
  ])
