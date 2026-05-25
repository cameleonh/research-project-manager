# Implementation Plan: Local Windows Agent

## Scope

Implement the 1순위 architecture:

```text
Server WSL = repo/update/optional automation
Shared Markdown = source of truth
Local Windows agent = visible alerts and scheduled scans
```

## Current Status

Already implemented:

- `npx` installer
- local `.research_pm_tools` copy
- reminder scan dry-run
- Windows toast notification script
- Windows Task Scheduler registration
- reminder state file
- Google Calendar OAuth/sync
- Outlook Calendar OAuth/sync
- one-way calendar sync

Needed for app-level polish:

- clearer setup wizard or installer
- local path validation
- better state strategy for multi-machine use
- optional tray UI
- provider setup screens

## Phase 1: Harden Current CLI

Goal: make the current CLI reliable enough for daily use.

Tasks:

- Add clearer error messages for missing `PROJECT_DASHBOARD.md`.
- Add command to print resolved paths and state file location.
- Add command to validate dashboard table schema.
- Add `--state-dir` option for per-machine state.
- Add `--quiet-hours` or document why it is deferred.
- Add tests for Markdown table parsing and reminder classification.

Acceptance:

- User can run one command to validate a Research HQ folder.
- Task Scheduler failures are diagnosable from CLI output.
- CLI can be used on a shared folder without modifying project data unexpectedly.

## Phase 2: Local Windows Installer

Goal: make setup easier on each local Windows PC.

Options:

- PowerShell installer script
- npm/npx installer only
- packaged `.exe` installer later

Tasks:

- Add `scripts/install_local_agent.ps1`.
- Create Start Menu shortcut to open dashboard.
- Register or update Task Scheduler job.
- Run notification test after install.
- Print exact uninstall commands.

Acceptance:

- A local Windows PC can be configured in under five minutes.
- The install process verifies that the dashboard path is readable.
- The scheduled task is visible in Task Scheduler.

## Phase 3: Tray App

Goal: make the agent visible without building a full project-management app.

Recommended features:

- tray icon
- Scan now
- Show next 14 days
- Open dashboard
- Open Research HQ folder
- Pause reminders
- Test notification
- Open settings

Deferred features:

- full project editor
- rich calendar UI
- two-way sync
- mobile app

Technology candidates:

- Tauri: lightweight, good for tray + local files
- .NET WinUI: best Windows-native integration
- Electron: fastest UI development, heavier runtime

Recommendation: Tauri or .NET WinUI. Keep the existing Node CLI as the automation core until a replacement is justified.

## Phase 4: Calendar Setup UX

Goal: reduce OAuth friction.

Tasks:

- Show current Google/Outlook auth status.
- Provide step-by-step auth instructions.
- Add dry-run preview before sync.
- Add "sync selected provider now" command/UI.
- Add safer token location docs.

Acceptance:

- User can tell whether Google/Outlook sync is configured.
- Re-running sync does not duplicate events.
- Tokens are not stored in the repo.

## Phase 5: Multi-Machine Policy

Goal: make behavior predictable across multiple local PCs.

Decisions required:

- shared state or per-machine state
- whether each machine should notify independently
- how to handle offline machines
- how to handle stale local sync copies

Recommended default:

```text
Per-machine notification state.
Shared Markdown project data.
Calendar sync on one designated machine only.
```

Rationale:

- local reminders should appear on each active PC
- calendar sync should not create duplicate events from several machines
- per-machine state avoids file write conflicts

## Testing Plan

Test matrix:

| Scenario | Expected |
|---|---|
| Missing dashboard | clear error |
| Empty dashboard | zero reminders |
| Due reminder | appears in scan |
| Future reminder within lookahead | appears as upcoming |
| Done reminder | skipped |
| Duplicate scan same day | no duplicate notification |
| Task Scheduler install | task registered |
| Shared UNC path unavailable | clear failure |
| Google dry-run | no API write |
| Outlook dry-run | no API write |

## Release Checklist

- README updated
- PRD updated
- setup guide updated
- CLI help updated
- local install tested
- dry-run tested
- Windows notification tested
- Task Scheduler registration tested
- GitHub `npx` tested

