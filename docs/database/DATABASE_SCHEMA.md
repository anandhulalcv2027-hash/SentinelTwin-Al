# SentinelTwin AI
## Database Schema Specification
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official database architecture for SentinelTwin AI.

The database schema described here is the single source of truth for:

- PostgreSQL database design
- SQLAlchemy models
- Alembic migrations
- Repository implementations
- API data models

Any database modification must update this document before implementation.

---

# Database Technology

Primary Database:

PostgreSQL

Version:

PostgreSQL 16+

ORM:

SQLAlchemy 2.x

Migration Tool:

Alembic

Cache:

Redis

---

# Database Design Principles

The database follows these principles:

## Normalization

Data must avoid unnecessary duplication.

---

## Separation of Concerns

Different types of information must remain separated.

Examples:

Static Device Information

↓

devices table


Current Device Condition

↓

device_live_state table


Historical Measurements

↓

telemetry table

---

## Historical Data Preservation

Historical security and telemetry data must never be overwritten.

All historical records are append-only.

---

## Multi-Tenant Isolation

Every organization-owned entity must contain:

organization_id

This ensures tenant separation.

---

# Entity Overview

The SentinelTwin AI database consists of the following major entities:

```

organizations

users

roles

permissions

user_roles

employees

devices

device_credentials

digital_twins

device_live_state

device_telemetry

device_heartbeats

ai_predictions

threat_events

alerts

reports

audit_logs

refresh_tokens

system_settings

```

---

# Entity Relationship Overview

```

Organization

    |
    |
    +---- Users
    |
    +---- Employees
    |
    +---- Devices
             |
             |
             +---- Digital Twin
             |
             +---- Live State
             |
             +---- Telemetry
             |
             +---- Heartbeats
             |
             +---- AI Predictions
             |
             +---- Threat Events
             |
             +---- Alerts


```

---

# Core Tables

---

# 1. organizations

## Purpose

Stores tenant organizations using SentinelTwin AI.

Each organization represents an independent customer environment.

---

## Columns

| Column | Type | Description |
|-|-|-|
| id | UUID | Primary key |
| name | VARCHAR(255) | Organization name |
| slug | VARCHAR(100) | Unique identifier |
| email | VARCHAR(255) | Contact email |
| status | ENUM | Active/Inactive |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

---

## Constraints

Primary Key:

id

Unique:

slug

email

---

# 2. users

## Purpose

Stores authenticated application users.

Users are administrators, security analysts, or employees accessing the platform.

---

## Columns

| Column | Type | Description |
|-|-|-|
| id | UUID | Primary key |
| organization_id | UUID | Organization reference |
| username | VARCHAR(100) | Login name |
| email | VARCHAR(255) | Email |
| password_hash | TEXT | Hashed password |
| first_name | VARCHAR(100) | First name |
| last_name | VARCHAR(100) | Last name |
| is_active | BOOLEAN | Account status |
| last_login | TIMESTAMP | Last login |
| created_at | TIMESTAMP | Creation time |

---

## Relationships

Organization:

One Organization

has many Users

---

# 3. roles

## Purpose

Defines user access roles.

---

## Default Roles

```

Super Admin

Organization Admin

Security Analyst

Employee

Viewer

```

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| name | VARCHAR |
| description | TEXT |
| created_at | TIMESTAMP |

---

# 4. permissions

## Purpose

Defines granular system permissions.

Examples:

```

device.read

device.create

device.delete

alert.manage

report.generate

```

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| name | VARCHAR |
| description | TEXT |

---

# 5. user_roles

## Purpose

Many-to-many relationship between users and roles.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| user_id | UUID |
| role_id | UUID |

---

# 6. employees

## Purpose

Represents organization employees whose endpoints are monitored.

This is separate from platform users.

An employee may have a monitored laptop but never log into SentinelTwin AI.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| organization_id | UUID |
| employee_id | VARCHAR |
| name | VARCHAR |
| email | VARCHAR |
| department | VARCHAR |
| designation | VARCHAR |
| status | ENUM |
| created_at | TIMESTAMP |

