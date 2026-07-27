import type { Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { getAllTags, THIN_TAG_THRESHOLD } from '@/lib/content'

export const metadata: Metadata = {
  title: 'All topics',
  description: 'Browse every topic covered on The Baby Insider.',
  alternates: { canonical: '/tags' },
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <Container width="wide" className="pt-6 pb-4">
      <Breadcrumbs trail={[{ name: 'Home', url: '/' }, { name: 'Topics' }]} />

      <header className="border-rule mt-5 border-b pb-7">
        <h1 className="text-ink font-serif text-[2.1rem] font-semibold sm:text-[2.5rem]">Topics</h1>
        <p className="text-ink-muted mt-3 text-[0.95rem]">
          {tags.length} topics across {new Set(tags.map((t) => t.tag)).size} articles.
        </p>
      </header>

      <ul className="mt-9 flex flex-wrap gap-2.5">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link
              href={`/tags/${tag}`}
              className="border-rule text-ink hover:border-ink inline-flex items-baseline gap-1.5 border px-3.5 py-2 text-[0.85rem] transition-colors"
              // Very thin archives stay crawlable but are kept out of the index.
              rel={count < THIN_TAG_THRESHOLD ? 'nofollow' : undefined}
            >
              {tag}
              <span className="text-ink-faint text-[0.72rem]">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
