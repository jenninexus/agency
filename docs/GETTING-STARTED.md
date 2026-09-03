# Getting started — staff a desk

Clone this repo and you already have a loft. You do **not** need Voice Seed,
a Discord bot, a theme kit, or any studio network-admin tools.

Full walk for a stranger. The README Quick Start is the short version.

---

## 1. Clone and configure

```bash
git clone https://github.com/jenninexus/agency.git
cd agency
cp mcp.example.json mcp.json
cp .vscode/mcp.example.json .vscode/mcp.json
# Edit mcp.json — studio name, agent domains, file paths.
# mcp.json is gitignored so personal paths stay off GitHub.
```

Optional workspace chrome:

```bash
cp agency.example.code-workspace agency.code-workspace
```

---

## 2. Copy the template, then pick a specialty

```bash
cp templates/AGENT-TEMPLATE.md agents/YourAgent.md
```

Start from the five audit areas that catch most drift (README table):

| Specialty | Starter energy | Example showcase desk |
|-----------|----------------|------------------------|
| Theme / tokens | CSS variables, contrast, no white backgrounds | GraphViz |
| Layout / UX | Breakpoints, spacing, hierarchy | DivineDesign |
| Content | Structure, metadata, stale copy | Bloggie |
| Media | Aspect ratios, lazy loading, embeds | Vidette |
| Metrics / SEO | Indexing, PageSpeed, JSON-LD | Metrica |

Fill identity → accent → responsibilities → red flags → audit day → commit tag.
Keep public `agents/*.md` **project-agnostic** — no live analytics IDs, no machine paths.

Working example: [`examples/StyleGuard.md`](../examples/StyleGuard.md).

---

## 3. Keep secrets in `projects/<name>/`

```text
agents/YourAgent.md              ← public template (safe to commit)
projects/your-project/YourAgent.md   ← live paths, scores, slang (gitignored)
```

See [`projects/README.md`](../projects/README.md) and
[`PUBLIC-LOCAL-SPLIT.md`](PUBLIC-LOCAL-SPLIT.md).

---

## 4. Portraits (optional)

This repo does **not** ship a portrait generator script.

1. Copy [`agents/characters.yaml.example`](../agents/characters.yaml.example)
   → `agents/characters.yaml` (gitignored).
2. Fill prompts using [`ART-STYLE.md`](ART-STYLE.md) (shared penthouse + accent neon).
3. Generate with **Grok Imagine**, DALL-E, or Midjourney — any image model that
   accepts the yaml prompts.
4. Drop an 80×80 (or 1×1 webp) at `resources/images/agents/<name>-1x1.webp`
   for the README cards.

Studio-only PowerShell helpers, if you have them elsewhere, are not a clone
dependency.

---

## 5. Optional — Voice Seed (not a submodule)

Agency is the **prose SSOT** for loft characters (`agents/*.md` +
[`STUDIO-VOICE.md`](STUDIO-VOICE.md)).

If you also want a **map** so résumé voice, Patreon voice, and loft `chatVoice`
do not mix:

```text
git clone https://github.com/jenninexus/voice-seed.git
```

Then copy `voice-seed/templates/agent-chatVoice.seed.md` into `agents/YourAgent.md`.

- Do **not** add Voice Seed as a git submodule of Agency.
- Skip this step entirely if you only want the loft.
- Do not install a live Discord bot, www-theme-kit, or sys-admin to use Agency.

Bot greeter / embed chrome / loft runtime samples use relative `{bot}/` paths
in Voice Seed. A future bot-seed clone will use the same files. That GitHub
remote does not have to exist for Agency to work.

---

## What you never need

| Tool | Why |
|------|-----|
| Voice Seed | Optional map only |
| jenni-bot / martian-bot | Live studio Discord apps — not this SKU |
| www-theme-kit | Private token kit — copy hex into ART-STYLE if you want, never `@import` |
| Studio network-admin tools | Infra for this studio, not a product dependency |
| Node beyond the bundled MCP | The stdio server in `scripts/mcp-server.js` is enough |
