import { articles } from '@/lib/content'
import { buildFeed } from '@/lib/feed'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildFeed(articles).json1(), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
