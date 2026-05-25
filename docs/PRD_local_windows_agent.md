# PRD: Local Windows Reminder Agent

## Summary

Build a lightweight local Windows agent for Research Project Manager. The agent runs on the user's current Windows machine, reads the shared `PROJECT_DASHBOARD.md`, shows Windows notifications, and optionally mirrors selected reminders to Google Calendar or Outlook Calendar.

The server WSL environment is used for central repo management, updates, and automation logic. It does not directly show notifications on the user's local Windows notification center. Local notifications are produced by the local Windows agent.

## Problem

A researcher may keep the project management system on a server or server WSL environment, while actually working from several local Windows machines. If reminder scanning runs only on the server, notifications appear on the server or are not visible to the current user.

The user needs local reminders on the active Windows machine, while still keeping the Markdown project dashboard centralized and easy to update from WSL.

## Goal

Make the local Windows machine responsible for visible user notifications while keeping Markdown data portable and centrally managed.

## Product Principle

```text
Shared Markdown is the source of truth.
Server WSL manages code and updates.
Local Windows agent owns visible notifications.
Calendar providers mirror selected reminders.
```

## Target User

- A doctoral student or researcher managing 5-7 simultaneous paper projects.
- The user works across more than one computer.
- The user may maintain the repository on a server WSL environment.
- The user wants notifications to appear on the current local Windows desktop.

## Non-Goals

- Do not make server WSL directly push Windows toast notifications to arbitrary local PCs.
- Do not build a full cloud service in v1.
- Do not require always-on internet for local Windows reminder scanning.
- Do not make Google Calendar or Outlook the source of truth.
- Do not require a GUI before the local agent workflow is stable.
- Do not create two-way calendar sync in v1.

## Deployment Model

### Recommended Model

```text
Server WSL
  - git clone / git pull
  - repo updates
  - optional calendar sync jobs

Shared Storage
  - OneDrive, SMB share, Syncthing, or another synced folder
  - contains PROJECT_DASHBOARD.md and project folders

Local Windows PC
  - local reminder agent
  - Windows Task Scheduler
  - Windows notification delivery
  - optional Google/Outlook OAuth setup
```

### Example Paths

Server WSL:

```text
~/repos/research-project-manager
/mnt/c/Users/honey/Documents/New project
```

Local Windows:

```text
C:\Users\honey\Documents\New project
\\server\Research_HQ
C:\Users\honey\OneDrive\Research_HQ
```

## User Stories

1. As a researcher, I want local Windows reminders to appear on the PC I am using, even if the project system is maintained from server WSL.
2. As a researcher, I want to keep `PROJECT_DASHBOARD.md` as the source of reminder data.
3. As a researcher, I want each local PC to install its own notification task.
4. As a researcher, I want server WSL to update the tool without breaking the local reminder setup.
5. As a researcher, I want calendar sync to be optional and one-way.
6. As a researcher, I want duplicate notifications and duplicate calendar events to be suppressed.

## Functional Requirements

### Local Agent

- Install local tooling into `.research_pm_tools` under the target Research HQ folder.
- Scan `PROJECT_DASHBOARD.md` for due and upcoming reminders.
- Show Windows notifications for due reminders.
- Store local notification state in `.research_pm_state/reminders.json`.
- Suppress duplicate notifications for the same reminder on the same day.
- Provide dry-run output before enabling notifications.
- Support multiple local Windows machines reading the same Markdown folder.

### Windows Task Scheduler

- Register a daily task on each local Windows machine.
- Default schedule: 09:00 local time.
- Run the local copied CLI from `.research_pm_tools`, not a transient `npx` cache.
- Allow custom task name, target path, time, and lookahead days.

### Shared Folder Handling

- Support local paths, OneDrive paths, and UNC paths where possible.
- Fail clearly when the dashboard is unavailable.
- Do not silently create reminders if the dashboard cannot be read.
- Do not require the server WSL repo to be mounted on the local Windows machine.

### Calendar Sync

- Google Calendar sync is optional.
- Outlook Calendar sync is optional.
- Sync only rows whose `캘린더 등록` is `예` or `yes`.
- Use stable reminder IDs to avoid duplicates.
- Store generated event IDs in local state.
- Treat calendar events as mirrors, not source data.

### Update Workflow

- Server WSL can run `git pull` and update the repo.
- Local Windows can re-run `npx -y github:cameleonh/research-project-manager -- --target "<Research_HQ>" --force` to refresh tools.
- Reinstalling tools should not overwrite research project data unless `--force` is explicitly used.

## UX Requirements

### CLI UX

The first version can remain CLI-based.

Required commands:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "<Research_HQ>" --dry-run
npx -y github:cameleonh/research-project-manager -- reminders scan --target "<Research_HQ>" --notify
npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "<Research_HQ>" --time 09:00
```

### Future Tray App UX

A later app can add:

- tray icon
- "Scan now"
- "Open PROJECT_DASHBOARD"
- "Open Research folder"
- "Pause reminders"
- "Show next 14 days"
- "Calendar sync status"

The tray app should still read Markdown files directly.

## Acceptance Criteria

- A local Windows PC can install the agent against a shared `Research_HQ` path.
- The local Windows PC shows a test notification.
- The local Windows PC registers a scheduled task.
- Due reminders in `PROJECT_DASHBOARD.md` produce local Windows notifications.
- Re-running the scan does not notify the same reminder repeatedly on the same day.
- Server WSL is not required to be interactive for local notifications to work.
- Calendar sync can run independently from local notification scanning.

## Risks

- Shared folders may be unavailable when the scheduled task runs.
- OneDrive or Syncthing may not have completed sync before the scan.
- UNC paths can behave differently under scheduled tasks.
- OAuth setup is provider-specific and can fail independently of local reminders.
- Multiple local PCs can each notify the same reminder unless per-machine state is expected and documented.

## Open Decisions

- Should each local PC have its own notification state, or should state be shared across machines?
- Should overdue reminders notify every day until marked `done`, or only once per reminder?
- Should the future tray app use Tauri, .NET WinUI, or Electron?
- Should the local agent support a "quiet hours" setting?
- Should the installer expose a first-run wizard?

