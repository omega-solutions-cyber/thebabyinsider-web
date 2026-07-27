import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { siteConfig } from '@/data/siteConfig'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = siteConfig.name

export default function OgImage() {
  return renderOgImage({ title: siteConfig.tagline, eyebrow: 'The Baby Insider' })
}
