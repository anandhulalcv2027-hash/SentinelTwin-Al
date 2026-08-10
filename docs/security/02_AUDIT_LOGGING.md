# SentinelTwin AI
## Audit Logging
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the Audit Logging architecture for SentinelTwin AI.

Audit logs provide a complete, chronological record of user actions, system events, authentication activities, administrative changes, and security-related operations.

Unlike application logs, audit logs exist to provide accountability, traceability, compliance, and forensic evidence.

Audit logs are immutable and must never be altered after creation.

---

# Objectives

The Audit Logging system shall provide:

- Accountability
- Traceability
- Non-Repudiation
- Security Monitoring
- Incident Investigation
- Compliance Support
- Historical Analysis

Every security-sensitive action performed within SentinelTwin AI shall generate an audit event.

---

# Audit Logging Principles

Audit logs shall be:

- Immutable
- Chronological
- Tamper-resistant
- Searchable
- Structured
- Consistent
- Time synchronized

Audit logs are append-only.

Existing records shall never be modified or deleted.

---

# Audit Log Architecture

```
User / Endpoint Agent

↓

API Request

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Audit Logger

↓

PostgreSQL Audit Table

↓

Reports
```

Audit logging occurs after authentication and authorization but before the response is returned.

---

# What Must Be Logged

The following events must always generate audit entries.

## Authentication

- Login Success
- Login Failure
- Logout
- Password Change
- Password Reset
- Token Refresh

---

## Authorization

- Permission Denied
- Role Assignment
- Role Removal
- RBAC Changes

---

## Organization

- Organization Created
- Organization Updated
- Organization Deleted

---

## User Management

- User Created
- User Updated
- User Disabled
- User Enabled
- User Deleted

---

## Employee Management

- Employee Created
- Employee Updated
- Employee Deleted

---

## Asset Management

- Asset Registered
- Asset Updated
- Asset Deleted
- Asset Assigned
- Asset Unassigned

---

## Endpoint Agent

- Agent Registered
- Agent Authenticated
- Agent Heartbeat
- Agent Offline
- Agent Reconnected

---

## Digital Twin

- Twin Created
- Twin Synchronized
- Twin Synchronization Failure

---

## AI Engine

- Prediction Generated
- Risk Score Updated
- Threat Detected
- Threat Resolved

---

## Alerts

- Alert Generated
- Alert Acknowledged
- Alert Closed

---

## Reports

- Report Generated
- Report Exported

---

## System Administration

- Settings Updated
- Configuration Changed
- System Restart
- Backup Created
- Backup Restored

---

# Audit Log Schema

Every audit record contains:

```
Audit ID

Timestamp (UTC)

Organization ID

User ID

Username

Role

Event Type

Resource Type

Resource ID

Action

Description

Status

IP Address

User Agent

Session ID

Correlation ID

Additional Metadata
```

---

# Event Categories

Supported categories:

```
Authentication

Authorization

Organization

User

Employee

Asset

Digital Twin

Telemetry

AI

Alert

Report

System

Security
```

---

# Event Severity

Severity levels:

```
Informational

Low

Medium

High

Critical
```

Severity helps prioritize investigations.

---

# Event Status

Possible values:

```
Success

Failure

Warning

Blocked
```

---

# Example Audit Record

```json
{
  "audit_id": "AUD-000154",
  "timestamp": "2026-07-28T14:33:17Z",
  "organization_id": 3,
  "user_id": 18,
  "username": "admin@example.com",
  "role": "Organization Administrator",
  "event_type": "Asset Registered",
  "resource_type": "Asset",
  "resource_id": 92,
  "action": "Create",
  "status": "Success",
  "ip_address": "192.168.1.22",
  "user_agent": "Chrome",
  "correlation_id": "REQ-784522"
}
```

---

# Correlation ID

Every request shall receive a unique Correlation ID.

Purpose:

- Trace distributed operations
- Link API requests
- Associate audit events
- Simplify incident investigation

Example:

```
REQ-20260728-000458
```

---

# Time Synchronization

All timestamps shall:

- Use UTC
- Follow ISO 8601 format
- Include milliseconds when available

Example:

```
2026-07-28T14:33:17.245Z
```

---

# Storage Policy

Audit logs are stored in PostgreSQL.

Characteristics:

- Append-only
- Indexed
- Partitioned (future)
- Encrypted backups

Audit records must never overwrite existing entries.

---

# Retention Policy

Version 1

Retain audit logs for:

```
365 Days
```

Future versions may support configurable retention periods.

---

# Search Capabilities

Users shall be able to search audit logs using:

- Username
- Organization
- Asset
- Event Type
- Severity
- Date Range
- IP Address
- Correlation ID

---

# Filtering

Supported filters:

- User
- Organization
- Event Category
- Resource Type
- Status
- Severity
- Date Range

Filters may be combined.

---

# Export

Audit logs may be exported as:

- CSV
- PDF

Future:

- JSON
- SIEM Integration

Only authorized users may export logs.

---

# Permissions

Only authorized roles may access audit logs.

Permissions:

```
audit:read

audit:export
```

Regular employees cannot access audit records.

---

# Performance Requirements

The audit logging system shall:

- Log asynchronously when practical
- Minimize API response delay
- Support millions of records
- Support indexed searches
- Preserve chronological order

---

# Privacy

Audit logs shall never contain:

- Plaintext passwords
- JWT tokens
- Encryption keys
- API secrets
- Sensitive credentials

Personally identifiable information shall be limited to what is necessary for accountability.

---

# Forensic Investigation

Audit logs shall support:

- Incident reconstruction
- Timeline analysis
- User activity tracking
- Administrative review
- Compliance reporting

Audit logs are considered authoritative historical evidence.

---

# Integration

Audit logs integrate with:

- Authentication
- RBAC
- Endpoint Agent
- Digital Twin
- AI Engine
- Alert System
- Reports

Every subsystem shall use the centralized Audit Logging service.

---

# Future Enhancements

Planned improvements:

- Real-time Audit Dashboard
- Immutable Log Storage
- Cryptographic Log Signing
- SIEM Integration
- Log Streaming
- Compliance Reporting
- Long-Term Cold Storage

---

# Related Documents

- SECURITY_MODEL.md
- THREAT_MODEL.md
- AUTHENTICATION.md
- RBAC.md
- API_SPECIFICATION.md

---

# Final Principle

Audit logging is the permanent historical memory of SentinelTwin AI.

Every security-relevant action shall be recorded accurately, consistently, and immutably to support accountability, forensic investigation, operational transparency, and future compliance requirements.