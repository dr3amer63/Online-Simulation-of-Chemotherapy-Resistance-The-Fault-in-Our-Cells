import { SiteFooter } from '../components/SiteFooter'
import { WHATS_NEWER } from '../content/modernScience'

interface Props {
  onExplore: () => void
  onCredits: () => void
}

export function ModernScreen({ onExplore, onCredits }: Props) {
  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Context</p>
        <h1>{WHATS_NEWER.title}</h1>
      </header>
      <div className="panel">
        {WHATS_NEWER.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
      <div className="actions actions--wrap">
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          Explore with grounded knobs
        </button>
        <button type="button" className="btn" onClick={onCredits}>
          Credits
        </button>
      </div>
      <SiteFooter />
    </section>
  )
}
