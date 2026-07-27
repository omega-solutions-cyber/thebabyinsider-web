# The Baby Insider

Editorial site for [thebabyinsider.com](https://thebabyinsider.com) — evidence-based,
clinician-reviewed parenting content, published by Omega Solutions (the company behind the
BabyLeap app).

## Stack

| Concern   | Choice                                                         |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 15.5.9, App Router, fully prerendered                  |
| Content   | **Velite** → `.velite/*.json`, imported as `#site/content`     |
| Styling   | Tailwind v4 (CSS-first `@theme` in `app/globals.css`)          |
| Search    | MiniSearch over a build-emitted `public/search-index.json`     |
| Email     | Klaviyo REST via `app/api/newsletter` — the only dynamic route |

### Why Velite and not Contentlayer

Both sibling repos (`baby-leap-funnel`, `babyleap-blog`) use Contentlayer2, which is unmaintained
and hooks Next's bundler — every Next major is a gamble. Velite is a standalone CLI: it reads
`content/` and writes `.velite/`, and Next never knows it exists. It also emits image width, height
and a blur placeholder at build time, which is what keeps the hero mosaic at zero layout shift.

**Gotcha:** Velite compiles MDX to a function-body _string_, not a component. `components/mdx/MDXContent.tsx`
is the ~15-line shim that evaluates it. It runs server-side during RSC render; the client only ever
receives HTML.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Klaviyo + PostHog
pnpm dev                     # velite --watch + next dev, concurrently
```

Other commands:

```bash
pnpm build       # velite build && next build
pnpm content     # rebuild the content layer only
pnpm typecheck
pnpm lint
```

## Writing content

Articles live at `content/articles/<category>/<slug>.mdx`, with hero images collocated in
`content/articles/<category>/<slug>/`. The full frontmatter schema is defined and documented in
`velite.config.ts`.

Categories are defined once in `content/categories/index.yml` — that file drives the header nav,
footer columns, homepage section order and card eyebrow colours. Adding a category needs no code
change.

MDX blocks available without importing: `Callout`, `KeyTakeaways`, `FAQ`, `ProductRoundup`,
`ProductCard`, `InlineArticleLink`, `BabyLeapPromo`, `OwnershipDisclosure`, `AffiliateDisclosure`.

`FAQ` and `ProductRoundup` take no props — the article page binds them to that article's
frontmatter, so the visible content and the JSON-LD can never disagree.

## Build-time guarantees

`prepare()` in `velite.config.ts` **fails the build** on:

- An unknown category, author, medical reviewer or contributor
- A duplicate slug, or a category slug shadowing a real route
- An `<InlineArticleLink slug="…">` pointing at an article that does not exist
- **An article that mentions BabyLeap without `ownershipDisclosure: true`**

and warns on: unfilled hero mosaic slots, fewer than four featured articles, roundups with no
`products[]`, and orphaned articles with no inbound internal links.

## Disclosure — enforced, not remembered

This site covers its own parent company's product, so disclosure is structural:

1. `DisclosureBar` on every page → `/advertising-disclosure`
2. Build fails if an article mentions BabyLeap without the disclosure flag (above)
3. `BabyLeapPromo` renders `OwnershipDisclosure` itself, with no prop to disable it
4. `lib/rehype/outbound-links.ts` auto-applies `rel="sponsored nofollow noopener noreferrer"` to any
   host in `data/affiliateDomains.ts` — writers never hand-write it
5. `parentOrganization` in the Organization JSON-LD names the parent company
6. `/how-we-evaluate`, `/editorial-process`, `/medical-review-team` are written as real pages

Audit the built output before any deploy:

```bash
pnpm build && pnpm audit:disclosure
```

`scripts/audit-disclosure.mjs` checks, per article: the disclosure block actually rendered when
the flag is set, every commercial outbound link carries `rel="sponsored"`, the medical review badge
rendered when a reviewer is assigned, and `faq[]` produced FAQPage JSON-LD. It runs in CI and exits
non-zero on any violation.

A plain `grep -l babyleap` is **not** a valid substitute — the footer's ownership statement mentions
the product on every page, so it matches everything.

## Newsletter — Discord only, no subscriptions

`app/api/newsletter/route.ts` posts submitted addresses to a Discord channel and
does nothing else. **Nobody is subscribed to a mailing list**, and no marketing
consent is recorded.

Three things are coupled to that and must move together when an ESP is wired up:

1. `NewsletterForm`'s success copy says we will be in touch when the newsletter
   launches — it must not claim a subscription or a confirmation email.
2. `content/pages/legal-privacy.mdx` names Discord as the processor and states
   that no address has been added to a mailing list.
3. Addresses collected during this phase have not given marketing consent, so
   they need a fresh opt-in before they can be mailed.

Validation, honeypot, submit-timing and IP rate limiting are unchanged and still
apply. Unlike the app's `discord.ts`, a failed webhook returns an error to the
caller rather than being swallowed — silently dropping an address would leave
the reader believing they had signed up.

## Analytics and metrics

View and comment counts are **deliberately absent** at launch. `ArticleMeta` accepts `views` and
`comments` props that render nothing when undefined — inventing engagement numbers on a
health-adjacent site is an FTC exposure and is trivially detectable.

To add real numbers later: a nightly job queries PostHog for `$pageview` by `$pathname`, commits
`data/metrics.json`, and `prepare()` merges it into each article at build. Display is gated on
`VIEW_DISPLAY_THRESHOLD` (1,000) in `components/article/ArticleMeta.tsx`.

## Search

`prepare()` emits `public/search-index.json`. The modal fetches and indexes it on **first open
only**, never on page load.

Current index: ~20 KB raw, ~8 KB gzipped at 10 articles. **If the gzipped index passes ~250 KB
(roughly 2,000 articles), switch to Pagefind or Algolia** — MiniSearch loads the whole index into
memory client-side.

## Homepage content threshold

A homepage category section is a three-up row, so a category earns one only once
it has **3+ articles** (`SECTION_MIN` in `app/page.tsx`). Below that it would
render a single card marooned in a three-column grid, which reads as broken.

Until at least two categories qualify, a cross-category **LATEST** grid carries
the page instead. To match the reference layout's per-category sections you need
roughly **3 articles x 8 categories = 24**. There are currently 10.

## Verified

Measured with headless Chrome against a production build (`scripts/` in the
session scratchpad, not committed):

- **CLS 0** on home, article, category and author pages, at 1440x900 and 390x844
- No horizontal overflow at any breakpoint
- **Zero axe violations** (wcag2a/2aa/21a/21aa) on all five page types
- Disclosure audit passes, and fails correctly when a disclosure is removed

Palette contrast is verified against white, `surface`, and — for the filled
category pills — against the pill fill itself. `--color-accent-on-dark` exists
because the base accent is far too dark on the footer.

## Visual identity

Deliberately not the hard-edged, all-sans magazine template this genre defaults
to:

- **Fraunces** serif headlines over **Inter** UI/body (`--font-display` /
  `--font-body`)
- Deep plum accent with an antique-gold CTA, on white
- Soft corners throughout (`--radius-card`, `--radius-pill`)
- Category labels are filled pills, not plain coloured uppercase text
- Section headings are title-case serif with a short accent bar, not uppercase
  with a full-width hairline

## Do not run Prettier over content

`content/**/*.mdx` is in `.prettierignore`. Prettier reflows markdown inside JSX
blocks, which silently merges `<KeyTakeaways>` bullet lists into one paragraph —
it renders as prose with stray hyphens and nothing errors.

## Before launch

- [ ] **Replace every placeholder image.** All hero images are generated gradients from
      `scripts/make-placeholder.mjs` and say so on the image. Real licensed photography required.
- [ ] Replace the author and medical-reviewer profiles with real people, real credentials and real
      `sameAs` links. The current ones are illustrative.
- [ ] Have `content/pages/legal-*.mdx` reviewed by a lawyer — they are templates, and say so.
- [ ] Wire `components/legal/CookiePreferences.tsx` to a real CMP and make analytics/ad scripts gate
      on it.
- [ ] Set `NEXT_PUBLIC_SITE_URL`, `DISCORD_NEWSLETTER_WEBHOOK_URL`, `NEXT_PUBLIC_POSTHOG_*` in
      Vercel.
- [ ] Before actually mailing anyone: wire a real ESP with **double opt-in**, re-confirm every
      address collected during the Discord-only phase, use a separate sending subdomain so this
      list's reputation cannot affect BabyLeap app deliverability, and update the privacy policy
      and the form's success copy (see below).
- [ ] Point `thebabyinsider.com` at the Vercel project; 308 `www` → apex.
- [ ] Submit the sitemap to Google Search Console and Bing Webmaster Tools.

## Deployment

Vercel, own project. Build command `pnpm build`, install `pnpm install`. `data/redirects.generated.json`
is committed because `next.config.ts` imports it at config load.
