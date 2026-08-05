# SentinelTwin AI
## Database Migration Strategy
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official database migration strategy for SentinelTwin AI.

It establishes rules for:

- Schema evolution
- Database changes
- Migration creation
- Migration testing
- Rollback procedures
- Production deployment

Every database modification MUST follow this document.

---

# Database Migration Technology

Primary Database:

```
PostgreSQL 16+
```

ORM:

```
SQLAlchemy 2.x
```

Migration Framework:

```
Alembic
```

---

# Migration Philosophy

Database changes must be:

- Planned
- Documented
- Reviewed
- Tested
- Reversible whenever possible

The database schema must evolve safely.

---

# Source of Truth

The database lifecycle follows:

```
Documentation

↓

SQLAlchemy Models

↓

Alembic Migration

↓

Database

```

The correct order is:

1. Update documentation
2. Update models
3. Generate migration
4. Review migration
5. Test migration
6. Apply migration

---

# Forbidden Workflow

The following is prohibited:

```
Change database manually

↓

Update code later

```

Example:

Directly running:

```sql
ALTER TABLE devices ADD COLUMN test VARCHAR;
```

without migration tracking is forbidden.

---

# Migration File Structure

Alembic migrations follow:

```
backend/

    migrations/

        versions/

            xxxx_add_device_table.py

            xxxx_add_ai_prediction.py

```

---

# Migration Naming Convention

Format:

```
<action>_<object>_<purpose>

```

Examples:

```
create_devices_table

add_device_status_column

create_alert_indexes

remove_unused_field

```

---

# Migration Types

Database changes are classified into:

---

# 1. Additive Changes

Preferred.

Examples:

- Add new table
- Add new column
- Add new index

Example:

```
Add risk_score column

```

These are usually safe.

---

# 2. Modification Changes

Require review.

Examples:

- Change column type
- Change constraints
- Rename fields

Example:

```
Change severity VARCHAR to ENUM

```

---

# 3. Destructive Changes

Require approval.

Examples:

- Drop table
- Delete column
- Remove relationship

Example:

```
DROP COLUMN password_hash;

```

Never perform automatically.

---

# Migration Development Workflow

Every migration follows:

```

Requirement

↓

Database Documentation Update

↓

Architecture Review

↓

Model Change

↓

Generate Migration

↓

Review SQL

↓

Test Locally

↓

Apply

↓

Update Documentation

```

---

# Creating Migrations

Recommended workflow:

Command:

```
alembic revision --autogenerate -m "description"

```

Generated migrations MUST be manually reviewed.

AI-generated migrations MUST NOT be blindly accepted.

---

# Migration Review Rules

Before accepting a migration verify:

## Table Changes

Check:

- Correct table
- Correct columns
- Correct types
- Correct constraints

---

## Data Safety

Check:

- Existing data preserved
- No accidental deletion
- No unintended defaults

---

## Performance

Check:

- Index creation impact
- Large table operations
- Locking behavior

---

# Production Migration Rules

Production migrations must:

- Be tested first
- Have backups available
- Be reversible when possible
- Be executed during controlled deployment

---

# Database Backup Requirement

Before destructive migrations:

Required:

```
Database backup

```

Example:

```
Before removing column

↓

Backup

↓

Migration

↓

Verification

```

---

# Migration Testing

Every migration must be tested on:

## Development Database

Purpose:

Basic correctness.

---

## Test Database

Purpose:

Automated verification.

---

## Production-like Database

Purpose:

Performance validation.

---

# Migration Testing Checklist

Verify:

```

Migration applies successfully

↓

Application starts

↓

API endpoints work

↓

Existing data accessible

↓

Relationships preserved

↓

Indexes created

↓

Rollback works if supported

```

---

# Rollback Strategy

Every migration should define downgrade behavior.

Example:

Upgrade:

```python
add_column(
    "devices",
    "risk_score"
)
```

Downgrade:

```python
drop_column(
    "devices",
    "risk_score"
)
```

---

# When Rollback Is Not Possible

Some migrations cannot safely rollback.

Examples:

- Data deletion
- Data transformation
- Large-scale migration

In such cases:

Create:

```
Forward migration only

+

Backup strategy

```

---

# Database Version Control

Database schema version is tracked through:

```
Alembic version table

```

Example:

```
alembic_version

current revision:

a84f21

```

---

# Development Environment Rules

Every developer environment must be reproducible.

New developers should run:

```
Create database

↓

Run migrations

↓

Seed development data

```

Example:

```
alembic upgrade head

```

---

# Seed Data Rules

Development seed data may include:

- Test organizations
- Test users
- Demo devices
- Sample telemetry

Never include:

- Real passwords
- Real credentials
- Real customer data

---

# Database Reset Rules

Allowed:

Development only.

Example:

```
Drop database

Recreate

Run migrations

```

Forbidden:

Production.

---

# Schema Change Categories

---

## Category A: Internal Change

Example:

Add index.

Process:

Developer approval.

---

## Category B: Feature Change

Example:

Add threat intelligence table.

Process:

Requires update:

- Database schema
- API documentation
- Architecture documentation

---

## Category C: Architecture Change

Example:

Replace PostgreSQL.

Process:

Requires:

- Constitution update
- Architecture review
- Migration plan

---

# Data Migration Strategy

When changing existing data:

Use:

```
Migration Script

```

Example:

Old:

```
severity = "high"

```

New:

```
severity = HIGH

```

Migration:

```
Convert existing values

```

---

# Large Data Migration Rules

For large tables:

Never run:

```
UPDATE millions_of_rows;

```

directly.

Instead:

Use batching:

```
Batch 1

↓

Batch 2

↓

Batch 3

```

---

# Telemetry Table Migration Rules

The telemetry table requires special care.

Reasons:

- High volume
- Historical importance
- AI dependency

Rules:

Never:

- Delete telemetry casually
- Rewrite historical values
- Change metric meaning without documentation

---

# AI Data Migration Rules

AI-related schema changes require:

Update:

- AI documentation
- Feature definitions
- Model input definitions

Example:

Adding:

```
new network feature

```

requires updating:

```
Feature Engineering Documentation

```

---

# Migration Security Rules

Never store:

- Passwords
- API keys
- Agent secrets

inside migration files.

---

# AI Assistant Migration Rules

AI assistants must:

Before creating migrations:

Read:

```
DATABASE_SCHEMA.md

ER_DIAGRAM.md

DATA_DICTIONARY.md

MIGRATION_STRATEGY.md

```

AI must never:

- Drop tables automatically
- Rename fields without approval
- Remove relationships
- Modify production schemas

---

# Emergency Database Changes

Emergency changes require:

1. Immediate fix
2. Create migration afterward
3. Update documentation
4. Record in audit history

---

# Migration Checklist

Before merging:

```
[ ] Documentation updated

[ ] SQLAlchemy models updated

[ ] Migration generated

[ ] Migration reviewed

[ ] Upgrade tested

[ ] Downgrade tested

[ ] API compatibility checked

[ ] Tests passed

[ ] No data loss

```

---

# Final Migration Principle

Database migrations are permanent historical records.

A migration should tell the story of how SentinelTwin AI evolved.

Every schema change must preserve:

```

Data Integrity

+

Security

+

Backward Compatibility

+

System Reliability

```

---

# Related Documents

- DATABASE_SCHEMA.md
- ER_DIAGRAM.md
- DATA_DICTIONARY.md
- INDEXING_STRATEGY.md
- DATA_RETENTION_POLICY.md
