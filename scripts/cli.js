#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const https = require("https");
const os = require("os");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const defaultTarget = process.cwd();
const defaultCodexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const projectListStartMarker = "<!-- RPM:PROJECT_LIST:START -->";
const projectListEndMarker = "<!-- RPM:PROJECT_LIST:END -->";
const dashboardProjectFiles = ["README.md", "WBS.md", "START_HERE.md"];
const dashboardWatchedFiles = new Set(["README.md", "WBS.md", "START_HERE.md", "RESEARCH_LOG.md"]);
const dashboardExcludedNames = new Set([
  ".git",
  ".research_pm_state",
  "node_modules",
  "research_project_template",
]);

function usage() {
  console.log(`Research Project Manager

Install:
  npx -y github:cameleonh/research-project-manager
  npx -y github:cameleonh/research-project-manager -- --target "C:\\Research_HQ"

Reminder commands:
  research-project-manager reminders scan --target "C:\\Research_HQ" --dry-run
  research-project-manager reminders scan --target "C:\\Research_HQ" --notify
  research-project-manager reminders install-windows-task --target "C:\\Research_HQ" --time 09:00
  research-project-manager reminders test-notification
  research-project-manager reminders mark --target "C:\\Research_HQ" --id R-2026-001 --status done
  research-project-manager reminders status --target "C:\\Research_HQ"
  research-project-manager reminders weekly --target "C:\\Research_HQ"

Calendar commands:
  research-project-manager calendar google-auth --client-secret "C:\\path\\client_secret.json"
  research-project-manager calendar google-sync --target "C:\\Research_HQ" --dry-run
  research-project-manager calendar outlook-auth --client-id "<azure-app-client-id>"
  research-project-manager calendar outlook-sync --target "C:\\Research_HQ" --dry-run

Dashboard commands:
  research-project-manager dashboard rebuild --target "C:\\Research_HQ" --dry-run
  research-project-manager dashboard rebuild --target "C:\\Research_HQ"
  research-project-manager dashboard watch --target "C:\\Research_HQ"

Install options:
  --target <path>      Install Markdown project files into this folder. Default: current directory.
  --codex-home <path>  Codex home folder. Default: CODEX_HOME or ~/.codex.
  --skip-files         Do not install Markdown dashboard/template files.
  --skip-skill         Do not install the Codex skill.
  --skip-tools         Do not install local reminder tooling.
  --force              Overwrite existing destination files.
  --help               Show this help.
`);
}

function parseOptions(argv, defaults = {}) {
  const options = { ...defaults };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      continue;
    }
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (["help", "dry-run", "notify", "notify-upcoming", "force", "skip-files", "skip-skill", "skip-tools"].includes(key)) {
      options[toCamel(key)] = true;
      continue;
    }
    const value = argv[++i];
    if (value === undefined) {
      throw new Error(`Missing value for ${arg}`);
    }
    options[toCamel(key)] = value;
  }

  return { options, positional };
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyPath(source, destination, options = {}) {
  if (!fs.existsSync(source)) {
    throw new Error(`Missing source path: ${source}`);
  }

  if (fs.existsSync(destination)) {
    if (!options.force) {
      console.log(`skip: ${destination} already exists`);
      return;
    }
    fs.rmSync(destination, { recursive: true, force: true });
  }

  ensureDir(path.dirname(destination));
  fs.cpSync(source, destination, { recursive: true });
  console.log(`copy: ${destination}`);
}

function installFiles(options) {
  const target = path.resolve(options.target || defaultTarget);
  ensureDir(target);

  for (const item of ["PROJECT_DASHBOARD.md", "PROJECT_MANAGEMENT_GUIDE.md", "JOURNAL_TARGETS.md", "research_project_template", "docs"]) {
    copyPath(path.join(repoRoot, item), path.join(target, item), options);
  }
}

function installSkill(options) {
  const skillSource = path.join(repoRoot, "codex_skill", "research-project-manager");
  const skillDestination = path.join(
    path.resolve(options.codexHome || defaultCodexHome),
    "skills",
    "research-project-manager"
  );
  copyPath(skillSource, skillDestination, options);
}

function installTools(options) {
  const target = path.resolve(options.target || defaultTarget);
  const toolDir = path.join(target, ".research_pm_tools");
  ensureDir(toolDir);
  for (const item of ["cli.js", "show_windows_notification.ps1", "install_windows_task.ps1"]) {
    copyPath(path.join(__dirname, item), path.join(toolDir, item), options);
  }
}

function installCommand(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    codexHome: defaultCodexHome,
    skipFiles: false,
    skipSkill: false,
    skipTools: false,
    force: false,
  });
  if (options.help) {
    usage();
    return;
  }
  if (!options.skipFiles) installFiles(options);
  if (!options.skipSkill) installSkill(options);
  if (!options.skipTools) installTools(options);
  console.log("done");
}

function dashboardPath(options) {
  if (options.dashboard) return path.resolve(options.dashboard);
  return path.join(path.resolve(options.target || defaultTarget), "PROJECT_DASHBOARD.md");
}

function statePath(target) {
  return path.join(path.resolve(target || defaultTarget), ".research_pm_state", "reminders.json");
}

