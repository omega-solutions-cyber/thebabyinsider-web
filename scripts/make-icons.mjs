/**
 * Generates the favicon / app-icon set from the wordmark tile.
 *
 * Run after changing the brand mark or accent colour:
 *   node scripts/make-icons.mjs
 *
 * Outputs:
 *   app/icon.svg          browser tab (Next emits the <link rel="icon">)
 *   app/apple-icon.png    180x180, iOS home screen
 *   app/favicon.ico       32x32, for clients that probe /favicon.ico directly
 *   public/icon.png       512x512, the Organization JSON-LD `logo` URL
 */
import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ACCENT = '#16513E'
const ROOT = process.cwd()

/** The mark: accent tile, white lowercase "b", optically centred. */
const svg = (size) => {
  const radius = Math.round(size * 0.16)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${ACCENT}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="Helvetica, Arial, sans-serif" font-size="${size * 0.72}"
        font-weight="800" fill="#ffffff" dy="${size * 0.015}">b</text>
</svg>`
}

/**
 * Minimal ICO container wrapping a PNG. The ICO format permits PNG-encoded
 * entries, so this is a 6-byte header + one 16-byte directory entry + the PNG.
 */
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // one image

  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0) // width (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
  entry.writeUInt8(0, 2) // palette colours
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // colour planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(header.length + entry.length, 12) // offset

  return Buffer.concat([header, entry, png])
}

const render = (size) => sharp(Buffer.from(svg(size))).png().toBuffer()

await writeFile(join(ROOT, 'app', 'icon.svg'), svg(64))
await writeFile(join(ROOT, 'app', 'apple-icon.png'), await render(180))
await writeFile(join(ROOT, 'public', 'icon.png'), await render(512))
await writeFile(join(ROOT, 'app', 'favicon.ico'), pngToIco(await render(32), 32))

console.log('wrote app/icon.svg, app/apple-icon.png, app/favicon.ico, public/icon.png')
