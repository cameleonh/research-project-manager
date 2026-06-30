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
- Journal target reference: `C:\Users\honey\Documents\New project\JOURNAL_TARGETS.md`
- User guide: `C:\Users\honey\Documents\New project\PROJECT_MANAGEMENT_GUIDE.md`
- Reminder/calendar sync PRD: `C:\Users\honey\Documents\New project\research-project-manager\docs\PRD_reminder_calendar_sync.md`
- Dashboard auto-rebuild PRD: `C:\Users\honey\Documents\New project\research-project-manager\docs\PRD_dashboard_auto_rebuild.md`
- Finishing workflow guide: `C:\Users\honey\Documents\New project\research-project-manager\docs\FINISHING_WORKFLOW.md`
- Local Windows agent planning repo: `C:\Users\honey\Documents\New project\research-pm-local-windows-agent`

Verify paths before editing. Work with the user's current files; do not overwrite research content unless explicitly asked.

## File Roles

| File | Role |
|---|---|
| `PROJECT_DASHBOARD.md` | Portfolio view across all research projects |
| `JOURNAL_TARGETS.md` | Shared journal, society, and conference target reference |
| `README.md` | Stable project basics and current paper stage |
| `WBS.md` | Paper-stage map and task status |
| `START_HERE.md` | The first screen to restart work within 5 minutes |
| `RESEARCH_LOG.md` | Date-based record of actual work performed |
| `DECISIONS.md` | Important decisions, reasons, alternatives, and revisit conditions |
| `FILES.md` | Key file locations only, not a complete file inventory |
| `VARIABLE_AUDIT.md` | Crosswalk for actual data columns, code variable names, manuscript concepts, and review status |
| `CITATION_AUDIT.md` | Crosswalk for in-text citations, reference list entries, and actual paper existence checks |
| `06_manuscript/*.md` | Chapter-based manuscript drafting files using the `writings` scene format |
| `SUBMISSION_CHECKLIST.md` | Pre-submission readiness checklist for closing the manuscript |
| `PARKING_LOT.md` | Good but out-of-scope ideas intentionally excluded from the current manuscript |
| `ANALYSIS_DASHBOARD.md` | Optional registry linking analysis IDs, scripts, outputs, manuscript locations, and claims |

## Managed Files

The skill manages this Markdown project system:

- `PROJECT_DASHBOARD.md` for the portfolio view
- `JOURNAL_TARGETS.md` for journal/society targets and submission fit notes
- `README.md` for project basics
- The `README.md` stage navigation table for which files to read and edit at each paper stage
- `WBS.md` for paper-stage tracking
- `START_HERE.md` for the next first action
- `RESEARCH_LOG.md` for session history
- `DECISIONS.md` for important decisions
- `FILES.md` for key file locations
- `VARIABLE_AUDIT.md` for data/code/manuscript variable review
- `CITATION_AUDIT.md` for manuscript citation/reference matching and cited-paper existence review
- `06_manuscript/` for actual manuscript paragraphs and paper outline files; chapter files follow the `writings` scene format
- `SUBMISSION_CHECKLIST.md` for pre-submission readiness checks
- `PARKING_LOT.md` for out-of-scope ideas and follow-up research candidates
- Optional `ANALYSIS_DASHBOARD.md` for analysis-heavy projects only
- Dashboard sections for collaboration waiting items, deadlines, and reminder dates
- `docs/PROMPTS.md` for user-facing prompt examples when the user asks how to invoke or use this workflow
- `docs/FINISHING_WORKFLOW.md` for turning mature analyses into submission-ready manuscripts

## Supported Tasks

Support these recurring operations:

- Creating a new research paper project from the template
- Migrating messy notes or long work logs into the structure
- Updating daily work logs
- Deciding the next first action
- Updating the project dashboard
- Rebuilding the project dashboard automatically from project Markdown files
- Reviewing journal, society, conference, and submission target fit from `JOURNAL_TARGETS.md`
- Creating or updating an optional `ANALYSIS_DASHBOARD.md` when a project has many scripts, outputs, baselines, robustness checks, or model comparisons
- Creating or updating `VARIABLE_AUDIT.md` to check whether actual data columns, code variable names, and manuscript concepts match
- Reviewing analysis code at the variable and sample-definition level before trusting results
- Creating or updating `CITATION_AUDIT.md` to check whether in-text citations match the reference list
- Verifying cited references for actual paper existence before submission
- Applying the finishing workflow when the user has mature analyses but needs to close manuscripts for submission
- Tracking collaborator waits, external checkpoints, deadlines, and reminder dates
- Keeping the system lightweight and avoiding unnecessary new files

## Operating Rules

