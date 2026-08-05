# SentinelTwin AI
## Coding Standards
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the mandatory coding standards for SentinelTwin AI.

Every source file must comply with these standards to ensure consistency, maintainability, security, and long-term scalability.

These standards apply to:

- Backend
- Frontend
- Endpoint Agent
- AI Engine
- Tests
- Utility Scripts

---

# Engineering Philosophy

Every line of code should be:

- Readable
- Maintainable
- Testable
- Secure
- Predictable
- Reusable

Code is written for future developers first and computers second.

---

# General Rules

Always:

- Write self-explanatory code.
- Keep functions focused on one responsibility.
- Avoid duplication.
- Prefer composition over inheritance.
- Prefer explicit behavior over hidden behavior.

Never:

- Hardcode secrets.
- Write dead code.
- Leave commented-out code.
- Ignore warnings.
- Bypass architecture.

---

# Naming Conventions

## Variables

Use descriptive names.

Good

device_status

risk_score

heartbeat_interval

Bad

x

temp

obj

data1

---

## Functions

Use verbs.

Good

calculateRisk()

authenticateUser()

collectTelemetry()

Bad

risk()

user()

telemetry()

---

## Classes

Use nouns.

Examples:

DeviceService

AlertRepository

RiskScorer

TelemetryCollector

---

## Constants

UPPER_SNAKE_CASE

Example:

MAX_RETRY_COUNT

JWT_EXPIRATION_MINUTES

---

## Files

Python

snake_case.py

Example

device_service.py

TypeScript

PascalCase.tsx

Example

DeviceCard.tsx

---

# Function Design

Functions should:

- Perform one task.
- Return predictable values.
- Validate inputs.
- Avoid hidden side effects.

Preferred length:

Less than 40 lines whenever practical.

---

# Class Design

Classes should:

Represent one concept.

Avoid excessive responsibilities.

Follow SOLID principles.

Prefer dependency injection.

---

# SOLID Principles

The project follows:

S

Single Responsibility Principle

O

Open/Closed Principle

L

Liskov Substitution Principle

I

Interface Segregation Principle

D

Dependency Inversion Principle

---

# Backend Standards

Controllers:

Receive request.

Validate.

Call service.

Return response.

Nothing else.

---

Services:

Contain business rules.

Coordinate repositories.

Never access HTTP objects directly.

---

Repositories:

Only communicate with PostgreSQL.

No business logic.

---

Schemas:

Validate request/response models.

Never include database queries.

---

# Frontend Standards

Components should:

Be reusable.

Remain presentation-focused.

Avoid business logic.

Receive data through props or hooks.

---

Hooks

Encapsulate reusable logic.

Examples:

useAuth()

useDevices()

useWebSocket()

---

Pages

Coordinate features.

Avoid complex logic.

---

# Endpoint Agent Standards

The Endpoint Agent should:

Be lightweight.

Use asynchronous tasks.

Recover from network failures.

Store temporary offline data.

Retry failed transmissions safely.

---

# AI Standards

Models should:

Remain deterministic.

Be explainable.

Store predictions.

Separate training from inference.

Training code must never execute during production requests.

---

# Database Standards

Never execute raw SQL unless justified.

Use repositories.

Use transactions where required.

Respect foreign keys.

Never modify historical telemetry.

---

# Error Handling

Every error should:

Be logged.

Be handled gracefully.

Return meaningful responses.

Never expose stack traces.

---

# Logging

Log:

Authentication

Telemetry

Threat detection

Configuration changes

Unexpected failures

Never log:

Passwords

JWT tokens

Secrets

Private keys

---

# API Standards

Every endpoint should:

Validate input.

Authenticate requests.

Return consistent responses.

Use proper HTTP status codes.

Support versioning.

---

# Response Format

Successful responses:

{
    "success": true,
    "message": "...",
    "data": { }
}

Errors:

{
    "success": false,
    "message": "...",
    "errors": [ ]
}

---

# Async Standards

Prefer async when:

Network requests

Database operations

File operations

Long-running tasks

Avoid unnecessary async usage.

---

# Configuration

Configuration belongs only in:

.env

Never hardcode:

Database URLs

Secrets

API keys

JWT keys

---

# Security Standards

Always:

Validate input.

Escape output where necessary.

Hash passwords.

Verify authorization.

Log security events.

---

# Performance Guidelines

Avoid:

N+1 database queries

Duplicate calculations

Large payloads

Repeated API requests

Optimize before adding complexity.

---

# Comments

Comments explain:

Why

not

What

Good

// Cache results to reduce repeated AI inference.

Bad

// Increment i

---

# Documentation

Every major module should include:

Purpose

Responsibilities

Dependencies

Limitations

---

# Code Formatting

Python

PEP 8

Black

isort

Frontend

Prettier

ESLint

TypeScript strict mode

---

# Testing Expectations

Business logic:

Unit tested

Critical APIs:

Integration tested

Authentication:

Security tested

AI:

Prediction validation tested

---

# Code Review Questions

Before merging:

Is the code readable?

Is duplication avoided?

Does it follow architecture?

Are security concerns addressed?

Is documentation updated?

Would another developer understand it?

---

# Technical Debt

Temporary solutions must:

Be documented.

Include a reason.

Include a planned removal strategy.

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 05_DEVELOPMENT_RULES.md