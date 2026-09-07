import { CompositionBars } from '../components/CompositionBars'
import { SiteFooter } from '../components/SiteFooter'
import { COLORS } from '../content/colors'
import { meanCounts, startTumor, total, type RunResult } from '../sim/engine'

interface Props {
  runs: RunResult[]
  onContinue: () => void
}

export function ResultsScreen({ runs, onContinue }: Props) {
  const mean = meanCounts(runs)
  const start = startTumor()
  const maxBar = Math.max(
    ...runs.map((r) => total(r.final)),
    total(mean),
    total(start),
    1,
  )

  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Results · triplicate</p>
        <h1>What remained after chemo</h1>
        <p className="lede">
          Three replicates with the same rules but different random kills - like
          repeating a lab experiment. Compare each run and the average.
        </p>
      </header>

      <div className="results-grid">
        <CompositionBars title="Starting tumor" counts={start} max={maxBar} />
        {runs.map((run) => (
          <CompositionBars
            key={run.replicate}
            title={`Replicate ${run.replicate} · ${run.total} cells`}
            counts={run.final}
            max={maxBar}
          />
        ))}
        <CompositionBars title="Mean of 3 runs" counts={mean} max={maxBar} />
      </div>

      <div className="panel">
        <h2>How to read this (MIT analysis factors)</h2>
        <ul>
          <li>
            <strong>Growth rate</strong> - green adds more each cycle than pink,
            so fast clones often dominate leftovers.
          </li>
          <li>
            <strong>Resistance colors</strong> - resistant + fast-growing tumors
            tend to stay larger.
          </li>
          <li>
            <strong>Kill randomness / pressure</strong> - which beads get pulled
            changes each replicate; totals will wiggle.
          </li>
        </ul>
        <div className="legend-row">
          {COLORS.map((c) => (
            <span key={c.id} className="legend-chip">
              <span className="swatch" style={{ background: c.hex }} />
              {c.label} (+{c.defaultGrowth}/cycle)
            </span>
          ))}
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onContinue}>
          Next questions
        </button>
      </div>
      <p className="hint stay-hint">
        This page stays open until you continue.
      </p>
      <SiteFooter />
    </section>
  )
}
