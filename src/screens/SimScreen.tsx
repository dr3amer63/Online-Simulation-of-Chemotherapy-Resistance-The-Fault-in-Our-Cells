import { useEffect, useMemo, useRef, useState } from 'react'
import { BeadCanvas } from '../components/BeadCanvas'
import { CompositionBars } from '../components/CompositionBars'
import { SiteFooter } from '../components/SiteFooter'
import { colorLabel } from '../content/colors'
import type { AppConfig } from '../app/types'
import { toSimConfig } from '../app/types'
import {
  afterKillSnapshot,
  growthPerCycleTotal,
  runOneReplicate,
  startTumor,
  total,
  type CycleLog,
  type RunResult,
} from '../sim/engine'

type Phase = 'ready' | 'grow' | 'kill' | 'return' | 'cycle-end' | 'run-end'

interface Props {
  config: AppConfig
  onComplete: (runs: RunResult[]) => void
}

const STEP_MS = 1100

const PHASE_ORDER_RESIST: Phase[] = ['grow', 'kill', 'return', 'cycle-end']
const PHASE_ORDER_CONTROL: Phase[] = ['grow', 'kill', 'cycle-end']

function phaseLabel(phase: Phase): string {
  switch (phase) {
    case 'ready':
      return 'Ready'
    case 'grow':
      return 'Growth'
    case 'kill':
      return 'Chemo'
    case 'return':
      return 'Resistance'
    case 'cycle-end':
      return 'Cycle done'
    case 'run-end':
      return 'Run done'
    default:
      return phase
  }
}

function phaseHighlight(phase: Phase): 'grow' | 'kill' | 'return' | null {
  if (phase === 'grow') return 'grow'
  if (phase === 'kill') return 'kill'
  if (phase === 'return') return 'return'
  return null
}

