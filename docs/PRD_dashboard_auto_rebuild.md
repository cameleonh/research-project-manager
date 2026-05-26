# PRD: Dashboard Auto-Rebuild

## Summary

Add a local, dependency-free dashboard automation feature to Research Project Manager. The feature scans project folders under a Research HQ directory, extracts project status from Markdown files, and refreshes only the auto-managed project list region in `PROJECT_DASHBOARD.md`.

The feature must work without LLM calls, API calls, or external services. Markdown remains the source of truth.

## Problem

Researchers update per-project files such as `README.md`, `WBS.md`, `START_HERE.md`, and `RESEARCH_LOG.md`, but the portfolio dashboard can drift out of date. Manual dashboard maintenance creates duplicate work and makes it easy to lose the latest status, next action, blocked reason, or reminder date across several paper projects.

## Goals

- Keep `PROJECT_DASHBOARD.md` synchronized with per-project Markdown files.
- Update only the auto-generated project list region, preserving manual dashboard sections.
- Support manual rebuilds and a file watcher for automatic rebuilds.
- Work on Windows paths and Korean Markdown text.
- Avoid LLM/API calls and avoid new dependencies unless necessary.
- Preserve existing reminder and calendar commands.

## Non-Goals

- Do not rewrite the entire dashboard.
- Do not infer research meaning beyond lightweight Markdown parsing.
- Do not sync collaborator waits or reminder queue rows in this version.
- Do not call external calendar, notification, LLM, or web APIs.
- Do not require a daemon, database, or long-lived state file for rebuild.

## Target User

A researcher or doctoral student managing multiple paper projects in a shared Research HQ folder. The user wants one portfolio dashboard to reflect each project's current state without manually copying fields after every project update.

## Inputs

Each project folder may include:

- `README.md`
- `WBS.md`
- `START_HERE.md`
- `RESEARCH_LOG.md`

A folder qualifies as a project folder when at least two of the following exist:

- `README.md`
- `WBS.md`
- `START_HERE.md`

Excluded paths:

- `PROJECT_DASHBOARD.md`
- `research_project_template/`
- `.research_pm_state/`
- `.git/`
- `node_modules/`

## Output

The generated output is the project list table inside `PROJECT_DASHBOARD.md`, between:

```markdown
<!-- RPM:PROJECT_LIST:START -->
<!-- RPM:PROJECT_LIST:END -->
```

If an older dashboard has no markers, the rebuild command may safely add markers around the existing `## 논문 프로젝트 목록` table. If that section or table cannot be identified, the command must fail with a clear error instead of guessing.

## User Stories

### US-001: Rebuild Dashboard On Demand

**Description:** As a researcher, I want to run a CLI command that refreshes the dashboard from project files so that my portfolio view reflects current project state.

**Acceptance Criteria:**

- [ ] `research-project-manager dashboard rebuild --target "<Research_HQ>"` scans project folders below the target.
- [ ] Only folders with at least two of `README.md`, `WBS.md`, and `START_HERE.md` are included.
- [ ] The command updates only the marked project-list region in `PROJECT_DASHBOARD.md`.
- [ ] Existing reminder and calendar commands still run.
- [ ] `node --check scripts/cli.js` passes.

### US-002: Preview Generated Table

**Description:** As a researcher, I want a dry-run mode so that I can inspect the generated dashboard table before writing files.

**Acceptance Criteria:**

- [ ] `dashboard rebuild --dry-run` prints the generated Markdown table.
- [ ] `--dry-run` does not create or modify `PROJECT_DASHBOARD.md`.
- [ ] The dry-run output includes Korean project names and Windows-safe relative folder paths.

### US-003: Watch Project Files

**Description:** As a researcher, I want the dashboard to rebuild automatically after project Markdown files change so that the dashboard stays current during normal work.

**Acceptance Criteria:**

- [ ] `dashboard watch --target "<Research_HQ>"` watches `README.md`, `WBS.md`, `START_HERE.md`, and `RESEARCH_LOG.md`.
- [ ] The watcher waits 2 seconds after the latest change before rebuilding.
- [ ] Changes to `PROJECT_DASHBOARD.md` do not trigger a rebuild loop.
- [ ] Excluded directories are not watched.
- [ ] New or removed project directories are reflected after watcher refresh.

