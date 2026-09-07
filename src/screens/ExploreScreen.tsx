import { useMemo, useState } from 'react'
import { CompositionBars } from '../components/CompositionBars'
import { SiteFooter } from '../components/SiteFooter'
import { COLORS, type BeadColor } from '../content/colors'
import { colorLabel } from '../content/colors'
import type { AppConfig } from '../app/types'
import { toSimConfig } from '../app/types'
import {
  defaultGrowthRates,
  meanCounts,
  runTriplicate,
  type Counts,
  type RunResult,
} from '../sim/engine'

interface Props {
  base: AppConfig
  onRerunFull: (cfg: AppConfig) => void
}

export function ExploreScreen({ base, onRerunFull }: Props) {
  const [resistant, setResistant] = useState<BeadColor[]>(base.resistant)
  const [noResistance, setNoResistance] = useState(base.noResistance)
  const [pullsPerInterval, setPullsPerInterval] = useState(
    base.pullsPerInterval,
  )
  const [growth, setGrowth] = useState<Counts>(base.growth)
  const [preview, setPreview] = useState<RunResult[] | null>(null)

  const cfg: AppConfig = useMemo(
    () => ({
      resistant,
      noResistance,
      pullsPerInterval,
      growth,
      cycles: base.cycles,
    }),
    [resistant, noResistance, pullsPerInterval, growth, base.cycles],
  )

  const toggleResistant = (id: BeadColor) => {
    setNoResistance(false)
    setResistant((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const runPreview = () => {
    setPreview(runTriplicate(toSimConfig(cfg)))
  }

  const mean = preview ? meanCounts(preview) : null

  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Explore</p>
        <h1>Grounded knobs only</h1>
        <p className="lede">
          These controls stay inside the MIT bead lab: resistant colors (up to
          2), growth-cup sizes (1-3), and chemo pull speed during each 30s
          interval.
        </p>
      </header>

      <div className="explore-grid">
        <div className="panel">
          <h2>Resistant clones</h2>
          <p className="hint">Up to 2 colors (teacher assigns two per group).</p>
          <label className="check">
            <input
              type="checkbox"
              checked={noResistance}
              onChange={(e) => {
                setNoResistance(e.target.checked)
                if (e.target.checked) setResistant([])
              }}
            />
            No resistance (control)
          </label>
          <div className="chip-toggles">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`chip-toggle ${resistant.includes(c.id) && !noResistance ? 'is-on' : ''}`}
                style={{ ['--chip' as string]: c.hex }}
                onClick={() => toggleResistant(c.id)}
                disabled={noResistance}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Chemo pull speed</h2>
          <p className="hint">
            MIT: chemo takes beads out one-by-one without looking. In class,
            pull speed varies by student. Here: pulls per 30s interval.
          </p>
          <label className="slider-label">
            Pulls / 30s: <strong>{pullsPerInterval}</strong>
            <input
              type="range"
              min={10}
              max={20}
              value={pullsPerInterval}
              onChange={(e) => setPullsPerInterval(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="panel">
          <h2>Relative growth (division)</h2>
          <p className="hint">MIT growth cups: 1, 2, or 3 new cells per 30s.</p>
          {COLORS.map((c) => (
            <label key={c.id} className="slider-label">
              {c.label}: <strong>{growth[c.id]}</strong>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={growth[c.id]}
                onChange={(e) =>
                  setGrowth((g) => ({ ...g, [c.id]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
          <button
            type="button"
            className="btn btn--small"
            onClick={() => setGrowth(defaultGrowthRates())}
          >
            Reset growth
          </button>
        </div>
      </div>

      <div className="actions actions--wrap">
        <button type="button" className="btn btn--primary" onClick={runPreview}>
          Preview runs
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onRerunFull(cfg)}
        >
          Run simulation
        </button>
      </div>

      {mean && preview ? (
        <div className="results-grid" style={{ marginTop: '1.25rem' }}>
          {preview.map((run) => (
            <CompositionBars
              key={run.replicate}
              title={`Preview rep ${run.replicate}`}
              counts={run.final}
            />
          ))}
          <CompositionBars title="Preview mean" counts={mean} />
        </div>
      ) : null}

      <p className="hint" style={{ marginTop: '1rem' }}>
        Active resistance:{' '}
        {cfg.noResistance
          ? 'none'
          : cfg.resistant.map(colorLabel).join(' & ') || 'none selected'}
      </p>
      <SiteFooter />
    </section>
  )
}
