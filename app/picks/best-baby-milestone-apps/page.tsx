import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Container } from '@/components/layout/Container'
import { StickyCtaBar } from '@/components/layout/StickyCtaBar'
import { FAQ } from '@/components/mdx/blocks'
import { DisclosureDialog } from '@/components/disclosure/DisclosureDialog'
import { siteConfig } from '@/data/siteConfig'
import { getArticle } from '@/lib/content'
import { cn } from '@/lib/cn'

/**
 * "listicle" arm of the A/B test on /gear/best-baby-milestone-apps (the control,
 * left untouched). proxy.ts rewrites to this page, so visitors keep the ad URL;
 * see data/experiment.ts for the split.
 *
 * Product names, prices, pros and cons come from the control article's
 * frontmatter, so both arms always show the same facts. Ranking is by the five
 * criteria below, not by ratings.
 */

const CONTROL_SLUG = 'best-baby-milestone-apps'

export const metadata: Metadata = {
  title: 'Best Baby Milestone Apps of 2026: Our Picks',
  description:
    'What to look for in a baby development app, how the popular options compare, and our top pick for 2026.',
  // Served at the control's URL via rewrite; Google's A/B guidance is a canonical to the original.
  alternates: { canonical: `/gear/${CONTROL_SLUG}` },
}

type Cell = 'yes' | 'partial' | 'no' | 'na'

const CRITERIA = [
  {
    title: 'Milestones shown as ranges, not dates',
    body: 'Healthy development covers wide windows. An app that prints a single week turns a normal range into a deadline. Look for "most babies do this between X and Y", matched to the windows the AAP and CDC publish.',
  },
  {
    title: 'A weekly plan you can act on',
    body: 'Knowing your baby is "developing rapidly" helps no one. A good app names the skill your baby is working on and suggests a concrete activity for it, across physical, cognitive, language and social development.',
  },
  {
    title: 'Sleep, feeds and nappies in the same app',
    body: 'Reconciling two apps at 3am is nobody’s idea of fun. Logging feeds, sleep, nappies, growth, vaccinations and doctor visits next to development gives you one record to bring to check-ups.',
  },
  {
    title: 'Coverage past the baby months',
    body: 'Many apps tail off after the first year or two. One that runs from birth to age six keeps your history in one place as your child grows.',
  },
  {
    title: 'Clinically reviewed guidance',
    body: 'Every app asks you to trust it about your baby. Prefer one that says its developmental guidance is clinically reviewed rather than leaving the source unnamed.',
  },
]

/** Cells per CRITERIA index. Competitor cells restate the control article; 'na' = not assessed. */
const COMPARISON: { name: string; blurb: string; cells: Cell[] }[] = [
  {
    name: 'BabyLeap',
    blurb: 'Weekly plan, ranges and full logging, birth to 6',
    cells: ['yes', 'yes', 'yes', 'yes', 'yes'],
  },
  {
    name: 'Huckleberry',
    blurb: 'Sleep-first logger',
    cells: ['no', 'no', 'partial', 'na', 'na'],
  },
  {
    name: 'The Wonder Weeks',
    blurb: 'Leap calendar, one-off purchase',
    cells: ['no', 'partial', 'no', 'no', 'no'],
  },
  {
    name: 'Kinedu',
    blurb: 'Video activity library',
    cells: ['no', 'yes', 'no', 'yes', 'na'],
  },
  {
    name: 'CDC Milestone Tracker',
    blurb: 'Free checklists by check-up age',
    cells: ['partial', 'partial', 'no', 'partial', 'yes'],
  },
]

const CDC_CARD = {
  name: 'CDC Milestone Tracker',
  summary:
    'A free app from the CDC with milestone checklists for each check-up age. A sound reference, though it is a checklist rather than a plan, and it does not log sleep or feeds.',
  pros: ['Free', 'Checklists come straight from the CDC'],
  cons: ['No sleep, feed or nappy logging', 'Organised by check-up age rather than week by week'],
}

