import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { medicalReviewers, getArticlesReviewedBy, absoluteUrl } from '@/lib/content'
import { personNode, breadcrumbNode } from '@/lib/schema'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'Medical Review Team',
  description:
    'The licensed clinicians who review clinical content on The Baby Insider for accuracy and safety before it is published.',
  alternates: { canonical: '/medical-review-team' },
}

export default function MedicalReviewTeamPage() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': absoluteUrl('/medical-review-team#webpage'),
        url: absoluteUrl('/medical-review-team'),
        name: 'Medical Review Team',
      },
      breadcrumbNode([
        { name: 'Home', url: '/' },
        { name: 'Medical Review Team', url: '/medical-review-team' },
      ]),
      ...medicalReviewers.map(personNode),
    ],
  }

  return (
    <>
      <JsonLd data={graph} />

      <Container width="wide" className="pt-6">
        <Breadcrumbs trail={[{ name: 'Home', url: '/' }, { name: 'Medical Review Team' }]} />
      </Container>

      <Container className="mt-5">
        <header className="border-rule border-b pb-7">
          <h1 className="text-ink font-sans text-[1.75rem] font-extrabold uppercase sm:text-[2.1rem]">
            Medical Review Team
          </h1>
          <p className="text-ink-muted mt-4 text-[0.98rem] leading-relaxed">
            Anything on {siteConfig.name} that touches symptoms, safety, medication, feeding or
            developmental concern is reviewed by a licensed clinician before it publishes. Reviewed
            articles carry the reviewer&rsquo;s name and the date of review.
          </p>
          <p className="text-ink-muted mt-4 text-[0.9rem] leading-relaxed">
            Medical review checks clinical accuracy and safety. It is{' '}
            <strong className="text-ink font-bold">not an endorsement</strong> of any product
            mentioned. Reviewers are paid for review work and hold no financial interest in the
            products we cover — including our own. See our{' '}
            <Link href="/editorial-process" className="underline underline-offset-2">
              editorial process
            </Link>{' '}
            for how review fits into publication.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {medicalReviewers.map((r) => {
            const reviewed = getArticlesReviewedBy(r.slug)
            return (
              <article key={r.slug} className="flex flex-col gap-5 sm:flex-row">
                {r.avatar && (
                  <Image
                    src={r.avatar.src}
                    alt=""
                    width={88}
                    height={88}
                    className="h-22 w-22 shrink-0 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-ink font-sans text-xl font-bold">
                    <Link href={r.permalink} className="hover:text-accent">
                      {r.name}
                      {r.credentials && <span className="text-ink-muted">, {r.credentials}</span>}
                    </Link>
                  </h2>
                  <p className="text-ink-muted mt-1 text-[0.88rem]">{r.title}</p>
                  <p className="text-ink-muted mt-3 text-[0.92rem] leading-relaxed">{r.shortBio}</p>
                  {r.expertise.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {r.expertise.map((e) => (
                        <li
                          key={e}
                          className="border-rule text-ink-muted border px-2.5 py-1 text-[0.72rem]"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-ink-faint mt-3 text-[0.8rem]">
                    {reviewed.length} article{reviewed.length === 1 ? '' : 's'} reviewed
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </>
  )
}
