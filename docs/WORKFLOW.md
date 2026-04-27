# Agency Repo — Edit & Sync Workflow

## Structure

This repo (`jenninexus/agency`) is used in two ways:

| Location | Purpose |
|----------|---------|
| `C:\Github\agency` | **Canonical clone** — make all edits here |
| `<user-home>\Projects\www\jenninexus\storage\agency` | Git submodule inside the jenninexus.com repo |

The jenninexus.com repo pins a specific commit of this repo as a submodule. After pushing changes here, the submodule pointer in jenninexus.com must be updated separately.

---

## Edit Workflow

### 1. Edit in the canonical clone

```bash
cd C:/Github/agency
# edit agent files, README, scripts, etc.
git add <files>
git commit -m "feat: ..."
git push
```

### 2. Pull into the submodule

```bash
cd <user-home>/Projects/www/jenninexus/storage/agency
git pull origin main
```

### 3. Bump the submodule pointer in jenninexus.com

```bash
cd <user-home>/Projects/www/jenninexus
git add storage/agency
git commit -m "chore: bump agency submodule to <short-sha> (<description>)"
git push
```

That's it. Three commands after an edit.

---

## Local-Only Files (gitignored)

These files live in `C:\Github\agency` but are **never committed**:

| File | Purpose |
|------|---------|
| `agents.html` | Local agent roster dashboard — open via VS Code Live Server |
| `.foam/agents-paths.json` | SSOT config for agents.html (all image/doc paths) |
| `.foam/` (entire dir) | Local Foam knowledge graph config |

To update `agents.html` data, edit `.foam/agents-paths.json` — no commit needed.

---

## Agent Profile Location

Agent `.md` files are committed in this repo under `agents/`:

```
agents/
├── Bloggie.md
├── DivineDesign.md
├── GamerGirl.md
├── GraphViz.md
├── Metrica.md
└── Vidette.md
```

These are the **tracked SSOT profiles**. The jenninexus submodule and `agents-paths.json` both point here.

MG and Jerry VR agents (`GlassField.md`, `MissionControl.md`, `Orbiter.md`, `Vixel.md`) live in their own project repos and are referenced in `.foam/agents-paths.json` by absolute path — they are NOT in this repo.

---

## Quick Reference

```bash
# Full edit + sync cycle
cd C:/Github/agency
git add agents/Metrica.md && git commit -m "docs: update Metrica audit checklist"
git push

cd <user-home>/Projects/www/jenninexus/storage/agency && git pull origin main
cd <user-home>/Projects/www/jenninexus && git add storage/agency
git commit -m "chore: bump agency submodule" && git push
```

---

## `agents.html` — Live Server Required

`agents.html` uses `fetch('.foam/agents-paths.json')` to load config. This requires HTTP — it **will not work** opened as a bare `file://` URL.

Open it via VS Code Live Server (right-click → **Open with Live Server**) or any local HTTP server on port 5500+.