function readState(target) {
  const file = statePath(target);
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeState(target, state) {
  const file = statePath(target);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function readDashboard(options) {
  const file = dashboardPath(options);
  if (!fs.existsSync(file)) {
    throw new Error(`Dashboard not found: ${file}`);
  }
  return { file, markdown: fs.readFileSync(file, "utf8") };
}

function getSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() === `## ${heading}`) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return "";
  let end = lines.length;
  for (let i = start; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function splitMarkdownRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdownTable(sectionText) {
  const lines = sectionText.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i += 1) {
    if (!lines[i].trim().startsWith("|")) continue;
    if (!/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i + 1])) continue;
    const headers = splitMarkdownRow(lines[i]);
    const rows = [];
    for (let j = i + 2; j < lines.length; j += 1) {
      if (!lines[j].trim().startsWith("|")) break;
      const cells = splitMarkdownRow(lines[j]);
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = cells[idx] || "";
      });
      rows.push(row);
    }
    return { headers, rows };
  }
  return { headers: [], rows: [] };
}

function parseMarkdownHeading(line) {
  const match = String(line || "").match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
  if (!match) return null;
  return {
    level: match[1].length,
    title: match[2].trim(),
  };
}

function parseMarkdownSections(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const sections = new Map();
  let firstH1 = "";

  for (let i = 0; i < lines.length; i += 1) {
    const heading = parseMarkdownHeading(lines[i]);
    if (!heading) continue;
    if (heading.level === 1 && !firstH1) {
      firstH1 = heading.title;
    }
    if (heading.level !== 2) continue;

    let end = lines.length;
    for (let j = i + 1; j < lines.length; j += 1) {
      const nextHeading = parseMarkdownHeading(lines[j]);
      if (nextHeading && nextHeading.level <= heading.level) {
        end = j;
        break;
      }
    }

    const content = lines.slice(i + 1, end).join("\n").trim();
    if (!sections.has(heading.title)) sections.set(heading.title, content);
  }

  return { firstH1, sections };
}

function cleanMarkdownValue(value) {
  let text = String(value || "").trim();
  text = text.replace(/^[-*+]\s+\[[ xX]\]\s*/, "");
  text = text.replace(/^[-*+]\s*/, "");
  text = text.replace(/^\d+[.)]\s*/, "");
  text = text.replace(/^`(.+)`$/, "$1");
  text = text.replace(/\s+/g, " ").trim();
  if (["", "-", "YYYY-MM-DD"].includes(text)) return "";
  return text;
}

function firstSectionValue(markdown, heading) {
  const section = parseMarkdownSections(markdown).sections.get(heading);
  if (!section) return "";
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    const value = cleanMarkdownValue(line);
    if (value) return value;
  }
  return "";
}

function firstActionSectionValue(markdown, heading) {
  const section = parseMarkdownSections(markdown).sections.get(heading);
  if (!section) return "";
  const lines = section.split(/\r?\n/);
  for (const line of lines) {
    if (!/^\s*[-*+]\s+/.test(line)) continue;
    const value = cleanMarkdownValue(line);
    if (value) return value;
  }
  for (const line of lines) {
    if (/처럼 크게 쓰지 말고|바로 착수 가능한 행동/.test(line)) continue;
    const value = cleanMarkdownValue(line);
    if (value) return value;
  }
  return "";
}

function readUtf8IfExists(file) {
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8");
}

function hasExcludedPathPart(filePath, root) {
  const relative = path.relative(root, filePath);
  if (!relative || relative.startsWith("..")) return false;
  return relative.split(/[\\/]+/).some((part) => dashboardExcludedNames.has(part));
}

function isProjectDir(dir) {
  let count = 0;
  for (const file of dashboardProjectFiles) {
    if (fs.existsSync(path.join(dir, file))) count += 1;
  }
  return count >= 2;
}

function discoverProjectDirs(target) {
  const root = path.resolve(target || defaultTarget);
  const projects = [];

  function walk(dir) {
    if (dir !== root && dashboardExcludedNames.has(path.basename(dir))) return;
    if (dir !== root && hasExcludedPathPart(dir, root)) return;
    if (isProjectDir(dir)) {
      projects.push(dir);
      return;
    }

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (dashboardExcludedNames.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    }
  }

  walk(root);
  return projects.sort((a, b) => relativeProjectPath(root, a).localeCompare(relativeProjectPath(root, b)));
}

function relativeProjectPath(target, projectDir) {
  const relative = path.relative(path.resolve(target), projectDir) || ".";
  return relative.split(path.sep).join("/");
}

function latestResearchLogDate(markdown) {
  let latest = null;
  const lines = String(markdown || "").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s{0,3}##\s+(\d{4}-\d{2}-\d{2})\s*#*\s*$/);
    if (!match) continue;
    const date = parseDateOnly(match[1]);
    if (!date) continue;
    if (!latest || date > latest) latest = date;
  }
  return latest ? formatDate(latest) : "";
}

function extractDateCandidates(markdown) {
  const candidates = [];
  const lines = String(markdown || "").split(/\r?\n/);
  let currentH2 = "";
  for (const line of lines) {
    const heading = parseMarkdownHeading(line);
    if (heading && heading.level === 2) {
      currentH2 = heading.title;
    }

    const matches = line.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g);
    for (const match of matches) {
      const date = parseDateOnly(match[1]);
      if (!date) continue;
      const lineText = line.toLowerCase();
      const headingText = currentH2.toLowerCase();
      const lineHasReminder = /(리마인드|remind|알림|notification)/i.test(lineText);
      const lineHasDeadline = /(마감|deadline|due|체크포인트|checkpoint|제출|투고|회의)/i.test(lineText);
      const headingHasReminder = /(리마인드|remind|알림|notification)/i.test(headingText);
      const headingHasDeadline = /(마감|deadline|due|체크포인트|checkpoint|제출|투고|회의)/i.test(headingText);
      const kinds = new Set();

      if (lineHasReminder) kinds.add("reminder");
      if (lineHasDeadline) kinds.add("deadline");
      if (!lineHasReminder && !lineHasDeadline) {
        if (headingHasReminder) kinds.add("reminder");
        if (headingHasDeadline) kinds.add("deadline");
      }

      candidates.push({
        date,
        dateText: formatDate(date),
        kinds,
      });
    }
  }
  return candidates;
}

