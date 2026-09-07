export const CREDITS = {
  lessonTitle: 'Chemotherapy Resistance: The Fault in Our Cells',
  institution: 'Koch Institute for Integrative Cancer Research at MIT',
  program: 'MIT BLOSSOMS',
  instructors: [
    {
      name: 'Rachel Leeson',
      role: 'Outreach Assistant, Koch Institute for Integrative Cancer Research at MIT',
    },
    {
      name: 'Simona Dalin',
      role: 'Ph.D. candidate, MIT Department of Biology / Koch Institute',
    },
    {
      name: 'Emma Sedivy',
      role: 'Ph.D. candidate, MIT Department of Biology / Koch Institute',
    },
  ],
  lessonUrl:
    'https://web.mit.edu/blossoms/videos/lessons/chemotherapy_resistance_fault_our_cells/',
  adapterName: 'Mwihaki',
  adapterUrl: 'https://www.linkedin.com/in/dorcas-ndungu/',
  adapterWith: 'Cursor',
} as const

export const instructorNames = CREDITS.instructors.map((i) => i.name).join(', ')

export const MAPPING_ROWS: { sim: string; real: string }[] = [
  { sim: 'Colored bead', real: 'One cancer cell (a clone with a set of mutations)' },
  { sim: 'Black field (“bag”)', real: 'The tumor' },
  { sim: 'Bead color', real: 'Different mutation profile / cell population' },
  {
    sim: 'Growth pulse (+beads by color)',
    real: 'Cell division - some clones divide faster than others',
  },
  {
    sim: 'Random remove → dead pile',
    real: 'Chemotherapy kill that is not selective for color/clone',
  },
  {
    sim: 'Return 2 when 3 same resistant color die',
    real: 'Those clones are resistant and survive treatment',
  },
  { sim: '5 cycles per run', real: 'Time under growth + treatment' },
  {
    sim: '3 replicate runs',
    real: 'Repeating the experiment - chance variation, like a real lab',
  },
]
