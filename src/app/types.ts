import type { BeadColor } from '../content/colors'
import {
  CYCLES_PER_RUN,
  DEFAULT_PULLS_PER_INTERVAL,
  defaultGrowthRates,
  type SimConfig,
} from '../sim/engine'

export type Screen =
  | 'intro'
  | 'mapping'
  | 'sim'
  | 'results'
  | 'questions'
  | 'modern'
  | 'explore'
  | 'credits'

export interface AppConfig extends SimConfig {
  noResistance: boolean
}

export function makeDefaultConfig(resistant: BeadColor[]): AppConfig {
  return {
    resistant,
    growth: defaultGrowthRates(),
    pullsPerInterval: DEFAULT_PULLS_PER_INTERVAL,
    cycles: CYCLES_PER_RUN,
    noResistance: false,
  }
}

export function toSimConfig(cfg: AppConfig): SimConfig {
  return {
    resistant: cfg.noResistance ? [] : cfg.resistant.slice(0, 2),
    growth: { ...cfg.growth },
    pullsPerInterval: cfg.pullsPerInterval,
    cycles: cfg.cycles,
  }
}

export function pickTwoResistant(): BeadColor[] {
  const ids: BeadColor[] = ['pink', 'orange', 'yellow', 'purple', 'green']
  const a = Math.floor(Math.random() * 5)
  let b = Math.floor(Math.random() * 5)
  while (b === a) b = Math.floor(Math.random() * 5)
  return [ids[a], ids[b]]
}
