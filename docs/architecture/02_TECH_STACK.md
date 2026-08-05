# SentinelTwin AI
## Technology Stack Specification
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official technology stack used by SentinelTwin AI.

It establishes:

- Approved technologies
- Technology responsibilities
- Version expectations
- Development tools
- Infrastructure choices
- Technology selection rules

Any technology change requires:

1. Technical justification
2. Architecture review
3. Documentation update
4. Constitution update if required

---

# Technology Philosophy

SentinelTwin AI follows these principles:

## Stability Over Trends

The project prioritizes:

- Reliability
- Community support
- Security
- Long-term maintainability

New technologies must provide measurable improvement.

---

## Avoid Unnecessary Complexity

A technology must solve a real problem.

The project must not introduce:

- Frameworks without purpose
- Duplicate libraries
- Over-engineered solutions

---

## Enterprise-Oriented Choices

Technology decisions should support:

- Scalability
- Security
- Maintainability
- Developer productivity

---

# System Technology Overview

```
Frontend

React + TypeScript


Backend

FastAPI + Python


Database

PostgreSQL


Cache

Redis


AI

Scikit-Learn


Agent

Python


Deployment

Docker

```

---

# Frontend Technology Stack

## Core Framework

```
React 19
```

Purpose:

React provides the user interface architecture.

Used for:

- SOC Dashboard
- Asset Management
- Digital Twin Interface
- Reports
- Administration Panels

---

## Language

```
TypeScript
```

Purpose:

Provides:

- Type safety
- Better maintainability
- Reduced runtime errors

Rules:

Strict mode must be enabled.

---

## Build Tool

```
Vite
```

Purpose:

Provides:

- Fast development server
- Modern bundling
- Optimized builds

---

# UI Framework

## Tailwind CSS

Purpose:

Used for:

- Styling
- Responsive layouts
- Design consistency

---

## shadcn/ui

Purpose:

Provides reusable UI components.

Used for:

- Forms
- Tables
- Dialogs
- Navigation
- Cards

---

# Frontend Routing

Technology:

```
React Router
```

Responsibilities:

- Page navigation
- Route protection
- Application structure

---

# Frontend Data Management

Technology:

```
TanStack Query
```

Purpose:

Handles:

- API requests
- Server state
- Caching
- Synchronization

---

# Form Management

Technology:

```
React Hook Form

+

Zod

```

Purpose:

Provides:

- Form handling
- Validation
- Type-safe schemas

---

# Data Visualization

## Recharts

Used for:

- Metrics
- Graphs
- Analytics

Examples:

- CPU usage
- Risk trends
- Threat statistics

---

## React Flow

Used for:

- Network diagrams
- Asset relationships
- Security topology

---

# 3D Visualization

## Three.js

Purpose:

Advanced visualization.

Used only for:

- Digital Twin visualization
- Asset environments
- Threat animations

---

Supporting libraries:

```
@react-three/fiber

@react-three/drei

```

---

Three.js must NOT be used for:

- Forms
- Tables
- Settings
- Standard dashboards

---

# Animation

Technology:

```
Framer Motion
```

Purpose:

Used for:

- UI transitions
- Dashboard animations
- Interactive feedback

---

# Icon System

Technology:

```
Lucide React
```

Purpose:

Provides consistent icons.

---

# Backend Technology Stack

---

# Programming Language

```
Python 3.13
```

Purpose:

Used for:

- Backend APIs
- AI systems
- Endpoint Agent

---

# API Framework

```
FastAPI
```

Purpose:

Provides:

- REST APIs
- Async support
- Validation
- Documentation generation

---

FastAPI responsibilities:

- Routing
- Request validation
- Authentication integration
- API responses

---

# Data Validation

Technology:

```
Pydantic v2
```

Used for:

- Request models
- Response models
- Configuration validation

---

# ORM

Technology:

```
SQLAlchemy 2
```

Purpose:

Database interaction.

Rules:

Database access must use:

```
Repository Pattern

```

---

# Database Migration

Technology:

```
Alembic
```

Purpose:

Manages:

- Schema changes
- Database versions
- Migration history

---

# Database Technology

## PostgreSQL

Purpose:

Primary database.

Stores:

