import { useState } from 'react'
import { SiteFooter } from '../components/SiteFooter'
import { QUESTIONS } from '../content/questions'

interface Props {
  onContinue: () => void
}

export function QuestionsScreen({ onContinue }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, ''])),
  )
  const [submitted, setSubmitted] = useState(false)

  const update = (id: string, value: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <section className="screen">
      <header className="screen__header">
        <p className="eyebrow">Questions</p>
        <h1>Reflect on the simulation</h1>
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
          setSubmitted(true)
        }}
      >
        {QUESTIONS.map((q, i) => (
          <fieldset key={q.id} className="q-card" disabled={submitted}>
            <legend>
              {i + 1}. {q.prompt}
            </legend>
            <textarea
              rows={4}
              value={answers[q.id]}
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
                Answers stay on this page until you leave.
              </p>
            </>
          )}
        </div>
      </form>
      <SiteFooter />
    </section>
  )
}
