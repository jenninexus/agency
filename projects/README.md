# Agency Projects

This directory is intentionally empty of project content in the **public** repo.

| What | Tracked? |
|------|----------|
| `projects/README.md` (this file) | ✅ Yes |
| `projects/<project-name>/` | ❌ No — gitignored (`projects/*/`) |

See [`docs/PUBLIC-LOCAL-SPLIT.md`](../docs/PUBLIC-LOCAL-SPLIT.md) and [`docs/STUDIO-VOICE.md`](../docs/STUDIO-VOICE.md).

---

## Two-Layer Pattern (canonical)

| Layer | Location | Tracked? | Contains |
|-------|----------|----------|----------|
| **Origin** | `agents/AgentName.md` | ✅ | Personality, generic rules, red flags, Discord chatVoice summary |
| **Overlay** | `projects/<project>/AgentName.md` — in a consumer, that is `storage/agency/projects/<project>/` inside its read-only submodule checkout | ❌ | Real paths, GA4 IDs, audit history, live scores |

There is **no** third tracked project-content layer in git. Cross-repository ownership pointers
belong in this tracked README; local overrides remain ignored.

**Critical rule:** Never push server IPs, API keys, absolute machine paths, or live credentials into `agents/*.md`.

---

## Local layout (example)

```
projects/
├── README.md                 ← tracked (this file)
├── jenninexus/               ← gitignored
│   ├── Metrica.md            ← real GA4 / GCP notes
│   └── …
├── jerry-vr/                 ← gitignored — Vixel override
└── neophi/                   ← gitignored
```

Consuming projects that submodule this repo keep overlays under:

```
{consumer}/storage/agency/projects/{project}/AgentName.md
```

That folder is the only writable place in a consumer's checkout. Edit public origin files in the
agency repo's own checkout, push, then run `node storage/agency/scripts/consumer.mjs sync` in each
consumer. Contract: [`docs/CONSUMERS.md`](../docs/CONSUMERS.md).

---

## Which agents for which kind of project?

| Project type | Typical agents |
|--------------|----------------|
| Creator / portfolio site | Vidette, Bloggie, GraphViz, DivineDesign, Metrica (+ GamerGirl if games) |
| VR / game client site | **Vixel** primary (+ GraphViz for tokens) |
| Separate game studio site | Prefer that studio's own agency roster (e.g. MissionControl / GlassViz / OrbitalPipe) — not a forced JN 7-pack |

Shared loft culture (all agents): [`docs/STUDIO-VOICE.md`](../docs/STUDIO-VOICE.md).

---

## Independent rosters

Do not add a studio's own characters here as extra desks or as a tracked `projects/<studio>/`
folder. A studio with its own roster keeps it in its own private repository, publishes only approved
marketing fields through its own site or API, and never copies that lore back into this repo.

