import { visit } from 'unist-util-visit'
import type { Root, Element } from 'hast'
import { isAffiliateHost } from '../../data/affiliateDomains'

/**
 * Rewrites outbound anchors in article bodies:
 *
 *   - affiliate/commercial hosts → rel="sponsored nofollow noopener noreferrer"
 *   - every other external host  → rel="noopener noreferrer"
 *
 * Internal links are left alone so they still pass authority between our own
 * pages. Runs at build time, so a writer cannot ship an undisclosed commercial
 * link by forgetting the attribute.
 */
export function rehypeOutboundLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return

      const href = node.properties?.href
      if (typeof href !== 'string') return

      // Internal, anchor, mailto, tel — nothing to do.
      if (!/^https?:\/\//i.test(href)) return

      let hostname: string
      try {
        hostname = new URL(href).hostname
      } catch {
        return
      }

      const sponsored = isAffiliateHost(hostname)

      node.properties = {
        ...node.properties,
        rel: sponsored
          ? ['sponsored', 'nofollow', 'noopener', 'noreferrer']
          : ['noopener', 'noreferrer'],
        target: '_blank',
        ...(sponsored ? { 'data-affiliate': 'true' } : {}),
      }
    })
  }
}
