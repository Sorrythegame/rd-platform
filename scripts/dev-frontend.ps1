$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$frontendDir = Join-Path $projectRoot 'frontend'
$pnpmPath = Join-Path $env:APPDATA 'npm\pnpm.cmd'

if (-not (Test-Path $pnpmPath)) {
    throw "pnpm.cmd not found at $pnpmPath. Install pnpm first."
}

Set-Location $frontendDir

& $pnpmPath dev
