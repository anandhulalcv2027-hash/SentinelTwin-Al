# SentinelTwin AI
## Data Flow Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the complete data flow architecture of SentinelTwin AI.

It describes how information travels through the platform, beginning from monitored assets and ending with dashboard visualization, AI analysis, reporting, and long-term storage.

This document serves as the official reference for:

- Backend Developers
- Frontend Developers
- AI Engineers
- Endpoint Agent Development
- Database Design
- API Development

All future implementations shall comply with this document.

---

# Objectives

The SentinelTwin AI data flow shall satisfy the following objectives:

- Real-time telemetry collection
- Secure data transmission
- Continuous Digital Twin synchronization
- AI-assisted threat detection
- Reliable historical storage
- Efficient dashboard updates
- Horizontal scalability
- Fault tolerance

---

# High-Level Data Flow

```

┌──────────────────────┐
│ Physical Asset │
└──────────┬───────────┘
│
▼
┌──────────────────────┐
│ Endpoint Agent │
└──────────┬───────────┘
│ HTTPS
▼
┌──────────────────────┐
│ FastAPI Backend │
└──────────┬───────────┘
│
├──────────────┐
▼ ▼
Validation Telemetry Processing
│ │
└──────┬───────┘
▼
Twin Engine
│
├─────────────┐
▼ ▼
AI Engine Database
│ │
▼ ▼
Alert Engine Historical Storage
│ │
└──────┬────────┘
▼
WebSocket Gateway
│
▼
SOC Dashboard

```

---

# Data Sources

SentinelTwin AI collects information from multiple sources.

## Endpoint Agent

Primary telemetry producer.

Collects:

- CPU Usage
- Memory Usage
- Disk Usage
- Running Processes
- Network Interfaces
- Logged-in User
- Operating System
- Installed Software
- Hostname
- System Uptime

Transmission Interval:

Default: 10 Seconds

---

## Heartbeat

Heartbeat packets verify that an asset remains online.

Contains:

- Asset Identifier
- Timestamp
- Organization ID
- Agent Version
- Health Status

Default Interval:

30 Seconds

---

## Security Events

The Endpoint Agent reports security-related events.

Examples:

- Unauthorized Login
- Suspicious Process
- Service Failure
- Firewall Disabled
- High CPU Utilization
- Malware Detection (Future)

---

# API Entry Point

All incoming requests enter through the FastAPI Gateway.

Responsibilities:

- Authentication
- Authorization
- Validation
- Routing
- Logging
- Rate Limiting

No request may bypass the API layer.

---

# Authentication Flow

Incoming Request

↓

JWT Validation

↓

Organization Validation

↓

Agent Validation

↓

Permission Verification

↓

Request Accepted

If validation fails:

- Return appropriate HTTP status
- Log the attempt
- Reject processing

---

# Request Validation

Every request shall be validated before processing.

Validation includes:

- JSON Schema
- Required Fields
- Data Types
- Organization Ownership
- Timestamp Validation
- Payload Size

Invalid data shall never reach business services.

---

# Telemetry Processing Flow

Validated telemetry enters the Telemetry Service.

Responsibilities:

1. Normalize Data
2. Validate Metrics
3. Remove Invalid Values
4. Timestamp Records
5. Attach Asset Metadata
6. Forward to Twin Engine

---

# Data Normalization

Different operating systems expose metrics differently.

The Telemetry Service converts platform-specific information into a common internal format.

Example:

Windows

```
CPU Load
```

Linux

```
CPU Percentage
```

Internal Format

```
cpu_usage
```

This ensures consistency throughout the platform.

---

# Twin Engine Flow

After normalization, telemetry is forwarded to the Digital Twin Engine.

Responsibilities:

- Update Live State
- Preserve Historical Data
- Refresh Health Status
- Trigger Synchronization Events

The Twin Engine never modifies historical telemetry.

---

# Digital Twin Synchronization

Incoming Telemetry

↓

Locate Twin

↓

Update Live State

↓

Calculate Health

↓

Refresh Status

↓

Publish Update

