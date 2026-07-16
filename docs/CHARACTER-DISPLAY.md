# Character display — cards + profile viewer

Hub for how Agency characters appear in **public sites** vs this repo’s **local** roster.

## Surfaces

| Surface | Tracked? | Pattern |
|---------|----------|---------|
| [martiangames.com/atlas](https://martiangames.com/atlas) Meet the Agents | MG site | Glass cards → `#agentModal` (‹ ›, swipe, ←→, wrap, backdrop dismiss) |
| [jenninexus.com/agency](https://jenninexus.com/agency) Meet the Agency | JN site | Portrait grid → `#agentProfileModal` (same nav contract) |
| `agency.html` (this repo root) | **No** (gitignored) | Personal detailed roster — SSOT docs, paths, when-to-invoke |

**UX + asset contract (kit):** `www-theme-kit/profiles/agency.json` → `character_display`

## Image presets

| Preset | Aspect | Use |
|--------|--------|-----|
| Square 1×1 | `1 / 1` | Card thumb + modal avatar (`object-fit: cover`, top-biased) |
| Landscape 16×9 | `16 / 9` | Modal banner |
| Studio (optional) | varies | Extra env tab only when a third asset exists |

Masters in this repo: `resources/images/agents/*-1x1.webp` + `*-16x9.webp` (see `resources/README.md`).

## Profile viewer — required behaviors

1. Backdrop click / Esc dismiss  
2. Prev / next (prefer side overlays)  
3. Arrow keys + touch swipe (≥56px horizontal)  
4. Wrap-around roster + `n / total` counter  

Reference implementation: MG `html/page/atlas.php` `#agentModal`.

## Naming guardrail

- **GraphViz** = JN loft desk (purple)  
- **GlassViz** = MG-local design agent (portraits may still use historical `graph-viz-*` filenames)  
- Never reuse one agent’s art for the other  

## Local `agency.html`

Keep untracked (see [PUBLIC-LOCAL-SPLIT.md](PUBLIC-LOCAL-SPLIT.md)). Use it for private paths, audit notes, and full markdown profiles. Public lore stays in `agents/*.md`.
