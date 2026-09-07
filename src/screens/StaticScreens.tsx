import { COLORS, colorLabel } from '../content/colors'
import { CREDITS, MAPPING_ROWS } from '../content/credits'
import { SiteFooter } from '../components/SiteFooter'
import type { AppConfig } from '../app/types'

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="screen screen--center">
      <p className="eyebrow">{CREDITS.program}</p>
      <h1 className="display">The Fault in Our Cells</h1>
      <p className="lede">
        An online bead simulation of tumor heterogeneity and chemotherapy
        resistance - a direct digital translation of the classroom lab from the
        Koch Institute / MIT BLOSSOMS.
      </p>
      <p className="hook">
        Do you think all the cancer cells in a tumor have the same mutations?
      </p>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        Start Simulation
      </button>
      <SiteFooter />
    </section>
  )
}

export function MappingScreen({
  config,
  onContinue,
}: {
  config: AppConfig
  onContinue: () => void
}) {
  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Before you begin</p>
        <h1>What maps to what</h1>
        <p className="lede">
          This is the same MIT bead experiment: beads are cells, the black field
          is the tumor, colors are different mutation sets.
        </p>
      </header>

      <div className="map-table-wrap">
        <table className="map-table">
          <thead>
            <tr>
              <th>In the simulation</th>
              <th>In real chemo resistance</th>
            </tr>
          </thead>
          <tbody>
            {MAPPING_ROWS.map((row) => (
              <tr key={row.sim}>
                <td>{row.sim}</td>
                <td>{row.real}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>This session’s setup</h2>
        <ul className="setup-list">
          <li>
            MIT start: <strong>10 beads of each color</strong> in the tumor
          </li>
          <li>
            Growth every 30s (one cup):{' '}
            {COLORS.map((c) => `${c.label} +${config.growth[c.id]}`).join(' · ')}
          </li>
          <li>
            Chemo: blind one-by-one pulls (
            <strong>{config.pullsPerInterval} pulls / 30s</strong> digital stand-in
            for student pull speed)
          </li>
          <li>
            Resistance:{' '}
            {config.noResistance ? (
              <strong>None (control)</strong>
            ) : (
              <strong>
                {config.resistant.map((c) => colorLabel(c)).join(' & ')}
              </strong>
            )}{' '}
            (3 dead of one color → 2 back)
          </li>
          <li>
            3 minutes → <strong>5 intervals</strong>; experiment run{' '}
            <strong>3 times</strong> (triplicate)
          </li>
        </ul>
        <div className="legend-row" aria-label="Color legend">
          {COLORS.map((c) => (
            <span key={c.id} className="legend-chip">
              <span className="swatch" style={{ background: c.hex }} />
              {c.label}
            </span>
          ))}
        </div>
      </div>

      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onContinue}>
          I understand: run simulation
        </button>
      </div>
      <SiteFooter />
    </section>
  )
}

export function CreditsScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Credits</p>
        <h1>Who made this</h1>
      </header>
      <div className="panel">
        <h2>Original lesson contributors</h2>
        <p>
          <em>{CREDITS.lessonTitle}</em>
        </p>
        <p>
          {CREDITS.program} · {CREDITS.institution}
        </p>
        <ul className="credit-list">
          {CREDITS.instructors.map((person) => (
            <li key={person.name}>
              <strong>{person.name}</strong>
              <span>{person.role}</span>
            </li>
          ))}
        </ul>
        <p>
          <a href={CREDITS.lessonUrl} target="_blank" rel="noreferrer">
            Official lesson page
          </a>
        </p>
      </div>
      <div className="panel">
        <h2>Online simulation adaptation</h2>
        <p>
          Built by{' '}
          <a href={CREDITS.adapterUrl} target="_blank" rel="noreferrer">
            {CREDITS.adapterName}
          </a>{' '}
          with {CREDITS.adapterWith}. Unofficial interactive port of their
          classroom bead lab.
        </p>
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onBack}>
          Back
        </button>
      </div>
      <SiteFooter />
    </section>
  )
}