function nearestFutureDate(candidates, kind) {
  const today = todayLocal();
  const filtered = candidates
    .filter((candidate) => candidate.date >= today)
    .filter((candidate) => !kind || candidate.kinds.has(kind));
  const pool = filtered.length > 0 || !kind
    ? filtered
    : candidates.filter((candidate) => candidate.date >= today);
  pool.sort((a, b) => a.date - b.date);
  return pool[0] ? pool[0].dateText : "";
}

function wbsBlockedReason(markdown) {
  const table = parseMarkdownTable(getSection(markdown, "단계별 작업"));
  const blocked = table.rows.filter((row) => String(row["상태"] || "").includes("막힘"));
  if (blocked.length === 0) return "";
  return blocked.slice(0, 3).map((row) => {
    const label = [row["ID"], row["단계"], row["작업"]].filter(Boolean).join(" ");
    const detail = [row["다음 행동"], row["담당 / 대기상대"], row["마감 / 체크포인트"]]
      .map(cleanMarkdownValue)
      .filter(Boolean)
      .join("; ");
    return detail ? `${label} (${detail})` : label;
  }).join("; ");
}

function projectInfo(target, projectDir) {
  const readme = readUtf8IfExists(path.join(projectDir, "README.md"));
  const startHere = readUtf8IfExists(path.join(projectDir, "START_HERE.md"));
  const wbs = readUtf8IfExists(path.join(projectDir, "WBS.md"));
  const researchLog = readUtf8IfExists(path.join(projectDir, "RESEARCH_LOG.md"));
  const readmeSections = parseMarkdownSections(readme);
  const dateCandidates = [
    ...extractDateCandidates(readme),
    ...extractDateCandidates(startHere),
    ...extractDateCandidates(wbs),
  ];

  return {
    project: readmeSections.firstH1 || path.basename(projectDir),
    status: firstSectionValue(readme, "현재 상태"),
    stage: firstSectionValue(readme, "현재 논문 단계") || firstSectionValue(wbs, "현재 단계"),
    lastWorkDate: firstSectionValue(startHere, "마지막 업데이트") || latestResearchLogDate(researchLog),
    nextAction: firstActionSectionValue(startHere, "다음에 시작할 첫 행동"),
    nextDeadline: nearestFutureDate(dateCandidates, "deadline"),
    reminderDate: nearestFutureDate(dateCandidates, "reminder"),
    blockedReason: firstSectionValue(startHere, "막힌 지점") || wbsBlockedReason(wbs),
    folder: relativeProjectPath(target, projectDir),
  };
}

function escapeMarkdownTableCell(value) {
  return cleanMarkdownValue(value).replace(/\|/g, "\\|");
}

function buildProjectDashboardTable(target) {
  const root = path.resolve(target || defaultTarget);
  const headers = ["프로젝트", "상태", "단계", "마지막 작업일", "다음 첫 행동", "다음 마감", "리마인드일", "막힌 이유", "폴더"];
  const rows = discoverProjectDirs(root).map((dir) => projectInfo(root, dir));
  const lines = [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
  ];

  for (const row of rows) {
    lines.push(`| ${[
      row.project,
      row.status,
      row.stage,
      row.lastWorkDate,
      row.nextAction,
      row.nextDeadline,
      row.reminderDate,
      row.blockedReason,
      row.folder,
    ].map(escapeMarkdownTableCell).join(" | ")} |`);
  }

  return lines.join("\n");
}

function lineEnding(markdown) {
  return String(markdown || "").includes("\r\n") ? "\r\n" : "\n";
}

function updateMarkedProjectList(markdown, table) {
  const start = markdown.indexOf(projectListStartMarker);
  const end = markdown.indexOf(projectListEndMarker);
  if (start === -1 && end === -1) return null;
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Dashboard project list markers are incomplete or out of order");
  }
  const eol = lineEnding(markdown);
  const before = markdown.slice(0, start + projectListStartMarker.length);
  const after = markdown.slice(end);
  return `${before}${eol}${table}${eol}${after}`;
}

function updateUnmarkedProjectList(markdown, table) {
  const eol = lineEnding(markdown);
  const lines = String(markdown || "").split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === "## 논문 프로젝트 목록");
  if (headingIndex === -1) {
    throw new Error("Dashboard project list markers not found, and ## 논문 프로젝트 목록 section was not found");
  }

  let sectionEnd = lines.length;
  for (let i = headingIndex + 1; i < lines.length; i += 1) {
    if (/^\s{0,3}##\s+/.test(lines[i])) {
      sectionEnd = i;
      break;
    }
  }

  let tableStart = -1;
  let tableEnd = -1;
  for (let i = headingIndex + 1; i < sectionEnd - 1; i += 1) {
    if (!lines[i].trim().startsWith("|")) continue;
    if (!/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[i + 1])) continue;
    tableStart = i;
    tableEnd = i + 2;
    while (tableEnd < sectionEnd && lines[tableEnd].trim().startsWith("|")) {
      tableEnd += 1;
    }
    break;
  }

  if (tableStart === -1) {
    throw new Error("Dashboard project list markers not found, and no standard project table was found to mark safely");
  }

  const replacement = [
    projectListStartMarker,
    ...table.split(/\r?\n/),
    projectListEndMarker,
  ];
  lines.splice(tableStart, tableEnd - tableStart, ...replacement);
  return lines.join(eol);
}

