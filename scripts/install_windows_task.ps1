param(
    [Parameter(Mandatory=$true)][string]$Target,
    [Parameter(Mandatory=$true)][string]$CliPath,
    [string]$TaskName = "Research Project Manager Reminders",
    [string]$Time = "09:00",
    [int]$LookaheadDays = 14
)

$ErrorActionPreference = "Stop"

$node = (Get-Command node -ErrorAction Stop).Source
$targetFull = (Resolve-Path -LiteralPath $Target).Path
$cliFull = (Resolve-Path -LiteralPath $CliPath).Path
$arguments = "`"$cliFull`" reminders scan --target `"$targetFull`" --notify --lookahead-days $LookaheadDays"

$action = New-ScheduledTaskAction -Execute $node -Argument $arguments -WorkingDirectory $targetFull
$trigger = New-ScheduledTaskTrigger -Daily -At ([DateTime]::Parse($Time))
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description "Scan Research Project Manager Markdown reminders and show Windows notifications." `
    -Force | Out-Null

Write-Output "Registered scheduled task: $TaskName"
Write-Output "Target: $targetFull"
Write-Output "Schedule: daily at $Time"
