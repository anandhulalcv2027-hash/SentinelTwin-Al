# SentinelTwin AI
## Backend Engineering Guidelines
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official backend engineering standards for SentinelTwin AI.

It establishes rules for:

- Backend architecture
- Code organization
- API development
- Database interaction
- Service design
- Security implementation
- Error handling
- Testing

Every backend developer and AI assistant MUST follow this document.

---

# Backend Philosophy

The SentinelTwin AI backend is designed as a production-grade modular system.

The backend must prioritize:

1. Security
2. Maintainability
3. Scalability
4. Reliability
5. Performance
6. Developer Experience

---

# Backend Technology Stack

The backend uses:

Programming Language:

```
Python 3.13+
```

Framework:

```
FastAPI
```

ORM:

```
SQLAlchemy 2.x
```

Migration:

```
Alembic
```

Database:

```
PostgreSQL
```

Cache:

```
Redis
```

Validation:

```
Pydantic v2
```

Authentication:

```
JWT
```

Password Security:

```
Passlib
```

Logging:

```
Loguru
```

Testing:

```
Pytest
```

---

# Backend Architecture

The backend follows Clean Architecture principles.

High-level flow:

```
API Layer

↓

Service Layer

↓

Repository Layer

↓

Database Layer

```

---

# Layer Responsibilities

## API Layer

Responsible for:

- Receiving HTTP requests
- Validating input
- Authentication checks
- Calling services
- Returning responses


The API layer must NOT contain:

- Business logic
- Database queries
- Complex calculations

---

## Service Layer

Responsible for:

- Business rules
- Data processing
- Workflow execution
- Communication between modules


Example:

Device registration workflow:

```
Receive device

↓

Validate device

↓

Create asset

↓

Create digital twin

↓

Generate credentials

↓

Return result

```

---

## Repository Layer

Responsible for:

- Database access
- Queries
- CRUD operations


Repositories must hide database implementation details.

Example:

Allowed:

```python
device_repository.get_by_id(id)
```

Not allowed:

```python
session.query(Device).filter(...)
```

inside services.

---

## Database Layer

Responsible for:

- Models
- Relationships
- Transactions
- Database configuration

---

# Backend Folder Structure

The backend follows:

```
backend/

├── app/

│   ├── main.py

│   ├── core/

│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logging.py
│   │
│   ├── api/

│   │   ├── routes/

│   │   └── dependencies.py
│   │
│   ├── models/

│   ├── schemas/

│   ├── repositories/

│   ├── services/

│   ├── middleware/

│   ├── exceptions/

│   ├── websocket/

│   └── utils/


├── migrations/

├── tests/

├── requirements.txt

└── Dockerfile

```

---

# Module Design

Each major feature is a separate module.

Examples:

```
authentication

users

organizations

assets

digital_twins

telemetry

alerts

ai

reports

audit

```

---

# Dependency Rules

Dependencies flow only downward.

Correct:

```
API

↓

Service

↓

Repository

↓

Database

```

Incorrect:

```
Repository

↓

Service

```

or:

```
Database

↓

API

```

---

# FastAPI Rules

Every endpoint must:

- Use Pydantic schemas
- Validate input
- Use dependency injection
- Return consistent responses
- Handle errors properly


Example:

```
POST /api/v1/assets

Request

↓

Validation

↓

Service

↓

Repository

↓

Response

```

---

# API Versioning

All APIs must use version prefixes.

Required format:

```
/api/v1/

```

Example:

```
/api/v1/auth/login

/api/v1/assets

/api/v1/alerts

```

Future versions:

```
/api/v2/

```

---

# Request Validation

All external input must be validated.

Validation includes:

- Type checking
- Length validation
- Format validation
- Permission validation


Never trust client input.

---

# Response Standards

All APIs should return consistent responses.

Success:

```json
{
    "success": true,
    "data": {},
    "message": "Operation completed"
}
```

---

Error:

