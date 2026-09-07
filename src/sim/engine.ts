/**
 * MIT BLOSSOMS / Koch Institute bead-lab rules (The Fault in Our Cells).
 * Digital stand-in: `pullsPerInterval` approximates student chemo pull speed.
 */
import { COLOR_IDS, COLORS, type BeadColor } from '../content/colors'

export const START_COUNT = 10
export const CYCLES_PER_RUN = 5
export const REPLICATE_COUNT = 3
export const RESISTANCE_TRIGGER = 3
export const RESISTANCE_RETURN = 2
export const DEFAULT_PULLS_PER_INTERVAL = 16

export type Counts = Record<BeadColor, number>

export function emptyCounts(): Counts {
  return { pink: 0, orange: 0, yellow: 0, purple: 0, green: 0 }
}

export function startTumor(): Counts {
  const c = emptyCounts()
  for (const id of COLOR_IDS) c[id] = START_COUNT
  return c
}

export function total(counts: Counts): number {
  return COLOR_IDS.reduce((sum, id) => sum + counts[id], 0)
}

export function cloneCounts(c: Counts): Counts {
  return { ...c }
}

export function defaultGrowthRates(): Counts {
  const g = emptyCounts()
  for (const color of COLORS) g[color.id] = color.defaultGrowth
  return g
}

export interface SimConfig {
  resistant: BeadColor[]
  growth: Counts
  pullsPerInterval: number
  cycles: number
}

export interface CycleLog {
  cycle: number
  before: Counts
  afterGrowth: Counts
  killed: Counts
  returned: Counts
  after: Counts
  grownTotal: number
  killedTotal: number
  returnedTotal: number
}

export interface RunResult {
  replicate: number
  final: Counts
  total: number
  logs: CycleLog[]
}

function pickRandomAlive(counts: Counts): BeadColor | null {
  const bag: BeadColor[] = []
  for (const id of COLOR_IDS) {
    for (let i = 0; i < counts[id]; i++) bag.push(id)
  }
  if (bag.length === 0) return null
  return bag[Math.floor(Math.random() * bag.length)]
}

function tryResistanceReturn(
  dead: Counts,
  resistant: BeadColor[],
): { returned: Counts; remainingDead: Counts } {
  const returned = emptyCounts()
  const remainingDead = cloneCounts(dead)

  for (const color of resistant) {
    while (remainingDead[color] >= RESISTANCE_TRIGGER) {
      remainingDead[color] -= RESISTANCE_TRIGGER
      returned[color] += RESISTANCE_RETURN
    }
  }

  return { returned, remainingDead }
}

export function growTumor(counts: Counts, growth: Counts): Counts {
  const next = cloneCounts(counts)
  for (const id of COLOR_IDS) next[id] += growth[id]
  return next
}

function addCounts(a: Counts, b: Counts): Counts {
  const out = emptyCounts()
  for (const id of COLOR_IDS) out[id] = a[id] + b[id]
  return out
}

export function runInterval(
  tumorIn: Counts,
  deadIn: Counts,
  config: SimConfig,
): {
  afterGrowth: Counts
  killed: Counts
  returned: Counts
  tumor: Counts
  deadPile: Counts
} {
  let tumor = growTumor(tumorIn, config.growth)
  const afterGrowth = cloneCounts(tumor)
  const killed = emptyCounts()
  const returned = emptyCounts()
  let deadPile = cloneCounts(deadIn)

  for (let pull = 0; pull < config.pullsPerInterval; pull++) {
    if (total(tumor) === 0) break
    const pick = pickRandomAlive(tumor)
    if (!pick) break
    tumor[pick] -= 1
    killed[pick] += 1
    deadPile[pick] += 1

    if (config.resistant.length > 0) {
      const res = tryResistanceReturn(deadPile, config.resistant)
      deadPile = res.remainingDead
      if (total(res.returned) > 0) {
        tumor = addCounts(tumor, res.returned)
        for (const id of COLOR_IDS) returned[id] += res.returned[id]
      }
    }
  }

  return { afterGrowth, killed, returned, tumor, deadPile }
}

export function runOneReplicate(config: SimConfig, replicate: number): RunResult {
  let tumor = startTumor()
  let deadPile = emptyCounts()
  const logs: CycleLog[] = []

  for (let cycle = 1; cycle <= config.cycles; cycle++) {
    const before = cloneCounts(tumor)
    const step = runInterval(tumor, deadPile, config)
    tumor = step.tumor
    deadPile = step.deadPile

    logs.push({
      cycle,
      before,
      afterGrowth: step.afterGrowth,
      killed: step.killed,
      returned: step.returned,
      after: cloneCounts(tumor),
      grownTotal: total(config.growth),
      killedTotal: total(step.killed),
      returnedTotal: total(step.returned),
    })
  }

  return {
    replicate,
    final: tumor,
    total: total(tumor),
    logs,
  }
}

export function runTriplicate(config: SimConfig): RunResult[] {
  return Array.from({ length: REPLICATE_COUNT }, (_, i) =>
    runOneReplicate(config, i + 1),
  )
}

export function meanCounts(runs: RunResult[]): Counts {
  const sum = emptyCounts()
  for (const run of runs) {
    for (const id of COLOR_IDS) sum[id] += run.final[id]
  }
  const n = runs.length || 1
  const mean = emptyCounts()
  for (const id of COLOR_IDS) mean[id] = Math.round((sum[id] / n) * 10) / 10
  return mean
}

export function growthPerCycleTotal(growth: Counts): number {
  return total(growth)
}

/** UI helper: tumor after growth minus kills (before resistance highlight). */
export function afterKillSnapshot(log: CycleLog): Counts {
  const mid = cloneCounts(log.afterGrowth)
  for (const id of COLOR_IDS) {
    mid[id] = Math.max(0, mid[id] - log.killed[id])
  }
  return mid
}