- Organizations
- Users
- Assets
- Digital Twins
- Telemetry
- Alerts
- Reports
- Audit Logs

---

Why PostgreSQL:

- Strong relational model
- Excellent indexing
- Transaction support
- JSON support
- Enterprise adoption

---

# Cache and Real-Time Support

Technology:

```
Redis
```

Used for:

- Cache
- WebSocket state
- Temporary data
- Queue support

---

Redis must NOT become the primary database.

---

# Authentication Technologies

## JWT

Used for:

- User authentication
- API authorization

---

## Passlib

Used for:

- Password hashing

Algorithm:

```
bcrypt

```

---

# Logging

Technology:

```
Loguru
```

Purpose:

Provides:

- Structured logging
- Error tracking
- Debugging

---

# Real-Time Communication

Technology:

```
WebSockets

```

Used for:

- Live dashboard updates
- Alert notifications
- Digital Twin synchronization

---

# HTTP Communication

Technology:

```
httpx
```

Used for:

- Agent communication
- Internal HTTP requests

---

# AI Technology Stack

---

# Machine Learning Framework

```
Scikit-Learn
```

Purpose:

Provides:

- Classification models
- Anomaly detection
- Risk prediction

---

# AI Models

Version 1:

## Random Forest

Purpose:

Threat classification.

Examples:

```
Normal Activity

Suspicious Activity

Malicious Activity

```

---

## Isolation Forest

Purpose:

Anomaly detection.

Used for:

Finding:

- Unusual CPU spikes
- Abnormal network behavior
- Suspicious activity patterns

---

# Data Processing

Libraries:

```
Pandas

NumPy

```

Used for:

- Data preparation
- Feature engineering
- Analysis

---

# Model Storage

Technology:

```
Joblib
```

Used for:

- Saving models
- Loading trained models

---

# Endpoint Agent Stack

Language:

```
Python

```

---

Libraries:

## psutil

Purpose:

Collect:

- CPU
- Memory
- Disk
- Processes

---

## asyncio

Purpose:

Async operations.

Used for:

- Heartbeat
- Telemetry collection
- Communication

---

## httpx

Purpose:

Secure backend communication.

---

## cryptography

Purpose:

Security functions.

Used for:

- Encryption
- Secure credentials

---

# Development Tools

---

# Version Control

```
Git

+

GitHub

```

---

# Containerization

```
Docker

Docker Compose

```

Used for:

- Development environments
- Deployment consistency

---

# Testing

Backend:

```
pytest

```

Frontend:

```
Vitest

React Testing Library

```

---

# Code Quality

Recommended:

Backend:

```
Ruff

Black

MyPy

```

Frontend:

```
ESLint

Prettier

```

---

# Environment Management

Configuration:

```
.env files

```

Rules:

Never store:

- Passwords
- API keys
- Secrets

inside source code.

---

# CI/CD

Technology:

```
GitHub Actions

```

Used for:

- Automated testing
- Build verification
- Quality checks

---

# Technology Version Policy

Major version upgrades require review.

Example:

Allowed:

```
FastAPI 0.x → 0.x update

```

Requires review:

```
React 19 → React 20

Python 3 → Python 4

```

---

# Forbidden Technology Decisions

The following are not allowed without architecture approval:

- Replacing PostgreSQL with MongoDB
- Replacing FastAPI without review
- Adding unnecessary frameworks
- Introducing duplicate UI libraries
- Moving AI into frontend
- Direct database access from agents

---

# AI Assistant Rules

Before changing technologies, AI must read:

```
00_PROJECT_CONSTITUTION.md

01_SYSTEM_ARCHITECTURE.md

02_TECH_STACK.md

```

AI must never:

- Add dependencies casually
- Replace frameworks
- Create duplicate solutions

---

# Final Technology Principle

The SentinelTwin AI technology stack is designed around:

```
Modern Development

+

Enterprise Reliability

+

Security

+

Future Expansion

```

Technology exists to support the product, not define it.

---

# Related Documents

- 01_SYSTEM_ARCHITECTURE.md
- 03_FOLDER_STRUCTURE.md
- 06_CODING_STANDARDS.md
- DEVELOPMENT_RULES.md
