# SentinelTwin AI
## Database Data Dictionary
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the meaning, behavior, and usage of every important database field in SentinelTwin AI.

This document acts as the official reference for:

- Backend developers
- Frontend developers
- AI engineers
- Database engineers
- API designers
- Documentation writers

No field should be added, removed, or modified without updating this document.

---

# Data Classification

Every database field belongs to one of the following classifications.

---

## Public Data

Information safe for normal application display.

Examples:

```
Organization Name

Device Hostname

Asset Type

Health Status

```

---

## Internal Data

Information used internally by the platform.

Examples:

```
Risk Scores

AI Confidence

System Metadata

```

---

## Sensitive Data

Information requiring protection.

Examples:

```
Password Hashes

Agent Credentials

Refresh Tokens

Security Events

```

---

# Naming Convention

Database:

```
snake_case
```

Examples:

```
organization_id

created_at

device_type

risk_score

```

API:

```
camelCase

```

Example:

```json
{
 "deviceType":"SERVER"
}
```

---

# Common Fields

The following fields appear across multiple tables.

---

# id

Type:

```
UUID
```

Purpose:

Unique identifier for database records.

Rules:

- Generated automatically
- Never reused
- Never exposed as sequential numbers

Example:

```
550e8400-e29b-41d4-a716-446655440000
```

---

# organization_id

Type:

```
UUID
```

Classification:

Internal

Purpose:

Identifies the organization owning the record.

Used for:

- Multi-tenancy
- Authorization
- Data isolation

Required:

Yes

---

# created_at

Type:

```
TIMESTAMP
```

Purpose:

Stores record creation time.

Rules:

- Automatically generated
- Never manually modified

---

# updated_at

Type:

```
TIMESTAMP
```

Purpose:

Stores last modification time.

Rules:

Updated automatically.

---

# Organization Entity

Table:

```
organizations
```

---

# name

Type:

```
VARCHAR(255)
```

Purpose:

Human-readable organization name.

Example:

```
Acme Corporation
```

---

# slug

Type:

```
VARCHAR(100)
```

Purpose:

Unique machine-readable identifier.

Example:

```
acme-corp
```

Rules:

- Lowercase
- No spaces
- Unique

---

# email

Type:

```
VARCHAR(255)
```

Purpose:

Primary organization contact.

---

# status

Type:

```
ENUM
```

Allowed values:

```
ACTIVE

SUSPENDED

DISABLED

```

Purpose:

Controls organization availability.

---

# User Entity

Table:

```
users
```

---

# username

Type:

```
VARCHAR(100)
```

Purpose:

Login identifier.

Rules:

Must be unique inside organization.

---

# password_hash

Type:

```
TEXT
```

Classification:

Sensitive

Purpose:

Stores encrypted password representation.

Rules:

Never store:

- Plain passwords
- Reversible encryption

Allowed:

- bcrypt
- Argon2

---

# email

Type:

```
VARCHAR(255)
```

Purpose:

User communication and login recovery.

---

# is_active

Type:

```
BOOLEAN
```

Purpose:

Controls account availability.

Example:

```
true = active

false = disabled

```

---

# last_login

Type:

```
TIMESTAMP
```

Purpose:

Tracks last successful authentication.

Used for:

- Security monitoring
- Account analysis

---

# Role Entity

Table:

```
roles
```

---

# name

Type:

```
VARCHAR
```

Allowed examples:

```
SUPER_ADMIN

ORGANIZATION_ADMIN

SECURITY_ANALYST

EMPLOYEE

VIEWER

```

Purpose:

Defines access level.

---

# Permission Entity

Table:

```
permissions
```

---

# permission_name

Type:

```
VARCHAR
```

Examples:

```
device.read

device.create

alert.manage

report.generate

```

Purpose:

Fine-grained authorization control.

---

# Employee Entity

Table:

```
employees
```

---

# employee_id

Type:

```
VARCHAR
```

Purpose:

Organization-specific employee identifier.

Example:

```
EMP-00125
```

---

# department

Type:

```
VARCHAR
```

Purpose:

Employee department.

Example:

```
Finance

Security

Engineering

```

---

# designation

Type:

```
VARCHAR
```

Purpose:

Job role.

Example:

```
Network Engineer
```

---

# Device Entity

Table:

```
devices
```

---

# device_type

Type:

```
ENUM
```

Allowed values:

```
LAPTOP

DESKTOP

SERVER

FIREWALL

```

Future:

```
ROUTER

SWITCH

CLOUD_VM

IOT_DEVICE

```

Purpose:

Defines asset category.

Used by:

- Digital Twin
- Dashboard
- AI models

---

# hostname

Type:

```
VARCHAR
```