function updateProjectDashboardMarkdown(markdown, table) {
  const updated = updateMarkedProjectList(markdown, table);
  if (updated !== null) return updated;
  return updateUnmarkedProjectList(markdown, table);
}

function rebuildDashboard(options) {
  const target = path.resolve(options.target || defaultTarget);
  const table = buildProjectDashboardTable(target);
  if (options.dryRun) {
    console.log(table);
    return { table, file: dashboardPath(options), changed: false };
  }

  const file = dashboardPath({ ...options, target });
  if (!fs.existsSync(file)) {
    throw new Error(`Dashboard not found: ${file}`);
  }
  const markdown = fs.readFileSync(file, "utf8");
  const updated = updateProjectDashboardMarkdown(markdown, table);
  if (updated === markdown) {
    console.log(`dashboard unchanged: ${file}`);
    return { table, file, changed: false };
  }
  fs.writeFileSync(file, updated, "utf8");
  console.log(`dashboard updated: ${file}`);
  return { table, file, changed: true };
}

function dashboardRebuildCommand(argv) {
  const { options } = parseOptions(argv, { target: defaultTarget, dryRun: false });
  return rebuildDashboard(options);
}

function collectWatchDirs(target) {
  const root = path.resolve(target || defaultTarget);
  const dirs = [];

  function walk(dir) {
    if (dir !== root && dashboardExcludedNames.has(path.basename(dir))) return;
    if (dir !== root && hasExcludedPathPart(dir, root)) return;
    dirs.push(dir);

    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (dashboardExcludedNames.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    }
  }

  walk(root);
  return dirs;
}

function shouldWatchEvent(target, fileName) {
  if (!fileName) return true;
  const normalized = String(fileName);
  const base = path.basename(normalized);
  if (base === "PROJECT_DASHBOARD.md") return false;
  if (!dashboardWatchedFiles.has(base)) return false;
  return !hasExcludedPathPart(path.join(path.resolve(target), normalized), path.resolve(target));
}

function watchDashboard(options) {
  const target = path.resolve(options.target || defaultTarget);
  const debounceMs = Number(options.debounceMs || 2000);
  const watchers = new Map();
  let timer = null;
  let rebuilding = false;
  let pending = false;

  function closeRemovedWatchers(nextDirs) {
    const keep = new Set(nextDirs);
    for (const [dir, watcher] of watchers.entries()) {
      if (keep.has(dir)) continue;
      watcher.close();
      watchers.delete(dir);
    }
  }

  function refreshWatchers() {
    const dirs = collectWatchDirs(target);
    closeRemovedWatchers(dirs);
    for (const dir of dirs) {
      if (watchers.has(dir)) continue;
      try {
        const watcher = fs.watch(dir, (eventType, fileName) => {
          if (eventType === "rename") {
            setTimeout(refreshWatchers, 100);
          }
          if (!shouldWatchEvent(target, fileName)) return;
          scheduleRebuild(fileName ? path.join(dir, String(fileName)) : dir);
        });
        watchers.set(dir, watcher);
      } catch (error) {
        console.error(`watch skip: ${dir}: ${error.message}`);
      }
    }
  }

  function scheduleRebuild(reason) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      runRebuild(reason);
    }, debounceMs);
  }

  function runRebuild(reason) {
    if (rebuilding) {
      pending = true;
      return;
    }
    rebuilding = true;
    try {
      console.log(`dashboard rebuild triggered: ${reason || "change"}`);
      rebuildDashboard(options);
    } catch (error) {
      console.error(`dashboard rebuild failed: ${error.message}`);
    } finally {
      rebuilding = false;
      refreshWatchers();
      if (pending) {
        pending = false;
        scheduleRebuild("pending change");
      }
    }
  }

  refreshWatchers();
  console.log(`watching dashboard sources under: ${target}`);
  runRebuild("initial scan");

  return {
    close() {
      clearTimeout(timer);
      for (const watcher of watchers.values()) watcher.close();
      watchers.clear();
    },
  };
}

function dashboardWatchCommand(argv) {
  const { options } = parseOptions(argv, { target: defaultTarget, dryRun: false, debounceMs: "2000" });
  const watcher = watchDashboard(options);
  process.once("SIGINT", () => {
    watcher.close();
    console.log("dashboard watcher stopped");
    process.exit(0);
  });
  process.once("SIGTERM", () => {
    watcher.close();
    process.exit(0);
  });
}

