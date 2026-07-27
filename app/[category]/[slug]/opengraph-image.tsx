import { getArticle, getCategory } from '@/lib/content'
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

// Re-exported so every article's OG image is generated at build time and
// served as a static asset, rather than rendered per request.
export { generateStaticParams } from './page'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Article preview'

export default async function OgImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  const category = article ? getCategory(article.category) : undefined

  return renderOgImage({
    title: article?.title ?? 'The Baby Insider',
    eyebrow: category?.name,
    accent: category?.color,
    footnote: article?.medicalReviewer ? 'Medically reviewed' : undefined,
  })
}
