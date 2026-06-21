> **Example:** How to wire the Metrica SEO agent into a project-scoped Claude Code `/seo` command. See also [`AgentRoster.md`](AgentRoster.md) for the full roster pattern and [`StyleGuard.md`](StyleGuard.md) for a minimal single-agent example.

# Example: Project-Scoped `/seo` Command (Metrica)

The agency framework defines *agent profiles* (in `agents/*.md`). Claude Code *commands* are separate — they live in `~/.claude/commands/` (user-level, all projects) or a project's `.claude/commands/` (project-scoped). This example shows how to build a `/seo` command that loads Metrica and your project's SEO state.

---

## What goes where

```
C:\Github\agency\
  agents/
    Metrica.md          ← generic character, rules, red flags (THIS REPO — public)

your-project/
  storage/agency/
    projects/your-project/
      Metrica.md        ← project override: real GA4 IDs, live scores, next steps
                          (gitignored in submodule — never pushed to agency repo)
  .claude/
    commands/
      seo.md            ← Claude Code /seo command (project-scoped)
                          OR put in ~/.claude/commands/seo.md for user-level
```

**Hard rule:** Never put project-specific GA4 property IDs, real dashboard passwords, or private file paths in `agents/Metrica.md`. Those belong in the project override. The `agents/` directory is what other teams see.

---

## Minimal project-scoped `seo.md`

Save to `your-project/.claude/commands/seo.md`:

```markdown
---
description: SEO, analytics, and performance for [your-project]
argument-hint: [status | pagespeed | ga4 | search-console | audit | metrica]
---

# /seo — SEO & Analytics ([Your Project])

Managed by **Metrica** — the SEO, Analytics & PR agent.

## Quick Reference

| Resource | Location |
|----------|----------|
| **Agent profile** | `storage/agency/agents/Metrica.md` (framework rules) |
| **Project override** | `storage/agency/projects/[your-project]/Metrica.md` (live data) |
| **SEO narrative doc** | `storage/seo/SEO-AND-MARKETING.md` |
| **Live dashboard** | `[your-domain]/seo` (password-gated) |
| **GA4 property** | `[YOUR_PROPERTY_ID]` |
| **Search Console** | `https://[your-domain]/` |
| **Audit script** | `scripts/audits/audit-seo-analytics.ps1` |

## Usage Modes

Parse `$ARGUMENTS`. Default: `status`.

- **`status`** — load project override; show current scores + next steps
- **`metrica`** — show full Metrica profile + project state
- **`pagespeed`** — run pagespeed-monitor.mjs; report CWV scores
- **`ga4`** — run ga4-report.mjs; summarize traffic
- **`search-console`** — GSC indexing status, coverage errors
- **`audit`** — run audit-seo-analytics.ps1
```

---

## Cross-project cluster `/seo` command

For a multi-site setup (like JenniNexus + MartianGames + Synagen), the user-level `~/.claude/commands/seo.md` covers the whole cluster. It points to:
- Each project's native dashboard (per-project SEO SSOT)
- The SEO Export API (cross-dashboard live sync)
- Metrica's project override for the primary project

See the live implementation: `C:\Users\Owner\.claude\commands\seo.md` (JenniNexus cluster — JN + MG + Synagen tabs, SEO Export API, Metrica pointer).

---

## SEO Export API pattern

If you have multiple sites and want one dashboard to pull data from others:

```php
// In your aggregator dashboard (e.g. project-a/seo/index.php):
// Fetch from project-b's export endpoint:
$data['b'] = seoFetch(
    'https://project-b.com/seo?export=1&token=' . getenv('SEO_EXPORT_TOKEN'),
    $cacheDir . '/b.json',
    300  // 5-minute cache
) ?? $fallbackSnapshot;

// On project-b/seo/index.php — add export endpoint:
if (isset($_GET['export']) && $_GET['export'] === '1') {
    $expected = getenv('SEO_EXPORT_TOKEN') ?: 'dev-token';
    if (!hash_equals($expected, $_GET['token'] ?? '')) {
        http_response_code(403); echo json_encode(['error'=>'forbidden']); exit;
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge($data, ['_exported_at' => date('c')]));
    exit;
}
```

For static sites (no PHP), serve a public `data/[project].json` file and fetch it directly — no token needed if the dashboard is already `noindex`.

---

## Metrica in the Synagen editor

Synagen has a built-in SEO panel inside the engine editor — admin-gated, accessible via Modules → "SEO & Analytics". It shows GA4/GSC signal status and a prioritized checklist. This is separate from the `seo.synagen.us` static dashboard.

For Synagen-hosted games (SPA routes at `/g/[game]/`), the SEO gap to fix is SPA route tracking — GA4 only sees the initial page load, not game-to-game navigation. Fix: fire `gtag('event', 'page_view', { page_path: newRoute })` in the SPA router on each navigation.

---

## Related

- **Framework:** `agents/Metrica.md` — character, rules, red flags (this repo)
- **Roster example:** [`AgentRoster.md`](AgentRoster.md)
- **Single agent example:** [`StyleGuard.md`](StyleGuard.md)
- **Agent template:** `templates/AGENT-TEMPLATE.md`
- **Two-layer pattern:** `projects/README.md`
