# SentinelTwin AI
## System Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official high-level architecture of SentinelTwin AI.

It describes:

- System components
- Module boundaries
- Communication patterns
- Data flow
- Security boundaries
- Technology responsibilities

Every implementation MUST follow this architecture.

Any architectural modification requires approval and documentation updates.

---

# Architecture Vision

SentinelTwin AI is designed as a modular AI-powered cybersecurity platform.

The architecture follows:

- Layered Architecture
- Service-Oriented Design
- Event-Driven Processing
- Zero Trust Security
- Separation of Responsibilities

The goal is to create a scalable platform capable of monitoring organizational assets through Digital Twins and AI-driven security analysis.

---

# Core Architecture Model

The SentinelTwin AI platform consists of:

```
                    SentinelTwin AI


                 Frontend Application
                         |
                         |
                 Backend API Gateway
                         |
        -------------------------------------
        |                 |                 |
 Authentication     Twin Engine        AI Engine
        |                 |                 |
        -------------------------------------
                         |
              Telemetry Processing Layer
                         |
        -------------------------------------
        |                 |                 |
 Endpoint Agents    Connectors       Data Services
                         |
                    PostgreSQL
                         |
                      Redis

```

---

# Architectural Layers

The system is divided into six major layers.

```
1. Presentation Layer

2. API Layer

3. Business Logic Layer

4. Intelligence Layer

5. Data Layer

6. Collection Layer

```

---

# Layer 1: Presentation Layer

Technology:

```
React + TypeScript

```

Responsibility:

The presentation layer provides:

- SOC Dashboard
- Asset visualization
- Digital Twin interface
- Reports
- User management
- Security analytics

---

The frontend MUST NOT:

- Contain business logic
- Directly access database
- Execute AI models
- Handle security decisions

---

Frontend communication:

```
React

↓

REST API

↓

WebSocket Events

↓

Backend

```

---

# Layer 2: API Layer

Technology:

```
FastAPI

```

The API layer acts as the gateway between frontend, agents, and internal services.

Responsibilities:

- Request validation
- Authentication
- Authorization
- API routing
- Response formatting

---

The API layer contains:

```
Authentication Routes

User Routes

Asset Routes

Telemetry Routes

Alert Routes

Report Routes

Agent Routes

```

---

The API layer MUST NOT:

- Perform complex business logic
- Execute AI models
- Directly manipulate database queries

---

# Layer 3: Business Logic Layer

This layer contains the core platform functionality.

Components:

```
Authentication Service

Organization Service

Asset Service

Digital Twin Service

Alert Service

Report Service

```

---

Responsibilities:

- Business rules
- Data processing
- Workflow execution
- Validation

---

Example:

Asset registration:

```
API Request

↓

Asset Controller

↓

Asset Service

↓

Repository

↓

Database

```

---

# Layer 4: Intelligence Layer

This contains AI and security intelligence.

Components:

```
AI Engine

Risk Scoring Engine

Threat Detection Engine

Prediction Service

```

---

Responsibilities:

- Analyze telemetry
- Detect anomalies
- Calculate risk
- Generate predictions

---

AI Flow:

```
Telemetry

↓

Feature Engineering

↓

ML Model

↓

Prediction

↓

Risk Score

↓

Alert Generation

```

---

AI MUST NOT:

- Modify assets directly
- Execute commands
- Bypass security controls

---

# Layer 5: Data Layer

Technology:

```
PostgreSQL

Redis

```

---

PostgreSQL stores:

- Users
- Organizations
- Assets
- Digital Twin metadata
- Historical telemetry
- Alerts
- Audit logs

---

Redis stores:

- Cache
- Temporary state
- Real-time communication data
- WebSocket events

---

# Layer 6: Collection Layer

The collection layer consists of:

```
Endpoint Agents

Firewall Connectors

Future Cloud Connectors

```

---

Responsibilities:

- Collect telemetry
- Report health
- Send security events

---

Collection components MUST:

- Authenticate
- Encrypt communication
- Validate data

---

# Major System Components

---

# 1. Frontend Application

Purpose:

Provide human interaction.

Main modules:

```
Authentication UI

SOC Dashboard

Asset Management

Digital Twin Viewer

Alert Center

Reports

Administration

```

---

# 2. Backend API Gateway

Purpose:

Central communication layer.

Handles:

```
HTTP Requests

WebSocket Connections

Authentication

Authorization

```

---

# 3. Authentication Service

Responsible for:

