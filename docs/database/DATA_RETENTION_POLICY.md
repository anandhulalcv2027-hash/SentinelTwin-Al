# SentinelTwin AI
## Data Retention Policy
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official data retention strategy for SentinelTwin AI.

The purpose of this policy is to ensure:

- Security evidence preservation
- Database scalability
- Storage optimization
- Compliance readiness
- Historical analytics support

This document defines:

- What data is stored
- How long data is retained
- When data is archived
- When data can be deleted

---

# Retention Philosophy

SentinelTwin AI follows this principle:

> Security data should be preserved by default and deleted only through controlled processes.

The platform separates data into:

```
Operational Data

+

Historical Data

+

Security Evidence

```

---

# Data Classification

Data is classified into four categories.

---

# Category 1: Critical Security Data

Examples:

```
Audit Logs

Threat Events

Alerts

AI Predictions

```

Retention:

Permanent by default.

Reason:

Required for:

- Investigations
- Compliance
- Forensics
- Incident analysis

---

# Category 2: Historical Operational Data

Examples:

```
Telemetry

Heartbeats

Performance Metrics

```

Retention:

Configurable.

Reason:

Large volume data requires lifecycle management.

---

# Category 3: Configuration Data

Examples:

```
Organizations

Users

Devices

Roles

Permissions

```

Retention:

Until account deletion.

Soft deletion preferred.

---

# Category 4: Temporary Data

Examples:

```
Cache

Sessions

Temporary Processing Data

```

Retention:

Short-term.

---

# Default Retention Periods

The following values define Version 1 defaults.

---

# Organizations

Table:

```
organizations
```

Retention:

Permanent.

Reason:

Root tenant identity.

Deletion:

Requires administrative action.

---

# Users

Table:

```
users
```

Retention:

Until organization removal.

Deletion method:

Soft delete.

Preserved:

```
User ID

Audit History

Actions

```

---

# Employees

Table:

```
employees
```

Retention:

Organization lifetime.

Deletion:

Soft delete.

---

# Devices

Table:

```
devices
```

Retention:

Organization lifetime.

Reason:

Asset history is important.

A removed device should not erase security history.

---

# Device Credentials

Table:

```
device_credentials
```

Retention:

Until device removal.

After removal:

Credentials must be revoked immediately.

---

# Digital Twins

Table:

```
digital_twins
```

Retention:

Same as device lifetime.

Reason:

Digital Twin represents asset identity.

---

# Live Device State

Table:

```
device_live_state
```

Retention:

Current state only.

Historical values are stored in:

```
device_telemetry
```

Old state:

Overwritten.

---

# Telemetry Data

Table:

```
device_telemetry
```

This is the largest dataset.

---

# Default Retention

Hot storage:

```
90 days
```

Purpose:

Fast dashboard queries.

---

Warm storage:

```
12 months
```

Purpose:

Historical analysis.

---

Cold archive:

```
Beyond 12 months
```

Purpose:

Long-term security analytics.

---

# Telemetry Lifecycle

```
Endpoint Agent

        |

        ↓

Live Database

(0-90 days)

        |

        ↓

Archive Storage

(3-12 months)

        |

        ↓

Cold Storage

(12+ months)

```

---

# Telemetry Deletion Rules

Telemetry must never be deleted immediately.

Before deletion:

Verify:

```
No active investigation

No legal hold

No compliance requirement

```

---

# Heartbeat Data

Table:

```
device_heartbeats
```

Retention:

90 days.

Reason:

Heartbeat data is operational.

Long-term availability trends may be aggregated.

---

# AI Predictions

Table:

```
ai_predictions
```

Retention:

Minimum:

```
12 months
```

Reason:

Required for:

- Model evaluation
- False positive analysis
- Threat investigation

---

# Threat Events

Table:

```
threat_events
```

Retention:

Permanent.

Reason:

Security evidence.

---

# Alerts

Table:

```
alerts
```

Retention:

Minimum:

```
3 years
```

Reason:

Security operations history.

---

# Reports

Table:

```
reports
```

Retention:

Organization controlled.

Default:

```
3 years
```

---

# Audit Logs

Table:

```
audit_logs
```

Retention:

Permanent.

Reason:

Audit records are security-critical.

Audit logs must be:

- Immutable
- Append-only
- Protected from modification

---

# Refresh Tokens

Table:

```
refresh_tokens
```

Retention:

Until expiration.

After expiration:

Cleanup allowed.

---

# Redis Data Retention

Redis stores:

```
Cache

Temporary Sessions

Realtime State

Queues

```

Rules:

Redis data is not considered permanent storage.

Expiration:

Required.

Examples:

```
Session cache:

24 hours


Realtime cache:

minutes

```

---

# Data Archiving Strategy

Large historical data should move through lifecycle stages.

---

# Hot Storage

Technology:

PostgreSQL

Purpose:

Active queries.

Examples:

```
Current alerts

Recent telemetry

Live dashboards

```

---

# Warm Storage

Technology:

PostgreSQL partitions or archive database.

Purpose:

Historical analytics.

Examples:

```
Monthly telemetry

Previous incidents

```

---

# Cold Storage

Future options:

```
Object Storage

Compressed Archives

Data Lake

```

Purpose:

Long-term retention.

---

# Database Partitioning Strategy

Large tables may require partitioning.

Primary candidate:

```
device_telemetry
```

Partition method:

Time-based.

Example:

```
device_telemetry_2026_07

device_telemetry_2026_08

```

---

# Data Export Policy

Organizations may export:

```
Reports

Security Events

Telemetry Summaries

```

Exports must:

- Respect RBAC
- Be logged
- Be encrypted

---

# Data Deletion Policy

Deletion requires:

Authorization.

Required:

```
Permission check

Audit entry

Confirmation

```

---

# Forbidden Deletion

The following must never be silently deleted:

```
Audit Logs

Threat Events

Security Incidents

```

---

# Privacy and Security Rules

Sensitive information must be protected.

Examples:

Passwords:

```
Never stored

```

Credentials:

```
Encrypted or hashed

```

Tokens:

```
Hashed

```

---

# Backup Strategy

Critical data requires backups.

Backup priority:

1. Database
2. Audit Logs
3. Threat Data
4. Configuration

---

# Recovery Objectives

Future production targets:

Recovery Point Objective:

```
RPO: < 24 hours

```

Recovery Time Objective:

```
RTO: Defined by deployment tier

```

---

# AI Data Considerations

AI models require historical information.

Before deleting data:

Check:

```
Is it used for training?

Is it required for evaluation?

Is it linked to incidents?

```

---

# Retention Configuration

Future versions may allow organization-level policies.

Example:

```
Organization A

Telemetry:

6 months


Organization B

Telemetry:

24 months

```

---

# Compliance Readiness

This policy supports future compliance requirements including:

- Security auditing
- Incident investigation
- Enterprise governance

---

# Retention Checklist

Before deleting data:

```
[ ] Authorization verified

[ ] Retention period completed

[ ] No investigation exists

[ ] Backup completed

[ ] Audit entry created

[ ] Deletion logged

```

---

# Final Retention Principle

SentinelTwin AI treats security data as valuable intelligence.

The system must balance:

```

Security Evidence

+

Performance

+

Storage Cost

+

Operational Requirements

```

Data lifecycle management must never compromise security visibility.

---

# Related Documents

- DATABASE_SCHEMA.md
- ER_DIAGRAM.md
- DATA_DICTIONARY.md
- INDEXING_STRATEGY.md
- MIGRATION_STRATEGY.md
