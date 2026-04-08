# Local Development

## Ports

- Backend: `http://localhost:8888`
- Frontend: `http://localhost:5173`

Frontend development requests should use the `/api` prefix.
The Vite dev server proxies `/api/*` to the backend and strips the `/api` prefix before forwarding.

Example:

- Frontend request: `/api/user/list`
- Backend endpoint: `/user/list`

## Prerequisites

- Java 17
- Maven Wrapper is already included in the repo
- Node.js 20+
- pnpm installed at `%APPDATA%\npm\pnpm.cmd`

## Local Database Config

Create your own local backend config before starting Spring Boot:

```powershell
Copy-Item .\config\application-local.example.yaml .\config\application-local.yaml
```

Then edit `.\config\application-local.yaml` and fill in your own database password.
This file is ignored by Git and should remain local to your machine.

## Start Backend Only

From the repo root:

```powershell
.\mvnw.cmd spring-boot:run
```

Or use the helper script:

```powershell
.\scripts\dev-backend.ps1
```

## Start Frontend Only

Install dependencies once:

```powershell
cd .\frontend
& "$env:APPDATA\npm\pnpm.cmd" install
```

Start the dev server:

```powershell
cd .\frontend
& "$env:APPDATA\npm\pnpm.cmd" dev
```

Or use the helper script from the repo root:

```powershell
.\scripts\dev-frontend.ps1
```

## Start Frontend And Backend Together

From the repo root:

```powershell
.\scripts\dev-all.ps1
```

This script opens two PowerShell windows:

- one for Spring Boot
- one for Vite

## Build Separately

Backend:

```powershell
.\mvnw.cmd clean package
```

Frontend:

```powershell
cd .\frontend
& "$env:APPDATA\npm\pnpm.cmd" build
```

## Local Rules

- Keep backend code in the current Spring Boot structure under `src/main/java`.
- Keep frontend code only inside `frontend/`.
- Do not put frontend build output into Spring Boot `static/`.
- Frontend API calls should always go through `/api`.
- Backend controllers can stay on their current paths for now, and the dev proxy handles the prefix rewrite.
- Environment-specific values should stay in frontend `.env.*` files or backend `application-*.yaml`.
