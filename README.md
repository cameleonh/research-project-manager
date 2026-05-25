# Research Project Manager

Markdown-based project management system and Codex skill for researchers who run several paper projects at the same time.

The goal is not to create a heavy project-management app. The goal is to make every paper project easy to resume after interruptions by preserving:

- the current paper stage
- the last work done
- the next first action
- important decisions
- key file locations
- collaboration waits
- deadlines and reminder dates

This is useful when multiple manuscripts, analyses, reviews, and revisions are moving in parallel and it becomes hard to remember where each project stopped.

## What This Includes

- `PROJECT_DASHBOARD.md`: portfolio view across multiple paper projects
- `PROJECT_MANAGEMENT_GUIDE.md`: operating guide
- `research_project_template/`: per-paper project folder template
- `codex_skill/research-project-manager/`: Codex skill rules for maintaining the system
- `docs/PRD_reminder_calendar_sync.md`: product requirements for Windows reminders and calendar sync

## Install With npx

Install the Markdown files into the current folder and the Codex skill into `~/.codex/skills/research-project-manager`:

```powershell
npx -y github:cameleonh/research-project-manager
```

Install into a specific research folder:

```powershell
npx -y github:cameleonh/research-project-manager -- --target "C:\Users\honey\Documents\New project"
```

Useful options:

```powershell
npx -y github:cameleonh/research-project-manager -- --skip-skill
npx -y github:cameleonh/research-project-manager -- --skip-files
npx -y github:cameleonh/research-project-manager -- --force
```

For private GitHub repositories, the machine running `npx` must have GitHub access to `cameleonh/research-project-manager`.

The installer also copies local reminder tooling into `.research_pm_tools/` under the target folder. That makes Windows Task Scheduler jobs independent of the transient `npx` cache.

## What The Skill Does

The Codex skill in `codex_skill/research-project-manager/` tells Codex how to maintain this Markdown system consistently. It supports:

- creating a new research paper project from the template
- migrating messy notes or long work logs into the structure
- updating daily research logs
- deciding the next first action for a project
- updating the portfolio dashboard
- tracking collaborators, deadlines, external checkpoints, and reminder dates
- keeping the system lightweight and avoiding unnecessary new files

The skill does not store actual research content. Research content stays in the user's own project folders.

## File Roles

| File | Purpose |
|---|---|
| `PROJECT_DASHBOARD.md` | Overview of all paper projects |
| `README.md` | Stable basics for one paper project |
| `WBS.md` | Paper-stage tracking and task map |
| `START_HERE.md` | One-screen restart note for the next session |
| `RESEARCH_LOG.md` | Session history and daily work record |
| `DECISIONS.md` | Important decisions and rationale |
| `FILES.md` | Key file locations |

## Collaboration, Deadlines, And Reminders

The system now includes lightweight collaboration and deadline tracking:

- `PROJECT_DASHBOARD.md` includes collaboration waiting items and a deadline/reminder queue.
- Each project `README.md` includes collaboration status and alert-related fields.
- Each project `WBS.md` can track owner/waiting party and deadline/checkpoint per task.
- Each project `RESEARCH_LOG.md` can record sent requests, received replies, and changed deadlines.

Markdown reminder dates are not real notifications. Hard deadlines should also be registered in an external calendar or reminder app.

Automation is described in `docs/PRD_reminder_calendar_sync.md`. The implemented direction is Markdown as the source of truth, Windows Task Scheduler for local notifications, and optional one-way sync to Google Calendar or Outlook Calendar.

### Windows Reminder Commands

Preview due and upcoming reminders:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "C:\Users\honey\Documents\New project" --dry-run
```

Show Windows notifications for due reminders:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "C:\Users\honey\Documents\New project" --notify
```

Register a daily Windows Task Scheduler job:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "C:\Users\honey\Documents\New project" --time 09:00
```

Test Windows notification delivery:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders test-notification
```

Mark a reminder row as done:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders mark --target "C:\Users\honey\Documents\New project" --id R-2026-001 --status done
```

### Calendar Sync Commands

Google Calendar uses an OAuth desktop/client-secret JSON file:

```powershell
npx -y github:cameleonh/research-project-manager -- calendar google-auth --client-secret "C:\path\client_secret.json"
npx -y github:cameleonh/research-project-manager -- calendar google-sync --target "C:\Users\honey\Documents\New project" --dry-run
npx -y github:cameleonh/research-project-manager -- calendar google-sync --target "C:\Users\honey\Documents\New project"
```

Outlook Calendar uses Microsoft Graph device-code OAuth with your own Azure app client ID:

```powershell
npx -y github:cameleonh/research-project-manager -- calendar outlook-auth --client-id "<azure-app-client-id>"
npx -y github:cameleonh/research-project-manager -- calendar outlook-sync --target "C:\Users\honey\Documents\New project" --dry-run
npx -y github:cameleonh/research-project-manager -- calendar outlook-sync --target "C:\Users\honey\Documents\New project"
```

Calendar sync is one-way: `PROJECT_DASHBOARD.md` creates or updates calendar events. Calendar edits are not synced back into Markdown.

## Basic Workflow

1. Copy `research_project_template/` for each new paper project.
2. Track all papers in `PROJECT_DASHBOARD.md`.
3. Use each project's `WBS.md` for paper-stage tracking.
4. Use each project's `START_HERE.md` to restart work quickly.
5. Use each project's `RESEARCH_LOG.md` for session history.

## Codex Usage Example

```text
Use $research-project-manager to update my paper project dashboard and next actions.
```

Other useful prompts:

```text
Use $research-project-manager to create a new paper project from the template.
Use $research-project-manager to migrate this long work log into START_HERE, WBS, and RESEARCH_LOG.
Use $research-project-manager to review my PROJECT_DASHBOARD and suggest this week's top priorities.
```

Actual research data and private project contents should live in the user's own research folders, not in this repository.
