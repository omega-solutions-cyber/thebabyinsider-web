import { articles } from '@/lib/content'
import { buildFeed, feedHeaders } from '@/lib/feed'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildFeed(articles).rss2(), { headers: feedHeaders })
}
