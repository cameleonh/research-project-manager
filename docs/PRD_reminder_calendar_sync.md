# PRD: Reminder And Calendar Sync

## Summary

Add lightweight reminder automation to Research Project Manager. The system should read reminder and deadline data from Markdown files, show Windows notifications through a scheduled local job, and optionally mirror hard deadlines to Google Calendar or Outlook Calendar.

The Markdown project files remain the source of truth. Calendar events and Windows notifications are outputs generated from Markdown, not separate places where project state is managed.

For the server WSL + local Windows deployment model, see:

- `PRD_local_windows_agent.md`
- `ARCHITECTURE_wsl_local_agent.md`
- `SETUP_wsl_server_local_windows.md`

## Problem

The current Markdown system can record deadlines and reminder dates, but Markdown does not actively notify the user. A researcher managing several paper projects can still miss:

- collaborator follow-up dates
- journal revision deadlines
- conference submission deadlines
- meeting preparation checkpoints
- stale projects that need review

Putting every reminder manually into Google Calendar or Outlook creates duplicate work and makes the Markdown dashboard less useful.

## Goals

- Notify the user on Windows when a project reminder or deadline is due.
- Mirror selected hard deadlines to Google Calendar or Outlook Calendar.
- Keep `PROJECT_DASHBOARD.md` as the canonical source for project reminder data.
- Prevent duplicate calendar events and repeated stale notifications.
- Preserve the system's lightweight, file-based workflow.

## Non-Goals

- Do not build a full project-management app.
- Do not create two-way sync between calendars and Markdown in the first version.
- Do not treat Google Calendar or Outlook as the source of truth.
- Do not store OAuth secrets, access tokens, or project data inside the Codex skill.
- Do not require calendar sync for the local Windows notification feature.

## Target User

A researcher or doctoral student running multiple paper projects at once, using Markdown files to track project state, next actions, deadlines, collaborators, and session logs.

## Current Inputs

The system currently stores reminder-related information in:

- `PROJECT_DASHBOARD.md`
- each project `README.md`
- each project `WBS.md`
- each project `START_HERE.md`
- each project `RESEARCH_LOG.md`

The main automation input should be `PROJECT_DASHBOARD.md`, specifically:

- `논문 프로젝트 목록`
- `협업 대기 목록`
- `마감 / 알림 큐`

## Recommended Dashboard Schema

The reminder queue needs stable IDs to prevent duplicate events and duplicate notifications.

```markdown
| ID | 날짜 | 프로젝트 | 유형 | 해야 할 일 | 캘린더 등록 | 알림 상태 |
|---|---|---|---|---|---|---|
| R-2026-001 | 2026-06-01 | 논문A | 리마인드 | 공저자 피드백 확인 | 예 | pending |
```

`ID` should be stable after creation. It should not be regenerated when the row text changes.

Recommended `알림 상태` values:

- `pending`
- `notified`
- `snoozed`
- `done`
- `skipped`

## Product Principles

1. Markdown first
   The project dashboard remains the source of truth.

2. One-way sync first
   Sync from Markdown to Windows notifications and calendars. Do not sync calendar edits back into Markdown in v1.

3. Calendar as mirror
   Google Calendar and Outlook are used for external alert delivery, especially phone notifications, not project management.

4. No hidden project state
   Any persistent sync state should be stored in a local state file, not in the Codex skill.

5. Low maintenance
   The feature should add automation, not create a new administrative burden.

## Functional Requirements

## Implementation Status

Implemented CLI commands:

- `reminders scan`
- `reminders test-notification`
- `reminders install-windows-task`
- `reminders mark`
- `reminders status`
- `reminders weekly`
- `calendar google-auth`
- `calendar google-sync`
- `calendar outlook-auth`
- `calendar outlook-sync`

The calendar sync is intentionally one-way from Markdown to the selected calendar provider.

### Phase 1: Windows Local Notifications

- Parse `PROJECT_DASHBOARD.md`.
- Detect reminders due today or overdue.
- Detect deadlines within a configurable lookahead window.
- Show a Windows toast notification for each due item.
- Run on a schedule through Windows Task Scheduler.
- Keep a local state file to avoid notifying the same item repeatedly.
- Allow a dry-run mode that prints upcoming notifications without sending them.

