import { getCategory } from '@/lib/content'
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export { generateStaticParams } from './page'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Category preview'

export default async function OgImage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = getCategory(category)

  return renderOgImage({
    title: cat?.tagline ?? 'The Baby Insider',
    eyebrow: cat?.name,
    accent: cat?.color,
  })
}
