# Contributing

Thanks for helping improve this unofficial educational port of the MIT BLOSSOMS / Koch Institute bead lab.

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

## Pull request checklist

1. Create a focused branch from `main`.
2. Prefer small PRs with one clear purpose.
3. Run:

   ```bash
   npm run lint
   npm run build
   ```

4. Describe what changed and why.
5. If you touch simulation rules, cite which MIT rule you matched or explain the intentional extension.

## Guidelines

- Keep growth cups, start counts, resistance (3 → 2), and five intervals aligned with the original lab unless documented otherwise.
- Chemo pull count per interval is a digital stand-in for student pull speed; do not present it as a number from the paper protocol.
- Always credit the original lesson contributors (Rachel Leeson, Simona Dalin, Emma Sedivy) and MIT BLOSSOMS / Koch Institute; do not claim official endorsement. See [CONTRIBUTORS.md](CONTRIBUTORS.md).
- Use clear commit messages that describe the change (for example `fix: restore bead counts after kill step`). Avoid personal chat logs or private discussion threads in commits or comments.

## Reporting issues

Open a GitHub issue with:

- What you expected
- What happened
- Browser / device if relevant
- Steps to reproduce

## Code of conduct

Be respectful. Harassment or discrimination is not welcome. Maintainers may close hostile or off-topic contributions.
