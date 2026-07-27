/**
 * Any outbound link whose hostname matches (or is a subdomain of) an entry here
 * is automatically rewritten at build time to carry
 * `rel="sponsored nofollow noopener noreferrer"` and `target="_blank"`.
 *
 * This is deliberately not left to writers. A missed `rel` on a commercial link
 * is both an FTC disclosure problem and a Google link-spam policy problem, and
 * it is exactly the kind of thing that gets forgotten on article #200.
 *
 * Add a domain here the moment a commercial relationship starts.
 */
export const affiliateDomains: string[] = [
  // Our own product — commercial by definition.
  'babyleapapp.com',
  'apps.apple.com',
  'play.google.com',

  // Retail / affiliate networks
  'amazon.com',
  'amzn.to',
  'target.com',
  'walmart.com',
  'buybuybaby.com',
  'shareasale.com',
  'awin1.com',
  'anrdoezrs.net',
  'shrsl.com',
  'rstyle.me',
]

/** Domains we link to editorially and must never mark as sponsored. */
export const citationDomains: string[] = [
  'aap.org',
  'healthychildren.org',
  'nih.gov',
  'ncbi.nlm.nih.gov',
  'who.int',
  'cdc.gov',
  'nhs.uk',
  'cochrane.org',
  'acog.org',
]

const normalise = (host: string) => host.replace(/^www\./, '').toLowerCase()

export function isAffiliateHost(hostname: string): boolean {
  const host = normalise(hostname)
  if (citationDomains.some((d) => host === d || host.endsWith(`.${d}`))) return false
  return affiliateDomains.some((d) => host === d || host.endsWith(`.${d}`))
}