- Keep the system lightweight. Prefer updating existing files over adding new files.
- Preserve the language and labels already used in the user's template files.
- Keep a stage navigation table in each project `README.md` when the template has one. It should link the current paper stage to the files to read first, files to inspect next, and files to edit.
- Do not put detailed daily logs in `WBS.md`; keep them in `RESEARCH_LOG.md`.
- Do not bury the next first action only in `RESEARCH_LOG.md`; copy the actionable next step into `START_HERE.md`.
- Do not put long manuscript paragraphs in `WBS.md`, `START_HERE.md`, or `RESEARCH_LOG.md`; keep actual draft text in `06_manuscript/`.
- Use `PROJECT_DASHBOARD.md` for the many-project overview, not for detailed project notes.
- Use `START_HERE.md` as the restart document. It should fit on one short screen when possible.
- Use `SUBMISSION_CHECKLIST.md` only as a closing checklist. Do not turn it into an open-ended research task list.
- Use `PARKING_LOT.md` to preserve good ideas that should not expand the current manuscript.
- Do not create `ANALYSIS_DASHBOARD.md` by default. Suggest it only for analysis-heavy projects where `FILES.md` no longer clearly links scripts, results, manuscript locations, and supported claims.
- When creating `ANALYSIS_DASHBOARD.md`, use simple IDs such as `A0`, `A1`, `A2`; include purpose, input data, script, output folder, manuscript location, supported claim, and status.
- Do not treat code organization as code review. A script being in `04_analysis/` only means it is findable; it does not prove the variables, joins, filters, recodes, or sample definitions are correct.
- Use `VARIABLE_AUDIT.md` when analysis code affects results, variables, sample construction, or manuscript claims.
- In `VARIABLE_AUDIT.md`, map each important actual data column to the code variable name, manuscript or conceptual variable, measurement content, transformation/coding, use location, evidence, review status, and required fix.
- Do not mark a result ready for manuscript use while any core variable in that result has `불일치`, `애매함`, `수정 필요`, or `확인 전` status.
- Use `CITATION_AUDIT.md` before submission and whenever the user asks whether citations or references are correct.
- In `CITATION_AUDIT.md`, match every in-text citation to the reference list and every reference list entry back to an in-text citation unless the user intentionally keeps an uncited background source.
- For actual paper existence checks, do not rely on search snippets alone. Prefer DOI resolver, publisher page, Crossref, PubMed, KCI, RISS, DBpia, Scopus, or another authoritative scholarly source, and record the evidence and check date.
- Do not mark references ready for submission while any core citation has `본문만 있음`, `목록만 있음`, `서지정보 불일치`, `확인 실패`, `DOI 불일치`, `제목/저자 불일치`, `공식 출처 없음`, `수정 필요`, or `확인 전` status.
- When the user says analysis is easy but writing/submission closure is hard, use the finishing workflow: lock one research question, map analyses, write results, calibrate discussion, park new ideas, run the submission checklist, and submit.
- Store actual research content in the user's project files, never inside this skill.
- The skill should contain only operating rules and procedures, not project data.
- Do not store changing journal metrics directly in the skill. Use `JOURNAL_TARGETS.md` and refresh it from official sources.
- Markdown reminder dates are not real notifications. If a deadline must produce an alert, tell the user to also put it in their calendar or reminder app.
- When the user asks to refresh the project list in `PROJECT_DASHBOARD.md`, prefer the dashboard auto-rebuild CLI over manually editing the generated project-list table.
- Do not edit content between `<!-- RPM:PROJECT_LIST:START -->` and `<!-- RPM:PROJECT_LIST:END -->` by hand unless the user explicitly asks. That region is owned by the rebuild command.
- For manuscript work, use `06_manuscript/research_plan_bullet.md` for design notes, `00_paper_outline.md` for overall logic, the `writings` scene files for actual draft chapters, and `manuscript_full.md` only as a final assembly file.
- Use these chapter files for new projects: `Index.md`, `Abstract.md`, `Introduction.md`, `Theory.md`, `Conceptual Frameworks.md`, `Methods.md`, `Result.md`, `Discussion.md`, and `Conclusion.md`.
- Put implications, interpretations, and policy significance in `06_manuscript/Discussion.md`; keep `Result.md` focused on analysis results.
- When the user asks about publication venues, journal fit, society targets, IF/JIF, or conference options, read `JOURNAL_TARGETS.md` first. If values are stale or missing, verify against official society/publisher pages and JCR/Scopus/KCI before updating.

## Manuscript Writing Format

When the user asks which writing format to use, treat this skill's project template as the canonical workspace and use the `writings` format as the canonical chapter manuscript format.