function parseDateOnly(value) {
  if (!value) return null;
  const match = String(value).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayLocal() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function daysBetween(a, b) {
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function isDoneStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  return ["done", "skipped", "완료"].some((needle) => normalized.includes(needle));
}

function isYes(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["예", "yes", "y", "true", "1"].includes(normalized);
}

function stableGeneratedId(prefix, parts) {
  return `${prefix}-${hash(parts.filter(Boolean).join("|"))}`;
}

function loadReminderItems(options) {
  const { markdown } = readDashboard(options);
  const items = [];

  const projectTable = parseMarkdownTable(getSection(markdown, "논문 프로젝트 목록"));
  for (const row of projectTable.rows) {
    if (!row["프로젝트"] || row["프로젝트"].includes("프로젝트")) continue;
    if (isDoneStatus(row["상태"])) continue;
    for (const field of ["리마인드일", "다음 마감"]) {
      const date = parseDateOnly(row[field]);
      if (!date) continue;
      items.push({
        id: stableGeneratedId("PROJECT", [row["프로젝트"], field, row[field], row["다음 첫 행동"]]),
        source: "project_list",
        date,
        dateText: formatDate(date),
        project: row["프로젝트"],
        type: field,
        action: row["다음 첫 행동"] || row["막힌 이유"] || "프로젝트 상태 확인",
        calendarRegister: false,
        status: row["상태"] || "",
      });
    }
  }

  const waitingTable = parseMarkdownTable(getSection(markdown, "협업 대기 목록"));
  for (const row of waitingTable.rows) {
    if (!row["프로젝트"] || row["프로젝트"].includes("프로젝트")) continue;
    if (isDoneStatus(row["상태"])) continue;
    const date = parseDateOnly(row["리마인드일"]);
    if (!date) continue;
    items.push({
      id: stableGeneratedId("WAIT", [row["프로젝트"], row["상대"], row["기다리는 것"], row["요청일"], row["리마인드일"]]),
      source: "collaboration_wait",
      date,
      dateText: formatDate(date),
      project: row["프로젝트"],
      type: "협업 리마인드",
      action: `${row["상대"] || "상대"}: ${row["기다리는 것"] || "답변 확인"}`,
      calendarRegister: false,
      status: row["상태"] || "",
    });
  }

  const reminderTable = parseMarkdownTable(getSection(markdown, "마감 / 알림 큐"));
  for (const row of reminderTable.rows) {
    if (!row["날짜"] || row["날짜"].includes("YYYY")) continue;
    const date = parseDateOnly(row["날짜"]);
    if (!date) continue;
    const id = row["ID"] && !row["ID"].includes("YYYY")
      ? row["ID"]
      : stableGeneratedId("REM", [row["날짜"], row["프로젝트"], row["유형"], row["해야 할 일"]]);
    items.push({
      id,
      source: "reminder_queue",
      date,
      dateText: formatDate(date),
      project: row["프로젝트"] || "",
      type: row["유형"] || "리마인드",
      action: row["해야 할 일"] || "",
      calendarRegister: isYes(row["캘린더 등록"]),
      status: row["알림 상태"] || "",
    });
  }

  return items;
}

function itemText(item) {
  const project = item.project ? `[${item.project}] ` : "";
  return `${item.dateText} ${project}${item.type}: ${item.action}`.trim();
}

function classifyItems(items, lookaheadDays) {
  const today = todayLocal();
  const due = [];
  const upcoming = [];
  for (const item of items) {
    if (isDoneStatus(item.status)) continue;
    const delta = daysBetween(item.date, today);
    item.daysUntil = delta;
    if (delta <= 0) due.push(item);
    else if (delta <= lookaheadDays) upcoming.push(item);
  }
  due.sort((a, b) => a.date - b.date);
  upcoming.sort((a, b) => a.date - b.date);
  return { due, upcoming };
}

function printScan(items, lookaheadDays) {
  const { due, upcoming } = classifyItems(items, lookaheadDays);
  console.log(`Due or overdue (${due.length})`);
  for (const item of due) console.log(`- ${item.id}: ${itemText(item)}`);
  console.log(`Upcoming within ${lookaheadDays} days (${upcoming.length})`);
  for (const item of upcoming) console.log(`- ${item.id}: ${itemText(item)}`);
}

function sendWindowsNotification(title, message) {
  if (process.platform !== "win32") {
    console.log(`[notification] ${title}: ${message}`);
    return true;
  }
  const script = path.join(__dirname, "show_windows_notification.ps1");
  const result = spawnSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    script,
    "-Title",
    title,
    "-Message",
    message,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Windows notification failed").trim());
  }
  return true;
}

function scanCommand(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    lookaheadDays: "14",
    dryRun: false,
    notify: false,
    notifyUpcoming: false,
    force: false,
  });
  const lookaheadDays = Number(options.lookaheadDays || 14);
  const items = loadReminderItems(options);
  printScan(items, lookaheadDays);

  if (!options.notify) return;

  const target = path.resolve(options.target || defaultTarget);
  const state = readState(target);
  const todayText = formatDate(todayLocal());
  const { due, upcoming } = classifyItems(items, lookaheadDays);
  const notifyItems = options.notifyUpcoming ? due.concat(upcoming) : due;

  for (const item of notifyItems) {
    const contentHash = hash(JSON.stringify({
      date: item.dateText,
      project: item.project,
      type: item.type,
      action: item.action,
    }));
    const previous = state[item.id] || {};
    if (!options.force && previous.last_notified_date === todayText && previous.last_seen_hash === contentHash) {
      console.log(`skip already notified today: ${item.id}`);
      continue;
    }
    sendWindowsNotification("Research reminder", itemText(item));
    state[item.id] = {
      ...previous,
      last_notified_at: new Date().toISOString(),
      last_notified_date: todayText,
      last_seen_hash: contentHash,
    };
  }
  writeState(target, state);
}

function testNotificationCommand(argv) {
  const { options } = parseOptions(argv, {
    title: "Research reminder",
    message: "Windows notifications are working.",
  });
  sendWindowsNotification(options.title, options.message);
  console.log("notification sent");
}

