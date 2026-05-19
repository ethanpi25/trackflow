# Getting Started

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [pnpm-workspace.yaml](file://pnpm-workspace.yaml)
- [docker-compose.yml](file://docker-compose.yml)
- [apps/web/package.json](file://apps/web/package.json)
- [apps/api/package.json](file://apps/api/package.json)
- [apps/web/next.config.ts](file://apps/web/next.config.ts)
- [apps/api/src/server.ts](file://apps/api/src/server.ts)
- [apps/api/src/routes/track.ts](file://apps/api/src/routes/track.ts)
- [apps/web/src/app/api/v1/health/route.ts](file://apps/web/src/app/api/v1/health/route.ts)
- [apps/web/src/lib/api.ts](file://apps/web/src/lib/api.ts)
- [apps/web/vercel.json](file://apps/web/vercel.json)
- [tsconfig.base.json](file://tsconfig.base.json)
- [apps/web/tsconfig.json](file://apps/web/tsconfig.json)
- [apps/api/tsconfig.json](file://apps/api/tsconfig.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Setup with Docker Compose](#environment-setup-with-docker-compose)
5. [Initial Project Configuration](#initial-project-configuration)
6. [Development Workflow](#development-workflow)
7. [Running the Application Locally](#running-the-application-locally)
8. [Testing API Endpoints](#testing-api-endpoints)
9. [Troubleshooting](#troubleshooting)
10. [Verification Steps](#verification-steps)
11. [Conclusion](#conclusion)

## Introduction
This guide helps you set up and run the LOGISTIC project locally. It covers prerequisites, installation via pnpm workspaces, environment preparation with Docker Compose, development workflow, and how to test the API and frontend.

## Prerequisites
- Node.js: Version 20 or higher
- pnpm: Version 9 or higher
- Docker and Docker Compose (for local database and caching services)

These engine requirements are enforced at the project level and ensure compatibility across environments.

**Section sources**
- [package.json:14-17](file://package.json#L14-L17)

## Installation
Install dependencies using pnpm workspaces. The workspace configuration defines the packages to include and allows builds for specific tools.

Steps:
1. Install dependencies for all workspace packages:
   - Run: pnpm install
2. Verify workspace configuration:
   - Packages included: apps/* and packages/*
   - Build allowances for esbuild, sharp, and unrs-resolver are enabled

Notes:
- The root package.json defines scripts for building, linting, and type-checking across all packages.
- The workspace file ensures consistent dependency resolution across the web, API, and shared packages.

**Section sources**
- [package.json:6-12](file://package.json#L6-L12)
- [pnpm-workspace.yaml:1-8](file://pnpm-workspace.yaml#L1-L8)

## Environment Setup with Docker Compose
The project includes a Docker Compose setup for local PostgreSQL and Redis instances. These services are optional for basic development but recommended for full functionality.

Services:
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)

Volumes persist data across container restarts.

To start:
- docker-compose up -d

To stop:
- docker-compose down

Optional: Configure environment variables for the API service to connect to these local services if needed.

**Section sources**
- [docker-compose.yml:1-23](file://docker-compose.yml#L1-L23)

## Initial Project Configuration
TypeScript configuration is centralized and extended by app-specific configurations.

- Base configuration (shared across packages):
  - Targets ES2022, uses bundler module resolution, strict mode, declaration generation, and source maps
- Web app configuration:
  - Next.js-specific options, path aliases (@/*), isolated modules, JSX transform
- API app configuration:
  - Extends base configuration, compiles to dist with outDir and rootDir

Environment configuration:
- Web app Next.js configuration supports runtime proxying to an external API via API_URL, enabling local development with a separate backend.
- Vercel deployment configuration delegates install/build commands to the workspace root.

**Section sources**
- [tsconfig.base.json:1-18](file://tsconfig.base.json#L1-L18)
- [apps/web/tsconfig.json:1-35](file://apps/web/tsconfig.json#L1-L35)
- [apps/api/tsconfig.json:1-9](file://apps/api/tsconfig.json#L1-L9)
- [apps/web/next.config.ts:1-23](file://apps/web/next.config.ts#L1-L23)
- [apps/web/vercel.json:1-5](file://apps/web/vercel.json#L1-L5)

## Development Workflow
The project uses pnpm workspaces to run multiple applications in parallel during development.

Available scripts:
- Start both apps in parallel:
  - pnpm dev
- Start web app only:
  - pnpm dev:web
- Start API app only:
  - pnpm dev:api
- Build all packages:
  - pnpm build
- Lint all packages:
  - pnpm lint
- Type-check all packages:
  - pnpm typecheck

Web app:
- Next.js dev server runs on the default port (see the web app’s package.json for the dev command).
- When API_URL is set, requests under /api/* are proxied to the external backend.

API app:
- Fastify server with CORS and rate limiting.
- Optional Redis integration with graceful fallback when unavailable.
- Exposes tracking endpoints and a health endpoint.

**Section sources**
- [package.json:6-12](file://package.json#L6-L12)
- [apps/web/package.json:5-11](file://apps/web/package.json#L5-L11)
- [apps/api/package.json:6-12](file://apps/api/package.json#L6-L12)
- [apps/web/next.config.ts:3-20](file://apps/web/next.config.ts#L3-L20)

## Running the Application Locally
Follow these steps to run the full stack locally:

1. Start local databases (PostgreSQL and Redis) using Docker Compose:
   - docker-compose up -d

2. Install dependencies:
   - pnpm install

3. Start both applications in parallel:
   - pnpm dev

4. Access the frontend:
   - Open http://localhost:3000 in your browser

5. Verify the API:
   - The API server listens on port 3001 by default.
   - Health endpoint: http://localhost:3001/api/v1/health

Notes:
- If you want to run the web app against a separate backend, set API_URL to the backend address. The web app will proxy /api/* accordingly.
- The API server registers CORS for all origins and applies rate limiting.

**Section sources**
- [docker-compose.yml:1-23](file://docker-compose.yml#L1-L23)
- [package.json:6-12](file://package.json#L6-L12)
- [apps/web/next.config.ts:3-20](file://apps/web/next.config.ts#L3-L20)
- [apps/api/src/server.ts:10-54](file://apps/api/src/server.ts#L10-L54)

## Testing API Endpoints
The API exposes several endpoints for shipment tracking and health checks.

Endpoints:
- GET /api/v1/health
  - Purpose: Health check for the API service and Redis connectivity status
  - Example: curl http://localhost:3001/api/v1/health

- GET /api/v1/track/:trackingNumber
  - Purpose: Retrieve tracking information for a single tracking number
  - Validation: Requires a non-empty tracking number with a minimum length
  - Example: curl "http://localhost:3001/api/v1/track/AB123456789"

- POST /api/v1/track/batch
  - Purpose: Batch tracking for up to 50 tracking numbers
  - Request body: { "trackingNumbers": ["AB123", "CD456"] }
  - Example: curl -X POST "http://localhost:3001/api/v1/track/batch" -H "Content-Type: application/json" -d '{"trackingNumbers":["AB123","CD456"]}'

Client-side helpers:
- The web app includes client functions to call these endpoints and handle errors gracefully.

**Section sources**
- [apps/api/src/routes/track.ts:67-73](file://apps/api/src/routes/track.ts#L67-L73)
- [apps/api/src/routes/track.ts:8-35](file://apps/api/src/routes/track.ts#L8-L35)
- [apps/api/src/routes/track.ts:37-64](file://apps/api/src/routes/track.ts#L37-L64)
- [apps/web/src/lib/api.ts:5-27](file://apps/web/src/lib/api.ts#L5-L27)
- [apps/web/src/lib/api.ts:29-55](file://apps/web/src/lib/api.ts#L29-L55)

## Troubleshooting
Common setup issues and resolutions:

- Node.js or pnpm version mismatch
  - Symptom: Engine check fails during install
  - Resolution: Upgrade Node.js to v20+ and pnpm to v9+

- Port conflicts
  - Web app default port: 3000
  - API app default port: 3001
  - PostgreSQL: 5432
  - Redis: 6379
  - Resolution: Stop conflicting services or adjust ports in environment variables

- CORS or proxy issues
  - If using a separate backend, ensure API_URL points to the correct backend address so the web app proxies /api/* correctly

- Redis connectivity
  - The API server attempts to connect to Redis if REDIS_URL is set; otherwise it runs without cache
  - Resolution: Start Redis via Docker Compose or configure REDIS_URL appropriately

- Docker permissions
  - Symptom: Cannot start containers
  - Resolution: Ensure Docker daemon is running and you have permission to manage containers

**Section sources**
- [package.json:14-17](file://package.json#L14-L17)
- [apps/web/next.config.ts:3-20](file://apps/web/next.config.ts#L3-L20)
- [apps/api/src/server.ts:25-46](file://apps/api/src/server.ts#L25-L46)
- [docker-compose.yml:1-23](file://docker-compose.yml#L1-L23)

## Verification Steps
After completing setup, verify the installation:

1. Confirm dependencies installed:
   - pnpm install completes without errors

2. Start both apps in parallel:
   - pnpm dev
   - Observe both web and API servers start successfully

3. Test the frontend:
   - Visit http://localhost:3000
   - Ensure pages load without errors

4. Test the API health endpoint:
   - curl http://localhost:3001/api/v1/health
   - Expect a response indicating service status and Redis availability

5. Test a tracking endpoint:
   - curl "http://localhost:3001/api/v1/track/AB123456789"
   - Expect validation errors for invalid inputs or successful responses for valid ones

6. Optional: Run type checking and linting:
   - pnpm typecheck
   - pnpm lint

**Section sources**
- [package.json:6-12](file://package.json#L6-L12)
- [apps/web/src/app/api/v1/health/route.ts:1-9](file://apps/web/src/app/api/v1/health/route.ts#L1-L9)
- [apps/api/src/routes/track.ts:67-73](file://apps/api/src/routes/track.ts#L67-L73)

## Conclusion
You now have the LOGISTIC project running locally with both the web and API applications, supported by optional PostgreSQL and Redis services. Use the provided scripts to develop efficiently, and refer to the troubleshooting and verification sections if you encounter issues.