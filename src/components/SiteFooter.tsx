import { CREDITS } from '../content/credits'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Lesson by {CREDITS.instructors.map((i) => i.name).join(', ')} (
        {CREDITS.program} / {CREDITS.institution}).
      </p>
      <p>
        Based on{' '}
        <a href={CREDITS.lessonUrl} target="_blank" rel="noreferrer">
          {CREDITS.lessonTitle}
        </a>
        .
      </p>
      <p>
        Online simulation by{' '}
        <a href={CREDITS.adapterUrl} target="_blank" rel="noreferrer">
          {CREDITS.adapterName}
        </a>{' '}
        with {CREDITS.adapterWith}.
      </p>
    </footer>
  )
}
