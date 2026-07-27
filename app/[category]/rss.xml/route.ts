import { categories, getCategory, getArticlesByCategory } from '@/lib/content'
import { buildFeed, feedHeaders } from '@/lib/feed'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return new Response('Not found', { status: 404 })

  const feed = buildFeed(getArticlesByCategory(cat.slug), { name: cat.name, slug: cat.slug })
  return new Response(feed.rss2(), { headers: feedHeaders })
}
