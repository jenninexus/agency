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
| **Override** | `projects/<project>/AgentName.md` **or** consuming project's `storage/agency/projects/<project>/` | ❌ | Real paths, GA4 IDs, audit history, live scores |

There is **no** third “tracked pointer” layer in git. If a local `projects/jenninexus/README.md` exists on your machine, it is for *you* — it is not published unless you force-add it (don't).

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
├── martiangames/             ← gitignored — MG agents if using this clone
└── neophi/                   ← gitignored
```

Consuming sites that submodule this repo usually keep overrides under:

```
{site}/storage/agency/projects/{project}/AgentName.md
```

Edit public origin files in the **canonical** agency clone, push, then bump the submodule.

---

## Which agents for which kind of project?

| Project type | Typical agents |
|--------------|----------------|
| Creator / portfolio site | Vidette, Bloggie, GraphViz, DivineDesign, Metrica (+ GamerGirl if games) |
| VR / game client site | **Vixel** primary (+ GraphViz for tokens) |
| Separate game studio site | Prefer that studio's own agency roster (e.g. MissionControl / GlassViz / OrbitalPipe) — not a forced JN 7-pack |

Shared loft culture (all agents): [`docs/STUDIO-VOICE.md`](../docs/STUDIO-VOICE.md).
