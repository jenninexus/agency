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

---

## Martian Games pointer (separate owned roster)

Do not create or restore an active `projects/martiangames/` override in this public framework.
Martian Games owns its independent three-officer roster and all visual continuity in the website
repository:

- Repository: `https://github.com/monofinitystudio/martiangames.com`
- Workflow: `<mg-repo>/storage/docs/AGENCY.md`
- Project command: `<mg-repo>/.claude/commands/mg-agency.md`
- Global route on Jenni's workstation: `/mg-agents`
- Profiles/graph: `mg/storage/agency/agents/` and `mg/storage/agency/AGENT-GRAPH.md`

The former local scratch tree is archived at
`projects/_archive/martiangames-2026-09-08` and remains gitignored. It is history, not a runtime or
documentation dependency.
