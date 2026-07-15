# Agency `resources/`

Public-safe media that ships with the framework.

| Path | Purpose |
|------|---------|
| `images/banner.jpg` | Shared loft / studio banner (16:9) |
| `images/agents/*-1x1.webp` | Agent square portraits |
| `images/agents/*-16x9.webp` | Agent wide banners |
| `video/{id}.mp4` | One Discord-playable clip per desk (H.264 + faststart) |

Hosted Discord/site URLs:

- Pics: `https://jenninexus.com/resources/images/agency/agents/…`
- Vids: `https://jenninexus.com/resources/videos/agency/{id}.mp4`

`bloggie` / `vidette` / `graphviz` = character clips. Others = ken-burns from 16×9 until a full clip ships.

## Public vs private

| Layer | Where | Tracked? |
|-------|--------|----------|
| Framework masters | this folder | yes (webp / banner.jpg) |
| Hosted Discord/site | `jenninexus.com/resources/images/agency/agents/` | deploy from consumer www |
| Private generations / !Favs | consuming project `storage/agency/generations/` | **no** — see `docs/PUBLIC-LOCAL-SPLIT.md` |

**Machine-specific paths** (more portraits, videos, Favs folders) live in:

```text
resources/README.local.md   ← gitignored — copy from README.local.example.md
```

Do not put `C:\Users\...` paths in tracked files.
