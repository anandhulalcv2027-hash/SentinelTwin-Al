# SentinelTwin AI
## Telemetry Pipeline Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

The Telemetry Pipeline is responsible for collecting, validating, processing, storing, and distributing operational data from monitored assets.

It serves as the central nervous system of SentinelTwin AI by ensuring that telemetry flows securely and efficiently from Endpoint Agents to the Digital Twin Engine, AI Engine, database, and SOC Dashboard.

Every telemetry event shall pass through this pipeline.

---

# Objectives

The Telemetry Pipeline shall provide:

- Reliable telemetry collection
- Secure transmission
- Data normalization
- Data validation
- Real-time Digital Twin synchronization
- AI-ready feature generation
- Historical storage
- Dashboard updates
- Fault tolerance
- Horizontal scalability

---

# Pipeline Overview

```
Physical Asset
      │
      ▼
Endpoint Agent
      │
 HTTPS + JWT
      │
      ▼
FastAPI Gateway
      │
      ▼
Telemetry Validation
      │
      ▼
Telemetry Normalization
      │
      ▼
Telemetry Processor
      │
 ┌────┴─────────────┐
 ▼                  ▼
Twin Engine     Historical Storage
 │                  │
 ▼                  ▼
AI Engine      Metrics Database
 │
 ▼
Alert Engine
 │
 ▼
WebSocket Gateway
 │
 ▼
SOC Dashboard
```

---

# Telemetry Sources

Telemetry originates from monitored assets through the Endpoint Agent.

Supported telemetry includes:

## System Information

- Hostname
- Device Name
- Asset Type
- Operating System
- OS Version
- Architecture
- Kernel Version

---

## CPU Metrics

- CPU Usage
- Core Count
- Clock Speed
- Temperature (where supported)
- Load Average

---

## Memory Metrics

- Total RAM
- Used RAM
- Available RAM
- Swap Usage

---

## Disk Metrics

- Disk Capacity
- Used Space
- Free Space
- Read Operations
- Write Operations

---

## Network Metrics

- IP Address
- MAC Address
- Interface Status
- Upload Speed
- Download Speed
- Packet Count

---

## Process Metrics

- Running Processes
- Process Count
- High CPU Processes
- High Memory Processes

---

## User Activity

- Logged-in User
- Login Time
- Active Sessions

---

## Security Metrics

- Firewall Status
- Antivirus Status
- Failed Login Attempts
- Suspicious Processes
- Disabled Services

Future versions may include:

- USB Activity
- Registry Monitoring
- File Integrity Monitoring
- DNS Events

---

# Collection Strategy

The Endpoint Agent collects telemetry periodically.

Default intervals:

| Metric | Interval |
|---------|----------|
| Heartbeat | 30 Seconds |
| System Metrics | 10 Seconds |
| Process List | 30 Seconds |
| Security Events | Immediate |
| Alerts | Immediate |

Collection intervals shall remain configurable.

---

# Endpoint Collection Flow

```
Collect Metrics
      │
      ▼
Validate Locally
      │
      ▼
Create JSON Payload
      │
      ▼
Encrypt Request
      │
      ▼
Transmit
```

The Endpoint Agent shall never transmit malformed telemetry.

---

# Payload Structure

Each telemetry payload shall contain:

```json
{
  "organization_id": "",
  "asset_id": "",
  "timestamp": "",
  "agent_version": "",
  "metrics": {
      ...
  }
}
```

Every payload shall include:

- Organization ID
- Asset ID
- Timestamp
- Agent Version
- Metric Data

---

# Transmission Protocol

Communication uses:

- HTTPS
- JSON
- JWT Authentication
- TLS Encryption

Future support:

- Message Queue
- gRPC

---

# Gateway Validation

Upon receipt, FastAPI validates:

- Authentication
- JWT Signature
- Organization Ownership
- Asset Registration
- Payload Size
- JSON Schema
- Timestamp

Invalid requests are rejected immediately.

---

# Normalization

Different operating systems report metrics differently.

The pipeline converts all telemetry into a common internal representation.

Example:

Windows

```
Memory Available
```

Linux

```
Free Memory
```

Internal Format

```
available_memory
```

This abstraction simplifies backend processing.

---

# Telemetry Processing

The Telemetry Processor performs:

