# Local media path map (example)

Copy to `README.local.md` (gitignored) and edit for your machine.

```text
cp resources/README.local.example.md resources/README.local.md
```

## SEGO / JenniNexus layout

```yaml
agency_framework:
  root: C:\Github\agency
  agents_webp: C:\Github\agency\resources\images\agents
  loft_banner: C:\Github\agency\resources\images\banner.jpg

# Private generations — NEVER commit these into the public agency repo
jenninexus_private:
  generations: C:\Users\Owner\Projects\www\jenninexus\storage\agency\generations
  favs: C:\Users\Owner\Projects\www\jenninexus\storage\agency\generations\!Favs
  # also look for: generations/vidette, bloggie, etc. if you sort by agent

# Hosted (Discord embeds / site) — deploy from www public_html
hosted:
  base: https://jenninexus.com/resources/images/agency/agents/
  local_www: C:\Users\Owner\Projects\www\jenninexus\public_html\resources\images\agency\agents

# Optional extras (videos, alternate takes, Midjourney dumps)
extras:
  # videos: D:\Media\agency-agents\
  # raw_exports: ...
```

## Agent file map (framework webp → hosted jpg)

| Agent | 1×1 webp | 16×9 webp | Hosted 1×1 | Hosted 16×9 |
|-------|----------|-----------|------------|-------------|
| Vidette | `vidette-1x1.webp` | `vidette-16x9.webp` | `vidette-1x1.jpg` | `vidette-16x9.jpg` |
| Bloggie | `bloggie-1x1.webp` | `bloggie-16x9.webp` | `bloggie-1x1.jpg` | `bloggie-16x9.jpg` (= `banner.jpg`) |
| GraphViz | `graphviz-1x1.webp` | `graphviz-16x9.webp` | `graph-viz-1x1.jpg` | `graph-viz-16x9.jpg` |
| GamerGirl | `gamergirl-1x1.webp` | `gamergirl-16x9.webp` | `gamer-girl-1x1.jpg` | `gamer-girl-16x9.jpg` |
| DivineDesign | `divinedesign-1x1.webp` | `divinedesign-16x9.webp` | `divine-design-1x1.jpg` | `divine-design-1x1.jpg-16x9.jpg` |
| Metrica | `metrica-1x1.webp` | `metrica-16x9.webp` | `metrica-1x1.jpg` | `metrica-16x9.jpg` |
| Vixel | `vixel-1x1.webp` | `vixel-16x9.webp` | `vixel/square.jpg` | `vixel/landscape.jpg` |

Discord catalogue that consumes these: `jenni-bot/resources/agency-profiles.json`.
