/**
 * Quick smoke checks for MIT-rule invariants (run via: npx --yes tsx scripts/smoke-sim.ts)
 */
import {
  DEFAULT_PULLS_PER_INTERVAL,
  defaultGrowthRates,
  runOneReplicate,
  runTriplicate,
  startTumor,
  total,
} from '../src/sim/engine'

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg)
}

const growth = defaultGrowthRates()
assert(total(growth) === 9, 'growth cup total should be 9')
assert(total(startTumor()) === 50, 'start tumor should be 50')

const control = runOneReplicate(
  {
    resistant: [],
    growth,
    pullsPerInterval: DEFAULT_PULLS_PER_INTERVAL,
    cycles: 5,
  },
  1,
)
assert(control.logs.length === 5, 'five intervals')
assert(control.total < 50, 'no-resistance tumor should shrink with default pulls')

const resistant = runOneReplicate(
  {
    resistant: ['green', 'purple'],
    growth,
    pullsPerInterval: DEFAULT_PULLS_PER_INTERVAL,
    cycles: 5,
  },
  1,
)
assert(
  resistant.total >= control.total,
  'resistant run should not end smaller than matched control expectation on average; got ' +
    resistant.total +
    ' vs ' +
    control.total,
)

const trips = runTriplicate({
  resistant: ['yellow', 'pink'],
  growth,
  pullsPerInterval: DEFAULT_PULLS_PER_INTERVAL,
  cycles: 5,
})
assert(trips.length === 3, 'triplicate should produce 3 runs')

console.log('smoke-sim: ok')
console.log('  control total:', control.total)
console.log('  G/P resist total:', resistant.total)
console.log(
  '  triplicate totals:',
  trips.map((t) => t.total).join(', '),
)