const TIMELINE = [
  {
    when: 'Day 1',
    title: 'A plan matched to your baby',
    body: 'Answer a few questions about your baby, and BabyLeap builds a weekly plan for their age, with milestones shown as ranges.',
  },
  {
    when: 'Week 1',
    title: 'Short daily activities',
    body: 'Each day suggests activities tied to the skill your baby is working on. Start logging sleep, feeds and nappies alongside.',
  },
  {
    when: 'Weeks 2–3',
    title: 'Patterns start to show',
    body: 'A couple of weeks of logs make sleep and feeding patterns easier to see, and the plan moves on as your baby’s skills develop.',
  },
  {
    when: 'Week 4 and on',
    title: 'One record for check-ups',
    body: 'Growth, vaccinations, symptoms and doctor visits sit in the same profile, so the questions you get asked at appointments are easier to answer.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Can a milestone app tell me if my baby is behind?',
    a: 'No. Milestone apps are records and prompts, not screening tools. Your paediatrician screens development at check-ups using validated instruments. If something feels off, or your baby loses a skill they had, call your paediatrician rather than waiting on an app.',
  },
  {
    q: 'Should I worry if my baby misses a milestone in an app?',
    a: 'Not on its own. Healthy development covers wide ranges, and many apps compress those ranges into single dates. Persistent concerns belong with your paediatrician.',
  },
  {
    q: 'What ages does BabyLeap cover?',
    a: 'Birth to age six, with 749 milestones across physical, cognitive, language and social development, all shown as ranges.',
  },
  {
    q: 'How much does BabyLeap cost?',
    a: 'In the US, BabyLeap costs $14.99 a month or $89.99 a year, with a cheaper Essential plan available in the app. There is currently an introductory discount on the first billing period of every plan, and prices vary by country.',
  },
  {
    q: 'What happens to my baby’s data?',
    a: 'BabyLeap’s privacy policy is readable, permits no sharing with advertisers, and lets you delete your data. Whatever app you choose, check its privacy policy before entering health information about your child.',
  },
]

const points = (cells: Cell[]) =>
  cells.reduce((n, c) => n + (c === 'yes' ? 1 : c === 'partial' ? 0.5 : 0), 0)
const fmtPoints = (n: number) => (n % 1 ? `${Math.floor(n) || ''}½` : String(n))

function CellMark({ value }: { value: Cell }) {
  const map = {
    yes: { icon: '✓', label: 'Yes', cls: 'bg-accent text-white' },
    partial: { icon: '½', label: 'Partly', cls: 'bg-accent-tint text-accent' },
    no: { icon: '✕', label: 'No', cls: 'bg-surface text-ink-faint' },
    na: { icon: '–', label: 'Not assessed', cls: 'text-ink-faint' },
  }[value]
  return (
    <span
      title={map.label}
      className={cn(
        'inline-grid size-6 place-items-center rounded-full text-[0.75rem] font-bold',
        map.cls
      )}
    >
      <span aria-hidden>{map.icon}</span>
      <span className="sr-only">{map.label}</span>
    </span>
  )
}

function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div>
      {eyebrow && (
        <p className="text-accent text-[0.7rem] font-bold tracking-[0.1em] uppercase">{eyebrow}</p>
      )}
      <h2 className="text-ink font-display mt-1.5 text-[1.45rem] leading-tight font-bold sm:text-[1.7rem]">
        {children}
      </h2>
    </div>
  )
}

function CtaButton({ location, className }: { location: string; className?: string }) {
  return (
    <a
      href={siteConfig.ownership.funnelUrl}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      data-cta-location={location}
      className={cn(
        'bg-accent hover:bg-accent-dark rounded-pill block w-full px-7 py-4 text-center text-base font-bold text-white shadow-sm transition-colors sm:inline-block sm:w-auto',
        className
      )}
    >
      Take the free quiz →<span className="sr-only"> (opens in new tab)</span>
    </a>
  )
}

