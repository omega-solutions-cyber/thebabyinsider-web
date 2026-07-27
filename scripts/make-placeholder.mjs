/**
 * Generates placeholder article imagery so the content pipeline and layout can
 * be built and measured before real photography exists.
 *
 * Usage: node scripts/make-placeholder.mjs <outPath> <hex> <label> [w] [h]
 *
 * These are DEVELOPMENT ASSETS. Every one of them must be replaced with real,
 * licensed photography before launch — see the launch checklist.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const [, , out, hex = '#0E7C86', label = '', w = '1600', h = '1200'] = process.argv
const width = Number(w)
const height = Number(h)

const shade = (color, amount) => {
  const n = parseInt(color.slice(1), 16)
  const clamp = (v) => Math.max(0, Math.min(255, v))
  const r = clamp(((n >> 16) & 255) + amount)
  const g = clamp(((n >> 8) & 255) + amount)
  const b = clamp((n & 255) + amount)
  return `rgb(${r},${g},${b})`
}

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${shade(hex, 45)}"/>
      <stop offset="100%" stop-color="${shade(hex, -35)}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${width * 0.78}" cy="${height * 0.24}" r="${height * 0.3}" fill="#ffffff" opacity="0.09"/>
  <circle cx="${width * 0.2}" cy="${height * 0.82}" r="${height * 0.36}" fill="#000000" opacity="0.07"/>
  <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(height * 0.075)}"
        font-weight="700" fill="#ffffff" opacity="0.9">${escapeXml(label)}</text>
  <text x="${width / 2}" y="${height / 2 + height * 0.09}" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(height * 0.032)}"
        fill="#ffffff" opacity="0.6">placeholder — replace before launch</text>
</svg>`

await mkdir(dirname(out), { recursive: true })
await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(out)
console.log(`wrote ${out} (${width}x${height})`)
