# Setup Guide: Server WSL + Local Windows Alerts

This guide describes the recommended 1순위 setup.

## Recommended Layout

```text
Server WSL
  ~/repos/research-project-manager

Shared Research HQ
  C:\Users\honey\Documents\New project
  or \\server\Research_HQ
  or C:\Users\honey\OneDrive\Research_HQ

Local Windows PC
  Windows Task Scheduler
  .research_pm_tools/
  .research_pm_state/
```

## Step 1: Maintain The Repo In Server WSL

In WSL:

```bash
mkdir -p ~/repos
cd ~/repos
git clone https://github.com/cameleonh/research-project-manager.git
cd research-project-manager
git pull
```

Use WSL for development, updates, and Git operations.

## Step 2: Keep Research HQ Visible To Local Windows

Choose one shared storage method:

### Option A: OneDrive

Use a OneDrive synced Research HQ folder on each local Windows PC.

Example:

```text
C:\Users\honey\OneDrive\Research_HQ
```

### Option B: SMB Share

Expose the server folder as a Windows network share.

Example:

```text
\\server\Research_HQ
```

### Option C: Syncthing

Use Syncthing to keep a local folder synced across machines.

Example:

```text
C:\Users\honey\Research_HQ
```

## Step 3: Install The Local Agent On Each Windows PC

Run on the local Windows PC where notifications should appear:

```powershell
npx -y github:cameleonh/research-project-manager -- --target "C:\Users\honey\Documents\New project"
```

For a network share:

```powershell
npx -y github:cameleonh/research-project-manager -- --target "\\server\Research_HQ"
```

This installs:

- Markdown dashboard and templates
- Codex skill
- `.research_pm_tools`

## Step 4: Test Reminder Scanning

```powershell
npx -y github:cameleonh/research-project-manager -- reminders scan --target "C:\Users\honey\Documents\New project" --dry-run
```

Fix dashboard table issues before enabling scheduled notifications.

## Step 5: Test Windows Notification

```powershell
npx -y github:cameleonh/research-project-manager -- reminders test-notification
```

If no notification appears, check Windows notification settings and Focus Assist / Do Not Disturb settings.

## Step 6: Register Scheduled Notifications

```powershell
npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "C:\Users\honey\Documents\New project" --time 09:00
```

The scheduled task runs the copied local CLI from:

```text
<Research_HQ>\.research_pm_tools\cli.js
```

This avoids depending on the temporary `npx` cache.

## Step 7: Optional Calendar Sync

Google Calendar:

```powershell
npx -y github:cameleonh/research-project-manager -- calendar google-auth --client-secret "C:\path\client_secret.json"
npx -y github:cameleonh/research-project-manager -- calendar google-sync --target "C:\Users\honey\Documents\New project" --dry-run
npx -y github:cameleonh/research-project-manager -- calendar google-sync --target "C:\Users\honey\Documents\New project"
```

Outlook Calendar:

```powershell
npx -y github:cameleonh/research-project-manager -- calendar outlook-auth --client-id "<azure-app-client-id>"
npx -y github:cameleonh/research-project-manager -- calendar outlook-sync --target "C:\Users\honey\Documents\New project" --dry-run
npx -y github:cameleonh/research-project-manager -- calendar outlook-sync --target "C:\Users\honey\Documents\New project"
```

Recommendation:

```text
Run calendar sync on one designated machine only.
Run local Windows reminders on every machine where desktop notifications are useful.
```

## Updating From Server WSL

In WSL:

```bash
cd ~/repos/research-project-manager
git pull
```

Then, on each local Windows PC that should use the updated local tools:

```powershell
npx -y github:cameleonh/research-project-manager -- --target "C:\Users\honey\Documents\New project" --force
```

If the scheduled task already exists, re-register it after major CLI updates:

```powershell
npx -y github:cameleonh/research-project-manager -- reminders install-windows-task --target "C:\Users\honey\Documents\New project" --time 09:00
```

## Troubleshooting

### Notifications Do Not Appear

- Run `reminders test-notification`.
- Check Windows notification settings.
- Check Focus Assist / Do Not Disturb.
- Confirm the scheduled task is running under the interactive user.

### The Scheduled Task Cannot Read The Dashboard

- Confirm the target path is accessible from Windows.
- If using a UNC path, confirm the user has saved credentials.
- If using OneDrive, confirm the file is available offline.

### Calendar Events Duplicate

- Confirm each reminder has a stable `ID`.
- Run calendar sync from only one designated machine.
- Check `.research_pm_state/reminders.json` for provider event IDs.

### Server WSL Updates Do Not Affect Local Alerts

Server WSL updates the repository, but the local Windows agent uses copied files in `.research_pm_tools`. Re-run the installer with `--force` on the local Windows machine.

