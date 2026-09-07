import { useEffect, useRef } from 'react'
import { COLORS, type BeadColor } from '../content/colors'
import type { Counts } from '../sim/engine'

interface Bead {
  id: number
  color: BeadColor
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

interface Props {
  counts: Counts
  highlight?: 'grow' | 'kill' | 'return' | null
}

let nextId = 1

function syncBeads(beads: Bead[], counts: Counts, w: number, h: number): Bead[] {
  const byColor: Record<BeadColor, Bead[]> = {
    pink: [],
    orange: [],
    yellow: [],
    purple: [],
    green: [],
  }
  for (const b of beads) byColor[b.color].push(b)

  const next: Bead[] = []
  const pad = 16
  const maxR = Math.min(10, Math.max(4, Math.min(w, h) / 28))

  for (const color of COLORS.map((c) => c.id)) {
    const need = counts[color]
    const have = byColor[color]
    for (let i = 0; i < need; i++) {
      if (i < have.length) {
        next.push(have[i])
      } else {
        next.push({
          id: nextId++,
          color,
          x: pad + Math.random() * Math.max(1, w - pad * 2),
          y: pad + Math.random() * Math.max(1, h - pad * 2),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: maxR * (0.85 + Math.random() * 0.3),
        })
      }
    }
  }

  const MAX = 220
  if (next.length > MAX) {
    const step = next.length / MAX
    const sampled: Bead[] = []
    for (let i = 0; i < MAX; i++) sampled.push(next[Math.floor(i * step)])
    return sampled
  }
  return next
}

export function BeadCanvas({ counts, highlight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const beadsRef = useRef<Bead[]>([])
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      beadsRef.current = syncBeads(beadsRef.current, counts, w, h)
    }

    resize()
    beadsRef.current = syncBeads(
      beadsRef.current,
      counts,
      canvas.clientWidth,
      canvas.clientHeight,
    )

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const tick = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.fillStyle = '#050505'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      if (highlight === 'kill') {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.12)'
        ctx.fillRect(0, 0, w, h)
      } else if (highlight === 'grow') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.08)'
        ctx.fillRect(0, 0, w, h)
      } else if (highlight === 'return') {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
        ctx.fillRect(0, 0, w, h)
      }

      for (const b of beadsRef.current) {
        b.x += b.vx
        b.y += b.vy
        if (b.x < b.r || b.x > w - b.r) b.vx *= -1
        if (b.y < b.r || b.y > h - b.r) b.vy *= -1
        b.x = Math.max(b.r, Math.min(w - b.r, b.x))
        b.y = Math.max(b.r, Math.min(h - b.r, b.y))

        const hex = COLORS.find((c) => c.id === b.color)!.hex
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = hex
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.45)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [counts, highlight])

  return <canvas ref={canvasRef} className="bead-canvas" aria-label="Tumor bead simulation" />
}
