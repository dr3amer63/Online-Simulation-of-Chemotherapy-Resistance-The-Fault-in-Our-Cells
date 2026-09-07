/**
 * Rasterize the five-bead mark to PNG/ICO. No extra packages.
 * Run: node scripts/generate-icons.mjs
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public')
mkdirSync(outDir, { recursive: true })

const BG = [12, 12, 14, 255]
const BEADS = [
  { x: 0.35, y: 0.38, r: 0.161, rgb: [255, 110, 180] },
  { x: 0.65, y: 0.38, r: 0.161, rgb: [255, 140, 26] },
  { x: 0.3, y: 0.668, r: 0.161, rgb: [245, 217, 10] },
  { x: 0.5, y: 0.675, r: 0.161, rgb: [168, 85, 247] },
  { x: 0.7, y: 0.668, r: 0.161, rgb: [34, 197, 94] },
]

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0)
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type)
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([t, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1)
    raw[row] = 0
    rgba.copy(raw, row + 1, y * width * 4, (y + 1) * width * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + ((b[3] ?? 255) - (a[3] ?? 255)) * t,
  ]
}

function drawMark(size, { rounded = true, pad = 0 } = {}) {
  const scale = 4
  const S = size * scale
  const rgba = Buffer.alloc(S * S * 4)
  const radiusPx = rounded ? S * 0.22 : 0
  const inner = S - pad * 2 * scale

  function setPx(x, y, c) {
    if (x < 0 || y < 0 || x >= S || y >= S) return
    const i = (y * S + x) * 4
    const srcA = c[3] / 255
    const dstA = rgba[i + 3] / 255
    const outA = srcA + dstA * (1 - srcA)
    if (outA === 0) return
    rgba[i] = Math.round((c[0] * srcA + rgba[i] * dstA * (1 - srcA)) / outA)
    rgba[i + 1] = Math.round((c[1] * srcA + rgba[i + 1] * dstA * (1 - srcA)) / outA)
    rgba[i + 2] = Math.round((c[2] * srcA + rgba[i + 2] * dstA * (1 - srcA)) / outA)
    rgba[i + 3] = Math.round(outA * 255)
  }

  function inRoundRect(x, y) {
    if (!rounded) return true
    const r = radiusPx
    const dx = x < r ? r - x : x > S - 1 - r ? x - (S - 1 - r) : 0
    const dy = y < r ? r - y : y > S - 1 - r ? y - (S - 1 - r) : 0
    if (dx === 0 || dy === 0) return true
    return dx * dx + dy * dy <= r * r
  }

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (inRoundRect(x, y)) setPx(x, y, BG)
    }
  }

  const ox = pad * scale
  const oy = pad * scale
  for (const bead of BEADS) {
    const cx = ox + bead.x * inner
    const cy = oy + bead.y * inner
    const r = bead.r * inner
    const hx = cx - r * 0.32
    const hy = cy - r * 0.35
    const minX = Math.max(0, Math.floor(cx - r - 1))
    const maxX = Math.min(S - 1, Math.ceil(cx + r + 1))
    const minY = Math.max(0, Math.floor(cy - r - 1))
    const maxY = Math.min(S - 1, Math.ceil(cy + r + 1))
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const d = Math.hypot(x - cx, y - cy)
        const edge = r - d
        if (edge < -1) continue
        const a = edge >= 0 ? 1 : Math.max(0, 1 + edge)
        const nx = (x - cx) / r
        const ny = (y - cy) / r
        const shade = Math.max(0, 1 - (nx * 0.35 + ny * 0.55 + 0.2))
        const lit = mix(bead.rgb, [255, 255, 255], shade * 0.22)
        const hd = Math.hypot(x - hx, y - hy)
        const highlight = Math.max(0, 1 - hd / (r * 0.42)) ** 2 * 0.45
        const col = mix(lit, [255, 255, 255], highlight)
        setPx(x, y, [col[0], col[1], col[2], a * 255])
      }
    }
  }

  const out = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let oy2 = 0; oy2 < scale; oy2++) {
        for (let ox2 = 0; ox2 < scale; ox2++) {
          const i = ((y * scale + oy2) * S + (x * scale + ox2)) * 4
          r += rgba[i]
          g += rgba[i + 1]
          b += rgba[i + 2]
          a += rgba[i + 3]
        }
      }
      const n = scale * scale
      const o = (y * size + x) * 4
      out[o] = Math.round(r / n)
      out[o + 1] = Math.round(g / n)
      out[o + 2] = Math.round(b / n)
      out[o + 3] = Math.round(a / n)
    }
  }
  return encodePng(size, size, out)
}

function packIco(pngs) {
  const count = pngs.length
  let offset = 6 + 16 * count
  const header = Buffer.alloc(6 + 16 * count)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)
  const images = []
  pngs.forEach((png, i) => {
    const o = 6 + i * 16
    header[o] = png.size >= 256 ? 0 : png.size
    header[o + 1] = png.size >= 256 ? 0 : png.size
    header[o + 2] = 0
    header[o + 3] = 0
    header.writeUInt16LE(1, o + 4)
    header.writeUInt16LE(32, o + 6)
    header.writeUInt32LE(png.data.length, o + 8)
    header.writeUInt32LE(offset, o + 12)
    offset += png.data.length
    images.push(png.data)
  })
  return Buffer.concat([header, ...images])
}

const png16 = drawMark(16)
const png32 = drawMark(32)
const png48 = drawMark(48)
const png180 = drawMark(180, { rounded: false, pad: 18 })
const png192 = drawMark(192, { rounded: true, pad: 16 })
const png512 = drawMark(512, { rounded: true, pad: 48 })

writeFileSync(join(outDir, 'favicon-16.png'), png16)
writeFileSync(join(outDir, 'favicon-32.png'), png32)
writeFileSync(join(outDir, 'apple-touch-icon.png'), png180)
writeFileSync(join(outDir, 'icon-192.png'), png192)
writeFileSync(join(outDir, 'icon-512.png'), png512)
writeFileSync(
  join(outDir, 'favicon.ico'),
  packIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ]),
)

console.log('Wrote favicon + touch/PWA icons in public/')
