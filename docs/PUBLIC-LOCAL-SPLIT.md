# Public vs Local Split

This repository is public and project-agnostic. Treat tracked files as framework material that another developer can clone without inheriting your machine paths, private MCP servers, client projects, credentials, audit output, or personal agent lore.

## Track Public Files

Commit these when they are generic and reusable:

- `mcp.example.json` - sanitized agent registry template.
- `.vscode/mcp.example.json` - minimal VS Code MCP server entry.
- `agents/*.md` - public-safe showcase or framework agents.
- `templates/*.md` - reusable agent/profile templates.
- `docs/*.md` - framework documentation.
- `scripts/*` - generic audit helpers and MCP server code.
- `projects/README.md` - explains the local override pattern.

## Keep Local Files Untracked

Never commit these from your personal machine or a consuming project:

- `mcp.json`
- `.vscode/mcp.json`
- `.config/`
- `.env`, `.env.local`, `.env.*.local`
- `projects/<project-name>/`
- `agents/characters.yaml`
- `generations/`
- `audits/*.md`
- `agency.html`
- `resources/README.local.md` — machine paths to more agent images / videos / Favs

## Agent media layers

| Layer | Location | Tracked? |
|-------|----------|----------|
| Framework masters (1×1 + 16×9 webp, loft banner) | `resources/images/` | yes |
| Path map for humans/agents | `resources/README.md` + `README.local.example.md` | yes |
| Your machine paths | `resources/README.local.md` | **no** |
| Private generations / !Favs | consuming project e.g. `www/jenninexus/storage/agency/generations/` | **no** (project gitignore) |
| Hosted Discord/site assets | `jenninexus.com/resources/images/agency/agents/` | deploy from www |

SEGO example private Favs root:

```text
C:\Users\Owner\Projects\www\jenninexus\storage\agency\generations\!Favs
```

Canonical public masters:

```text
C:\Github\agency\resources\images\agents\*-1x1.webp
C:\Github\agency\resources\images\agents\*-16x9.webp
C:\Github\agency\resources\images\banner.jpg
```

Discord Visual Profiles (:8777) read hosted URLs from `jenni-bot/resources/agency-profiles.json` (`avatarUrl` + `bannerUrl` per agent).


## Project Override Rule

If an agent profile names real project pages, local paths, private audit scripts, private service names, or project-specific visual lore, it belongs in:

```text
projects/<project-name>/
```

That directory is gitignored. Public origin agents in `agents/` should describe reusable responsibilities and audit patterns, not one project's private implementation.

## Submodule Rule

When this repo is embedded as a submodule, the submodule path is a consumer checkout. Do not do normal development there.

Use this flow:

```bash
cd /path/to/canonical/agency
# edit public framework files
git add <files>
git commit -m "docs: update agency workflow"
git push

cd /path/to/parent-project
git submodule update --remote storage/agency
git add storage/agency
git commit -m "chore: bump agency submodule"
```

If a future agent sees dirty files inside `storage/agency`, it should stop and classify them:

- Public framework change: move/copy the change to the canonical agency clone, commit there, then bump the submodule.
- Project-local change: move it to `projects/<project-name>/` or the consuming project's own `storage/agency` documentation.
- Generated output: leave ignored or delete only when explicitly asked.

## MCP Rule

Use examples for sharing and local files for real integration:

```text
mcp.example.json          tracked, public registry template
mcp.json                  ignored, local/private populated registry
.vscode/mcp.example.json  tracked, server stub only
.vscode/mcp.json          ignored, local MCP host config
```

Do not put personal MCP server names, absolute local paths, SSH hosts, API keys, or project-private agent schedules in tracked public files.

## Discord / chat voice

Agency agents may also appear as Discord posters (JN bot catalogue). That register is separate:

| Layer | Location | Tracked? |
|-------|----------|----------|
| Shared loft attributes | `docs/STUDIO-VOICE.md` | yes (this repo) |
| Discord catalogue + chatVoice | `jenni-bot/resources/agency-profiles.json` | jenni-bot repo |
| Theme / desk accents (Discord embed colors) | `www-theme-kit/profiles/agency.json` | www-theme-kit |
| Pin + chat copy | `jenni-bot/content/agency-loft-pin.md` · `agency-chat.md` | jenni-bot |
| Channel IDs / webhook URLs | `socials/storage/docs/DISCORD.md` + `.env` | **no** (gitignored) |
| Draft / previewer | `socials/content/jenninexus/discord/drafts/` · `:8777` | socials |

Do not put Discord webhook URLs, bot tokens, or channel IDs in this public repo.

## Sibling repos (work interchangeably)

| Repo | Role | Public docs | Private / local |
|------|------|-------------|-----------------|
| `C:\Github\agency` | Framework agents + media masters | `docs/`, `agents/`, `resources/images/` | `projects/`, `mcp.json`, `ROADMAP.md` (this file is local) |
| `C:\Github\jenni-bot` | Discord bot runtime | `docs/JENNIBOT.md`, public README | `.env`, `dev-log-sego.yaml` |
| `C:\Github\socials` | Webhooks, drafts, previewer, MCP | `docs/DISCORD.md` (generic) | `storage/docs/*`, `.env`, `mcp-socials.yaml` |
| www `…/storage/agency` | Submodule checkout of agency | bump only | never develop here — see Submodule Rule |

When editing loft pin / chat: change **jenni-bot** + **socials** drafts; when editing character lore: change **agency** `agents/*.md` then sync `chatVoice` samples.
