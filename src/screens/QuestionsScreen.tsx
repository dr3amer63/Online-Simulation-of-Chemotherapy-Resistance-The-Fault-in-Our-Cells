import { SiteFooter } from '../components/SiteFooter'
import { QUESTIONS } from '../content/questions'

interface Props {
  answers: Record<string, string>
  submitted: boolean
  onAnswersChange: (answers: Record<string, string>) => void
  onSubmittedChange: (submitted: boolean) => void
  onContinue: () => void
}

export function QuestionsScreen({
  answers,
  submitted,
  onAnswersChange,
  onSubmittedChange,
  onContinue,
}: Props) {
  const update = (id: string, value: string) => {
    if (submitted) return
    onAnswersChange({ ...answers, [id]: value })
  }

  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Questions</p>
        <h1>Reflection</h1>
        <p className="lede">
          Prompts adapted from MIT BLOSSOMS / Koch Institute teacher guide,
          handout, and assessment options. Write in your own words, then submit
          to see model answers. We do not grade you.
        </p>
      </header>

      <form
        className="questions"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmittedChange(true)
        }}
      >
        {QUESTIONS.map((q, i) => (
          <fieldset key={q.id} className="q-card" disabled={submitted}>
            <legend>
              {i + 1}. {q.prompt}
            </legend>
            <textarea
              rows={4}
              value={answers[q.id] ?? ''}
              onChange={(e) => update(q.id, e.target.value)}
              placeholder="Your answer…"
            />
            {submitted ? (
              <div className="model-answer">
                <h3>Model answer (from source talking points)</h3>
                <p>{q.modelAnswer}</p>
              </div>
            ) : null}
          </fieldset>
        ))}

        <div className="actions">
          {!submitted ? (
            <button type="submit" className="btn btn--primary">
              Show answers
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn--primary"
                onClick={onContinue}
              >
                Continue
              </button>
              <p className="hint stay-hint">
                Your answers stay saved if you leave and come back.
              </p>
            </>
          )}
        </div>
      </form>
      <SiteFooter />
    </section>
  )
}