Dashboard subscribers receive updates immediately.

---

# AI Processing Flow

The AI Engine receives processed telemetry.

Workflow:

Telemetry

↓

Feature Extraction

↓

Feature Engineering

↓

Risk Scoring

↓

Threat Classification

↓

Prediction Storage

↓

Alert Generation

The AI Engine never modifies telemetry.

---

# Risk Assessment Flow

Telemetry

↓

Random Forest

↓

Isolation Forest

↓

Combined Risk Score

↓

Threat Level

↓

Alert Decision

Risk Levels:

- Low
- Medium
- High
- Critical

---

# Alert Generation

Alerts are generated when predefined conditions are satisfied.

Examples:

- High CPU Usage
- Multiple Failed Logins
- Suspicious Process
- Firewall Disabled
- Memory Exhaustion

Alert Lifecycle:

Created

↓

Stored

↓

Published

↓

Displayed

↓

Acknowledged

↓

Resolved

---

# Database Flow

Two types of information are stored.

## Live State

Represents the current asset status.

Characteristics:

- Frequently updated
- One record per asset
- Optimized for dashboard queries

---

## Historical Telemetry

Historical metrics are append-only.

Characteristics:

- Never overwritten
- Time-series data
- Used for reporting
- Used for AI training

---

# Dashboard Update Flow

Once processing completes:

Twin Updated

↓

Event Published

↓

WebSocket Broadcast

↓

Frontend Receives Event

↓

UI Refresh

No polling is required.

---

# Reporting Flow

Historical Data

↓

Aggregation

↓

Statistics

↓

Charts

↓

Export

Supported Formats:

- PDF
- CSV

Future:

- Excel
- Scheduled Reports

---

# Audit Logging

Every important operation shall create an audit record.

Examples:

- User Login
- Asset Registration
- Configuration Change
- Alert Acknowledgement
- Role Assignment

Audit records are immutable.

---

# Error Handling Flow

Errors are categorized into:

## Validation Errors

Returned immediately.

No processing occurs.

---

## Processing Errors

Logged.

Request safely terminated.

---

## Database Errors

Transaction rollback.

Error logged.

Administrator notified.

---

## Agent Communication Errors

Retry Policy:

Attempt 1

↓

Attempt 2

↓

Attempt 3

↓

Offline Queue

↓

Reconnect

No telemetry should be lost during temporary outages.

---

# Performance Strategy

SentinelTwin AI uses asynchronous processing.

Advantages:

- Better scalability
- Lower latency
- Higher throughput

Processing is divided into:

- Request Handling
- Database Operations
- AI Processing
- WebSocket Notifications

Each stage remains independent.

---

# Security Considerations

Every stage enforces security.

Measures include:

- JWT Authentication
- TLS Encryption
- Input Validation
- RBAC
- Audit Logging
- Secure Agent Authentication

Sensitive information shall never traverse the pipeline unencrypted.

---

# Scalability

The architecture supports future expansion.

Future telemetry sources:

- Routers
- Switches
- Cloud Instances
- Containers
- Kubernetes
- Mobile Devices
- IoT Devices

No redesign should be required.

---

# Data Flow Principles

SentinelTwin AI follows these principles:

1. Validate before processing.
2. Never overwrite historical telemetry.
3. Keep live state separate from historical records.
4. AI consumes telemetry but never modifies it.
5. Dashboard receives events rather than polling.
6. Every critical action is audited.
7. All communication is authenticated.
8. Every processing stage is modular.

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 01_SYSTEM_ARCHITECTURE.md
- 02_TECH_STACK.md
- DATABASE_SCHEMA.md
- API_SPECIFICATION.md
- DIGITAL_TWIN_ENGINE.md
- TELEMETRY_PIPELINE.md

---

# Final Principle

The SentinelTwin AI Data Flow Architecture shall remain deterministic, secure, modular, and scalable.

Every telemetry event shall follow the defined processing pipeline to ensure consistent behavior, reliable Digital Twin synchronization, explainable AI analysis, and real-time dashboard visualization.