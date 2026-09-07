/**
 * Reflection prompts adapted from MIT BLOSSOMS / Koch Institute materials.
 * Model answers paraphrase teacher talking points. Not graded.
 */
export interface Question {
  id: string
  prompt: string
  modelAnswer: string
}

export const QUESTIONS: Question[] = [
  {
    id: 'main-idea',
    prompt:
      'Do you think all the cancer cells in a tumor have the same mutations? Why or why not?',
    modelAnswer:
      'No. As cells divide faster in a tumor they make more DNA mistakes, so different cells accumulate different mutations. That creates tumor heterogeneity - many populations (like the different bead colors) inside one tumor.',
  },
  {
    id: 'expect',
    prompt:
      'Before looking at your triplicate results: what did you expect to happen to the tumor under chemotherapy? Did your results match that expectation?',
    modelAnswer:
      'Many people expect the tumor to shrink evenly. Often it does not: resistant and/or fast-growing colors remain a larger share. Random kill order also makes each replicate a bit different - that variation is expected.',
  },
  {
    id: 'growth',
    prompt:
      'How did growth rate (how many beads of each color were added each cycle) affect the final tumor?',
    modelAnswer:
      'Colors that grow faster (green +3 each cycle vs pink +1) tend to make up more of the remaining tumor. The teacher guide notes green-resistant tumors are generally bigger than pink-resistant ones for this reason.',
  },
  {
    id: 'resistance',
    prompt:
      'What happened when certain colors were resistant compared with a no-resistance run? What does that mean for real chemotherapy?',
    modelAnswer:
      'Resistant colors can return to the tumor after being “killed,” so the tumor stays larger and skewed toward those clones. In patients, resistant cell populations survive therapy and can drive relapse. Different cells respond differently to chemo.',
  },
  {
    id: 'predict-hard',
    prompt:
      'Why is it hard to predict how a real tumor will respond to chemotherapy?',
    modelAnswer:
      'Tumors contain many different mutations and we cannot fully measure that heterogeneity. Different mutations change growth speed and drug sensitivity, so overall response is hard to forecast - a key talking point from the Koch / BLOSSOMS lesson.',
  },
  {
    id: 'triplicate',
    prompt:
      'Why run the simulation three times (in triplicate)? What did the differences between runs show?',
    modelAnswer:
      'Assessment Option C asks for resistance groups run in triplicate so you can see averages and variation. Because chemo pulls cells at random, each run differs slightly - like experimental noise. Comparing means across replicates is more trustworthy than one lucky (or unlucky) run.',
  },
  {
    id: 'writeup',
    prompt:
      'In a short experimental write-up: interpret your class-style results. Were they what you expected? What explains them? What could explain any surprises?',
    modelAnswer:
      'Interpret using three factors from the teacher guide: (1) growth rates by color, (2) which colors were resistant, (3) how aggressively cells were removed (kill speed/pressure). Surprises often come from randomness in which beads were pulled, or from resistance + fast growth stacking together.',
  },
]
