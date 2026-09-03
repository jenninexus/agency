# Public vs Local Split

This repository is public and project-agnostic. Treat tracked files as framework material that another developer can clone without inheriting your machine paths, private MCP servers, client projects, credentials, audit output, or personal agent lore.

## Track Public Files

Commit these when they are generic and reusable:

- `mcp.example.json` - sanitized agent registry template. **`profile` (and `audit_script`) paths must exist in a fresh clone** — point at `agents/*.md` and `scripts/audit-template.ps1`, not consuming-site files.
- `.vscode/mcp.example.json` - minimal VS Code MCP server entry.
- `agents/*.md` - public-safe showcase or framework agents.
- `templates/*.md` - reusable agent/profile templates.
- `docs/*.md` - framework documentation (`ROADMAP.md` is the exception — gitignored).
- `scripts/*` - generic audit helpers and MCP server code.
- `projects/README.md` - explains the local override pattern only. Do **not** force-add `projects/<name>/` (including a project `README.md`).

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
- `docs/ROADMAP.md` — local next-work (gitignored even though `docs/` is tracked)
- `Plans/` — `_Active/` + `_Completed/` session checklists (gitignored; never push)

Tracked framework docs are `ART-STYLE.md`, `AGENT-GUIDE.md`, `STUDIO-VOICE.md`, `WORKFLOW.md`, `SCHEDULE.md`, `CHARACTER-DISPLAY.md`, and this file. Planning files are not part of the clone.

## Agent media layers

| Layer | Location | Tracked? |
|-------|----------|----------|
| Framework masters (1×1 + 16×9 webp, loft banner) | `resources/images/` | yes |
| Path map for humans/agents | `resources/README.md` + `README.local.example.md` | yes |
| Your machine paths | `resources/README.local.md` | **no** |
| Private generations / !Favs | consuming project e.g. `www/jenninexus/storage/agency/generations/` | **no** (project gitignore) |
| Hosted Discord/site assets | `jenninexus.com/resources/images/agency/agents/` | deploy from www |

Canonical public masters (repo-relative):

```text
resources/images/agents/*-1x1.webp
resources/images/agents/*-16x9.webp
resources/images/banner.jpg
```

The public roster is the **seven** desks (Vidette, Bloggie, GraphViz, GamerGirl, DivineDesign, Metrica, Vixel). Extra studio portraits (`cypher-*`, `missioncontrol-*`, `orbital-pipe-*`, `graph-viz-mg-*`) are gitignored — keep bytes locally if you have them; they are not extra public agents.

Private generation dumps stay in the **consuming site** gitignore (never this public tree). Do not commit machine-absolute Favs paths here.

Discord Visual Profiles (:8777) read hosted URLs from `jenni-bot/resources/agency-profiles.json` (`avatarUrl` + `bannerUrl` per agent).

**Character cards / profile viewer UX:** see [CHARACTER-DISPLAY.md](CHARACTER-DISPLAY.md) + `www-theme-kit/profiles/agency.json#character_display`. Local `agency.html` should match MG `/atlas` nav (arrows, swipe, wrap).


## Project Override Rule

If an agent profile names real project pages, local paths, private audit scripts, private service names, or project-specific visual lore, it belongs in:

```text
projects/<project-name>/
```

That directory is gitignored (`projects/*/`). If a `projects/<name>/README.md` was force-tracked, `git rm --cached` it — project rosters do not belong on origin. Public origin agents in `agents/` should describe reusable responsibilities and audit patterns, not one project's private implementation. The public showcase is the **seven** desks in `agents/*.md` (Vidette, Bloggie, GraphViz, GamerGirl, DivineDesign, Metrica, Vixel). Extra portraits for other studios (if still in `resources/images/agents/`) are not extra public agents.

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

A GitHub user does **not** need these siblings to use this framework. They are
how *this studio* composes the loft. Do not put machine-absolute clone paths in
tracked docs.

| Repo | Role | Clone users | Private / local |
|------|------|-------------|-----------------|
| **this repo** (`jenninexus/agency`) | Framework agents + media masters | `docs/`, `agents/`, `resources/images/`, MCP + templates | `projects/`, `mcp.json`, `docs/ROADMAP.md`, `Plans/` |
| `pdf-designer` | Résumé / PDF toolkit | public `docs/` + examples | vaults · bare commands |
| `socials` | Drafts, webhooks, `:8777` previewer | generic `docs/` when public | IDs · `.env` · brand YAMLs (**private today**) |
| `dashboard` | Dashboard seed kit | `docs/` · fictional sample data | `my-dashboard/` · `.env` |
| `jenni-bot` | Discord bot runtime (JN loft consumer) | public README + STYLE-SPEC | `.env`, webhook URLs, `agency-profiles.json` faces |
| `www-theme-kit` | Brand token kit | **not a public product** | Whole kit is network private infra |
| `voice-seed` | Writing-register **map** (`agencyAudit` / `agencyDiscordChat`) | **private today** — planned semi-public | Never paste vault / Patreon prose here |
| `theme-designer` | Teaching seed for palettes / `--dash-*` tokens | public Phase 1 — optional | Not a character generator; not www-theme-kit |
| `product-design` | Campaign / store board (`/jen:products`) | **no GitHub remote** | Cards in `docs/AGENCY.md` · registry |
| www `{site}/storage/agency` | Submodule checkout of agency | bump only | never develop here — see Submodule Rule |

**Martian Games** runs its own 3-agent roster (MissionControl / GlassViz / OrbitalPipe)
under the MG site tree. It is **not** a submodule extension of the JN 7-pack. Local
pointers may live in gitignored `projects/martiangames/`.

When editing loft pin / chat: change **jenni-bot** + **socials** drafts. When editing
character lore: change **agency** `agents/*.md`, then sync `chatVoice` samples in the
bot catalogue. When routing *which writing register* applies: **voice-seed**
`registry.json` (studio-internal until that repo is public).

## Clone vs this studio

A stranger who clones `jenninexus/agency` should be able to:

1. Copy `templates/AGENT-TEMPLATE.md` → `agents/YourAgent.md`
2. Specialize the desk (metrics, theme, layout, content, media) using the five core audit areas in the README
3. Copy `agents/characters.yaml.example` → `characters.yaml` and stylize portraits with Grok Imagine / DALL-E / Midjourney per `docs/ART-STYLE.md`
4. Keep secrets and live site paths in `projects/<their-project>/`

They should **not** need voice-seed, theme-designer, jenni-bot, or www-theme-kit
installed. Those are optional later pairings:

| Pairing | When | How |
|---------|------|-----|
| voice-seed | after that repo is public | pointer in STUDIO-VOICE — agency remains the prose SSOT for loft characters |
| theme-designer | after it has a desk-accent example | copy-on-update into ART-STYLE tokens — never `@import` |
| Discord loft | never required | consuming bot; do not fold jenni-bot into this SKU |
| JN / MG audit scripts | never | stay in the site repos; this repo ships `audit-template.ps1` only |

Product campaign notes (store, tip, Gumroad art pack) live in local
`product-design/docs/AGENCY.md`, not in this public tree.