Suggested scripts:

```text
scripts/scan_reminders.py
scripts/show_windows_notification.ps1
scripts/install_windows_task.ps1
```

Default schedule:

- Daily at 09:00 local time
- Optional hourly scan for urgent reminders

### Phase 2: Google Calendar Sync

- Use OAuth for the user's Google account.
- Create calendar events for rows where `캘린더 등록` is `예`.
- Store the generated Google event ID in a local state file.
- Avoid creating duplicate events for the same reminder ID.
- Include reminder popup settings in the event.
- Support dry-run before writing to Google Calendar.

Required behavior:

- Use `PROJECT_DASHBOARD.md` as input.
- Only create or update events for rows with stable IDs.
- Do not delete calendar events automatically in v1 unless explicitly requested.

### Phase 3: Outlook Calendar Sync

- Use Microsoft Graph delegated permissions for the user's Outlook account.
- Create calendar events for selected reminder rows.
- Store the generated Outlook event ID in the local state file.
- Set event reminder fields when available.
- Support dry-run before writing to Outlook.

### Phase 4: Review And Cleanup

- Add a command to list stale reminder rows.
- Add a command to mark rows as `done` or `skipped`.
- Add a command to show calendar-sync status.
- Add a weekly summary output that can be pasted into `PROJECT_DASHBOARD.md`.

## State File

Use a local state file outside the Codex skill. Recommended path:

```text
.research_pm_state/reminders.json
```

Suggested structure:

```json
{
  "R-2026-001": {
    "last_notified_at": "2026-06-01T09:00:00+09:00",
    "google_event_id": null,
    "outlook_event_id": null,
    "last_seen_hash": "..."
  }
}
```

The state file should not contain OAuth client secrets or refresh tokens.

## OAuth And Security

- Store OAuth credentials outside the repo.
- Add credential and token paths to `.gitignore`.
- Request the smallest practical calendar scope.
- Never commit tokens, refresh tokens, client secrets, or generated credential files.
- Calendar sync must require explicit user setup.
- Local Windows notification mode must work without OAuth.

## Acceptance Criteria

Phase 1 is complete when:

- A dry run can list due reminders from `PROJECT_DASHBOARD.md`.
- A Windows toast notification can be shown for a sample reminder.
- A Windows Task Scheduler task can run the reminder scan.
- Duplicate notifications are suppressed using stable reminder IDs.

Phase 2 is complete when:

- The user can authenticate with Google Calendar.
- A selected reminder row can create one Google Calendar event.
- Re-running sync does not create duplicate events.
- The event includes a reminder.

Phase 3 is complete when:

- The user can authenticate with Microsoft Graph.
- A selected reminder row can create one Outlook Calendar event.
- Re-running sync does not create duplicate events.
- The event includes a reminder.

## Risks

- OAuth setup may be too heavy for the first version.
- Calendar write permissions require careful user consent.
- Windows toast notifications can be affected by local notification settings.
- Markdown table parsing can break if users manually change the table structure.
- Two-way sync can create complex conflict behavior and should be avoided initially.

## Open Questions

- Should Google Calendar or Outlook be the default calendar provider?
- Should the reminder scanner update `알림 상태` in Markdown automatically, or only update the local state file?
- Should overdue reminders notify every day until marked `done`, or only once?
- Should urgent deadlines use a different notification sound or frequency?
- Should a reminder row support a direct project folder link?

## Reference Docs

- Google Calendar event creation: https://developers.google.com/workspace/calendar/api/guides/create-events
- Google Calendar events reference: https://developers.google.com/workspace/calendar/api/v3/reference/events
- Microsoft Graph create calendar event: https://learn.microsoft.com/en-us/graph/api/calendar-post-events
- Microsoft Graph event reminder fields: https://learn.microsoft.com/en-us/graph/api/event-update
- Windows notification delivery methods: https://learn.microsoft.com/en-us/windows/apps/develop/notifications/choosing-a-notification-delivery-method
- PowerShell scheduled tasks: https://learn.microsoft.com/en-us/powershell/module/scheduledtasks/register-scheduledtask