- Use the Research Project Manager structure for the project: `README.md`, `WBS.md`, `START_HERE.md`, `RESEARCH_LOG.md`, `DECISIONS.md`, `FILES.md`, `SUBMISSION_CHECKLIST.md`, `PARKING_LOT.md`, and `06_manuscript/`.
- Use `06_manuscript/` as the actual manuscript source. Do not draft long paper paragraphs in management files.
- For chapter manuscripts, follow `C:\Users\hserver\Downloads\2025_seoultech_capstone_design\writings`: `Index.md` Longform scenes plus `Abstract.md`, `Introduction.md`, `Theory.md`, `Conceptual Frameworks.md`, `Methods.md`, `Result.md`, `Discussion.md`, and `Conclusion.md`.
- Use the clean reusable headings from `writings`, including metadata, numbered chapter headings, and subheadings; do not copy stale project-specific content from that external folder into a new project.
- Keep the `## 메타데이터` YAML block at the top of every chapter manuscript file. The reusable metadata fields are `title`, `authors` with `name`, `affiliation`, and `email`, `journal`, `date`, and `keywords`.
- When project facts are known, update chapter metadata consistently across all chapter files; do not leave different titles, journals, dates, or keywords in different chapters unless the user explicitly wants chapter-specific metadata.
- Do not preserve malformed Markdown headings such as duplicated `## ##` or `### ###`; normalize headings before moving any useful material.
- Keep the final source of truth in the current project's `06_manuscript/*.md` files. External `writings` folders define the format, but are not managed project files.

## Vocabulary

Use the exact project statuses, WBS statuses, and paper stages that appear in the user's existing Markdown files. If the template exists, read the relevant headings and table options from:

- `PROJECT_DASHBOARD.md`
- `README.md`
- `WBS.md`

Do not invent a larger status taxonomy unless the user asks.

## Folder Naming Rules

When organizing research paper folders, keep folder names as stable IDs and keep changing state in Markdown metadata.

- Prefer ASCII folder names in the form `YYYY_short_english_slug`.
- Use lowercase words separated by underscores.
- Do not put `active`, `paused`, `waiting`, `done`, or other status labels in folder names.
- Do not use spaces, parentheses, long dates, or long Korean titles in folder names when creating or renaming project folders.
- Store the readable Korean title and longer explanation in the project's `README.md`, not in the folder name.
- Use `_program` for a broad research program that contains several paper projects, for example `2026_tabpfn_avm_research_program`.
- Use numbered subfolders inside a program for paper-level projects, for example `2026_01_high_risk_jeonse_descriptive` and `2026_02_sparse_housing_tabpfn_avm`.
- Use `_inbox_*` only for temporary or unclear folders that need later classification.
- Use `PROJECT_DASHBOARD.md` and each project `README.md` / `START_HERE.md` for status fields such as `active`, `waiting`, `paused`, `backlog`, `submitted`, `revision`, `done`, and `archive`.

Before renaming existing folders:

1. Check whether the target folder already exists.
2. Search Markdown files for the old folder name.
3. Rename only folders inside the intended research root.
4. Update Markdown path references after the rename.
5. Remove only empty leftover old-name folders after verifying they contain no files.
6. For Windows case-only renames, use a temporary intermediate name before applying the final casing.

For the user's Obsidian paper vault, when no more specific root is given and the user refers to `02_Paper`, assume:

- Paper vault root: `D:\Writing_Data\Obsidian Vault\02_Paper`
- Portfolio dashboard: `D:\Writing_Data\Obsidian Vault\02_Paper\PROJECT_DASHBOARD.md`
- Current folder naming style: `YYYY_short_english_slug`

## New Project Workflow

When creating a new paper project:

1. Confirm or infer a short project name and target parent folder.
2. Copy `research_project_template` into the target project folder.
3. Rename the copied folder using `YYYY_short_english_slug`; use `_program` only for multi-paper research programs.
4. Update `README.md` with the project basics and current paper stage.
5. Check that `README.md` stage navigation links still match the copied project structure.
6. Update `WBS.md` with the current active stage and next action.
7. Add deadlines, reminder dates, collaborator waits, or checkpoints if known.
8. Update `START_HERE.md` with one immediately executable next first action.
9. Use `06_manuscript/research_plan_bullet.md` for initial research design notes, `00_paper_outline.md` for the paper's early argument structure, and the `writings` scene files for chapter drafting.
10. Keep `VARIABLE_AUDIT.md` available for variable crosswalk and code review once real data or analysis code exists.
11. Keep `CITATION_AUDIT.md` available for citation/reference matching and cited-paper existence review once manuscript citations exist.
12. Do not create `ANALYSIS_DASHBOARD.md` at project creation unless the user already has multiple analysis scripts or output folders.
13. Rebuild the project list in `PROJECT_DASHBOARD.md` using the dashboard auto-rebuild command when available.

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
8. Put manuscript-ready paragraphs in the appropriate `06_manuscript/Abstract.md`, `Introduction.md`, `Theory.md`, `Conceptual Frameworks.md`, `Methods.md`, `Result.md`, `Discussion.md`, or `Conclusion.md` file.
9. If notes include data columns, code variables, variable definitions, sample filters, joins, recodes, or result claims, update `VARIABLE_AUDIT.md`.
10. If notes include citations, reference-list items, BibTeX/RIS exports, DOI lists, or bibliography problems, update `CITATION_AUDIT.md`.
11. If analysis scripts or result folders are numerous, create or update `ANALYSIS_DASHBOARD.md` to map analysis IDs to scripts, outputs, manuscript sections, and supported claims.
12. Extract collaborator waits, deadlines, and reminder dates.
13. Update the source project files, then rebuild `PROJECT_DASHBOARD.md` so stage, last work date, next first action, deadline, reminder date, and blocker are refreshed.

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
5. If manuscript text changed, update the relevant `06_manuscript/*.md` chapter file rather than storing the draft in logs.
6. If analysis code, data columns, variable definitions, filters, joins, or recodes changed, update `VARIABLE_AUDIT.md`.
7. If manuscript citations or reference-list entries changed, update `CITATION_AUDIT.md`.
8. If a new analysis script or result folder was created and `ANALYSIS_DASHBOARD.md` exists, update its analysis chain and status.
9. Rebuild `PROJECT_DASHBOARD.md` after updating the project source files; update manual collaboration waiting sections separately when needed.
10. Add to `DECISIONS.md` only if a meaningful research or project decision was made.

## Variable and Code Review Workflow

When the user asks whether analysis code is correct, whether variables match, or whether results can be trusted:

1. Read `FILES.md` to locate raw data, processed data, scripts, and result outputs.
2. Inspect the actual data column names or data dictionary before reading code assumptions.
3. Inspect analysis scripts in `04_analysis/` for variable reads, renames, recodes, joins, filters, sample restrictions, aggregations, and model formulas.
4. Update `VARIABLE_AUDIT.md` with a row for each important variable. The minimum columns are actual data column, code variable name, manuscript or conceptual variable, measurement content, transformation/coding, use location, evidence, review status, required fix, and code review memo.
5. Cross-check `VARIABLE_AUDIT.md` against `Methods.md`, `Conceptual Frameworks.md`, `Result.md`, and any table/figure outputs.
6. Mark unresolved mismatches as `불일치`, `애매함`, or `수정 필요`; do not silently normalize names.
7. Put follow-up actions in `START_HERE.md` and task status in `WBS.md`.
8. If a variable mismatch changes a research decision, record it in `DECISIONS.md`.

## Citation and Reference Review Workflow

When the user asks whether citations are correct, whether cited papers exist, or whether references are ready for submission:

1. Read `FILES.md` and the project `README.md` to locate manuscript files, reference-list files, and any BibTeX/RIS/Zotero/EndNote exports.
2. Extract in-text citations from `06_manuscript/*.md` and `06_manuscript/manuscript_full.md` when present.
3. Extract the reference list from the manuscript, bibliography file, or reference-manager export; use structured parsers when available instead of ad hoc text matching.
4. Update `CITATION_AUDIT.md` with one row per cited work. Record in-text citation, manuscript location, reference-list entry, DOI or key, match status, required fix, and memo.
5. Check both directions: every in-text citation must appear in the reference list, and every reference-list item must be cited in the manuscript or explicitly marked as intentionally excluded.
6. Verify actual paper existence using DOI resolver, publisher page, Crossref, PubMed, KCI, RISS, DBpia, Scopus, or another authoritative scholarly source. Search snippets alone are not enough.
7. Record the verification source, evidence, and check date in `CITATION_AUDIT.md`; mark unresolved cases as `확인 실패`, `DOI 불일치`, `제목/저자 불일치`, `공식 출처 없음`, or `수정 필요`.
8. Cross-check high-risk details: author order, publication year, title, journal, volume, issue, pages/article number, DOI, and Korean/English title variants.
9. Put follow-up fixes in `START_HERE.md`, task status in `WBS.md`, and final citation-format readiness in `SUBMISSION_CHECKLIST.md`.

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

## Journal Target Reference

Use `JOURNAL_TARGETS.md` for housing, real estate, architecture, urban studies, and aging-related journal/society targets.

When updating or using this file:

- Treat homepage URLs, KCI/Scopus/JCR status, and JIF/IF as time-sensitive.
- Keep `확인일` with every metric or scope check.
- Prefer official society, publisher, KCI, Scopus, and JCR sources over search snippets.
- Use `Fit Memo` to explain why a venue fits or does not fit a specific paper.
- Record final submission decisions in the project's `DECISIONS.md`, not only in `JOURNAL_TARGETS.md`.

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