### US-004: Extract Project Fields

**Description:** As a researcher, I want the generated table to include the fields needed to resume or prioritize projects.

**Acceptance Criteria:**

- [ ] Project name comes from the first H1 in `README.md`, falling back to folder name.
- [ ] Status comes from `README.md` section `## 현재 상태`.
- [ ] Stage comes from `README.md` section `## 현재 논문 단계`, falling back to `WBS.md` section `## 현재 단계`.
- [ ] Last work date comes from `START_HERE.md` section `## 마지막 업데이트`, falling back to the latest `## YYYY-MM-DD` in `RESEARCH_LOG.md`.
- [ ] Next first action comes from `START_HERE.md` section `## 다음에 시작할 첫 행동`.
- [ ] Next deadline and reminder date use the nearest future `YYYY-MM-DD` found in `README.md`, `START_HERE.md`, or `WBS.md`, preferring matching deadline/reminder context.
- [ ] Blocked reason comes from `START_HERE.md` section `## 막힌 지점`, falling back to blocked WBS rows.
- [ ] Folder path is relative to `--target` and uses slash-separated paths.

## Functional Requirements

- FR-1: Add `dashboard rebuild` under the existing `scripts/cli.js` CLI router.
- FR-2: Add `dashboard watch` under the existing `scripts/cli.js` CLI router.
- FR-3: Implement a small Markdown heading/section parser that can be tested independently.
- FR-4: Preserve existing `reminders` and `calendar` commands.
- FR-5: Generate a Markdown table with columns: `프로젝트`, `상태`, `단계`, `마지막 작업일`, `다음 첫 행동`, `다음 마감`, `리마인드일`, `막힌 이유`, `폴더`.
- FR-6: Escape pipe characters inside generated table cells.
- FR-7: Preserve existing line endings when replacing dashboard marker content.
- FR-8: Use Node.js built-in modules only unless a dependency is clearly justified.

## Implementation Status

Implemented CLI commands:

- `dashboard rebuild`
- `dashboard rebuild --dry-run`
- `dashboard watch`

Implemented support files:

- Dashboard project-list markers in `PROJECT_DASHBOARD.md`
- README usage documentation
- Node test coverage for Markdown parsing, project scanning, marker replacement, and CLI dry-run routing

No dependency was added. The watcher uses Node's built-in `fs.watch`.

## Technical Considerations

- The project keeps a single-file CLI style, so the implementation stays in `scripts/cli.js`.
- The parser is intentionally small and line-oriented. It is designed for this repository's Markdown templates, not arbitrary Markdown.
- The watcher recursively watches directories and refreshes watcher registrations after rename events.
- Dashboard writes are ignored by watcher filtering to prevent rebuild loops.
- Date extraction recognizes `YYYY-MM-DD` only.

## Risks

- `fs.watch` behavior differs slightly across platforms. The command should avoid relying on event ordering and should debounce rebuilds.
- Markdown table parsing can break if users use complex escaped table syntax.
- Date classification is heuristic. A date without clear deadline or reminder context may be treated as the nearest future date fallback.
- Very large Research HQ folders could create many watchers. Excluding generated and dependency directories reduces that risk.

## QA Plan

- Run `node --check scripts/cli.js`.
- Run dashboard unit tests with `node test/dashboard.test.js` or `node --test test/dashboard.test.js`.
- Create a sample target folder with multiple projects and Korean Markdown.
- Run `dashboard rebuild --dry-run` and inspect the generated table.
- Run actual `dashboard rebuild` and verify that only the marker region changes.
- Run `reminders scan --dry-run` to verify existing reminder behavior still works.
- Start `dashboard watch --dry-run` and verify the initial rebuild path and debounce path.

## Open Questions

- Should future versions split dashboard helpers into a separate module once `scripts/cli.js` grows further?
- Should watch mode support polling for network drives where `fs.watch` is unreliable?
- Should deadline and reminder extraction become stricter to avoid ambiguous fallback dates?
