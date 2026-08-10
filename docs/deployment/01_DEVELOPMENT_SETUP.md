# SentinelTwin AI
## Development Environment Setup
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official development environment for SentinelTwin AI.

It specifies the required software, installation procedures, project configuration, development workflow, and environment standards that every developer must follow.

No development should begin without first completing the setup described in this document.

---

# Objectives

The development environment shall provide:

- Consistent setup across all developers
- Reproducible builds
- Secure local development
- Easy onboarding
- Fast development workflow
- Production-like behavior
- Version consistency

---

# Supported Operating Systems

SentinelTwin AI officially supports the following development environments.

## Windows

- Windows 11 (Recommended)
- Windows 10 (Supported)

---

## Linux

Recommended distributions:

- Ubuntu 24.04 LTS
- Debian 12
- Fedora 40+

---

## macOS

Supported:

- macOS Sonoma
- macOS Sequoia

---

# Minimum Hardware Requirements

| Component | Minimum | Recommended |
|-----------|----------|-------------|
| CPU | 4 Cores | 8+ Cores |
| RAM | 8 GB | 16 GB |
| Storage | 20 GB Free | SSD |
| Network | Broadband | Stable High-Speed |

---

# Required Software

The following software must be installed before development.

## Version Control

- Git

Recommended Version:

```
2.45+
```

---

## Backend

Python

```
3.13
```

Package Manager

```
pip
```

Virtual Environment

```
venv
```

---

## Frontend

Node.js

```
22 LTS
```

Package Manager

```
npm
```

Alternative:

```
pnpm
```

---

## Database

PostgreSQL

```
17
```

---

## Cache

Redis

```
7+
```

---

## IDE

Recommended:

Visual Studio Code

Recommended Extensions:

- Python
- Pylance
- Ruff
- ESLint
- Prettier
- Docker
- GitLens
- PostgreSQL
- Tailwind CSS IntelliSense
- Error Lens
- Markdown All in One

---

# Official Project Structure

```
SentinelTwin-AI/

├── backend/
├── frontend/
├── endpoint-agent/
├── docs/
├── tests/
├── datasets/
├── docker/
├── scripts/
├── .github/
├── .gitignore
├── README.md
└── LICENSE
```

This directory structure shall remain consistent.

---

# Repository Initialization

Clone the repository.

```
git clone <repository-url>

cd SentinelTwin-AI
```

Verify branch.

```
git branch
```

Default branch:

```
develop
```

Development shall not occur directly on the `main` branch.

---

# Python Environment

Navigate to backend.

```
cd backend
```

Create virtual environment.

```
python -m venv .venv
```

Activate.

Windows

```
.venv\Scripts\activate
```

Linux/macOS

```
source .venv/bin/activate
```

Verify.

```
python --version
```

Expected:

```
Python 3.13.x
```

---

# Backend Dependencies

Install project dependencies.

```
pip install -r requirements.txt
```

Freeze versions.

```
pip freeze > requirements-lock.txt
```

---

# Frontend Environment

Navigate to frontend.

```
cd frontend
```

Install dependencies.

```
npm install
```

Verify.

```
npm run dev
```

Development server:

```
http://localhost:5173
```

---

# PostgreSQL Setup

Create database.

Example:

```
sentineltwin
```

Create development user.

Grant required permissions.

Verify connection before backend startup.

---

# Redis Setup

Start Redis service.

Verify.

```
redis-cli ping
```

Expected response.

```
PONG
```

Redis shall be available before backend startup.

---

# Environment Variables

Every module shall use a `.env` file.

No secrets shall be hardcoded.

Example:

Backend

```
backend/.env
```

Frontend

```
frontend/.env
```

Endpoint Agent

```
endpoint-agent/.env
```

---

# Backend Environment Variables

Example variables.

```
APP_NAME=

APP_ENV=

SECRET_KEY=

JWT_SECRET=

ACCESS_TOKEN_EXPIRE_MINUTES=

REFRESH_TOKEN_EXPIRE_DAYS=

DATABASE_URL=

REDIS_URL=

LOG_LEVEL=

API_HOST=

API_PORT=
```

