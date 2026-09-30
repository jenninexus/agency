#!/usr/bin/env node
// Agency consumer tool — run from the ROOT of a repo that carries this repo as a submodule.
//
//   node storage/agency/scripts/consumer.mjs status    pinned commit vs origin/main, dirt, overlays, protection
//   node storage/agency/scripts/consumer.mjs check     exit 1 if the submodule was edited or pins an unpublished commit
//   node storage/agency/scripts/consumer.mjs sync      fetch origin/main, move the pin, stage the gitlink (add --commit to commit it)
//   node storage/agency/scripts/consumer.mjs protect   make the checkout read-only for git: no push URL, refusing pre-push
//                                                     hook inside the submodule, pre-commit guard in the consumer
//
// Options: --path <submodule path> (default: the .gitmodules entry whose URL ends in /agency(.git), else storage/agency)
//          --project <name>        overlay folder under projects/ (default: consumer folder name)
//          --commit                 (sync) commit the gitlink bump with a conventional message
//
// Contract (docs/CONSUMERS.md): the submodule is read-only in every consumer. Edit agents, docs and scripts
// in the canonical agency checkout, push to origin/main, then `sync` each consumer. The only writable place
// inside the checkout is the gitignored projects/<project>/ overlay folder.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

const HOOK_MARK = 'agency-consumer-guard';
const args = process.argv.slice(2);
const cmd = args.find((a) => !a.startsWith('--')) || 'status';
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const flag = (name) => args.includes(`--${name}`);

function git(cwd, ...a) {
  try {
    return execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    const err = new Error((e.stderr || e.message || '').toString().trim());
    err.code = e.status;
    throw err;
  }
}
const tryGit = (cwd, ...a) => {
  try { return git(cwd, ...a); } catch { return null; }
};

const root = tryGit(process.cwd(), 'rev-parse', '--show-superproject-working-tree') || tryGit(process.cwd(), 'rev-parse', '--show-toplevel');
if (!root) fail('Run this from inside a git repository that carries the agency submodule.');

function findSubPath() {
  if (opt('path')) return opt('path').replace(/\\/g, '/');
  const gm = join(root, '.gitmodules');
  if (existsSync(gm)) {
    const out = tryGit(root, 'config', '-f', '.gitmodules', '--get-regexp', '^submodule\\..*\\.url$') || '';
    for (const line of out.split('\n')) {
      const [key, url] = line.split(/\s+/);
      if (url && /\/agency(\.git)?$/i.test(url)) {
        return tryGit(root, 'config', '-f', '.gitmodules', key.replace(/\.url$/, '.path'));
      }
    }
  }
  return 'storage/agency';
}

const subPath = findSubPath();
const sub = resolve(root, subPath);
const project = opt('project') || basename(root).replace(/\.(com|net|org|us)$/i, '').toLowerCase();

function fail(msg) {
  console.error(`agency-consumer: ${msg}`);
  process.exit(1);
}

function subReady() {
  return existsSync(join(sub, '.git')) && tryGit(sub, 'rev-parse', 'HEAD');
}

function gitDirOf(dir) {
  const d = git(dir, 'rev-parse', '--git-dir');
  return resolve(dir, d);
}

// Tracked edits and untracked non-ignored files are both edits. Ignored slots (projects/*, audits/*,
// .config/, generations/) are the sanctioned local layer and never show here.
function dirt() {
  return git(sub, 'status', '--porcelain').split('\n').filter(Boolean);
}

function pinned() {
  const line = tryGit(root, 'ls-files', '-s', '--', subPath) || '';
  return line.split(/\s+/)[1] || null;
}

function onOrigin(sha) {
  if (!sha) return false;
  return tryGit(sub, 'merge-base', '--is-ancestor', sha, 'origin/main') !== null;
}

function overlays() {
  const dir = join(sub, 'projects', project);
  if (!existsSync(dir)) return { dir, files: [] };
  const files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile());
  return { dir, files };
}

function protectionState() {
  if (!subReady()) return { pushUrl: null, subHook: false, parentHook: false };
  const pushUrl = tryGit(sub, 'config', '--get', 'remote.origin.pushurl');
  const subHook = join(gitDirOf(sub), 'hooks', 'pre-push');
  const parentHooksDir = tryGit(root, 'config', '--get', 'core.hooksPath');
  const parentHook = join(parentHooksDir ? resolve(root, parentHooksDir) : join(gitDirOf(root), 'hooks'), 'pre-commit');
  const has = (p) => existsSync(p) && readFileSync(p, 'utf8').includes(HOOK_MARK);
  return { pushUrl, subHook: has(subHook), parentHook: has(parentHook), parentHookPath: parentHook };
}

