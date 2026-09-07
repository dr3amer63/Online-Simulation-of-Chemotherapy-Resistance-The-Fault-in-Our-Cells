import { useState } from 'react'
import {
  makeDefaultConfig,
  pickTwoResistant,
  type AppConfig,
  type Screen,
} from './app/types'
import type { RunResult } from './sim/engine'
import {
  CreditsScreen,
  IntroScreen,
  MappingScreen,
} from './screens/StaticScreens'
import { SimScreen } from './screens/SimScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { QuestionsScreen } from './screens/QuestionsScreen'
import { ModernScreen } from './screens/ModernScreen'
import { ExploreScreen } from './screens/ExploreScreen'
import { CREDITS } from './content/credits'

const FLOW_BACK: Partial<Record<Screen, Screen>> = {
  mapping: 'intro',
  sim: 'mapping',
  results: 'mapping',
  questions: 'results',
  modern: 'questions',
}

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [config, setConfig] = useState<AppConfig>(() =>
    makeDefaultConfig(pickTwoResistant()),
  )
  const [runs, setRuns] = useState<RunResult[]>([])
  const [returnScreen, setReturnScreen] = useState<Screen>('modern')

  const goBack = () => {
    if (screen === 'explore' || screen === 'credits') {
      setScreen(
        returnScreen === 'explore' || returnScreen === 'credits'
          ? 'mapping'
          : returnScreen,
      )
      return
    }
    const prev = FLOW_BACK[screen]
    if (prev) setScreen(prev)
  }

  const canGoBack = screen !== 'intro'

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="top-nav" aria-label="Primary">
        <div className="top-nav__left">
          {canGoBack ? (
            <button
              type="button"
              className="nav-back"
              onClick={goBack}
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
          <button
            type="button"
            className="brand"
            onClick={() => setScreen('intro')}
          >
            <img src="/favicon.svg" alt="" width={28} height={28} />
            Chemo Resistance · Beads
          </button>
        </div>
        <div className="top-nav__links">
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setReturnScreen(screen === 'explore' ? returnScreen : screen)
              setScreen('explore')
            }}
          >
            Explore
          </button>
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setReturnScreen(screen === 'credits' ? returnScreen : screen)
              setScreen('credits')
            }}
          >
            Credits
          </button>
          <a
            className="nav-name"
            href={CREDITS.adapterUrl}
            target="_blank"
            rel="noreferrer"
          >
            {CREDITS.adapterName}
          </a>
        </div>
      </nav>

      <main id="main">
        {screen === 'intro' ? (
          <IntroScreen onStart={() => setScreen('mapping')} />
        ) : null}
        {screen === 'mapping' ? (
          <MappingScreen
            config={config}
            onContinue={() => setScreen('sim')}
            onExplore={() => {
              setReturnScreen('mapping')
              setScreen('explore')
            }}
          />
        ) : null}
        {screen === 'sim' ? (
          <SimScreen
            config={config}
            onComplete={(r) => {
              setRuns(r)
              setScreen('results')
            }}
          />
        ) : null}
        {screen === 'results' ? (
          <ResultsScreen runs={runs} onContinue={() => setScreen('questions')} />
        ) : null}
        {screen === 'questions' ? (
          <QuestionsScreen onContinue={() => setScreen('modern')} />
        ) : null}
        {screen === 'modern' ? (
          <ModernScreen
            onExplore={() => {
              setReturnScreen('modern')
              setScreen('explore')
            }}
            onCredits={() => {
              setReturnScreen('modern')
              setScreen('credits')
            }}
          />
        ) : null}
        {screen === 'explore' ? (
          <ExploreScreen
            base={config}
            onRerunFull={(cfg) => {
              setConfig(cfg)
              setRuns([])
              setReturnScreen('mapping')
              setScreen('mapping')
            }}
          />
        ) : null}
        {screen === 'credits' ? <CreditsScreen /> : null}
      </main>
    </div>
  )
}

export default App
