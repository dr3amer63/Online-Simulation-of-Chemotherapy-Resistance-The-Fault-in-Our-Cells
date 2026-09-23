# Contributing

Thanks for helping improve this unofficial educational port of the MIT BLOSSOMS / Koch Institute bead lab.

Please also read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Ways to help

- Bug reports and accessibility improvements
- Clearer learner-facing copy that stays faithful to the lab rules
- Tests for `src/sim/engine.ts`
- Documentation fixes
- Translations (preserve scientific meaning)

## Setup

```bash
git clone https://github.com/dr3amer63/Online-Simulation-of-Chemotherapy-Resistance-The-Fault-in-Our-Cells.git
cd Online-Simulation-of-Chemotherapy-Resistance-The-Fault-in-Our-Cells
npm install
npm run dev
```

Requirements: Node.js **20+**.

## Pull request checklist

1. Fork the repo and create a focused branch from `main`.
2. Prefer small PRs with one clear purpose.
3. Run:

   ```bash
   npm run lint
   npm run build
   npm run smoke
   ```

4. Describe what changed and why.
5. If you touch engine rules, cite which MIT rule you matched or explain the intentional extension.

## Guidelines

- Keep growth cups, start counts, and resistance (3 dead → 2 returned) aligned with the original lab unless documented otherwise.
- This online port uses **10 cycles per run** (the classroom video uses 5 in about 3 minutes). Keep that default unless you document a change.
- Chemo pull count per interval is a digital stand-in for student pull speed; do not present it as a number from the paper protocol.
- Always credit the original lesson contributors (Rachel Leeson, Simona Dalin, Emma Sedivy) and MIT BLOSSOMS / Koch Institute; do not claim official endorsement. See [CONTRIBUTORS.md](CONTRIBUTORS.md) and [NOTICE](NOTICE).
- Use clear commit messages that describe the change (for example `fix: restore bead counts after kill step`). Do not put personal chat logs or private discussion in commits or comments.

## Reporting issues

Open a GitHub issue (bug or feature template welcome) with:

- What you expected
- What happened
- Browser / device if relevant
- Steps to reproduce

## License

By contributing, you agree that your contributions are licensed under the same [MIT License](LICENSE) as this repository.