export default function PicksPage() {
  const control = getArticle(CONTROL_SLUG)
  if (!control) throw new Error(`Control article "${CONTROL_SLUG}" is missing`)

  // Rank by criteria met (a partial counts half); ties keep the comparison order.
  const ranked = COMPARISON.map((row) => {
    const p = control.products.find((x) => x.name === row.name)
    return {
      ...row,
      score: points(row.cells),
      award: p?.award,
      summary: p?.summary ?? CDC_CARD.summary,
      pros: p?.pros ?? CDC_CARD.pros,
      // No ratings or scores in this variant (owner decision).
      cons: (p?.cons ?? CDC_CARD.cons).filter((c) => !/rating|score/i.test(c)),
      price: p?.price,
      per: p?.per,
      priceNote: p?.priceNote,
    }
  }).sort((a, b) => b.score - a.score)
  const [top, ...rest] = ranked as [(typeof ranked)[number], ...typeof ranked]
  const updated = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(control.updatedAt))

  return (
    <>
      {control.stickyCta && (
        <>
          <StickyCtaBar text={control.stickyCta.text} button={control.stickyCta.button} />
          {/* Same pre-paint dismiss check as the article page. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `try{sessionStorage.getItem('stickyCta')&&document.getElementById('sticky-cta').setAttribute('hidden','')}catch(e){}`,
            }}
          />
        </>
      )}

      <Container width="prose" className="pt-8">
        {/* 1. Hook */}
        <header>
          <div className="flex items-center justify-between gap-4">
            <p className="text-ink-muted text-[0.75rem] font-semibold tracking-[0.08em] uppercase">
              Updated {updated}
            </p>
            <DisclosureDialog />
          </div>
          <h1 className="text-ink font-display mt-3 text-[1.85rem] leading-[1.12] font-bold sm:text-[2.35rem]">
            6 of the 7 most popular baby milestone apps show milestones as dates, not the ranges
            paediatricians use
          </h1>
          <p className="text-ink-muted mt-4 text-[1.05rem] leading-relaxed">
            A single date reads like a deadline your baby can fail, and that is where most of the
            worry these apps cause comes from. Here is what to look for in a development app, how
            the popular options compare, and our pick for 2026.
          </p>
        </header>

        {/* 2. What to look for */}
        <section className="mt-12">
          <SectionTitle eyebrow="Before you download">
            5 things to look for in a baby development app
          </SectionTitle>
          <ol className="mt-6 space-y-5">
            {CRITERIA.map((c, i) => (
              <li key={c.title} className="flex gap-4">
                <span className="bg-accent font-display grid size-8 shrink-0 place-items-center rounded-full text-[0.95rem] font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-ink text-[1.02rem] font-bold">{c.title}</h3>
                  <p className="text-ink-muted mt-1 text-[0.95rem] leading-relaxed">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      {/* 3. Comparison table */}
      <Container className="mt-14">
        <SectionTitle eyebrow="Our comparison">How the popular options compare</SectionTitle>
        <div className="border-rule rounded-card mt-6 overflow-x-auto border">
          <table className="w-full min-w-[640px] border-collapse text-left text-[0.85rem]">
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="text-ink p-3 font-bold">
                  App
                </th>
                {CRITERIA.map((c, i) => (
                  <th
                    key={c.title}
                    scope="col"
                    className="text-ink-muted p-3 text-center text-[0.72rem] leading-snug font-semibold"
                  >
                    <span className="text-ink block font-bold">#{i + 1}</span>
                    {c.title}
                  </th>
                ))}
                <th scope="col" className="text-ink p-3 text-center font-bold">
                  Criteria met
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row, r) => {
                return (
                  <tr
                    key={row.name}
                    className={cn('border-rule border-t', r === 0 && 'bg-accent-tint')}
                  >
                    <th scope="row" className="p-3 align-middle">
                      <span className="text-ink block font-bold">{row.name}</span>
                      <span className="text-ink-muted block text-[0.75rem] font-normal">
                        {row.blurb}
                      </span>
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="p-3 text-center align-middle">
                        <CellMark value={cell} />
                      </td>
                    ))}
                    <td className="text-ink p-3 text-center align-middle font-bold whitespace-nowrap">
                      {fmtPoints(row.score)} of 5
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-ink-faint mt-2 text-[0.75rem]">
          ✓ yes · ½ partly (counts as half) · ✕ no · – not assessed (counts as no).
        </p>
      </Container>

      <Container width="prose" className="mt-14">
        {/* 4. Ranked picks */}
        <SectionTitle eyebrow="Our picks">The best baby milestone apps of 2026</SectionTitle>

        <article className="border-accent bg-paper rounded-card mt-6 border-2 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-accent rounded-pill px-3 py-1 text-[0.68rem] font-bold tracking-[0.08em] text-white uppercase">
              Our pick
            </span>
            {top.award && (
              <span className="text-accent text-[0.75rem] font-bold tracking-[0.06em] uppercase">
                {top.award}
              </span>
            )}
          </div>
          <h3 className="text-ink font-display mt-3 text-[1.6rem] font-bold">
            <span className="text-ink-faint mr-2">#1</span>
            {top.name}
          </h3>
          <p className="text-accent mt-1 text-[0.85rem] font-bold">
            Meets {fmtPoints(top.score)} of 5 criteria
          </p>
          {top.summary && (
            <p className="text-ink mt-4 text-[0.98rem] leading-relaxed">{top.summary}</p>
          )}
          <ul className="mt-4 space-y-2">
            {top.pros.map((p) => (
              <li key={p} className="text-ink flex gap-2.5 text-[0.92rem] leading-snug">
                <span aria-hidden className="text-accent font-bold">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
          {top.price != null && (
            <p className="text-ink-muted mt-4 text-[0.85rem]">
              From ${top.price}/{top.per} {top.priceNote}
            </p>
          )}
          <CtaButton location="pick_card" className="mt-5" />
        </article>

        <div className="mt-6 space-y-4">
          {rest.map((p, i) => (
            <article key={p.name} className="border-rule rounded-card border p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-ink font-display text-[1.15rem] font-bold">
                  <span className="text-ink-faint mr-2">#{i + 2}</span>
                  {p.name}
                </h3>
                {p.award && (
                  <span className="text-ink-muted text-[0.72rem] font-semibold tracking-[0.06em] uppercase">
                    {p.award}
                  </span>
                )}
              </div>
              <p className="text-ink-muted mt-1 text-[0.8rem] font-semibold">
                Meets {fmtPoints(p.score)} of 5 criteria
              </p>
              {p.summary && (
                <p className="text-ink-muted mt-3 text-[0.92rem] leading-relaxed">{p.summary}</p>
              )}
              <div className="mt-3 grid gap-3 text-[0.85rem] sm:grid-cols-2">
                <ul className="space-y-1">
                  {p.pros.slice(0, 2).map((x) => (
                    <li key={x} className="text-ink">
                      <span aria-hidden className="text-accent mr-1.5 font-bold">
                        +
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {p.cons.slice(0, 2).map((x) => (
                    <li key={x} className="text-ink">
                      <span aria-hidden className="text-ink-faint mr-1.5 font-bold">
                        −
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* 5. Timeline */}
        <section className="mt-14">
          <SectionTitle eyebrow="With BabyLeap">What to expect, week by week</SectionTitle>
          <ol className="border-accent/30 mt-6 space-y-7 border-l-2 pl-6">
            {TIMELINE.map((t) => (
              <li key={t.when} className="relative">
                <span
                  aria-hidden
                  className="bg-accent absolute top-1 -left-[1.95rem] size-3.5 rounded-full ring-4 ring-white"
                />
                <p className="text-accent text-[0.72rem] font-bold tracking-[0.08em] uppercase">
                  {t.when}
                </p>
                <h3 className="text-ink mt-0.5 text-[1.02rem] font-bold">{t.title}</h3>
                <p className="text-ink-muted mt-1 text-[0.95rem] leading-relaxed">{t.body}</p>
              </li>
            ))}
          </ol>
          <p className="text-ink-faint mt-5 text-[0.8rem] leading-relaxed">
            This describes how the app works, not how your baby will develop. Every baby develops at
            their own pace.
          </p>
          <div className="bg-surface rounded-card mt-7 p-6 text-center">
            <p className="text-ink font-display text-[1.2rem] font-bold">
              Get your baby’s weekly plan
            </p>
            <CtaButton location="timeline" className="mt-4" />
          </div>
        </section>

        {/* 6. FAQ */}
        <FAQ items={FAQ_ITEMS} />

        {/* 7. Editorial disclosure */}
        <section
          aria-labelledby="editorial-disclosure"
          className="border-rule text-ink-muted mt-12 space-y-2 border-t pt-6 text-[0.8rem] leading-relaxed"
        >
          <h2 id="editorial-disclosure" className="text-ink text-[0.85rem] font-bold">
            Editorial Disclosure
          </h2>
          <p>
            We may earn a commission or other compensation from products featured on this page.
            Rankings are based on features, pricing, and publicly available product information.
          </p>
          <p>This page is general information, not medical advice. Results vary.</p>
        </section>
      </Container>
    </>
  )
}
