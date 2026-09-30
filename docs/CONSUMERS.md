# Using Agency in another repository

Any project can carry this repo as a **read-only git submodule** and keep its own customizations
beside the public desks. This page is the contract; [`scripts/consumer.mjs`](../scripts/consumer.mjs)
enforces it.

## Cheat sheet (the only commands you need)

Run these from the **consumer's root**, never from inside `storage/agency/`.

| I want to… | Command |
|---|---|
| see where things stand | `node storage/agency/scripts/consumer.mjs status` |
| get the latest desks (after agency was pushed) | `node storage/agency/scripts/consumer.mjs sync --commit` |
| customize a desk for this project | `node storage/agency/scripts/consumer.mjs overlay Bloggie` → edit `storage/agency/projects/<project>/Bloggie.md` |
| set up a fresh clone | `git submodule update --init storage/agency` then `node storage/agency/scripts/consumer.mjs protect` |
| change a public desk itself | edit the **agency repo's own checkout**, push to `origin/main`, then `sync --commit` in each consumer |
| list the commands | `node storage/agency/scripts/consumer.mjs help` |

Consumers that have a `package.json` also expose `npm run agency:status` and `npm run agency:sync`.

## The rule

1. **Agency is edited in one place:** its own checkout. Change `agents/`, `docs/`, `templates/` or
   `scripts/` there, commit, and push to `origin/main`.
2. **Every consumer is read-only.** A consumer never commits, pushes or leaves edits inside its
   submodule checkout. It only moves its pin forward with `consumer.mjs sync`.
3. **Customization lives in the consumer's overlay folder**, `projects/<project>/` inside the
   submodule checkout. `projects/*` is gitignored by this repo, so overlays never reach the public
   repository and never make the submodule dirty.

```
<consumer>/
├── .gitmodules                      storage/agency → https://github.com/jenninexus/agency.git
└── storage/agency/                  read-only submodule, pinned to a commit on origin/main
    ├── agents/*.md                  public desks — read, never edit here
    ├── scripts/consumer.mjs         status · check · sync · protect
    └── projects/<project>/          YOUR overlays (gitignored): <Agent>.md, generations/, notes
```

## Setup (once per clone)

```bash
git submodule add https://github.com/jenninexus/agency.git storage/agency
node storage/agency/scripts/consumer.mjs protect
```

On an existing clone: `git submodule update --init storage/agency`, then `protect`.

`protect` makes the checkout read-only for **every** tool, not only one AI agent:

| Layer | Who it stops | Set by |
|---|---|---|
| Read-only file attribute on every tracked file | any editor, IDE, script or agent that writes files | `protect` (and re-applied by `sync`) |
| Pre-commit hook in the consumer (`consumer.mjs check`) | any commit that includes submodule edits | `protect` |
| Pre-push hook inside the submodule + push URL `no_push` | any push from the consumer checkout | `protect` |
| [`AGENTS.md`](../AGENTS.md) at the agency root | Codex, Grok, Cursor, Copilot and other agents that read `AGENTS.md` | ships with the repo |
| Agent permission settings (for example `.claude/settings.json` deny rules) | that agent's edit tools | the consumer, optional |

Hooks, push URL and file attributes are local to each clone, so run `protect` after every fresh clone.

If your repo ignores `storage/`, re-include the submodule path first, for example:

```gitignore
storage/*
!storage/agency
```

## Staying current

```bash
node storage/agency/scripts/consumer.mjs status          # pin vs origin/main, edits, overlays, protection
node storage/agency/scripts/consumer.mjs sync --commit   # fetch, move the pin, commit only the gitlink
```

`sync` refuses while the submodule has edits. `check` (run by the pre-commit hook) refuses a commit
when the submodule is edited, or when the consumer pins a commit that is not on agency `origin/main`,
for example a local commit made inside the submodule or a commit dropped by a history rewrite.

## Customizing a desk (overlays)

Start from what exists, then add only your difference:

1. Pick the public desk closest to what you need (`agents/*.md`).
2. `node storage/agency/scripts/consumer.mjs overlay <Agent>` creates
   `projects/<project>/<Agent>.md` from [`templates/OVERLAY-TEMPLATE.md`](../templates/OVERLAY-TEMPLATE.md):
   a header naming the public desk, a "what changes here" table, project paths, project-only rules,
   an audit log and a promotion checklist. It never copies the public profile.
3. Fill in only the delta. The public desk keeps supplying personality, rules and `chatVoice`, so
   `sync` brings every improvement to your overlay's base automatically.
4. A **brand-new character** (not a variant of a desk) starts from
   [`templates/AGENT-TEMPLATE.md`](../templates/AGENT-TEMPLATE.md), copied into `projects/<project>/`.
5. A finding that would help every project goes back to the public desk: edit it in the agency
   repo's own checkout and push.

In a plain clone (no submodule) the same command works from the agency root:
`node scripts/consumer.mjs overlay Bloggie --project mysite`.

An overlay file names the public desk it extends and records how it differs:

```markdown
> Extends public agents/Bloggie.md — changes: scope, paths · Public display: no (in development)
```

- Put only project facts in an overlay: real paths, audit scripts, scores, private lore.
- Never copy a whole public profile into an overlay. Link to it and add the delta.
- `projects/<project>/` exists only on the disk that made it. Back it up by making that folder its own
  **private** git repository (a LAN or private remote) — this repo ignores `projects/*`, so a nested
  repository there is invisible to the submodule. It is never pushed from the submodule itself.

## Sharing a customized character between your own projects

When two of your projects use the same customized character (for example a site and its Discord
bot), do not keep two overlays that drift apart:

- **One owner.** The overlay lives in exactly one place — the project that owns the character.
- **Others read what they need at runtime:** names and image URLs from the owner's public page or
  API, and a small runtime catalogue (the bot's JSON) with a drift check against the owner.
- **Many shared characters across several private projects?** Give them their own **private**
  character repository and add it as a second read-only submodule next to this one, with the same
  `status` / `sync` / `protect` flow. Keep public lore here and private lore there.

## Runtime catalogues

A bot or site that renders the desks (webhook names, avatars, `chatVoice` sample replies) keeps its
own runtime file, such as `resources/agency-profiles.json`. That file is a **consumer** of the lore.
When a desk's `### Discord chatVoice (community register)` changes here, update the runtime file to
match, ideally with a drift check that reads `storage/agency/agents/*.md`.

## Independent rosters

A studio with its own characters (not the seven desks) should not submodule this repo just to hold
them. Keep that roster in the studio's own private repository, publish only approved marketing fields
through the studio's own API, and let its tools read the private files directly. See
[`PUBLIC-LOCAL-SPLIT.md`](PUBLIC-LOCAL-SPLIT.md) for what may enter this public repository.