function updateReminderStatus(dashboardFile, id, status) {
  const markdown = fs.readFileSync(dashboardFile, "utf8");
  const lines = markdown.split(/\r?\n/);
  let sectionStart = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() === "## 마감 / 알림 큐") {
      sectionStart = i;
      break;
    }
  }
  if (sectionStart === -1) throw new Error("Reminder queue section not found");

  let headerLine = -1;
  for (let i = sectionStart + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) break;
    if (lines[i].trim().startsWith("|")) {
      headerLine = i;
      break;
    }
  }
  if (headerLine === -1) throw new Error("Reminder queue table not found");
  const headers = splitMarkdownRow(lines[headerLine]);
  const idIndex = headers.indexOf("ID");
  const statusIndex = headers.indexOf("알림 상태");
  if (idIndex === -1 || statusIndex === -1) throw new Error("Reminder queue must include ID and 알림 상태 columns");

  let changed = false;
  for (let i = headerLine + 2; i < lines.length; i += 1) {
    if (!lines[i].trim().startsWith("|")) break;
    const cells = splitMarkdownRow(lines[i]);
    if (cells[idIndex] !== id) continue;
    while (cells.length < headers.length) cells.push("");
    cells[statusIndex] = status;
    lines[i] = `| ${cells.join(" | ")} |`;
    changed = true;
    break;
  }
  if (!changed) throw new Error(`Reminder ID not found: ${id}`);
  fs.writeFileSync(dashboardFile, lines.join(os.EOL), "utf8");
}

function markCommand(argv) {
  const { options } = parseOptions(argv, { target: defaultTarget });
  if (!options.id || !options.status) {
    throw new Error("mark requires --id and --status");
  }
  const file = dashboardPath(options);
  updateReminderStatus(file, options.id, options.status);
  console.log(`updated ${options.id} -> ${options.status}`);
}

function statusCommand(argv) {
  const { options } = parseOptions(argv, { target: defaultTarget, lookaheadDays: "14" });
  const items = loadReminderItems(options);
  printScan(items, Number(options.lookaheadDays || 14));
  const state = readState(options.target);
  const keys = Object.keys(state);
  console.log(`State entries: ${keys.length}`);
  for (const key of keys.slice(0, 20)) {
    const entry = state[key];
    console.log(`- ${key}: last notified ${entry.last_notified_at || "never"}`);
  }
}

function weeklyCommand(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    lookaheadDays: "14",
    staleDays: "14",
  });
  const { markdown } = readDashboard(options);
  const projects = parseMarkdownTable(getSection(markdown, "논문 프로젝트 목록")).rows;
  const today = todayLocal();
  const staleDays = Number(options.staleDays || 14);
  const stale = [];
  for (const row of projects) {
    const date = parseDateOnly(row["마지막 작업일"]);
    if (!date || isDoneStatus(row["상태"])) continue;
    const age = daysBetween(today, date);
    if (age >= staleDays) stale.push({ row, age });
  }
  const items = loadReminderItems(options);
  const { due, upcoming } = classifyItems(items, Number(options.lookaheadDays || 14));

  console.log("# Weekly Research Project Review");
  console.log("\n## Due / Overdue");
  due.forEach((item) => console.log(`- ${item.id}: ${itemText(item)}`));
  console.log("\n## Upcoming");
  upcoming.forEach((item) => console.log(`- ${item.id}: ${itemText(item)}`));
  console.log("\n## Stale Projects");
  stale.forEach(({ row, age }) => console.log(`- ${row["프로젝트"]}: ${age} days since last work`));
  console.log("\n## Suggested Check");
  console.log("- Keep active projects to 1-3.");
  console.log("- Make sure every active project has a concrete next first action.");
}

function installWindowsTaskCommand(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    time: "09:00",
    taskName: "Research Project Manager Reminders",
    lookaheadDays: "14",
    force: false,
  });
  if (process.platform !== "win32") {
    throw new Error("Windows Task Scheduler installation only works on Windows");
  }
  const target = path.resolve(options.target || defaultTarget);
  installTools({ target, force: true });
  const cliPath = path.join(target, ".research_pm_tools", "cli.js");
  const script = path.join(target, ".research_pm_tools", "install_windows_task.ps1");
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    script,
    "-Target",
    target,
    "-CliPath",
    cliPath,
    "-TaskName",
    options.taskName,
    "-Time",
    options.time,
    "-LookaheadDays",
    String(options.lookaheadDays || "14"),
  ];
  const result = spawnSync("powershell.exe", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Task Scheduler registration failed").trim());
  }
  process.stdout.write(result.stdout);
}

function configDir() {
  if (process.env.RESEARCH_PM_CONFIG_HOME) return process.env.RESEARCH_PM_CONFIG_HOME;
  if (process.platform === "win32") return path.join(process.env.APPDATA || os.homedir(), "research-project-manager");
  return path.join(os.homedir(), ".config", "research-project-manager");
}

function tokenPath(provider) {
  return path.join(configDir(), `${provider}_token.json`);
}