- User login
- Token generation
- Session management
- Identity verification

---

Authentication is independent from:

- AI
- Digital Twin
- Dashboard

---

# 4. Asset Management Service

Responsible for:

Managing:

```
Assets

Asset Types

Asset Metadata

Asset Ownership

```

---

Supported assets:

```
Laptop

Desktop

Server

Firewall

```

---

# 5. Digital Twin Engine

The Digital Twin Engine maintains virtual representations of assets.

Each asset has:

```
Static Metadata

+

Live State

+

Historical Metrics

+

Health Status

+

Risk Information

```

---

Example:

Physical Server:

```
CPU: 75%

RAM: 60%

Status: Healthy

```

Digital Twin:

```
Server Twin

CPU: 75%

RAM: 60%

Health: Normal

Risk: Low

```

---

# 6. Telemetry Processing Engine

Responsible for:

- Receiving telemetry
- Validating information
- Processing metrics
- Updating Digital Twins

Flow:

```
Agent

↓

Telemetry API

↓

Validation

↓

Processing

↓

Storage

↓

Twin Update

```

---

# 7. AI Engine

Responsible for:

- Threat detection
- Anomaly detection
- Risk scoring

Models:

```
Random Forest

Isolation Forest

```

---

# 8. Alert Engine

Responsible for:

Creating security alerts.

Flow:

```
AI Prediction

↓

Risk Evaluation

↓

Alert Creation

↓

SOC Notification

```

---

# 9. Reporting Engine

Responsible for:

Generating:

- Security reports
- Asset reports
- Risk reports
- Historical analytics

---

# Communication Architecture

SentinelTwin AI uses multiple communication methods.

---

# Frontend Communication

Uses:

```
HTTPS REST API

+

WebSockets

```

REST:

Used for:

- CRUD operations
- Authentication
- Reports

WebSockets:

Used for:

- Live telemetry
- Alert updates
- Dashboard changes

---

# Agent Communication

Uses:

```
HTTPS

REST API

```

Flow:

```
Agent

↓

FastAPI

↓

Telemetry Processor

```

---

# Internal Communication

Version 1 uses:

```
Service Layer Communication

```

Future versions may introduce:

```
Message Queue

Kafka

RabbitMQ

```

---

# Real-Time Architecture

Live updates:

```
Endpoint Agent

↓

Telemetry API

↓

Redis

↓

WebSocket Manager

↓

Dashboard

```

---

# Security Architecture

Security boundaries:

```
External User

↓

Authentication

↓

Authorization

↓

Application

↓

Database

```

---

# Security Principles

The architecture follows:

## Zero Trust

No component is trusted automatically.

---

## Least Privilege

Every component receives only required permissions.

---

## Defense In Depth

Multiple security layers protect the system.

---

# Data Ownership Rules

Organization owns:

```
Users

Assets

Telemetry

Alerts

Reports

```

---

# Module Dependency Rules

Allowed:

```
Frontend

↓

API

↓

Services

↓

Repositories

↓

Database

```

---

AI:

```
Telemetry

↓

AI Engine

```

---

Forbidden:

```
Frontend

↓

Database

```

---

Forbidden:

```
AI Engine

↓

User Management

```

---

Forbidden:

```
Endpoint Agent

↓

Database

```

---

# Scalability Strategy

The architecture supports future expansion.

Possible additions:

```
Cloud Connectors

Container Monitoring

SIEM Integration

Threat Intelligence Feeds

Automated Response

```

without redesigning the core system.

---

# Reliability Principles

The system should support:

- Fault isolation
- Error recovery
- Logging
- Monitoring
- Data consistency

---

# AI Engineering Rules

Before modifying architecture, AI must read:

```
00_PROJECT_CONSTITUTION.md

00_AI_ENGINEERING_RULES.md

01_SYSTEM_ARCHITECTURE.md

```

AI must never:

- Introduce random services
- Break module boundaries
- Create duplicate components
- Connect forbidden layers

---

# Final Architecture Principle

SentinelTwin AI follows:

```
Clear Boundaries

+

Secure Communication

+

Independent Modules

+

Explainable Intelligence

+

Future Scalability

```

The architecture exists to keep the platform maintainable as it grows.

---

# Related Documents

- 02_TECH_STACK.md
- 03_FOLDER_STRUCTURE.md
- 04_DATA_FLOW.md
- 05_DIGITAL_TWIN_ENGINE.md
- 06_TELEMETRY_PIPELINE.md
