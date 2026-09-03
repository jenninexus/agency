> **Example:** This is a **showcase** 7-desk loft roster — a fully built example team, not a live production inventory. Use it as a model for your own `agents/` profiles. See also [`StyleGuard.md`](StyleGuard.md) for a single-agent starter, and [`../templates/AGENT-TEMPLATE.md`](../templates/AGENT-TEMPLATE.md) for the blank template.

# AI Agent Team — Showcase Loft (Example)

**Version:** 3.1
**Last Updated:** September 3, 2026
**Status:** Example — 7 public desks, shared penthouse studio aesthetic

---

## Overview

This directory contains the **showcase agent profiles** — a working example of the framework. Each `.md` file is a specialist persona with defined file ownership, enforced rules, and a weekly audit protocol.

Project-specific agents (tied to one domain or codebase) live in `projects/` locally — see [`../projects/README.md`](../projects/README.md) for how project-scoped agents are organized.

All agents work at the same luxury cyberpunk penthouse studio — high-rise tower, futuristic rainy Seattle skyline, each corner reflecting the agent's personality through neon color and specialized equipment. Their shared art style and image prompts are defined in `characters.yaml`.

---

## Agent Roster

| Agent | Day | Domain | Color |
|-------|-----|--------|-------|
| **Vidette** | Monday | Video grids, playlists, YouTube RSS, aspect ratios | Cyan `#66c0f4` |
| **Bloggie** | Tuesday | Blog structure, tags, share buttons, editorial quality | Gold `#FFB020` |
| **GraphViz** | Wednesday | Color palettes, themes, glass effects, WCAG | Purple `#A563D1` |
| **GamerGirl** | Thursday | Game pages, platform CTAs, Steam hero sections | Pink `#FF2E88` |
| **DivineDesign** | Friday | Layout, UX/UI, visual hierarchy, templates | Teal `#00D4AA` |
| **Metrica** | Saturday | GA4, PageSpeed, GSC, JSON-LD, og:image, sitemap | Neon Green `#39ff14` |
| **Vixel** | Sunday | VR/game project site, design tokens, devlog pipeline | Orange `#FF6B4A` |

> **Friday PM:** Implementation day — all agents collaborate to fix flagged issues.

> **Vixel** is the cross-project specialist: a VR/game client site full-time, same loft as the others. Implementation details live in `projects/[vr-project]/Vixel.md` (gitignored).

---

## Shared Art Style

All agents share a base aesthetic defined in the `characters.yaml` `shared_style` block:

- **Setting:** Luxury cyberpunk penthouse loft, futuristic rainy Seattle at night
- **Windows:** Floor-to-ceiling rain-streaked glass on multiple sides, neon city visible below
- **Architecture:** Polished dark concrete, hardwood floors, exposed industrial steel beams
- **Render quality:** Hyperrealistic, cinematic depth of field, moody atmospheric haze
- **Tone:** Each corner reflects the agent's personal color and domain specialty

Each agent's workstation has a distinct neon accent color, equipment set, and environmental details (Vidette's cyan streaming deck, Bloggie's amber editorial lamp, Vixel's brutalist concrete with blood-red neon, etc.).

---

## Image Generation

Portraits in this repo are the reviewed `resources/images/agents/<slug>-1x1.webp` and `-16x9.webp` files. Prompt SSOT is local `agents/characters.yaml` (copy from `characters.yaml.example`).

There is **no** portrait generator script in a fresh clone. Use Grok Imagine / DALL-E / Midjourney per [`../docs/ART-STYLE.md`](../docs/ART-STYLE.md). Consuming sites may keep a private generator; do not assume `scripts/generate-agent-portrait.ps1` exists here.

Private generation dumps belong in the consuming project (gitignored), not this public tree.

---

## Agent Profile Structure

Each agent `.md` file follows this pattern:

```
# AgentName — Domain Agent

Role / Created / Status / Audit Day

## SSOT — Where AgentName Lives
  Table of file paths and purposes this agent owns

## Character Profile
  Name, title, personality traits, catchphrase, visual appearance

## How to Use AgentName
  When to invoke, what files they own

## Red Flags
  Specific patterns that trigger rejection

## Weekly Audit Checklist
  Step-by-step audit tasks

## Changelog
  History of agent updates
```

---

## Universal Rules

All agents enforce these regardless of domain:

1. No white backgrounds — use a tinted surface token, never `#FFFFFF`
2. CSS variables over hardcoded hex
3. No inline styles — all styling via CSS classes
4. Test both light and dark themes
5. Document changes — update agent changelog

---

## Invoking Agents

Reference agent files directly in AI conversations:

```
@GraphViz.md audit src/assets/css/ for theme compliance
@Bloggie.md review this blog post structure
@GamerGirl.md check this game page against the template
@Vixel.md audit the VR/game project site
```

Or use the MCP config:

```json
// .vscode/mcp.json (copy from .vscode/mcp.example.json)
// Keys: vidette, bloggie, graphviz, gamergirl, divinedesign, metrica, vixel
```

---

## Running Audits

This repo ships **`scripts/audit-template.ps1`** only. Copy it per desk. Live site audits (`audit-video-pages.ps1`, etc.) live in the **consuming project**, not in a fresh `jenninexus/agency` clone.

```powershell
# Template in this repo
pwsh scripts/audit-template.ps1

# Typical consuming-site pattern (paths are yours — not shipped here)
# pwsh scripts/audits/audit-theme-consistency.ps1
```

Write reports to gitignored `audits/`.

---

## `characters.yaml`

Agent portrait generation prompts. Three ratios per agent: `landscape` (16:9), `square` (1:1), `portrait_3x4` (3:4). Includes a `shared_style` block applied to all agents for visual cohesion.

Used by your local image pipeline. This repo does not ship `scripts/generate-agent-portrait.ps1`.

---

## Commit Convention

```
[AGENTNAME] description of change
```

Examples:
```
[GRAPHVIZ] Replace hardcoded #fff with --color-surface token
[VIDETTE] Fix column preset for gaming hub wide layout
[VIXEL] Update devlog pipeline for devlog-posts.php promotion
```