```json
{
    "success": false,
    "error": {
        "code": "RESOURCE_NOT_FOUND",
        "message": "Asset does not exist"
    }
}
```

---

# HTTP Status Rules

Use correct HTTP status codes.

Examples:

```
200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

```

---

# Async Programming Rules

Use async operations where appropriate.

Examples:

Good:

- Database operations
- External API calls
- Agent communication
- WebSocket handling


Avoid:

- Blocking operations inside async functions

---

# Database Access Rules

Never access database directly from:

- Controllers
- Routes
- Background tasks

Database access must go through repositories.

---

# Transaction Rules

Transactions are required for operations involving multiple changes.

Example:

Device registration:

```
Create Device

+

Create Digital Twin

+

Create Credentials

```

Must succeed or fail together.

---

# Background Tasks

Long-running operations should not block API requests.

Examples:

- Report generation
- AI processing
- Large exports


Use:

- Background workers
- Async queues
- Redis-based processing

---

# WebSocket Rules

WebSockets are used for:

- Live dashboard updates
- Threat notifications
- Asset state changes


WebSockets must not:

- Replace REST APIs
- Directly access databases

Flow:

```
Database Event

↓

Backend Processing

↓

Redis Pub/Sub

↓

WebSocket

↓

Dashboard

```

---

# Logging Standards

Every important action must be logged.

Examples:

- User login
- Asset registration
- Permission changes
- Threat detection
- Configuration changes


Logs must include:

```
Timestamp

User

Organization

Action

Result

```

---

# Error Handling Rules

Never expose:

- Stack traces
- Database errors
- Internal paths


Example:

Wrong:

```
SQLAlchemy exception at line 42
```

Correct:

```
Database operation failed
```

---

# Exception Architecture

Use centralized exception handling.

Structure:

```
exceptions/

├── auth.py

├── database.py

├── validation.py

└── security.py

```

---

# Configuration Management

Configuration must use environment variables.

Example:

```
DATABASE_URL

JWT_SECRET

REDIS_URL

```

Never:

```python
PASSWORD="12345"
```

inside source code.

---

# Security Middleware

Backend must include:

- Authentication middleware
- Rate limiting
- CORS configuration
- Request logging
- Security headers

---

# Authentication Rules

Protected routes require:

```
JWT Authentication

```

Public routes must be explicitly documented.

---

# Testing Standards

Every module requires tests.

Test categories:

```
Unit Tests

Integration Tests

API Tests

Security Tests

```

---

# Code Review Checklist

Before merging:

```
[ ] Architecture followed

[ ] Documentation updated

[ ] Tests added

[ ] Security reviewed

[ ] No duplicated logic

[ ] Error handling implemented

[ ] Logging added

[ ] Database changes documented

```

---

# AI Code Generation Rules

Before generating backend code, AI must read:

```
00_PROJECT_CONSTITUTION.md

00_AI_ENGINEERING_RULES.md

BACKEND_GUIDELINES.md

DATABASE_SCHEMA.md

API_SPECIFICATION.md

```

AI must never:

- Create routes without documentation
- Put SQL inside controllers
- Skip validation
- Hardcode secrets
- Modify architecture silently

---

# Performance Guidelines

Backend should consider:

- Query optimization
- Database indexing
- Async execution
- Caching
- Pagination


Large responses must support pagination.

---

# Scalability Principles

Backend modules should be independently scalable.

Future possibility:

```
Authentication Service

AI Service

Telemetry Service

Notification Service

```

The current implementation may remain modular monolith.

---

# Final Backend Principle

The SentinelTwin AI backend must be:

```
Secure

+

Modular

+

Testable

+

Maintainable

+

Scalable

```

Every backend decision should support the long-term evolution of the platform.

---

# Related Documents

- API_SPECIFICATION.md
- AUTHENTICATION.md
- RBAC.md
- ENDPOINT_AGENT_PROTOCOL.md
- DATABASE_SCHEMA.md
