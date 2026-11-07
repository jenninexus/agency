# Integrate Agency into your project

Choose the desks that fit your project. A standalone Agency clone works for evaluation or as a
reference. Use a pinned submodule if your project wants to consume and update the shared desks.
An independent studio roster stays in its owning project.

Use `storage/AGENCY.md` to route to the project-owned guide and
[session source check](../docs/CONSUMERS.md#session-source-check). The guide names the desk
readers, governing specs, applicable theme profile, and audits.

## Set up a consumer

Run these from your project root. For an existing submodule, use
`git submodule update --init storage/agency` in place of `git submodule add`.

```sh
git submodule add https://github.com/jenninexus/agency.git storage/agency
node storage/agency/scripts/consumer.mjs protect
node storage/agency/scripts/consumer.mjs overlay Bloggie
node storage/agency/scripts/consumer.mjs status
```

Review and commit `.gitmodules` and the `storage/agency` gitlink in the parent project on first
setup. If your project ignores `storage/`, see the [consumer contract](../docs/CONSUMERS.md)
for the ignore exception. Run `protect` on each fresh clone.

| Change | Where it belongs |
|---|---|
| Reusable desk, template, helper or public documentation | Standalone Agency checkout. Land it on Agency main, then run `node storage/agency/scripts/consumer.mjs sync --commit` from each consumer root when ready to update its pin. |
| A desk's project-specific specialty, skills, personality, writing style, appearance or planned spoken voice | `<consumer>/storage/agency/projects/<project>/<Agent>.md`. Name the desk it extends and record the project differences. Keep agent profiles flat. |
| A studio's own character with no shared desk | Start with the [agent template](../templates/AGENT-TEMPLATE.md) and keep the character in the project's private overlay or independent roster. |
| Audits, site configuration, or runtime and display wiring | Owning project. Document which fields each consumer reads and verify those paths directly. |

Agency tracks this README. Your `projects/<project>/` folder is ignored by Agency and travels
separately from the parent gitlink. Back it up in a project-approved private repository. The
standalone checkout also supports local experiments with
`node scripts/consumer.mjs overlay Bloggie --project my-project`. An overlay there is a separate
copy and never syncs into another checkout.

A private consumer can track the overlay source in its own parent repository and generate the
ignored copy from it. Verify the copy before loading it and preserve local edits when refreshing.
Keep machine-specific consumer pointers in ignored `projects/<project>/README.md` files in the
standalone checkout.

## Optional tools

- [Voice Seed](https://github.com/jenninexus/voice-seed) routes written registers to the owning profile.
  Keep planned spoken-voice traits and approval status with the character. Use a separate audio
  workflow for auditions, recordings and synthesis.
- A character-design registry can index an agent's visual references, prompts, portraits and
  approved media alongside the profile and voice pointers. It is optional: keep original character
  material in its owning project, distinguish project casts from working agents, and do not assume
  a registry installs a runtime integration. If a registry is private, link to it only from private
  project documentation.
- To combine the tools, select the Agency base and project overlay or independent profile first;
  use Voice Seed to select the writing register, then the character registry to locate visual
  sources. Record where each layer is owned and which reader consumes it. A writing sample, a
  planned spoken brief and approved audio are separate deliverables. Clone optional tools beside
  the project as needed; they are not required submodules of Agency.
- [Theme Designer](https://github.com/jenninexus/theme-designer) helps design palettes. Put approved
  tokens in your project's design system.
- Keep visual references and prompt continuity with the owning character. A separate character
  registry can index those sources and approved media.

See the [consumer contract](../docs/CONSUMERS.md) and [public/local split](../docs/PUBLIC-LOCAL-SPLIT.md).

