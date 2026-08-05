# SentinelTwin AI
## Folder Structure
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official directory structure for SentinelTwin AI.

Every source file, configuration file, test, script, and document must follow this structure.

No new top-level folders may be introduced without updating this document.

---

# Repository Structure

SentinelTwin-AI/

├── backend/
├── frontend/
├── endpoint-agent/
├── docs/
├── tests/
├── datasets/
├── scripts/
├── docker/
├── deployment/
├── .github/
├── .gitignore
├── README.md
├── LICENSE
└── docker-compose.yml

---

# Backend Structure

backend/

├── app/
│
├── api/
├── core/
├── models/
├── schemas/
├── repositories/
├── services/
├── ai/
├── twin/
├── telemetry/
├── websocket/
├── middleware/
├── dependencies/
├── utils/
├── db/
├── tests/
│
├── alembic/
│
├── main.py
├── requirements.txt
└── pyproject.toml

---

# Backend Directory Responsibilities

## api/

Contains:

- API routes
- Controllers
- Versioned endpoints

Business logic is prohibited.

---

## core/

Contains:

- Configuration
- Environment settings
- Security utilities
- Constants

---

## models/

Contains:

SQLAlchemy models.

One model per file.

Example:

organization.py

user.py

device.py

telemetry.py

---

## schemas/

Contains:

Pydantic request and response models.

Examples:

CreateUserRequest

LoginResponse

TelemetryPayload

---

## repositories/

Contains:

Database access layer.

Responsible for:

- CRUD
- Queries
- Transactions

Repositories never contain business logic.

---

## services/

Contains:

Business logic.

Examples:

AuthService

DeviceService

TwinService

AlertService

ReportService

AIService

---

## ai/

Contains:

Machine learning modules.

Recommended structure:

ai/

feature_engineering/

models/

training/

prediction/

risk_scoring/

utils/

---

## twin/

Contains:

Digital Twin engine.

Responsibilities:

- Twin synchronization
- Health calculations
- Twin lifecycle

---

## telemetry/

Contains:

Telemetry processing.

Responsibilities:

- Validation
- Parsing
- Metric normalization

---

## websocket/

Contains:

Real-time communication.

Responsibilities:

- Connection management
- Broadcasting
- Notifications

---

## middleware/

Contains:

Authentication

Logging

Rate limiting

Request tracking

---

## dependencies/

Contains:

FastAPI dependency injection.

Examples:

Current user

Database session

Permissions

---

## utils/

Contains:

Shared helper utilities.

Avoid placing business logic here.

---

## db/

Contains:

Database initialization

Session management

Base model

---

# Frontend Structure

frontend/

src/

assets/

components/

features/

hooks/

layouts/

lib/

pages/

routes/

services/

store/

types/

utils/

styles/

App.tsx

main.tsx

---

# Frontend Responsibilities

## components/

Reusable UI components.

Buttons

Cards

Dialogs

Tables

Charts

---

## features/

Feature-specific components.

Example:

features/

auth/

dashboard/

devices/

alerts/

reports/

organizations/

Each feature owns its UI.

---

## pages/

Route-level pages.

Example:

Login

Dashboard

Devices

Reports

Settings

---

## services/

API communication.

Authentication

Devices

Telemetry

Reports

---

## hooks/

Reusable React hooks.

Example:

useAuth

useWebSocket

useDevices

---

## store/

Global state.

Authentication

Theme

Notifications

---

## types/

Shared TypeScript types.

---

# Endpoint Agent

endpoint-agent/

src/

collectors/

communication/

configuration/

heartbeat/

monitoring/

security/

storage/

utils/

main.py

requirements.txt

---

# Endpoint Agent Responsibilities

collectors/

Collect telemetry.

communication/

HTTPS client.

heartbeat/

Heartbeat scheduler.

storage/

Offline cache.

security/

Authentication.

---

# Documentation

docs/

00_PROJECT_CONSTITUTION.md

00_AI_ENGINEERING_RULES.md

01_PROJECT_OVERVIEW.md

02_TECH_STACK.md

03_SYSTEM_ARCHITECTURE.md

04_FOLDER_STRUCTURE.md

05_DEVELOPMENT_RULES.md

06_CODING_STANDARDS.md

architecture/

backend/

frontend/

database/

ai/

api/

security/

deployment/

---

# Tests

tests/

backend/

frontend/

endpoint-agent/

integration/

performance/

security/

datasets/

---

# Docker

docker/

backend/

frontend/

postgres/

redis/

nginx/

---

# Deployment

deployment/

development/

staging/

production/

---

# GitHub

.github/

workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE.md

---

# Scripts

scripts/

setup/

database/

training/

utilities/

---

# Dataset Storage

datasets/

raw/

processed/

models/

sample-data/

Datasets used for AI training should never be mixed with application source code.

---

# Naming Conventions

Folders

lowercase

hyphen-separated where necessary.

Python files

snake_case.py

TypeScript

PascalCase.tsx

React Components

PascalCase

Hooks

useSomething.ts

Environment Files

.env

.env.example

---

# Import Rules

Always use absolute imports where practical.

Avoid deeply nested relative imports.

---

# File Size Guidelines

Python modules

Prefer under 400 lines.

React components

Prefer under 250 lines.

Services

Keep focused on one responsibility.

---

# Related Documents

00_PROJECT_CONSTITUTION.md

03_SYSTEM_ARCHITECTURE.md

05_DEVELOPMENT_RULES.md