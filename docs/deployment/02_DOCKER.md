# SentinelTwin AI
## Docker & Containerization Standard
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official Docker architecture for SentinelTwin AI.

It standardizes containerization, service orchestration, networking, persistent storage, environment configuration, and local development deployment.

All Dockerfiles and Docker Compose configurations shall comply with this document.

---

# Objectives

The Docker environment shall provide:

- Consistent development environments
- Easy onboarding
- Service isolation
- Reproducible deployments
- Simplified dependency management
- Secure networking
- Persistent data storage
- Scalable architecture

---

# Container Architecture

SentinelTwin AI is composed of multiple independent containers.

```
                Docker Network

 ┌─────────────────────────────────────────┐
 │                                         │
 │  Frontend (React + Vite)                │
 │             │                           │
 │             ▼                           │
 │     Backend API (FastAPI)               │
 │        │            │                   │
 │        ▼            ▼                   │
 │ PostgreSQL      Redis Cache             │
 │                                         │
 └─────────────────────────────────────────┘

            ▲

Endpoint Agent
(runs on monitored machines)
```

The Endpoint Agent is **not** deployed inside Docker. It executes directly on monitored assets.

---

# Official Services

The Docker Compose environment shall include:

| Service | Purpose |
|----------|----------|
| frontend | React Application |
| backend | FastAPI Backend |
| postgres | PostgreSQL Database |
| redis | Redis Cache |

Future services:

- Prometheus
- Grafana
- Nginx
- MinIO
- Celery Worker

---

# Directory Structure

```
docker/

├── backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
├── postgres/
│
├── redis/
│
├── compose/
│   ├── docker-compose.dev.yml
│   └── docker-compose.prod.yml
│
└── README.md
```

---

# Docker Images

## Backend

Base Image

```
python:3.13-slim
```

Responsibilities

- FastAPI
- Business Logic
- AI Integration
- API
- Authentication

---

## Frontend

Base Image

```
node:22-alpine
```

Responsibilities

- React
- Vite
- Static Assets

Production build should use:

```
nginx:stable-alpine
```

---

## PostgreSQL

Official Image

```
postgres:17
```

Responsibilities

- Primary Database
- Persistent Storage

---

## Redis

Official Image

```
redis:7-alpine
```

Responsibilities

- Cache
- Session Storage
- Pub/Sub
- Future Queue

---

# Docker Networks

All containers communicate through an isolated bridge network.

Example

```
sentineltwin-network
```

Characteristics

- Internal communication only
- DNS-based service discovery
- Isolated from host network where possible

Containers communicate using service names.

Example

```
postgres

redis

backend

frontend
```

---

# Volumes

Persistent volumes shall be used.

## PostgreSQL

Stores

- Tables
- Indexes
- Schemas

Volume

```
postgres_data
```

---

## Redis

Stores

- Cache
- Persistence (optional)

Volume

```
redis_data
```

---

## Backend

Mount

```
backend/
```

Development only.

---

## Frontend

Mount

```
frontend/
```

Development only.

---

# Environment Variables

Containers shall never hardcode configuration.

Configuration shall originate from:

```
.env
```

Each service shall load its own environment variables.

---

# Backend Variables

```
DATABASE_URL

REDIS_URL

SECRET_KEY

JWT_SECRET

LOG_LEVEL

APP_ENV
```

---

# Frontend Variables

```
VITE_API_URL

VITE_WS_URL
```

---

# PostgreSQL Variables

```
POSTGRES_DB

POSTGRES_USER

POSTGRES_PASSWORD
```

---

# Redis Variables

Normally none required.

Future

```
REDIS_PASSWORD
```

---

# Container Startup Order

Recommended order

```
PostgreSQL

↓

Redis

↓

Backend

↓

Frontend
```

Backend shall wait until PostgreSQL becomes available.

Frontend shall wait until Backend is available.

---

# Health Checks

Every service shall expose a health check.

## Backend

```
GET /health
```

Returns

```
200 OK
```

---

## PostgreSQL

Health Check

```
pg_isready
```

---

## Redis

Health Check

```
redis-cli ping
```

Expected

```
PONG
```

---

## Frontend

Health Check

```
HTTP 200
```

---

# Logging

Containers shall log to stdout/stderr.

Benefits

- Docker integration
- Easy aggregation
- Compatible with logging systems

Logs shall include

- Timestamp
- Service
- Log Level
- Message

Sensitive information shall never be logged.

---

# Resource Limits

Development

No strict limits required.

Production recommendations

Backend

- CPU: 2
- Memory: 2 GB

Frontend

- CPU: 1
- Memory: 512 MB

PostgreSQL

- CPU: 2
- Memory: 2 GB

Redis

- CPU: 1
- Memory: 512 MB

---

# Development Mode

Development containers shall support:

- Hot Reload
- Volume Mounts
- Debug Logging
- Interactive Shell

No production optimizations required.

---

# Production Mode

Production containers shall:

- Disable debug mode
- Use optimized builds
- Run as non-root users
- Minimize image size
- Enable health checks
- Enable restart policies

---

# Restart Policies

Recommended

Backend

```
unless-stopped
```

PostgreSQL

```
unless-stopped
```

Redis

```
unless-stopped
```

Frontend

```
unless-stopped
```

---

# Networking Rules

Containers communicate only through Docker networking.

Services shall never use

```
localhost
```

inside containers.

Instead use

```
postgres

redis

backend
```

---

# Security Principles

Containers shall:

- Run with minimum privileges
- Avoid privileged mode
- Use read-only filesystems where possible
- Avoid root users
- Keep images updated
- Remove unnecessary packages

---

# Build Strategy

Development

```
docker compose -f docker-compose.dev.yml up
```

Production

```
docker compose -f docker-compose.prod.yml up -d
```

---

# Image Versioning

Images shall follow semantic versioning.

Example

```
sentineltwin/backend:1.0.0

sentineltwin/frontend:1.0.0
```

Future releases

```
1.1.0

1.2.0

2.0.0
```

---

# Backup Strategy

Persistent data shall be backed up regularly.

Critical volumes

- PostgreSQL
- Redis (if persistence enabled)

Application containers shall remain stateless.

---

# Monitoring

Future monitoring stack

```
Prometheus

↓

Grafana

↓

Alertmanager
```

Metrics shall include

- CPU
- Memory
- Container Health
- Network Usage
- Request Rate

---

# Scaling

The architecture supports horizontal scaling.

Future

```
Multiple Backend Containers

↓

Load Balancer

↓

Shared PostgreSQL

↓

Shared Redis
```

Frontend instances may scale independently.

---

# Future Kubernetes Migration

The Docker architecture is designed for future migration.

Potential resources

- Deployment
- StatefulSet
- Service
- ConfigMap
- Secret
- Ingress
- PersistentVolumeClaim

No redesign shall be required.

---

# Related Documents

- 01_DEVELOPMENT_SETUP.md
- 03_PRODUCTION.md
- SYSTEM_ARCHITECTURE.md
- DATABASE_SCHEMA.md
- API_SPECIFICATION.md

---

# Final Principle

Docker is the official containerization platform for SentinelTwin AI.

Every service shall be independently containerized, securely configured, reproducible, and capable of running consistently across development, testing, and production environments without requiring changes to application code.