function readToken(provider) {
  const file = tokenPath(provider);
  if (!fs.existsSync(file)) throw new Error(`${provider} is not authenticated. Run calendar ${provider}-auth first.`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeToken(provider, token) {
  ensureDir(configDir());
  fs.writeFileSync(tokenPath(provider), `${JSON.stringify(token, null, 2)}\n`, "utf8");
}

function requestJson(urlString, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(url, {
      method: options.method || "GET",
      headers: options.headers || {},
    }, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        let parsed = null;
        if (data) {
          try {
            parsed = JSON.parse(data);
          } catch (error) {
            return reject(new Error(`Invalid JSON response from ${urlString}: ${data.slice(0, 200)}`));
          }
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode} from ${urlString}: ${data.slice(0, 500)}`));
        }
        resolve(parsed || {});
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function formBody(fields) {
  return new URLSearchParams(fields).toString();
}

function openBrowser(url) {
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  }
}

function base64Url(buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function googleAuth(argv) {
  const { options } = parseOptions(argv);
  if (!options.clientSecret) throw new Error("google-auth requires --client-secret path");
  const secret = JSON.parse(fs.readFileSync(path.resolve(options.clientSecret), "utf8"));
  const client = secret.installed || secret.web;
  if (!client || !client.client_id) throw new Error("Invalid Google client secret JSON");
  const scope = options.scope || "https://www.googleapis.com/auth/calendar.events";
  const codeVerifier = base64Url(crypto.randomBytes(32));
  const codeChallenge = base64Url(crypto.createHash("sha256").update(codeVerifier).digest());
  const oauthState = base64Url(crypto.randomBytes(16));
  let redirectUri = "";

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const requestUrl = new URL(req.url, "http://127.0.0.1");
      if (requestUrl.pathname !== "/oauth2callback") return;
      if (requestUrl.searchParams.get("state") !== oauthState) {
        res.end("Invalid state.");
        server.close();
        reject(new Error("OAuth state mismatch"));
        return;
      }
      const authCode = requestUrl.searchParams.get("code");
      res.end("Research Project Manager authentication complete. You can close this tab.");
      server.close();
      resolve(authCode);
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", client.client_id);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", scope);
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      authUrl.searchParams.set("state", oauthState);
      authUrl.searchParams.set("code_challenge", codeChallenge);
      authUrl.searchParams.set("code_challenge_method", "S256");
      console.log(`Open this URL if the browser does not open:\n${authUrl.toString()}`);
      openBrowser(authUrl.toString());
    });
  });

  const body = formBody({
    client_id: client.client_id,
    client_secret: client.client_secret || "",
    code,
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  const token = await requestJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }, body);
  writeToken("google", {
    provider: "google",
    client_id: client.client_id,
    client_secret: client.client_secret || "",
    scope,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: Date.now() + (token.expires_in || 3600) * 1000,
  });
  console.log(`Google token saved to ${tokenPath("google")}`);
}

async function googleAccessToken() {
  const token = readToken("google");
  if (token.access_token && token.expires_at && token.expires_at > Date.now() + 60000) return token.access_token;
  if (!token.refresh_token) throw new Error("Google refresh token missing. Run google-auth again.");
  const body = formBody({
    client_id: token.client_id,
    client_secret: token.client_secret || "",
    refresh_token: token.refresh_token,
    grant_type: "refresh_token",
  });
  const refreshed = await requestJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }, body);
  const next = {
    ...token,
    access_token: refreshed.access_token,
    expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000,
  };
  writeToken("google", next);
  return next.access_token;
}

function calendarItems(options) {
  return loadReminderItems(options)
    .filter((item) => item.source === "reminder_queue")
    .filter((item) => item.calendarRegister)
    .filter((item) => !isDoneStatus(item.status));
}

function nextDate(dateText) {
  return formatDate(addDays(parseDateOnly(dateText), 1));
}

function eventSummary(item) {
  const project = item.project ? `${item.project}: ` : "";
  return `[Research] ${project}${item.type}`;
}

function eventDescription(item) {
  return [
    `Reminder ID: ${item.id}`,
    `Project: ${item.project}`,
    `Type: ${item.type}`,
    `Action: ${item.action}`,
    "",
    "Generated from Research Project Manager Markdown dashboard.",
  ].join("\n");
}

async function googleSync(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    dryRun: false,
    reminderMinutes: "1440",
  });
  const items = calendarItems(options);
  const target = path.resolve(options.target || defaultTarget);
  const state = readState(target);
  console.log(`Google calendar items: ${items.length}`);
  if (options.dryRun) {
    items.forEach((item) => console.log(`- ${item.id}: ${itemText(item)}`));
    return;
  }
  const accessToken = await googleAccessToken();
  for (const item of items) {
    const event = {
      summary: eventSummary(item),
      description: eventDescription(item),
      start: { date: item.dateText },
      end: { date: nextDate(item.dateText) },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: Number(options.reminderMinutes || 1440) }],
      },
    };
    const entry = state[item.id] || {};
    const url = entry.google_event_id
      ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(entry.google_event_id)}`
      : "https://www.googleapis.com/calendar/v3/calendars/primary/events";
    const method = entry.google_event_id ? "PATCH" : "POST";
    const response = await requestJson(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }, JSON.stringify(event));
    state[item.id] = {
      ...entry,
      google_event_id: response.id,
      google_synced_at: new Date().toISOString(),
    };
    console.log(`${method === "POST" ? "created" : "updated"} Google event for ${item.id}`);
  }
  writeState(target, state);
}

async function outlookAuth(argv) {
  const { options } = parseOptions(argv, { tenant: "common" });
  if (!options.clientId) throw new Error("outlook-auth requires --client-id");
  const scope = options.scope || "offline_access Calendars.ReadWrite";
  const tenant = options.tenant || "common";
  const device = await requestJson(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/devicecode`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }, formBody({ client_id: options.clientId, scope }));
  console.log(device.message || `Go to ${device.verification_uri} and enter ${device.user_code}`);
  if (device.verification_uri) openBrowser(device.verification_uri);
  const intervalMs = (device.interval || 5) * 1000;
  const expiresAt = Date.now() + (device.expires_in || 900) * 1000;
  while (Date.now() < expiresAt) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    try {
      const token = await requestJson(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }, formBody({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        client_id: options.clientId,
        device_code: device.device_code,
      }));
      writeToken("outlook", {
        provider: "outlook",
        client_id: options.clientId,
        tenant,
        scope,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at: Date.now() + (token.expires_in || 3600) * 1000,
      });
      console.log(`Outlook token saved to ${tokenPath("outlook")}`);
      return;
    } catch (error) {
      if (!String(error.message).includes("authorization_pending")) throw error;
    }
  }
  throw new Error("Outlook device authorization timed out");
}

async function outlookAccessToken() {
  const token = readToken("outlook");
  if (token.access_token && token.expires_at && token.expires_at > Date.now() + 60000) return token.access_token;
  if (!token.refresh_token) throw new Error("Outlook refresh token missing. Run outlook-auth again.");
  const refreshed = await requestJson(`https://login.microsoftonline.com/${token.tenant || "common"}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }, formBody({
    grant_type: "refresh_token",
    client_id: token.client_id,
    refresh_token: token.refresh_token,
    scope: token.scope || "offline_access Calendars.ReadWrite",
  }));
  const next = {
    ...token,
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token || token.refresh_token,
    expires_at: Date.now() + (refreshed.expires_in || 3600) * 1000,
  };
  writeToken("outlook", next);
  return next.access_token;
}