function status() {
  if (!subReady()) fail(`${subPath} is not initialised. Run: git submodule update --init ${subPath}`);
  tryGit(sub, 'fetch', 'origin', '--quiet');
  const head = git(sub, 'rev-parse', '--short', 'HEAD');
  const pin = pinned();
  const [behind, ahead] = (tryGit(sub, 'rev-list', '--left-right', '--count', 'origin/main...HEAD') || '? ?').split(/\s+/);
  const d = dirt();
  const o = overlays();
  const p = protectionState();
  console.log(`agency submodule   ${subPath}  (consumer: ${basename(root)})`);
  console.log(`  checkout HEAD    ${head}   pinned in consumer: ${pin ? pin.slice(0, 7) : 'none'}`);
  console.log(`  vs origin/main   behind ${behind} · ahead ${ahead}${onOrigin(pin) ? '' : '   ⚠ pin is NOT on origin/main'}`);
  console.log(`  edits            ${d.length ? `${d.length} ⚠ (the submodule must stay clean)` : 'none ✓'}`);
  console.log(`  overlay          projects/${project}/ — ${o.files.length} file(s)${o.files.length ? ': ' + o.files.slice(0, 8).join(', ') : ''}`);
  console.log(`  protection       push URL ${p.pushUrl === 'no_push' ? 'blocked ✓' : 'OPEN ⚠'} · submodule pre-push ${p.subHook ? '✓' : '⚠'} · consumer pre-commit ${p.parentHook ? '✓' : '⚠'}`);
  if (!p.subHook || !p.parentHook || p.pushUrl !== 'no_push') console.log(`  → run: node ${subPath}/scripts/consumer.mjs protect`);
  if (Number(behind) > 0) console.log(`  → run: node ${subPath}/scripts/consumer.mjs sync`);
}

function check() {
  if (!subReady()) return; // uninitialised submodule: nothing to guard (e.g. a deploy clone)
  const problems = [];
  const d = dirt();
  if (d.length) {
    problems.push(`${subPath} has local edits — the agency submodule is read-only here:\n    ${d.slice(0, 12).join('\n    ')}`);
  }
  const pin = pinned();
  const head = git(sub, 'rev-parse', 'HEAD');
  if (pin && !onOrigin(pin)) problems.push(`the consumer pins ${pin.slice(0, 7)}, which is not on agency origin/main (fetch, then sync).`);
  if (!onOrigin(head)) problems.push(`the submodule checkout is at ${head.slice(0, 7)}, which is not on agency origin/main.`);
  if (problems.length) {
    console.error('agency-consumer guard: refused.\n  - ' + problems.join('\n  - '));
    console.error('Edit agency in its own checkout and push to origin/main, then run `consumer.mjs sync` here.');
    console.error('Consumer-specific changes belong in the gitignored projects/<project>/ overlay folder.');
    process.exit(1);
  }
}

function sync() {
  if (!subReady()) git(root, 'submodule', 'update', '--init', '--', subPath);
  const d = dirt();
  if (d.length) fail(`${subPath} has local edits; move them to the agency checkout first:\n  ${d.join('\n  ')}`);
  git(sub, 'fetch', 'origin', '--prune');
  const before = git(sub, 'rev-parse', 'HEAD');
  git(sub, 'checkout', '--quiet', '--detach', 'origin/main');
  const after = git(sub, 'rev-parse', 'HEAD');
  if (before === after && pinned() === after) {
    console.log(`agency already at origin/main (${after.slice(0, 7)}).`);
    return;
  }
  git(root, 'add', '--', subPath);
  const msg = `chore(agency): bump submodule to ${after.slice(0, 7)}`;
  if (flag('commit')) {
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', msg, '--', subPath], { stdio: 'inherit' });
    console.log(`committed: ${msg}`);
  } else {
    console.log(`staged ${subPath} → ${after.slice(0, 7)}. Commit it on its own:\n  git commit -m "${msg}" -- ${subPath}`);
  }
}

function writeHook(file, body) {
  if (existsSync(file)) {
    const cur = readFileSync(file, 'utf8');
    if (cur.includes(HOOK_MARK)) {
      writeFileSync(file, body);
      return 'updated';
    }
    return 'skipped (an unrelated hook exists — chain it by hand)';
  }
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, body, { mode: 0o755 });
  return 'installed';
}

function protect() {
  if (!subReady()) fail(`${subPath} is not initialised. Run: git submodule update --init ${subPath}`);
  git(sub, 'config', 'remote.origin.pushurl', 'no_push');
  const subHook = join(gitDirOf(sub), 'hooks', 'pre-push');
  const r1 = writeHook(subHook, `#!/bin/sh\n# ${HOOK_MARK}: pushing from a consumer checkout is not allowed.\necho "agency: this is a read-only consumer checkout. Edit and push from the agency repo's own checkout." >&2\nexit 1\n`);
  const p = protectionState();
  const r2 = writeHook(p.parentHookPath, `#!/bin/sh\n# ${HOOK_MARK}: refuse commits while the agency submodule is edited or pins an unpublished commit.\nif [ -f "${subPath}/scripts/consumer.mjs" ]; then\n  node "${subPath}/scripts/consumer.mjs" check --path "${subPath}" || exit 1\nfi\n`);
  console.log(`push URL: no_push · submodule pre-push: ${r1} · consumer pre-commit: ${r2}`);
}

({ status, check, sync, protect })[cmd]?.() ?? fail(`unknown command "${cmd}" (status | check | sync | protect)`);
