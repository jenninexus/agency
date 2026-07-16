#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];

function readJson(rel) {
  const full = path.join(root, rel);
  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (error) {
    failures.push(`${rel}: invalid JSON (${error.message})`);
    return null;
  }
}

function readText(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function walkMd(dirRel, acc = []) {
  const full = path.join(root, dirRel);
  if (!fs.existsSync(full)) return acc;
  for (const name of fs.readdirSync(full)) {
    if (name === "node_modules" || name === ".git") continue;
    const rel = path.join(dirRel, name).replace(/\\/g, "/");
    const st = fs.statSync(path.join(root, rel));
    if (st.isDirectory()) {
      // Skip gitignored project overrides — only projects/README.md is public
      if (rel === "projects" || rel.startsWith("projects/")) continue;
      walkMd(rel, acc);
    } else if (/\.(md|example\.json|example\.yaml|example\.yml|html\.example)$/i.test(name)) {
      if (/^docs\/(ROADMAP|PLANS|NOTES)\.md$/i.test(rel)) continue;
      acc.push(rel);
    }
  }
  return acc;
}

const publicFiles = [
  "mcp.example.json",
  ".vscode/mcp.example.json",
  "README.md",
  "docs/WORKFLOW.md",
  "docs/PUBLIC-LOCAL-SPLIT.md",
  "docs/STUDIO-VOICE.md",
  "agency.html.example",
  "projects/README.md",
  ...walkMd("agents"),
  ...walkMd("docs"),
  ...walkMd("examples"),
  ...walkMd("templates")
];

const seen = new Set();
const files = publicFiles.filter((f) => {
  if (seen.has(f)) return false;
  seen.add(f);
  return true;
});

const forbiddenPatterns = [
  { re: /C:\\Users\\/i, label: "C:\\Users\\ path" },
  { re: /C:\\Github\\/i, label: "C:\\Github\\ path" },
  { re: /C:\\mcp\\/i, label: "C:\\mcp\\ path" },
  { re: /api[_-]?key\s*[:=]/i, label: "api_key assignment" },
  { re: /gserviceaccount\.com/i, label: "GCP service account email" },
  { re: /jenninexus-cloud/i, label: "GCP project id" },
  { re: /960846322441/, label: "GCP project number" },
  { re: /280909516/, label: "GA4 property id" },
  { re: /ssh_host/i, label: "ssh_host" },
  { re: /64\.23\./, label: "droplet IP fragment" }
];

for (const rel of files) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`${rel}: missing`);
    continue;
  }
  const text = readText(rel);
  for (const { re, label } of forbiddenPatterns) {
    if (re.test(text)) {
      failures.push(`${rel}: contains forbidden public-template pattern (${label})`);
    }
  }
}

const registry = readJson("mcp.example.json");
const vscode = readJson(".vscode/mcp.example.json");

if (vscode) {
  if (!vscode.servers || !vscode.servers.agency) {
    failures.push(".vscode/mcp.example.json: missing servers.agency");
  }
  for (const key of ["agents", "schedule", "studio"]) {
    if (Object.prototype.hasOwnProperty.call(vscode, key)) {
      failures.push(`.vscode/mcp.example.json: should not contain ${key}; keep agent registry in mcp.example.json`);
    }
  }
}

if (registry) {
  if (!registry.agents || typeof registry.agents !== "object") {
    failures.push("mcp.example.json: missing agents object");
  }
  if (registry.servers) {
    failures.push("mcp.example.json: use server for framework metadata; VS Code servers belong in .vscode/mcp.example.json");
  }
}

if (failures.length) {
  console.error("Public config validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Public config validation passed (${files.length} files scanned).`);
