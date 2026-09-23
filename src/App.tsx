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
import { SiteNav } from './components/SiteNav'
import { QUESTIONS } from './content/questions'

const FLOW_BACK: Partial<Record<Screen, Screen>> = {
  mapping: 'intro',
  sim: 'mapping',
  results: 'mapping',
  questions: 'results',
  modern: 'questions',
}

const SIDE_SCREENS: Screen[] = ['explore', 'credits', 'questions', 'modern', 'results']

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [config, setConfig] = useState<AppConfig>(() =>
    makeDefaultConfig(pickTwoResistant()),
  )
  const [runs, setRuns] = useState<RunResult[]>([])
  const [returnScreen, setReturnScreen] = useState<Screen>('modern')
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, ''])),
  )
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false)

  const openSide = (next: Screen) => {
    if (screen !== next) {
      setReturnScreen(SIDE_SCREENS.includes(screen) ? returnScreen : screen)
    }
    setScreen(next)
  }

  const goBack = () => {
    if (SIDE_SCREENS.includes(screen)) {
      setScreen(
        SIDE_SCREENS.includes(returnScreen) ? 'mapping' : returnScreen,
      )
      return
    }
    const prev = FLOW_BACK[screen]
    if (prev) setScreen(prev)
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav
        screen={screen}
        canGoBack={screen !== 'intro'}
        onBack={goBack}
        onHome={() => setScreen('intro')}
        onOpen={openSide}
      />

      <main id="main">
        {screen === 'intro' ? (
          <IntroScreen onStart={() => setScreen('mapping')} />
        ) : null}
        {screen === 'mapping' ? (
          <MappingScreen
            config={config}
            onContinue={() => setScreen('sim')}
            onExplore={() => openSide('explore')}
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
          <ResultsScreen
            runs={runs}
            onContinue={() => {
              setReturnScreen('results')
              setScreen('questions')
            }}
            onBeginRun={() => setScreen('mapping')}
          />
        ) : null}
        {screen === 'questions' ? (
          <QuestionsScreen
            answers={answers}
            submitted={questionsSubmitted}
            onAnswersChange={setAnswers}
            onSubmittedChange={setQuestionsSubmitted}
            onContinue={() => {
              setReturnScreen('questions')
              setScreen('modern')
            }}
          />
        ) : null}
        {screen === 'modern' ? (
          <ModernScreen
            onExplore={() => openSide('explore')}
            onCredits={() => openSide('credits')}
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