async function outlookSync(argv) {
  const { options } = parseOptions(argv, {
    target: defaultTarget,
    dryRun: false,
    reminderMinutes: "1440",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul",
  });
  const items = calendarItems(options);
  const target = path.resolve(options.target || defaultTarget);
  const state = readState(target);
  console.log(`Outlook calendar items: ${items.length}`);
  if (options.dryRun) {
    items.forEach((item) => console.log(`- ${item.id}: ${itemText(item)}`));
    return;
  }
  const accessToken = await outlookAccessToken();
  for (const item of items) {
    const event = {
      subject: eventSummary(item),
      body: { contentType: "text", content: eventDescription(item) },
      start: { dateTime: `${item.dateText}T09:00:00`, timeZone: options.timezone },
      end: { dateTime: `${item.dateText}T09:30:00`, timeZone: options.timezone },
      isReminderOn: true,
      reminderMinutesBeforeStart: Number(options.reminderMinutes || 1440),
    };
    const entry = state[item.id] || {};
    const url = entry.outlook_event_id
      ? `https://graph.microsoft.com/v1.0/me/events/${encodeURIComponent(entry.outlook_event_id)}`
      : "https://graph.microsoft.com/v1.0/me/events";
    const method = entry.outlook_event_id ? "PATCH" : "POST";
    const response = await requestJson(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }, JSON.stringify(event));
    state[item.id] = {
      ...entry,
      outlook_event_id: response.id || entry.outlook_event_id,
      outlook_synced_at: new Date().toISOString(),
    };
    console.log(`${method === "POST" ? "created" : "updated"} Outlook event for ${item.id}`);
  }
  writeState(target, state);
}

async function run(argv = process.argv.slice(2)) {
  while (argv[0] === "--") {
    argv = argv.slice(1);
  }
  if (argv.length === 0 || argv[0] === "install" || argv[0].startsWith("--")) {
    installCommand(argv[0] === "install" ? argv.slice(1) : argv);
    return;
  }
  if (argv[0] === "--help" || argv[0] === "-h" || argv[0] === "help") {
    usage();
    return;
  }
  if (argv[0] === "reminders") {
    const sub = argv[1];
    const rest = argv.slice(2);
    if (sub === "scan") return scanCommand(rest);
    if (sub === "test-notification") return testNotificationCommand(rest);
    if (sub === "install-windows-task") return installWindowsTaskCommand(rest);
    if (sub === "mark") return markCommand(rest);
    if (sub === "status") return statusCommand(rest);
    if (sub === "weekly") return weeklyCommand(rest);
    throw new Error(`Unknown reminders command: ${sub || ""}`);
  }
  if (argv[0] === "calendar") {
    const sub = argv[1];
    const rest = argv.slice(2);
    if (sub === "google-auth") return googleAuth(rest);
    if (sub === "google-sync") return googleSync(rest);
    if (sub === "outlook-auth") return outlookAuth(rest);
    if (sub === "outlook-sync") return outlookSync(rest);
    throw new Error(`Unknown calendar command: ${sub || ""}`);
  }
  if (argv[0] === "dashboard") {
    const sub = argv[1];
    const rest = argv.slice(2);
    if (sub === "rebuild") return dashboardRebuildCommand(rest);
    if (sub === "watch") return dashboardWatchCommand(rest);
    throw new Error(`Unknown dashboard command: ${sub || ""}`);
  }
  throw new Error(`Unknown command: ${argv[0]}`);
}

async function main(argv = process.argv.slice(2)) {
  try {
    await run(argv);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  main,
  run,
  loadReminderItems,
  parseMarkdownTable,
  classifyItems,
  parseMarkdownSections,
  buildProjectDashboardTable,
  updateProjectDashboardMarkdown,
};