---

# 7. devices

## Purpose

Primary monitored asset entity.

A device represents a physical or virtual system connected to SentinelTwin AI.

---

## Supported Types

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

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| organization_id | UUID |
| employee_id | UUID nullable |
| device_type | ENUM |
| hostname | VARCHAR |
| ip_address | VARCHAR |
| mac_address | VARCHAR |
| operating_system | VARCHAR |
| agent_version | VARCHAR |
| status | ENUM |
| registered_at | TIMESTAMP |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

## Rules

Every device:

Must belong to one organization.

Must have one Digital Twin.

Must have one current live state.

---

# 8. device_credentials

## Purpose

Stores secure authentication information for endpoint agents.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| credential_hash | TEXT |
| last_rotation | TIMESTAMP |
| expires_at | TIMESTAMP |

---

# 9. digital_twins

## Purpose

Stores the digital representation metadata of each device.

A Digital Twin is not the device itself.

It represents the continuously synchronized software model.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| health_status | ENUM |
| risk_level | ENUM |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# 10. device_live_state

## Purpose

Stores the latest known operational condition.

Only one active record exists per device.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| cpu_usage | FLOAT |
| memory_usage | FLOAT |
| disk_usage | FLOAT |
| network_status | ENUM |
| process_count | INTEGER |
| last_seen | TIMESTAMP |
| updated_at | TIMESTAMP |

---

# 11. device_telemetry

## Purpose

Stores historical endpoint measurements.

This table is append-only.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| metric_type | VARCHAR |
| metric_value | JSONB |
| collected_at | TIMESTAMP |

---

Examples:

CPU:

```json
{
 "usage":72
}
```

Network:

```json
{
 "packets_sent":1000,
 "packets_received":900
}
```

---

# 12. device_heartbeats

## Purpose

Tracks agent availability.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| status | ENUM |
| timestamp | TIMESTAMP |

---

# 13. ai_predictions

## Purpose

Stores AI model outputs.

AI never directly creates alerts.

Predictions are stored first.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| model_name | VARCHAR |
| prediction | JSONB |
| confidence | FLOAT |
| created_at | TIMESTAMP |

---

# 14. threat_events

## Purpose

Stores detected security events.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| device_id | UUID |
| threat_type | VARCHAR |
| severity | ENUM |
| description | TEXT |
| detected_at | TIMESTAMP |

---

# 15. alerts

## Purpose

Stores actionable security notifications.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| organization_id | UUID |
| threat_event_id | UUID |
| status | ENUM |
| assigned_to | UUID |
| created_at | TIMESTAMP |

---

# 16. reports

## Purpose

Stores generated security reports.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| organization_id | UUID |
| generated_by | UUID |
| report_type | VARCHAR |
| file_path | TEXT |
| created_at | TIMESTAMP |

---

# 17. audit_logs

## Purpose

Records security-sensitive actions.

Audit logs are immutable.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| organization_id | UUID |
| user_id | UUID |
| action | VARCHAR |
| entity_type | VARCHAR |
| entity_id | UUID |
| metadata | JSONB |
| timestamp | TIMESTAMP |

---

# 18. refresh_tokens

## Purpose

Stores JWT refresh token sessions.

---

## Columns

| Column | Type |
|-|-|
| id | UUID |
| user_id | UUID |
| token_hash | TEXT |
| expires_at | TIMESTAMP |
| revoked | BOOLEAN |

---

# Database Rules Summary

The following rules are mandatory:

- Every organization-owned table contains organization_id.
- Telemetry is append-only.
- Audit logs are immutable.
- Passwords are never stored.
- Secrets are encrypted or hashed.
- Live state is separated from historical data.
- AI predictions are stored before alerts.
- Foreign keys are always enforced.

---

# Related Documents

DATABASE_SCHEMA.md

ER_DIAGRAM.md

DATA_DICTIONARY.md

INDEXING_STRATEGY.md

MIGRATION_STRATEGY.md

DATA_RETENTION_POLICY.md
