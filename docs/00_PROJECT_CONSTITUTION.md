# SentinelTwin AI
## Project Constitution
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document is the highest-level governing document for the SentinelTwin AI project.

Every architecture decision, implementation, code generation, feature request, database modification, API addition, frontend component, AI model, and documentation update MUST comply with this constitution.

If any future prompt, AI-generated code, or manual implementation conflicts with this document, this document takes precedence.

---

# Project Vision

SentinelTwin AI is an AI-powered Digital Twin Cyber Defense Platform designed to provide organizations with real-time endpoint monitoring, Digital Twin visualization, AI-assisted threat detection, and centralized Security Operations Center (SOC) management.

The platform shall provide:

- Secure asset management
- Live Digital Twins
- Endpoint monitoring
- Threat detection
- Risk scoring
- Security analytics
- Historical reporting
- Organization-based multi-tenancy

The system shall be scalable, modular, secure, and maintainable.

---

# Primary Goals

The project shall always prioritize the following goals.

1. Security
2. Reliability
3. Scalability
4. Maintainability
5. Performance
6. Extensibility
7. User Experience

Every engineering decision must improve one or more of these goals.

---

# Product Scope

Version 1 supports:

- Organizations
- Users
- Roles
- Employees
- Endpoints
- Servers
- Basic Firewall Monitoring
- Digital Twin
- AI Threat Detection
- SOC Dashboard
- Reports
- Audit Logs

Version 1 does NOT support:

- Router Management
- Switch Management
- Active Directory Integration
- Cloud Provider Integration
- Kubernetes
- Mobile Device Management
- IoT Device Management

These features may be introduced in future versions without redesigning the architecture.

---

# Core Principles

The following principles are mandatory.

## Documentation First

Every new feature must be documented before implementation.

No feature shall be implemented without corresponding documentation.

---

## Single Source of Truth

The documentation contained within the /docs directory is the official source of truth.

Code must follow documentation.

Documentation must never be generated from code.

---

## Security by Design

Security is implemented from the beginning.

Security shall never be added later as an afterthought.

---

## Modular Architecture

Every module shall remain independent.

Authentication must never depend on AI.

AI must never depend on Dashboard.

Dashboard must never contain business logic.

Endpoint Agent must never access database directly.

---

## Production Quality

Every implementation should follow production software engineering practices.

Temporary solutions are prohibited unless explicitly marked.

---

# Architecture Rules

The architecture is fixed.

The platform consists of:

Frontend

↓

Backend API

↓

Twin Engine

↓

AI Engine

↓

Database

↓

Endpoint Agents

No implementation shall bypass this architecture.

---

# Approved Technology Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod
- React Flow
- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion
- Recharts

Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Redis
- JWT
- Passlib
- Loguru

AI

- Scikit-learn
- Random Forest
- Isolation Forest
- Pandas
- NumPy
- Joblib

Endpoint Agent

- Python
- psutil
- asyncio
- httpx
- cryptography

No technology replacement is allowed without updating this constitution.

---

# Asset Model

Every monitored resource is treated as an Asset.

Supported asset types:

- Laptop
- Desktop
- Server
- Firewall

Future asset types:

- Router
- Switch
- Cloud VM
- IoT Device

Every asset owns exactly one Digital Twin.

---

# Digital Twin Principles

A Digital Twin is NOT a database record.

A Digital Twin is a continuously synchronized software representation of a physical asset.

The Twin consists of:

- Static Metadata
- Live State
- Historical Metrics
- Health Status
- Risk Score
- AI Predictions

Static metadata shall never be overwritten by telemetry.

Historical telemetry shall be append-only.

Live state shall always represent the latest known status.

---

# Security Principles

The platform shall implement:

- JWT Authentication
- Refresh Tokens
- RBAC
- Password Hashing
- Rate Limiting
- HTTPS
- Input Validation
- Audit Logging
- Secure Agent Authentication

Sensitive information must never be stored in plaintext.

---

# Database Principles

The official database is PostgreSQL.

The database shall follow normalization principles.

Foreign keys shall always be enforced.

Indexes shall exist for every frequently queried column.

Historical telemetry must never overwrite previous records.

Live device state must remain separate from historical telemetry.

---

# API Principles

The backend shall follow REST principles.

Every endpoint shall:

- validate input
- return structured responses
- return proper HTTP status codes
- require authentication unless explicitly public

Business logic shall never exist inside controllers.

---

# Frontend Principles

The frontend shall:

- use reusable components
- support responsive layouts
- support dark mode
- separate UI from business logic
- use TypeScript strict mode

---

# AI Principles

AI shall never directly modify the database.

The AI Engine shall:

receive telemetry

↓

generate predictions

↓

calculate risk score

↓

generate alerts

↓

store prediction

↓

notify dashboard

AI must remain explainable.

---

# Endpoint Agent Principles

The Endpoint Agent shall:

collect telemetry

authenticate securely

send encrypted requests

operate independently

support automatic reconnection

The Endpoint Agent must never expose administrator privileges.

---

# Development Workflow

Every feature follows:

Requirement

↓

Documentation

↓

Architecture Review

↓

Database

↓

API

↓

Backend

↓

Frontend

↓

Testing

↓

Documentation Update

No phase shall be skipped.

---

# Coding Standards

The project shall follow:

- SOLID Principles
- Clean Architecture
- Repository Pattern
- Service Layer
- Dependency Injection
- Type Safety
- Async Programming

---

# Version Control

Main branches:

main

develop

feature/*

fix/*

No direct commits to main.

---

# Documentation Rules

Every new feature requires:

Architecture Update

API Update

Database Update

Testing Update

Roadmap Update

No undocumented feature shall exist.

---

# Success Criteria

SentinelTwin AI Version 1 is complete when:

Authentication is functional.

Organizations are supported.

Assets are monitored.

Digital Twins update live.

AI generates predictions.

Threats generate alerts.

Dashboard updates in real time.

Reports can be generated.

Audit logs are maintained.

All documentation is synchronized.

---

# Final Principle

This constitution is the governing document of SentinelTwin AI.

Every AI assistant, developer, contributor, and future version of the project shall comply with this document.

If any implementation conflicts with this constitution, the constitution shall be considered correct until officially amended.