Purpose:

Network identity of the device.

Example:

```
finance-laptop-01
```

---

# ip_address

Type:

```
VARCHAR
```

Purpose:

Current network address.

Classification:

Internal

---

# mac_address

Type:

```
VARCHAR
```

Purpose:

Hardware network identifier.

---

# operating_system

Type:

```
VARCHAR
```

Examples:

```
Windows 11

Ubuntu 24.04

Windows Server 2025

```

---

# agent_version

Type:

```
VARCHAR
```

Purpose:

Installed SentinelTwin Agent version.

Used for:

- Compatibility checks
- Updates

---

# status

Type:

```
ENUM
```

Allowed:

```
ONLINE

OFFLINE

WARNING

COMPROMISED

UNKNOWN

```

Purpose:

Current asset availability state.

---

# Digital Twin Entity

Table:

```
digital_twins
```

---

# health_status

Type:

```
ENUM
```

Values:

```
HEALTHY

WARNING

CRITICAL

UNKNOWN

```

Purpose:

Overall digital twin health.

---

# risk_level

Type:

```
ENUM
```

Values:

```
LOW

MEDIUM

HIGH

CRITICAL

```

Purpose:

AI-generated security risk category.

---

# Live State Entity

Table:

```
device_live_state
```

---

# cpu_usage

Type:

```
FLOAT
```

Range:

```
0-100
```

Purpose:

Current processor utilization.

---

# memory_usage

Type:

```
FLOAT
```

Range:

```
0-100
```

Purpose:

Current memory utilization.

---

# disk_usage

Type:

```
FLOAT
```

Range:

```
0-100
```

Purpose:

Current disk utilization.

---

# process_count

Type:

```
INTEGER
```

Purpose:

Number of running processes.

Used by:

- Anomaly detection
- Malware analysis

---

# last_seen

Type:

```
TIMESTAMP
```

Purpose:

Last successful communication time.

---

# Telemetry Entity

Table:

```
device_telemetry
```

---

# metric_type

Type:

```
VARCHAR
```

Examples:

```
CPU

MEMORY

NETWORK

PROCESS

DISK

SECURITY_EVENT

```

---

# metric_value

Type:

```
JSONB
```

Purpose:

Flexible storage of metric information.

Example:

```json
{
 "usage":75,
 "unit":"percent"
}
```

---

# collected_at

Type:

```
TIMESTAMP
```

Purpose:

Measurement collection time.

---

# AI Prediction Entity

Table:

```
ai_predictions
```

---

# model_name

Type:

```
VARCHAR
```

Example:

```
RandomForestRiskModel
```

---

# prediction

Type:

```
JSONB
```

Purpose:

Stores AI output.

Example:

```json
{
 "anomaly":true,
 "risk_score":87
}
```

---

# confidence

Type:

```
FLOAT
```

Range:

```
0-1
```

Purpose:

Model confidence.

---

# Threat Event Entity

Table:

```
threat_events
```

---

# threat_type

Type:

```
VARCHAR
```

Examples:

```
MALWARE

SUSPICIOUS_PROCESS

UNUSUAL_NETWORK

FAILED_LOGIN

```

---

# severity

Type:

```
ENUM
```

Values:

```
LOW

MEDIUM

HIGH

CRITICAL

```

---

# description

Type:

```
TEXT
```

Purpose:

Human-readable explanation.

---

# Alert Entity

Table:

```
alerts
```

---

# status

Type:

```
ENUM
```

Values:

```
OPEN

ACKNOWLEDGED

RESOLVED

CLOSED

```

---

# assigned_to

Type:

```
UUID
```

Purpose:

Security analyst responsible for handling alert.

---

# Audit Log Entity

Table:

```
audit_logs
```

---

# action

Type:

```
VARCHAR
```

Examples:

```
LOGIN

DEVICE_REGISTER

DELETE_DEVICE

UPDATE_POLICY

```

---

# entity_type

Type:

```
VARCHAR
```

Examples:

```
USER

DEVICE

ALERT

REPORT

```

---

# metadata

Type:

```
JSONB
```

Purpose:

Stores additional event information.

---

# Data Rules Summary

The following rules are mandatory:

1. UUIDs are used for identifiers.
2. Sensitive fields must be encrypted or hashed.
3. Timestamps use UTC.
4. Historical records are immutable.
5. AI outputs must be explainable.
6. Telemetry data must never overwrite history.
7. Organization ownership must always be enforced.
8. Database fields require documentation before creation.

---

# Related Documents

- DATABASE_SCHEMA.md
- ER_DIAGRAM.md
- INDEXING_STRATEGY.md
- MIGRATION_STRATEGY.md
- DATA_RETENTION_POLICY.md
