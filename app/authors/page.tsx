import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/article/ArticleExtras'
import { SectionHeading } from '@/components/home/SectionHeading'
import { editorialStaff, medicalReviewers, type Author } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Our team',
  description:
    'The writers, editors and clinicians behind The Baby Insider — who they are, what they cover, and what qualifies them to cover it.',
  alternates: { canonical: '/authors' },
}

function PersonCard({ person }: { person: Author }) {
  return (
    <article className="flex gap-4">
      {person.avatar && (
        <Image
          src={person.avatar.src}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="text-ink font-sans text-base font-bold">
          <Link href={person.permalink} className="hover:text-accent">
            {person.name}
            {person.credentials && <span className="text-ink-muted">, {person.credentials}</span>}
          </Link>
        </h3>
        <p className="text-ink-muted mt-0.5 text-[0.8rem]">{person.title}</p>
        <p className="text-ink-muted mt-2 text-[0.85rem] leading-relaxed">{person.shortBio}</p>
      </div>
    </article>
  )
}

export default function AuthorsPage() {
  return (
    <Container width="wide" className="pt-6 pb-4">
      <Breadcrumbs trail={[{ name: 'Home', url: '/' }, { name: 'Our team' }]} />

      <header className="border-rule mt-5 border-b pb-7">
        <h1 className="text-ink font-sans text-[1.9rem] font-extrabold uppercase sm:text-[2.3rem]">
          Our team
        </h1>
        <p className="text-ink-muted mt-3 max-w-[46rem] text-[0.95rem] leading-relaxed">
          Everything we publish carries a named author. Anything clinical also carries a named
          reviewer. If you cannot tell who wrote something and who checked it, that is a problem
          with the page, and we would like to hear about it.
        </p>
      </header>

      <section className="mt-12">
        <SectionHeading title="Editorial" />
        <div className="mt-7 grid gap-8 sm:grid-cols-2">
          {editorialStaff.map((p) => (
            <PersonCard key={p.slug} person={p} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading title="Medical review team" />
        <p className="text-ink-muted mt-4 max-w-[46rem] text-[0.88rem] leading-relaxed">
          Licensed clinicians who check our clinical content for accuracy and safety before it
          publishes. They are paid for review work and hold no financial interest in any product we
          cover.
        </p>
        <div className="mt-7 grid gap-8 sm:grid-cols-2">
          {medicalReviewers.map((p) => (
            <PersonCard key={p.slug} person={p} />
          ))}
        </div>
      </section>
    </Container>
  )
}
