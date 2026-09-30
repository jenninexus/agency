# AGENTS.md — AI Agent Agency

Instructions for any coding agent (Claude, Codex, Grok, Cursor, Copilot, …) that opens this folder.

## First: which checkout are you in?

```bash
git rev-parse --show-superproject-working-tree
```

- **Prints a path** → you are inside a **consumer's read-only submodule** (usually `<project>/storage/agency/`).
  - Do **not** edit, stage, commit or push anything here. Tracked files are read-only on purpose, a
    pre-commit guard refuses edits, and the push URL is `no_push`. Do not clear the read-only attribute
    or change the push URL to get around it.
  - The **only** writable place is `projects/<project>/` (gitignored). Start a desk overlay with
    `node storage/agency/scripts/consumer.mjs overlay <Agent>` from the consumer root.
  - To change a public desk, doc or script: make the change in the agency repo's **own** checkout,
    push it to `origin/main`, then run `node storage/agency/scripts/consumer.mjs sync --commit` in each consumer.
- **Prints nothing** → you are in the **agency repo itself** (the canonical checkout). Edit here, then push.

Full contract: [`docs/CONSUMERS.md`](docs/CONSUMERS.md).

## Rules in the canonical checkout

- This repository is **public**. Only generic, reusable content goes in `agents/`, `docs/`, `templates/`,
  `examples/`, `scripts/`: no real site paths, audit scores, IDs, tokens, webhook URLs, personal names
  beyond the published credit, or private project lore.
- Project-specific material belongs in the consumer's `projects/<project>/` overlay, never here.
- A studio's own characters (not the seven desks) live in that studio's private repository.
- Each desk keeps one `### Discord chatVoice (community register)` section; bot runtime catalogues copy
  from it, never the other way round.
- Run `npm run validate` before committing.
