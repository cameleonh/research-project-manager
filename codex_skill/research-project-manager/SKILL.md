---
name: research-project-manager
description: Use when the user wants to create, organize, migrate, review, or update multiple research paper project folders using Markdown files, including project dashboards, WBS files, restart notes, daily logs, decisions, key file paths, collaboration waiting items, deadlines, and reminder dates.
---

# Research Project Manager

## Overview

Use this skill to keep several research or paper projects recoverable across interruptions. The goal is to preserve each project's current stage, last work, next first action, important decisions, and key file locations without creating a heavy project-management system.

## Default Paths

If the user has not given another root, assume:

- Project system root: `C:\Users\honey\Documents\New project`
- Template folder: `C:\Users\honey\Documents\New project\research_project_template`
- Portfolio dashboard: `C:\Users\honey\Documents\New project\PROJECT_DASHBOARD.md`
- User guide: `C:\Users\honey\Documents\New project\PROJECT_MANAGEMENT_GUIDE.md`
- Reminder/calendar sync PRD: `C:\Users\honey\Documents\New project\research-project-manager\docs\PRD_reminder_calendar_sync.md`
- Dashboard auto-rebuild PRD: `C:\Users\honey\Documents\New project\research-project-manager\docs\PRD_dashboard_auto_rebuild.md`
- Local Windows agent planning repo: `C:\Users\honey\Documents\New project\research-pm-local-windows-agent`

Verify paths before editing. Work with the user's current files; do not overwrite research content unless explicitly asked.

## File Roles

| File | Role |
|---|---|
| `PROJECT_DASHBOARD.md` | Portfolio view across all research projects |
| `README.md` | Stable project basics and current paper stage |
| `WBS.md` | Paper-stage map and task status |
| `START_HERE.md` | The first screen to restart work within 5 minutes |
| `RESEARCH_LOG.md` | Date-based record of actual work performed |
| `DECISIONS.md` | Important decisions, reasons, alternatives, and revisit conditions |
| `FILES.md` | Key file locations only, not a complete file inventory |

## Managed Files

The skill manages this Markdown project system:

- `PROJECT_DASHBOARD.md` for the portfolio view
- `README.md` for project basics
- `WBS.md` for paper-stage tracking
- `START_HERE.md` for the next first action
- `RESEARCH_LOG.md` for session history
- `DECISIONS.md` for important decisions
- `FILES.md` for key file locations
- Dashboard sections for collaboration waiting items, deadlines, and reminder dates

## Supported Tasks

Support these recurring operations:

- Creating a new research paper project from the template
- Migrating messy notes or long work logs into the structure
- Updating daily work logs
- Deciding the next first action
- Updating the project dashboard
- Rebuilding the project dashboard automatically from project Markdown files
- Tracking collaborator waits, external checkpoints, deadlines, and reminder dates
- Keeping the system lightweight and avoiding unnecessary new files

## Operating Rules

- Keep the system lightweight. Prefer updating existing files over adding new files.
- Preserve the language and labels already used in the user's template files.
- Do not put detailed daily logs in `WBS.md`; keep them in `RESEARCH_LOG.md`.
- Do not bury the next first action only in `RESEARCH_LOG.md`; copy the actionable next step into `START_HERE.md`.
- Use `PROJECT_DASHBOARD.md` for the many-project overview, not for detailed project notes.
- Use `START_HERE.md` as the restart document. It should fit on one short screen when possible.
- Store actual research content in the user's project files, never inside this skill.
- The skill should contain only operating rules and procedures, not project data.
- Markdown reminder dates are not real notifications. If a deadline must produce an alert, tell the user to also put it in their calendar or reminder app.
- When the user asks to refresh the project list in `PROJECT_DASHBOARD.md`, prefer the dashboard auto-rebuild CLI over manually editing the generated project-list table.
- Do not edit content between `<!-- RPM:PROJECT_LIST:START -->` and `<!-- RPM:PROJECT_LIST:END -->` by hand unless the user explicitly asks. That region is owned by the rebuild command.

## Vocabulary

Use the exact project statuses, WBS statuses, and paper stages that appear in the user's existing Markdown files. If the template exists, read the relevant headings and table options from:

- `PROJECT_DASHBOARD.md`
- `README.md`
- `WBS.md`

Do not invent a larger status taxonomy unless the user asks.

## New Project Workflow

When creating a new paper project:

1. Confirm or infer a short project name and target parent folder.
2. Copy `research_project_template` into the target project folder.
3. Rename the copied folder using a clear pattern such as `YYYY_short_project_name`.
4. Update `README.md` with the project basics and current paper stage.
5. Update `WBS.md` with the current active stage and next action.
6. Add deadlines, reminder dates, collaborator waits, or checkpoints if known.
7. Update `START_HERE.md` with one immediately executable next first action.
8. Rebuild the project list in `PROJECT_DASHBOARD.md` using the dashboard auto-rebuild command when available.

If details are missing, make a conservative placeholder instead of blocking, unless the missing detail affects file location or risks overwriting existing work.

## Migrating Messy Notes

When the user provides a long work log, old memo, or scattered notes:

1. Extract project identity, current stage, last work, next action, blockers, decisions, and file paths.
2. Put stable project facts in `README.md`.
3. Put stage and task status in `WBS.md`.
4. Put the restart summary and one next first action in `START_HERE.md`.
5. Append date-based details to `RESEARCH_LOG.md`.
6. Put major choices and rationale in `DECISIONS.md`.
7. Put only key paths in `FILES.md`.
8. Extract collaborator waits, deadlines, and reminder dates.
9. Update the source project files, then rebuild `PROJECT_DASHBOARD.md` so stage, last work date, next first action, deadline, reminder date, and blocker are refreshed.