1. Timestamp validation
2. Unit conversion
3. Missing value handling
4. Metric aggregation
5. Event generation
6. Digital Twin update

Processing shall be deterministic.

---

# Live State Update

Processed telemetry updates the Live State.

Updated fields include:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Status
- User Activity
- Online Status

Only the latest values are stored.

---

# Historical Storage

Historical telemetry is stored separately.

Characteristics:

- Append-only
- Immutable
- Timestamped
- Query optimized

Historical data shall never overwrite previous records.

---

# Feature Engineering

The AI Engine receives processed telemetry.

Generated features include:

- CPU Trend
- Memory Trend
- Disk Growth
- Network Baseline
- Process Frequency
- Login Frequency

These features improve model accuracy.

---

# AI Processing

Workflow:

```
Telemetry
      │
      ▼
Feature Engineering
      │
      ▼
Random Forest
      │
      ▼
Isolation Forest
      │
      ▼
Risk Score
      │
      ▼
Threat Classification
```

AI predictions are stored independently.

---

# Alert Generation

Alerts may originate from:

- Rule-based Detection
- AI Prediction
- Missing Heartbeats
- Security Events

Alert Severity:

- Informational
- Low
- Medium
- High
- Critical

Every alert shall include:

- Timestamp
- Asset
- Organization
- Severity
- Description
- Recommended Action

---

# Dashboard Distribution

Once processing completes:

```
Telemetry Updated
      │
      ▼
Event Published
      │
      ▼
WebSocket Broadcast
      │
      ▼
Dashboard Refresh
```

No polling is required.

---

# Retry Strategy

If transmission fails:

```
Attempt 1
      │
      ▼
Attempt 2
      │
      ▼
Attempt 3
      │
      ▼
Store Locally
      │
      ▼
Retry After Reconnection
```

No telemetry should be discarded unless retention limits are exceeded.

---

# Offline Behavior

If an asset loses connectivity:

- Continue local collection
- Cache telemetry
- Retry automatically
- Synchronize when connection returns

This ensures eventual consistency.

---

# Data Retention

Telemetry shall be retained according to configurable policies.

Example defaults:

| Data Type | Retention |
|------------|-----------|
| Live State | Current Only |
| Telemetry | 180 Days |
| Alerts | 365 Days |
| Audit Logs | 1 Year |

Retention periods may vary by organization.

---

# Performance Considerations

The pipeline shall:

- Support asynchronous processing
- Minimize database writes
- Batch inserts where appropriate
- Compress payloads when necessary
- Avoid blocking operations

---

# Scalability

The Telemetry Pipeline shall support:

- Thousands of assets
- Multiple organizations
- Multiple backend instances
- Distributed AI processing
- Future message queues

Horizontal scaling shall require no architectural changes.

---

# Security Considerations

Every telemetry packet shall:

- Be encrypted in transit
- Be authenticated
- Be authorized
- Be validated
- Be logged

Sensitive information shall never be transmitted in plaintext.

---

# Failure Handling

Failures are categorized into:

## Validation Failure

Reject request.

Log event.

---

## Processing Failure

Retry if recoverable.

Otherwise log error.

---

## Database Failure

Rollback transaction.

Retry if possible.

Notify administrator.

---

## AI Failure

Continue storing telemetry.

Mark AI status unavailable.

Do not interrupt monitoring.

---

# Monitoring Metrics

The Telemetry Pipeline itself shall expose:

- Requests Per Second
- Average Processing Time
- Failed Requests
- Queue Size
- Database Latency
- AI Processing Time
- WebSocket Connections

These metrics support operational monitoring.

---

# Future Enhancements

Future versions may include:

- Kafka Integration
- RabbitMQ Support
- Apache Pulsar
- Stream Processing
- Edge AI
- Delta Compression
- Adaptive Collection Rates

These enhancements extend the pipeline without changing its core architecture.

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 01_SYSTEM_ARCHITECTURE.md
- 04_DATA_FLOW.md
- 05_DIGITAL_TWIN_ENGINE.md
- DATABASE_SCHEMA.md
- AI_ENGINE.md
- API_SPECIFICATION.md

---

# Final Principle

The Telemetry Pipeline is the authoritative mechanism for transporting operational data throughout SentinelTwin AI.

Every telemetry event shall be authenticated, validated, normalized, processed, and distributed through this pipeline to ensure secure, reliable, and real-time monitoring across the platform.