export function SimScreen({ config, onComplete }: Props) {
  const hasResist = !config.noResistance && config.resistant.length > 0
  const phaseTrack = hasResist ? PHASE_ORDER_RESIST : PHASE_ORDER_CONTROL
  const readyNote = hasResist
    ? `Resistant: ${config.resistant.map(colorLabel).join(', ')}`
    : 'Control: no resistance'

  const [replicate, setReplicate] = useState(1)
  const [runs, setRuns] = useState<RunResult[]>([])
  const [currentRun, setCurrentRun] = useState<RunResult | null>(null)
  const [cycleIndex, setCycleIndex] = useState(0)
  const [progressPhase, setProgressPhase] = useState<Phase>('ready')
  const [viewPhase, setViewPhase] = useState<Phase>('ready')
  const [displayCounts, setDisplayCounts] = useState(startTumor)
  const [highlight, setHighlight] = useState<'grow' | 'kill' | 'return' | null>(
    null,
  )
  const [auto, setAuto] = useState(false)
  const [deltaLine, setDeltaLine] = useState(
    () => `Start: ${total(startTumor())} cells`,
  )
  const [note, setNote] = useState(readyNote)

  const log: CycleLog | null = currentRun?.logs[cycleIndex] ?? null
  const reviewing = viewPhase !== progressPhase
  const cycleNum =
    progressPhase === 'ready'
      ? 0
      : progressPhase === 'run-end'
        ? 5
        : cycleIndex + 1

  const showPhaseSnapshot = (phase: Phase, activeLog: CycleLog) => {
    setViewPhase(phase)
    setHighlight(phaseHighlight(phase))

    if (phase === 'grow') {
      setDisplayCounts(activeLog.afterGrowth)
      setDeltaLine(`+${activeLog.grownTotal} from division`)
      setNote('Faster colors add more each cycle.')
      return
    }
    if (phase === 'kill') {
      setDisplayCounts(afterKillSnapshot(activeLog))
      setDeltaLine(`-${activeLog.killedTotal} blind one-by-one pulls`)
      setNote('MIT chemo: take beads out without looking.')
      return
    }
    if (phase === 'return') {
      setDisplayCounts(activeLog.after)
      if (activeLog.returnedTotal > 0) {
        setDeltaLine(`+${activeLog.returnedTotal} resistant returned`)
        setNote('MIT rule: 3 dead of one resistant color → 2 back.')
      } else {
        setDeltaLine('+0 returned')
        setNote('Need 3 of the same resistant color in the dead pile.')
      }
      return
    }
    if (phase === 'cycle-end') {
      setHighlight(null)
      setDisplayCounts(activeLog.after)
      const net = total(activeLog.after) - total(activeLog.before)
      const sign = net > 0 ? '+' : ''
      setDeltaLine(`Tumor now ${total(activeLog.after)} (${sign}${net})`)
      setNote(
        hasResist
          ? 'Resistant / fast clones tend to remain.'
          : 'No bounce-back. Growth vs kill only.',
      )
    }
  }

  const resetReady = (nextReplicate: number) => {
    setReplicate(nextReplicate)
    setProgressPhase('ready')
    setViewPhase('ready')
    setCurrentRun(null)
    setCycleIndex(0)
    setHighlight(null)
    setDisplayCounts(startTumor())
    setDeltaLine(`Start: ${total(startTumor())} cells`)
    setNote(
      hasResist
        ? `Resistant: ${config.resistant.map(colorLabel).join(', ')}`
        : 'Control: no resistance',
    )
  }

  const returnToProgress = () => {
    if (!log) return
    if (progressPhase === 'run-end' && currentRun) {
      setViewPhase('run-end')
      setHighlight(null)
      setDisplayCounts(currentRun.final)
      setDeltaLine(`Final: ${currentRun.total} cells`)
      setNote(
        replicate < 3
          ? 'Same rules next; new random kills.'
          : 'Triplicate complete.',
      )
      return
    }
    if (progressPhase === 'ready') return
    showPhaseSnapshot(progressPhase, log)
  }

  const jumpToPill = (step: Phase) => {
    if (!log) return
    if (progressPhase === 'ready' || progressPhase === 'run-end') return

    const progressIdx = phaseTrack.indexOf(progressPhase)
    const stepIdx = phaseTrack.indexOf(step)
    if (stepIdx < 0 || stepIdx > progressIdx) return

    if (auto) setAuto(false)
    showPhaseSnapshot(step, log)
  }

  const advance = () => {
    if (reviewing) {
      returnToProgress()
      return
    }

    if (progressPhase === 'ready') {
      const result = runOneReplicate(toSimConfig(config), replicate)
      setCurrentRun(result)
      setCycleIndex(0)
      setProgressPhase('grow')
      showPhaseSnapshot('grow', result.logs[0])
      return
    }

    if (!currentRun || !log) return

    if (progressPhase === 'run-end') {
      const nextRuns = [...runs, currentRun]
      setRuns(nextRuns)
      if (replicate < 3) {
        resetReady(replicate + 1)
      } else {
        onComplete(nextRuns)
      }
      return
    }

    const idx = phaseTrack.indexOf(progressPhase)
    if (idx >= 0 && idx < phaseTrack.length - 1) {
      const next = phaseTrack[idx + 1]
      setProgressPhase(next)
      showPhaseSnapshot(next, log)
      return
    }

    if (progressPhase === 'cycle-end') {
      const nextCycle = cycleIndex + 1
      if (nextCycle < currentRun.logs.length) {
        setCycleIndex(nextCycle)
        setProgressPhase('grow')
        showPhaseSnapshot('grow', currentRun.logs[nextCycle])
      } else {
        setAuto(false)
        setProgressPhase('run-end')
        setViewPhase('run-end')
        setHighlight(null)
        setDisplayCounts(currentRun.final)
        setDeltaLine(`Final: ${currentRun.total} cells`)
        setNote(
          replicate < 3
            ? 'Same rules next; new random kills.'
            : 'Triplicate complete. Stay here until you continue.',
        )
      }
    }
  }

  const advanceRef = useRef(advance)

  useEffect(() => {
    advanceRef.current = advance
  })

  useEffect(() => {
    if (!auto || reviewing) return
    if (progressPhase === 'run-end' || progressPhase === 'ready') return
    const t = window.setTimeout(() => advanceRef.current(), STEP_MS)
    return () => clearTimeout(t)
  }, [auto, progressPhase, viewPhase, cycleIndex, currentRun, replicate, reviewing])

  const steps = useMemo(
    () =>
      hasResist
        ? (['grow', 'kill', 'return', 'cycle-end'] as Phase[])
        : (['grow', 'kill', 'cycle-end'] as Phase[]),
    [hasResist],
  )

  const nextHint = (() => {
    if (reviewing) return `Back to ${phaseLabel(progressPhase)}`
    if (progressPhase === 'ready') return 'Begin growth'
    if (progressPhase === 'run-end') {
      return replicate < 3 ? 'Next replicate' : 'See results'
    }
    const idx = phaseTrack.indexOf(progressPhase)
    if (idx >= 0 && idx < phaseTrack.length - 1) {
      return `Next: ${phaseLabel(phaseTrack[idx + 1])}`
    }
    if (progressPhase === 'cycle-end') {
      return cycleIndex + 1 < 5 ? 'Next cycle' : 'Finish run'
    }
    return 'Next'
  })()

  const cycleNet =
    log && (viewPhase === 'cycle-end' || progressPhase === 'run-end')
      ? total(log.after) - total(log.before)
      : null

  const progressIdx =
    progressPhase === 'ready'
      ? -1
      : progressPhase === 'run-end'
        ? phaseTrack.length - 1
        : phaseTrack.indexOf(progressPhase)

  return (
    <section className="screen screen--sim">
      <header className="sim-hud">
        <div>
          <p className="eyebrow">Simulation</p>
          <h1>
            Run {replicate}/3 · Cycle {cycleNum}/5
          </h1>
        </div>
        <div className="sim-hud__meta">
          <span className="pill">
            {hasResist
              ? `Resist: ${config.resistant.map(colorLabel).join(', ')}`
              : 'No resistance'}
          </span>
          <button
            type="button"
            className={`btn btn--small btn--primary${auto ? ' is-auto-on' : ''}`}
            onClick={() => setAuto((a) => !a)}
            title={
              auto
                ? 'Pause automatic stepping'
                : 'Play through steps without tapping Next each time'
            }
          >
            {auto ? 'Pause' : 'Auto run'}
          </button>
        </div>
      </header>

      <div className="sim-layout">
        <div className="sim-stage-wrap">
          <div className="sim-stage-caption" aria-live="polite">
            {total(displayCounts)} cells
            {viewPhase !== 'ready' ? ` · ${phaseLabel(viewPhase)}` : ''}
            {reviewing ? ' · review' : ''}
          </div>
          <div className="sim-stage">
            <BeadCanvas counts={displayCounts} highlight={highlight} />
          </div>
        </div>

        <aside className="sim-side">
          <div className="panel panel--status">
            <p className="phase-hint">Tap a reached step to check its numbers</p>
            <ol className="phase-steps" aria-label="Cycle phases">
              {steps.map((step) => {
                const stepIdx = phaseTrack.indexOf(step)
                const reachable = progressIdx >= 0 && stepIdx <= progressIdx
                const active = viewPhase === step
                const isFrontier = progressPhase === step && !reviewing
                const done = reachable && stepIdx < progressIdx

                return (
                  <li key={step}>
                    <button
                      type="button"
                      className={`phase-steps__item${active ? ' is-active' : ''}${done && !active ? ' is-done' : ''}${isFrontier && !active ? ' is-frontier' : ''}${reachable ? ' is-clickable' : ''}`}
                      disabled={!reachable}
                      onClick={() => jumpToPill(step)}
                      aria-current={active ? 'step' : undefined}
                      title={
                        reachable
                          ? `Show ${phaseLabel(step)} numbers`
                          : 'Not reached yet'
                      }
                    >
                      {phaseLabel(step)}
                    </button>
                  </li>
                )
              })}
            </ol>

            {reviewing ? (
              <p className="review-banner">
                Reviewing {phaseLabel(viewPhase)}. Continue from{' '}
                {phaseLabel(progressPhase)} when ready.
              </p>
            ) : null}

            <div className="status-block">
              <p className="status-kicker">{phaseLabel(viewPhase)}</p>
              <p className="status-delta">{deltaLine || '…'}</p>
              <p className="status-note">{note}</p>
            </div>

            <dl className="stat-grid">
              <div>
                <dt>Growth / 30s</dt>
                <dd>+{growthPerCycleTotal(config.growth)}</dd>
              </div>
              <div>
                <dt>Chemo pulls / 30s</dt>
                <dd>-{config.pullsPerInterval}</dd>
              </div>
              {cycleNet !== null ? (
                <div>
                  <dt>Cycle net</dt>
                  <dd>
                    {cycleNet > 0 ? '+' : ''}
                    {cycleNet}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <CompositionBars title="Tumor mix" counts={displayCounts} />

          <button type="button" className="btn btn--primary" onClick={advance}>
            {nextHint}
          </button>
        </aside>
      </div>
      <SiteFooter />
    </section>
  )
}
