import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteConfig } from '@/data/siteConfig'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/**
 * Fonts must be ArrayBuffers. Read from disk at build time rather than fetched
 * from a CDN — a network hop here is the classic cause of flaky builds.
 * Cached per process so a 300-article build reads each file once.
 */
let fontCache: { bold: ArrayBuffer; semibold: ArrayBuffer } | null = null

async function loadFonts() {
  if (fontCache) return fontCache

  const dir = join(process.cwd(), 'public', 'fonts')
  const [bold, semibold] = await Promise.all([
    readFile(join(dir, 'InterTight-Bold.ttf')),
    readFile(join(dir, 'InterTight-SemiBold.ttf')),
  ])

  fontCache = {
    bold: bold.buffer.slice(bold.byteOffset, bold.byteOffset + bold.byteLength) as ArrayBuffer,
    semibold: semibold.buffer.slice(
      semibold.byteOffset,
      semibold.byteOffset + semibold.byteLength
    ) as ArrayBuffer,
  }
  return fontCache
}

export async function renderOgImage({
  title,
  eyebrow,
  accent = '#0E7C86',
  footnote,
}: {
  title: string
  eyebrow?: string
  accent?: string
  footnote?: string
}) {
  const fonts = await loadFonts()

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFDF9',
        padding: '64px 72px',
        borderTop: `16px solid ${accent}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow && (
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.1,
            color: '#111827',
            letterSpacing: -1,
          }}
        >
          {title.length > 110 ? `${title.slice(0, 107)}…` : title}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              backgroundColor: accent,
              color: '#fff',
              fontSize: 40,
              fontWeight: 700,
              marginRight: 16,
            }}
          >
            b
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#111827',
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        {footnote && (
          <div style={{ display: 'flex', fontSize: 22, color: '#5B6472' }}>{footnote}</div>
        )}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'InterTight', data: fonts.bold, weight: 700, style: 'normal' },
        { name: 'InterTight', data: fonts.semibold, weight: 600, style: 'normal' },
      ],
    }
  )
}
