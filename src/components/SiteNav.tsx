import { useEffect, useId, useRef, useState } from 'react'
import type { Screen } from '../app/types'

const PRIMARY: { id: Screen; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'questions', label: 'Questions' },
  { id: 'results', label: 'Results' },
]

const MORE: { id: Screen; label: string }[] = [
  { id: 'modern', label: 'Context' },
  { id: 'credits', label: 'Credits' },
]

const MENU_ITEMS = [...PRIMARY, ...MORE]

interface Props {
  screen: Screen
  canGoBack: boolean
  onBack: () => void
  onHome: () => void
  onOpen: (next: Screen) => void
}

export function SiteNav({ screen, canGoBack, onBack, onHome, onOpen }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setMenuOpen(false)

  const go = (next: Screen) => {
    onOpen(next)
    closeMenu()
  }

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const toggle = toggleRef.current
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href]',
    )
    focusables?.[0]?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      toggle?.focus()
    }
  }, [menuOpen])

  return (
    <>
      <nav className="top-nav" aria-label="Primary">
        <div className="top-nav__left">
          {canGoBack ? (
            <button
              type="button"
              className="nav-back"
              onClick={onBack}
              aria-label="Go back"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 6 9 12l6 6"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <span className="nav-back nav-back--spacer" aria-hidden="true" />
          )}
          <button type="button" className="brand" onClick={onHome}>
            <img src="/favicon.svg" alt="" width={28} height={28} />
            Chemo Resistance · Beads
          </button>
        </div>

        <div className="top-nav__right">
          <div className="nav-tabs" role="list">
            {PRIMARY.map((item) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`nav-tab${screen === item.id ? ' is-active' : ''}`}
                aria-current={screen === item.id ? 'page' : undefined}
                onClick={() => onOpen(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            ref={toggleRef}
            type="button"
            className={`nav-menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="nav-menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`nav-drawer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="nav-drawer__backdrop"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close menu"
          onClick={closeMenu}
        />
        <div
          ref={panelRef}
          id={menuId}
          className="nav-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="nav-drawer__head">
            <p className="nav-drawer__title">Menu</p>
            <button
              type="button"
              className="nav-drawer__close"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>
          <ul className="nav-drawer__list">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-drawer__link${screen === item.id ? ' is-active' : ''}`}
                  aria-current={screen === item.id ? 'page' : undefined}
                  onClick={() => go(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