Do not preserve every sentence. Preserve recoverability.

## Daily Start Workflow

When the user asks what to work on today:

1. Read `PROJECT_DASHBOARD.md`.
2. Check today's or this week's deadlines, reminder dates, and collaboration waiting items.
3. Identify active projects and stale projects.
4. Recommend 1-2 projects for today, unless the user specifies otherwise.
5. For the chosen project, read `START_HERE.md`.
6. If needed, read `WBS.md` and `FILES.md`.
7. Return a short plan centered on the next first action.

## Daily End Workflow

When recording today's work:

1. Append a dated entry to `RESEARCH_LOG.md`.
2. Record sent requests, received replies, changed deadlines, and new reminder dates when relevant.
3. Update the relevant row or task in `WBS.md`, including owner/waiting party and checkpoint if present in the template.
4. Rewrite `START_HERE.md` so the next session can start quickly.
5. Rebuild `PROJECT_DASHBOARD.md` after updating the project source files; update manual collaboration waiting sections separately when needed.
6. Add to `DECISIONS.md` only if a meaningful research or project decision was made.

## Weekly Review Workflow

When reviewing the portfolio:

1. Read `PROJECT_DASHBOARD.md`.
2. Flag projects with old last-work dates.
3. Check the next two weeks of deadlines and reminder dates.
4. Flag collaboration waiting items that need follow-up.
5. Limit active projects to a manageable set.
6. Move inactive projects to waiting or paused status when appropriate, using the labels already present in the dashboard.
7. Ensure every active project has a concrete next first action.
8. Suggest the next week's top 1-3 priorities.

## Collaboration, Deadline, and Reminder Rules

- Track cross-project waits in `PROJECT_DASHBOARD.md`, not in a new file by default.
- Track project-specific collaboration status in the project's `README.md`.
- Track task-level owner, waiting party, deadline, or checkpoint in `WBS.md` when the template has those columns.
- Track sent requests, received replies, and changed deadlines in `RESEARCH_LOG.md`.
- Keep hard deadlines in an external calendar as the source of actual notifications.
- Treat the Markdown reminder date as a review trigger, not an alarm system.
- If the user asks to implement Windows notifications, cron-like reminder scanning, Google Calendar sync, or Outlook Calendar sync, read the reminder/calendar sync PRD before making changes.
- If the user asks for a server WSL plus local Windows notification setup, read the local Windows agent PRD, architecture document, and setup guide before making changes.
- If the user asks to change dashboard auto-rebuild behavior, read the dashboard auto-rebuild PRD before making changes.

## Dashboard Auto-Rebuild Commands

Use these commands for implemented project-list dashboard automation:

- Preview generated project table: `npx -y github:cameleonh/research-project-manager -- dashboard rebuild --target "<Research_HQ>" --dry-run`
- Rebuild the project-list region in `PROJECT_DASHBOARD.md`: `npx -y github:cameleonh/research-project-manager -- dashboard rebuild --target "<Research_HQ>"`
- Watch project Markdown files and rebuild after changes: `npx -y github:cameleonh/research-project-manager -- dashboard watch --target "<Research_HQ>"`

The rebuild command scans project folders below the target. A folder counts as a project when at least two of `README.md`, `WBS.md`, and `START_HERE.md` exist.

The command updates only the region between these markers:

```markdown
<!-- RPM:PROJECT_LIST:START -->
<!-- RPM:PROJECT_LIST:END -->
```

The generated project-list fields come from project files:

- Project name: first H1 in `README.md`, falling back to folder name.
- Status: `README.md` section `## 현재 상태`.
- Stage: `README.md` section `## 현재 논문 단계`, falling back to `WBS.md` section `## 현재 단계`.
- Last work date: `START_HERE.md` section `## 마지막 업데이트`, falling back to the latest `## YYYY-MM-DD` in `RESEARCH_LOG.md`.
- Next first action: `START_HERE.md` section `## 다음에 시작할 첫 행동`.
- Next deadline and reminder date: nearest future `YYYY-MM-DD` from `README.md`, `START_HERE.md`, or `WBS.md`.
- Blocked reason: `START_HERE.md` section `## 막힌 지점`, falling back to blocked rows in `WBS.md`.
- Folder: target-relative path.

Excluded from scanning and watching:

- `PROJECT_DASHBOARD.md`
- `research_project_template/`
- `.research_pm_state/`
- `.git/`
- `node_modules/`

## Reminder Automation Commands

Use these commands for implemented reminder automation:

- Preview reminders: `npx -y github:cameleonh/research-project-manager -- reminders scan --target "<Research_HQ>" --dry-run`
- Send due Windows notifications: `npx -y github:cameleonh/research-project-manager -- reminders scan --target "<Research_HQ>" --notify`
- Install daily Windows Task Scheduler job: `npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "<Research_HQ>" --time 09:00`
- Mark a reminder done: `npx -y github:cameleonh/research-project-manager -- reminders mark --target "<Research_HQ>" --id R-2026-001 --status done`
- Google auth/sync: `calendar google-auth`, then `calendar google-sync`
- Outlook auth/sync: `calendar outlook-auth`, then `calendar outlook-sync`

Calendar sync is one-way from Markdown to calendar providers.

## Good Next First Actions

A next first action must be small enough to start immediately.

Poor:

- Read more papers.
- Do the analysis.
- Revise the manuscript.

Better:

- Check whether the safety-grade data has building name, address, and inspection-date columns.
- Summarize only the identification strategy from three key papers in `01_literature/lit_matrix.md`.
- Verify that the sample size in Figure 2 matches the manuscript text.
