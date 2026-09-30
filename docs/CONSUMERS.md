# Using Agency in another repository

Any project can carry this repo as a **read-only git submodule** and keep its own customizations
beside the public desks. This page is the contract; [`scripts/consumer.mjs`](../scripts/consumer.mjs)
enforces it.

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

`protect` makes the checkout read-only for git: it sets the submodule's push URL to `no_push`,
installs a pre-push hook inside the submodule that always refuses, and installs a pre-commit hook in
the consumer that runs `consumer.mjs check`. Hooks are local to each clone, so run `protect` after
every fresh clone.

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

## Overlays

An overlay file names the public desk it extends and records how it differs:

```markdown
> Extends public agents/Bloggie.md — changes: scope, paths · Public display: no (in development)
```

- Put only project facts in an overlay: real paths, audit scripts, scores, private lore.
- Never copy a whole public profile into an overlay. Link to it and add the delta.
- `projects/<project>/` exists only on the disk that made it. Back it up the way the project backs up
  other private files. It is never pushed from the submodule.

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
