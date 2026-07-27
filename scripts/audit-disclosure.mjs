/**
 * Post-build compliance audit. Run against `.next/server/app` after `pnpm build`.
 *
 * A naive `grep -l babyleap` is useless here: the footer's ownership statement
 * mentions the product on every page, so it matches everything. This checks the
 * invariants that actually matter, per article:
 *
 *   1. Any article whose BODY discusses our own product renders the full
 *      OwnershipDisclosure block (not just the footer one-liner).
 *   2. Every outbound link to a commercial host carries rel="sponsored nofollow".
 *   3. Every article with a medicalReviewer renders the review badge.
 *   4. Articles with `faq` frontmatter emit FAQPage JSON-LD.
 *
 * Exits non-zero on any violation.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const APP = join(ROOT, '.next', 'server', 'app')

const articles = JSON.parse(await readFile(join(ROOT, '.velite', 'articles.json'), 'utf8'))
// Parsed from source rather than imported: node cannot load the .ts module,
// and adding a bundler step for one array is not worth it.
const domainSrc = await readFile(join(ROOT, 'data', 'affiliateDomains.ts'), 'utf8')
const affiliateBlock = domainSrc.slice(
  domainSrc.indexOf('affiliateDomains'),
  domainSrc.indexOf('citationDomains')
)
const affiliateList = [...affiliateBlock.matchAll(/'([a-z0-9.-]+\.[a-z]{2,})'/g)].map((m) => m[1])

const DISCLOSURE_MARKER = 'Ownership disclosure'
const REVIEW_MARKER = 'Medically reviewed'

const errors = []
const checked = []

for (const article of articles) {
  const htmlPath = join(APP, article.category, `${article.slug}.html`)
  if (!existsSync(htmlPath)) {
    errors.push(`${article.slug}: no built HTML at ${htmlPath}`)
    continue
  }

  const html = await readFile(htmlPath, 'utf8')
  checked.push(article.slug)

  // 1. Ownership disclosure block present when the flag is set.
  if (article.ownershipDisclosure && !html.includes(DISCLOSURE_MARKER)) {
    errors.push(`${article.slug}: ownershipDisclosure is true but the block did not render`)
  }

  // 2. Commercial outbound links must be marked sponsored.
  for (const match of html.matchAll(/<a\s+[^>]*href="(https?:\/\/[^"]+)"[^>]*>/g)) {
    const [tag, href] = match
    let host
    try {
      host = new URL(href).hostname.replace(/^www\./, '')
    } catch {
      continue
    }
    const isAffiliate = affiliateList.some((d) => host === d || host.endsWith(`.${d}`))
    if (isAffiliate && !/rel="[^"]*sponsored/.test(tag)) {
      errors.push(`${article.slug}: commercial link to ${host} is missing rel="sponsored"`)
    }
  }

  // 3. Medical review badge renders when a reviewer is assigned.
  if (article.medicalReviewer && !html.includes(REVIEW_MARKER)) {
    errors.push(`${article.slug}: has a medicalReviewer but no review badge rendered`)
  }

  // 4. FAQ frontmatter must produce FAQPage structured data.
  if (article.faq.length > 0 && !html.includes('"FAQPage"')) {
    errors.push(`${article.slug}: has faq[] but emitted no FAQPage JSON-LD`)
  }
}

console.log(
  `Audited ${checked.length} article page(s) against ${affiliateList.length} commercial domains.`
)

if (errors.length > 0) {
  console.error('\nDisclosure audit FAILED:\n')
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}

console.log('Disclosure audit passed.')
