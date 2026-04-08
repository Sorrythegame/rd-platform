$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $projectRoot 'frontend'
$pnpmPath = Join-Path $env:APPDATA 'npm\pnpm.cmd'

if (-not (Test-Path $pnpmPath)) {
    throw "pnpm.cmd not found at $pnpmPath. Install pnpm first."
}

$backendCommand = "Set-Location '$projectRoot'; & '$projectRoot\mvnw.cmd' spring-boot:run"
$frontendCommand = "Set-Location '$frontendDir'; & '$pnpmPath' dev"

Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', $backendCommand | Out-Null
Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', $frontendCommand | Out-Null
