import { COLORS, type BeadColor } from '../content/colors'
import type { Counts } from '../sim/engine'
import { total } from '../sim/engine'

interface Props {
  title: string
  counts: Counts
  max?: number
}

export function CompositionBars({ title, counts, max }: Props) {
  const t = total(counts)
  const ceiling = max ?? Math.max(t, 1)

  return (
    <div className="comp-bars">
      <div className="comp-bars__head">
        <h3>{title}</h3>
        <span>{t} total</span>
      </div>
      <ul>
        {COLORS.map((c) => {
          const n = counts[c.id as BeadColor]
          const pct = (n / ceiling) * 100
          return (
            <li key={c.id}>
              <div className="comp-bars__label">
                <span className="swatch" style={{ background: c.hex }} />
                <span>{c.label}</span>
                <strong>{n}</strong>
              </div>
              <div className="comp-bars__track" role="presentation">
                <div
                  className="comp-bars__fill"
                  style={{ width: `${pct}%`, background: c.hex }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
