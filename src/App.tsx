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

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [config, setConfig] = useState<AppConfig>(() =>
    makeDefaultConfig(pickTwoResistant()),
  )
  const [runs, setRuns] = useState<RunResult[]>([])
  const [returnScreen, setReturnScreen] = useState<Screen>('modern')

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="top-nav" aria-label="Primary">
        <span className="brand">Chemo Resistance · Beads</span>
        <div className="top-nav__links">
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setReturnScreen(screen)
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
            onExplore={() => setScreen('explore')}
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
              setScreen('mapping')
            }}
          />
        ) : null}
        {screen === 'credits' ? (
          <CreditsScreen onBack={() => setScreen(returnScreen)} />
        ) : null}
      </main>
    </div>
  )
}

export default App
