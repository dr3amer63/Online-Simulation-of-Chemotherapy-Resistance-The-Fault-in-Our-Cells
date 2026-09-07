# Online Simulation of Chemotherapy Resistance: The Fault in Our Cells

Unofficial interactive web port of the MIT BLOSSOMS / Koch Institute classroom bead lab
**[Chemotherapy Resistance: The Fault in Our Cells](https://web.mit.edu/blossoms/videos/lessons/chemotherapy_resistance_fault_our_cells/)**.

This project turns the paper-bag bead activity into a browser simulation so learners can see tumor heterogeneity and chemotherapy resistance, then answer reflection questions (model answers shown after submit; no grading).

| | |
| --- | --- |
| **Original lesson contributors** | Rachel Leeson, Simona Dalin, Emma Sedivy (MIT BLOSSOMS / Koch Institute) |
| **Online adaptation** | [Mwihaki](https://www.linkedin.com/in/dorcas-ndungu/) |
| **License (software)** | [MIT](LICENSE) |
| **Status** | Unofficial educational port (not an MIT product) |

## Features

- Pre-sim mapping of beads to real biology concepts
- Guided 30s-style intervals with clear phase state (Growth → Chemo → Resistance)
- Clickable phase pills to review earlier step numbers, then continue
- Three replicate runs (triplicate), matching the lab’s statistics option
- Source-inspired questions with model answers after submit
- Short “what’s newer” science note (plasticity / non-genetic resistance)
- Explore knobs limited to parameters that exist in the lab model
- Responsive layout for phone, tablet, and desktop

## How the simulation works

The engine follows the MIT simulation rules:

1. **Start:** 10 beads of each color (pink, orange, yellow, purple, green) = the tumor.
2. **Growth (every 30s):** add one “cup”: Pink +1, Orange +1, Yellow +2, Purple +2, Green +3.
3. **Chemo:** remove beads one-by-one at random (blind).
4. **Resistance:** when 3 beads of one assigned resistant color are in the dead pile, return 2 to the tumor.
5. **Duration:** 3 minutes → **5** growth intervals (growth at 0:30 … 2:30; stop at 3:00 with no extra cup).
6. **Replicates:** run the experiment **3 times** (triplicate).

**Digital-only stand-in:** the paper lab does not fix how many beads the “chemo” student pulls. Pull speed is whatever the student does by hand. This app uses a default of **16 blind pulls per 30s interval** so no-resistance tumors shrink on a similar scale to the teacher guide’s sample board. That value is adjustable in Explore and is labeled as pull speed, not as biology.

```
src/
  app/           Screen flow types and session config
  components/    Bead canvas, composition bars, footer
  content/       Colors, credits, questions, science note
  screens/       Intro → mapping → sim → results → questions → …
  sim/           MIT-rule simulation engine
```

## Requirements

- [Node.js](https://nodejs.org/) **20+**
- npm 10+ (comes with Node)

## Clone and run

```bash
git clone https://github.com/dr3amer63/Online-Simulation-of-Chemotherapy-Resistance-The-Fault-in-Our-Cells.git
cd Online-Simulation-of-Chemotherapy-Resistance-The-Fault-in-Our-Cells
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run smoke` | Quick simulation rule checks |

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Short version:

1. Fork the repo and create a branch.
2. Keep simulation rules faithful to the MIT bead lab unless you document an intentional extension.
3. Run `npm run lint` and `npm run build`.
4. Open a PR with a clear description of the change.

## Attribution and naming

Full credit list: [CONTRIBUTORS.md](CONTRIBUTORS.md).

**Original lesson contributors (instructors):**

- Rachel Leeson, Outreach Assistant, Koch Institute / MIT
- Simona Dalin, Ph.D. candidate, MIT Biology / Koch Institute
- Emma Sedivy, Ph.D. candidate, MIT Biology / Koch Institute

Program / institution: MIT BLOSSOMS / Koch Institute for Integrative Cancer Research at MIT  
Official lesson: [web.mit.edu/blossoms/…](https://web.mit.edu/blossoms/videos/lessons/chemotherapy_resistance_fault_our_cells/)  
Also see [NOTICE](NOTICE).

This repository name includes the lesson title for discoverability and credit. It is **not** an official MIT or Koch Institute release.

## License

- **Code and UI** in this repository: [MIT License](LICENSE) (copyright Mwihaki).
- **Original lesson content / pedagogy:** Rachel Leeson, Simona Dalin, Emma Sedivy, and MIT BLOSSOMS / Koch Institute. Do not imply endorsement.
