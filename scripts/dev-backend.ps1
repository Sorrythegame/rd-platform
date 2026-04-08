$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

& "$projectRoot\mvnw.cmd" spring-boot:run