---

# Frontend Environment Variables

```
VITE_API_URL=

VITE_WS_URL=
```

---

# Endpoint Agent Variables

```
API_URL=

AGENT_TOKEN=

HEARTBEAT_INTERVAL=

TELEMETRY_INTERVAL=
```

---

# Starting Development Services

Recommended startup order.

1.

PostgreSQL

↓

2.

Redis

↓

3.

Backend

↓

4.

Frontend

↓

5.

Endpoint Agent

---

# Backend Startup

```
cd backend

uvicorn app.main:app --reload
```

Default.

```
http://localhost:8000
```

---

# Frontend Startup

```
cd frontend

npm run dev
```

---

# Endpoint Agent Startup

```
cd endpoint-agent

python main.py
```

---

# Running All Services

Verify.

- Database Running

- Redis Running

- Backend Running

- Frontend Running

- Endpoint Agent Connected

---

# Code Formatting

Backend

Use:

- Ruff
- Black

Frontend

Use:

- ESLint
- Prettier

Formatting shall occur before every commit.

---

# Static Analysis

Python

```
ruff check
```

Type Checking

```
mypy
```

Frontend

```
npm run lint
```

No linting errors shall exist before merging.

---

# Testing

Backend

```
pytest
```

Frontend

```
npm test
```

Endpoint Agent

Unit tests shall validate:

- Telemetry collection
- Authentication
- Retry logic
- Configuration loading

---

# Git Workflow

Main branches.

```
main
```

```
develop
```

Feature branches.

```
feature/auth

feature/dashboard

feature/telemetry

feature/agent

feature/ai
```

Bug fixes.

```
fix/*
```

Hotfixes.

```
hotfix/*
```

Direct commits to `main` are prohibited.

---

# Commit Message Convention

Examples.

```
feat(auth): implement JWT authentication

fix(agent): resolve heartbeat timeout

docs(database): update schema

refactor(api): simplify telemetry service

test(ai): add anomaly detection tests
```

---

# Documentation Workflow

Before implementing any feature.

Verify documentation exists.

If missing.

Create documentation first.

Implementation follows documentation.

Documentation is the project's source of truth.

---

# Logging

Development logging shall include.

- Timestamp
- Log Level
- Module
- Message

Sensitive information shall never be logged.

---

# Security During Development

Developers shall never:

- Commit secrets
- Commit API keys
- Commit passwords
- Commit database credentials
- Disable authentication
- Disable RBAC

Development shortcuts must never reach production.

---

# Development Checklist

Before beginning development verify:

- Git configured
- Python installed
- Node.js installed
- PostgreSQL running
- Redis running
- Virtual environment active
- Environment variables configured
- Dependencies installed

---

# Pre-Commit Checklist

Before every commit verify:

- Project builds successfully
- Tests pass
- Linting passes
- Formatting applied
- Documentation updated
- No secrets committed
- No temporary code remains

---

# Troubleshooting

## Backend fails to start

Verify:

- Python version
- Virtual environment
- Environment variables
- Database connectivity

---

## Frontend fails

Verify:

- Node.js version
- Dependencies installed
- API URL configured

---

## PostgreSQL connection fails

Verify:

- Database service
- Credentials
- Port
- DATABASE_URL

---

## Redis unavailable

Verify:

- Redis service
- REDIS_URL
- Firewall rules

---

## Endpoint Agent offline

Verify:

- API URL
- Agent Token
- Internet connectivity
- Backend availability

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 02_DOCKER.md
- 03_PRODUCTION.md
- DEVELOPMENT_RULES.md
- CODING_STANDARDS.md

---

# Final Principle

Every SentinelTwin AI development environment shall be reproducible, secure, version-controlled, and consistent.

No implementation shall rely on undocumented setup procedures or machine-specific configurations. Every developer must be able to clone the repository, complete the setup defined in this document, and begin development with identical behavior across supported platforms.