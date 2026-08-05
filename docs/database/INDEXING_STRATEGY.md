# SentinelTwin AI
## Database Indexing Strategy
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official indexing strategy for the SentinelTwin AI PostgreSQL database.

The purpose of indexing is to ensure:

- Fast dashboard queries
- Efficient telemetry retrieval
- Quick threat investigation
- Multi-tenant isolation performance
- Optimized AI data processing
- Scalable database operations

All database indexes must follow this document.

---

# Indexing Principles

## Principle 1: Index Query Patterns

Indexes are created based on actual application queries.

Do not create unnecessary indexes.

Every index has:

- Storage cost
- Write performance impact
- Maintenance cost

---

## Principle 2: Multi-Tenant First

Since SentinelTwin AI is a multi-tenant platform, almost every query starts with:

```
organization_id
```

Therefore:

Composite indexes should usually begin with:

```
organization_id
```

Example:

Recommended:

```
(organization_id, device_type)

```

Not:

```
(device_type)

```

---

## Principle 3: Time-Series Optimization

Telemetry and security data are time-dependent.

Queries frequently involve:

```
device_id

+

timestamp range

```

Therefore time-based indexes are mandatory.

---

## Principle 4: Avoid Over-Indexing

Do not index:

- Low-cardinality boolean fields
- Frequently updated fields without reason
- Large JSON columns without query requirements

---

# Primary Key Indexes

All tables automatically receive PostgreSQL primary key indexes.

Example:

```
organizations.id

users.id

devices.id

```

No manual creation required.

---

# Organization Table Indexes

Table:

```
organizations
```

---

## slug Index

Column:

```
slug
```

Type:

Unique Index

Purpose:

Fast organization lookup.

Example query:

```
Find organization by slug
```

---

## email Index

Column:

```
email
```

Type:

Unique Index

Purpose:

Organization contact lookup.

---

# Users Table Indexes

Table:

```
users
```

---

## Organization User Lookup

Columns:

```
organization_id
```

Index:

```
idx_users_organization

```

Purpose:

Retrieve users belonging to an organization.

Example:

```
SELECT users
WHERE organization_id = X

```

---

## Login Lookup

Columns:

```
organization_id

email

```

Index:

Composite Unique Index:

```
idx_users_login

```

Purpose:

Authentication lookup.

Reason:

A user email only needs to be unique inside an organization.

---

## Active User Filtering

Columns:

```
organization_id

is_active

```

Index:

```
idx_users_active

```

Purpose:

Find active accounts.

---

# Employees Table Indexes

Table:

```
employees
```

---

## Organization Employees

Columns:

```
organization_id
```

Index:

```
idx_employees_org

```

Purpose:

Employee listing.

---

## Employee Identifier

Columns:

```
organization_id

employee_id

```

Index:

Unique Composite Index.

Purpose:

Organization-specific employee lookup.

---

# Devices Table Indexes

Table:

```
devices
```

Devices are one of the most frequently queried entities.

---

## Organization Devices

Columns:

```
organization_id
```

Index:

```
idx_devices_org

```

Purpose:

Main dashboard queries.

---

## Device Type Filtering

Columns:

```
organization_id

device_type

```

Index:

```
idx_devices_type

```

Purpose:

Examples:

Show all servers.

Show all laptops.

---

## Device Status Filtering

Columns:

```
organization_id

status

```

Index:

```
idx_devices_status

```

Purpose:

SOC dashboard:

```
Online devices

Offline devices

Compromised devices

```

---

## Hostname Search

Columns:

```
hostname
```

Index:

B-tree index.

Purpose:

Fast device search.

---

## IP Address Search

Columns:

```
ip_address
```

Index:

B-tree index.

Purpose:

Network investigation.

---

# Device Credentials Indexes

Table:

```
device_credentials
```

---

## Device Lookup

Column:

```
device_id
```

Index:

Unique.

Reason:

One device has one credential record.

---

# Digital Twin Indexes

Table:

```
digital_twins
```

---

## Device Relationship

Column:

```
device_id
```

Index:

Unique.

Reason:

One-to-one relationship.

---

## Risk Dashboard

Columns:

```
risk_level
```

Index:

Purpose:

Find:

```
Critical assets

High-risk assets

```

---

# Live State Indexes

Table:

```
device_live_state
```

---

## Device Lookup

Column:

```
device_id
```

Index:

Unique.

Purpose:

Retrieve current state.

---

## Last Seen Monitoring

Column:

```
last_seen
```

Index:

Purpose:

Detect:

- Offline agents
- Dead connections
- Communication failures

---

# Telemetry Table Indexes

Table:

```
device_telemetry
```

This is the largest table in the system.

---

## Primary Telemetry Index

