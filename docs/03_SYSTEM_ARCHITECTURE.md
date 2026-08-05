# SentinelTwin AI
## System Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official architecture of SentinelTwin AI.

It describes the system structure, component responsibilities, communication flow, architectural constraints, and module interactions.

Every implementation must follow this architecture.

---

# Architectural Philosophy

SentinelTwin AI follows a Modular Monolith architecture.

The system is deployed as one backend application while maintaining clear internal module boundaries.

Benefits include:

- Easier development
- Easier debugging
- Faster deployment
- Lower operational complexity
- Clear separation of concerns
- Future migration to microservices if required

---

# High-Level Architecture

                        Users
                          │
                          ▼
              React + TypeScript Frontend
                          │
                  HTTPS / WebSockets
                          │
                          ▼
                  FastAPI Backend API
                          │
 ┌────────────────────────┼────────────────────────┐
 │                        │                        │
 ▼                        ▼                        ▼
Authentication      Digital Twin Engine      AI Engine
 │                        │                        │
 └──────────────┬─────────┴──────────────┬─────────┘
                ▼                        ▼
         Business Services      Telemetry Processing
                │                        │
                └──────────────┬─────────┘
                               ▼
                         PostgreSQL
                               ▲
                               │
                      Endpoint Agent

---

# Architectural Layers

SentinelTwin AI consists of seven logical layers.

1. Presentation Layer
2. API Layer
3. Service Layer
4. Domain Layer
5. AI Layer
6. Data Access Layer
7. Infrastructure Layer

Each layer has a single responsibility.

---

# Layer 1 – Presentation

Responsibilities:

- User interface
- Dashboard
- Forms
- Reports
- Device visualization
- Three.js Digital Twin

Technology:

- React
- TypeScript
- Tailwind CSS

The frontend never communicates directly with the database.

---

# Layer 2 – API

Responsibilities:

- REST endpoints
- Authentication
- Validation
- Response formatting

Technology:

- FastAPI

Controllers remain thin.

Business logic is prohibited inside controllers.

---

# Layer 3 – Service Layer

Responsibilities:

- Business rules
- Validation
- Workflow coordination
- Transactions

Examples:

AuthenticationService

DeviceService

TelemetryService

TwinService

AlertService

ReportService

AIService

---

# Layer 4 – Domain Layer

Contains:

- Business models
- Domain rules
- Enumerations
- Shared logic

This layer remains independent of infrastructure.

---

# Layer 5 – AI Layer

Responsibilities:

- Feature engineering
- Risk scoring
- Threat detection
- Model inference
- Prediction persistence

The AI Layer never modifies production data directly.

It produces predictions only.

---

# Layer 6 – Data Access Layer

Responsibilities:

- SQLAlchemy models
- Repository classes
- Database transactions

Repositories isolate database logic from business logic.

---

# Layer 7 – Infrastructure Layer

Responsibilities:

- PostgreSQL
- Redis
- Logging
- Configuration
- File storage
- Background jobs

Infrastructure remains replaceable without changing business rules.

---

# Core Modules

Version 1 contains the following modules.

Authentication

Organization Management

RBAC

Employee Management

Device Management

Endpoint Communication

Telemetry Processing

Digital Twin

AI Engine

Alert Management

Reporting

Audit Logging

Dashboard

---

# Module Dependencies

Authentication

↓

Organization

↓

Users

↓

Devices

↓

Telemetry

↓

Digital Twin

↓

AI

↓

Alerts

↓

Dashboard

Dependencies flow downward only.

Circular dependencies are prohibited.

---

# Authentication Flow

User

↓

Login Request

↓

Authentication Service

↓

JWT Generation

↓

Access Token

↓

Authenticated Requests

↓

Protected APIs

Refresh Tokens are used for session renewal.

---

# Device Registration Flow

Endpoint Agent

↓

Authentication

↓

Registration Request

↓

Device Service

↓

Database

↓

Digital Twin Creation

↓

Registration Complete

Each registered device automatically receives one Digital Twin.

---

# Telemetry Pipeline

Endpoint Agent

↓

Collect Metrics

↓

HTTPS POST

↓

Telemetry API

↓

Validation

↓

Telemetry Service

↓

Historical Storage

↓

Digital Twin Update

↓

AI Analysis

↓

Risk Score

↓

Alerts

↓

Dashboard Update

---

# Digital Twin Lifecycle

Device Registered

↓

Twin Created

↓

Telemetry Received

↓

Twin Updated

↓

Health Recalculated

↓

Risk Updated

↓

Visualization Updated

↓

History Stored

Every device has exactly one Digital Twin.

---

# AI Processing Flow

Telemetry

↓

Feature Engineering

↓

Isolation Forest

↓

Random Forest

↓

Risk Score

↓

Threat Classification

↓

Prediction Storage

↓

Alert Generation

↓

Dashboard Notification

The AI Engine remains deterministic for identical inputs.

---

# Alert Workflow

Threat Detected

↓

Alert Created

↓

Stored in Database

↓

WebSocket Notification

↓

Dashboard

↓

User Acknowledgement

↓

Audit Log

Alerts are never deleted.

They may only change status.

---

# Real-Time Communication

WebSockets are used for:

- Live telemetry updates
- Dashboard refresh
- Alert notifications
- Device status changes

Standard CRUD operations use REST APIs.

---

# Database Interaction

Business Services

↓

Repositories

↓

SQLAlchemy

↓

PostgreSQL

Direct SQL inside services or controllers is prohibited.

---

# Endpoint Agent Architecture

The Endpoint Agent contains:

System Information Collector

Telemetry Collector

Heartbeat Manager

Network Monitor

Communication Client

Offline Cache

Retry Manager

Configuration Manager

The Endpoint Agent never communicates with PostgreSQL directly.

---

# Digital Twin Architecture

Each Digital Twin contains:

Static Metadata

Current Live State

Historical Metrics

Health Score

Risk Score

Threat History

Synchronization Timestamp

The Twin is a software representation of the physical device.

---

# Dashboard Architecture

Dashboard Components include:

Overview

Organization Summary

Device Inventory

Digital Twin View

Network View

Threat Center

Reports

Audit Logs

Settings

Each component communicates only through the API.

---

# Security Architecture

Authentication

↓

Authorization

↓

Validation

↓

Business Logic

↓

Repositories

↓

Database

Security is enforced at every layer.

---

# Error Handling

Errors flow through a centralized exception handler.

Responsibilities:

- Logging
- Standard API response
- Safe error messages

Internal exceptions must never be exposed.

---

# Logging Strategy

The system logs:

Authentication events

Device registration

Telemetry failures

AI predictions

Threat detection

Configuration changes

Audit events

Sensitive information must never appear in logs.

---

# Scalability Strategy

Version 1 uses:

Single FastAPI instance

Single PostgreSQL database

Single AI Engine

Future versions may introduce:

Load balancing

Microservices

Distributed AI

Message queues

Container orchestration

These enhancements should not require architectural redesign.

---

# Architectural Constraints

The following rules are mandatory:

Controllers remain lightweight.

Business logic belongs to services.

Repositories handle persistence.

AI remains isolated.

Endpoint Agents never access the database.

Frontend never bypasses the API.

Documentation is the architectural source of truth.

---

# Related Documents

00_PROJECT_CONSTITUTION.md

00_AI_ENGINEERING_RULES.md

01_PROJECT_OVERVIEW.md

02_TECH_STACK.md

04_FOLDER_STRUCTURE.md