Columns:

```
device_id

collected_at

```

Index:

Composite:

```
idx_telemetry_device_time

```

Purpose:

Most common query:

```
Get device metrics between two times

```

Example:

```
Device A

Last 24 hours CPU usage

```

---

## Organization Telemetry Index

Columns:

```
organization_id

collected_at

```

Purpose:

Organization-wide analytics.

---

## Metric Type Index

Columns:

```
metric_type

```

Purpose:

Filtering:

```
CPU metrics

Network metrics

Process metrics

```

---

# Heartbeat Table Indexes

Table:

```
device_heartbeats
```

---

## Device Heartbeat History

Columns:

```
device_id

timestamp

```

Index:

Composite.

Purpose:

Agent availability analysis.

---

## Recent Heartbeats

Column:

```
timestamp
```

Purpose:

Find recently active devices.

---

# AI Prediction Indexes

Table:

```
ai_predictions
```

---

## Device Prediction History

Columns:

```
device_id

created_at

```

Purpose:

AI history timeline.

---

## High Risk Predictions

Columns:

```
risk_score

created_at

```

Purpose:

Find dangerous predictions.

---

# Threat Event Indexes

Table:

```
threat_events
```

---

## Device Threat History

Columns:

```
device_id

detected_at

```

Purpose:

Security investigation.

---

## Severity Search

Columns:

```
severity

detected_at

```

Purpose:

SOC alert prioritization.

---

## Threat Type Search

Column:

```
threat_type

```

Purpose:

Threat analytics.

---

# Alert Indexes

Table:

```
alerts
```

---

## Organization Alerts

Columns:

```
organization_id

status

```

Purpose:

SOC dashboard.

Example:

```
Open alerts

for organization

```

---

## Assigned Analyst

Column:

```
assigned_to

status

```

Purpose:

Analyst workflow.

---

## Recent Alerts

Column:

```
created_at

```

Purpose:

Latest security events.

---

# Audit Log Indexes

Table:

```
audit_logs
```

---

## Organization Audit History

Columns:

```
organization_id

timestamp

```

Purpose:

Compliance reporting.

---

## User Activity

Columns:

```
user_id

timestamp

```

Purpose:

Investigate user actions.

---

## Entity Tracking

Columns:

```
entity_type

entity_id

```

Purpose:

Find all actions involving an object.

Example:

```
All actions on Device X

```

---

# JSONB Index Strategy

Some tables contain JSONB data:

Examples:

```
telemetry.metric_value

ai_predictions.prediction

audit_logs.metadata

```

---

## Default Rule

Do not automatically index JSONB fields.

---

## Create GIN indexes only when required.

Example:

```
CREATE INDEX telemetry_metric_value_idx
ON device_telemetry
USING GIN(metric_value);

```

Only if queries frequently search inside JSON.

---

# Full Text Search

Future support:

Threat descriptions

Audit metadata

Reports

may use:

PostgreSQL Full Text Search.

Possible indexes:

```
tsvector

GIN indexes

```

---

# Time-Series Scaling Strategy

Telemetry will grow faster than other tables.

Expected growth:

Example:

```
1000 devices

+

1 metric/minute

=

1,440,000 records/day

```

Therefore future scaling may require:

---

## Partitioning

Partition:

```
device_telemetry

```

By:

```
month

```

Example:

```
telemetry_2026_07

telemetry_2026_08

```

---

## Retention Policy

Hot data:

Recent telemetry.

Cold data:

Archived telemetry.

Defined in:

```
DATA_RETENTION_POLICY.md

```

---

# Index Naming Convention

Format:

```
idx_<table>_<columns>

```

Examples:

```
idx_devices_org

idx_devices_status

idx_telemetry_device_time

```

Unique indexes:

```
uq_<table>_<columns>

```

Example:

```
uq_users_org_email

```

---

# Index Maintenance

Production database maintenance:

Required:

```
VACUUM

ANALYZE

REINDEX

```

Schedule:

Based on database growth.

---

# Performance Monitoring

Monitor:

- Slow queries
- Index usage
- Table size
- Query execution plans

Tools:

- PostgreSQL EXPLAIN ANALYZE
- pg_stat_statements

---

# Final Indexing Principle

Indexes exist to support the application's behavior.

The database should optimize:

```
SOC Dashboard

        ↓

Asset Investigation

        ↓

Telemetry Analysis

        ↓

Threat Detection

        ↓

AI Processing

```

Every index must have a clear engineering purpose.

---

# Related Documents

- DATABASE_SCHEMA.md
- ER_DIAGRAM.md
- DATA_DICTIONARY.md
- MIGRATION_STRATEGY.md
- DATA_RETENTION_POLICY.md
