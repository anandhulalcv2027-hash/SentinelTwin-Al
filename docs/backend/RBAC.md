# SentinelTwin AI
## Role-Based Access Control (RBAC)
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official Role-Based Access Control architecture for SentinelTwin AI.

RBAC controls:

- User permissions
- Organization isolation
- Resource access
- Administrative actions
- Security operations

Every authorization decision MUST follow this document.

---

# RBAC Philosophy

SentinelTwin AI follows the principle:

> Users should receive the minimum permissions required to perform their responsibilities.

This follows:

```
Principle of Least Privilege

```

---

# Authorization Model

SentinelTwin AI uses:

```
Role-Based Access Control

+

Organization-Level Isolation

+

Resource-Level Permissions

```

Architecture:

```
User

↓

Role

↓

Permissions

↓

Resources

↓

Actions

```

---

# Multi-Tenant Security Model

SentinelTwin AI supports multiple organizations.

Every user belongs to an organization.

Example:

```
Organization A

    User 1

    User 2


Organization B

    User 3

    User 4

```

Users must never access resources belonging to another organization.

---

# Organization Isolation Rule

Every database query involving tenant resources MUST include:

```
organization_id

```

Example:

Allowed:

```sql
SELECT *
FROM assets
WHERE organization_id = current_user.organization_id;
```

Forbidden:

```sql
SELECT *
FROM assets;
```

---

# RBAC Components

The RBAC system contains:

```
Users

Roles

Permissions

Role Assignments

Permission Rules

```

---

# User

A user represents an authenticated identity.

Example:

```
John Smith

Security Analyst

Organization A

```

---

# Role

A role represents a collection of permissions.

Examples:

```
System Administrator

Organization Administrator

Security Analyst

Employee

Endpoint Agent

```

---

# Permission

A permission defines a specific allowed action.

Format:

```
resource.action

```

Examples:

```
asset.read

asset.create

asset.delete

alert.resolve

report.generate

```

---

# Default Roles

Version 1 defines the following roles.

---

# 1. System Administrator

Purpose:

Platform-level management.

Scope:

Entire SentinelTwin AI platform.

Permissions:

```
*

```

Can:

- Manage organizations
- Manage users
- Configure platform
- View all security data

---

# 2. Organization Administrator

Purpose:

Manage a single organization.

Scope:

Organization only.

Permissions:

```
organization.manage

user.manage

asset.manage

report.manage

```

Can:

- Create users
- Assign roles
- Register assets
- View organization reports

Cannot:

- Access other organizations

---

# 3. Security Analyst

Purpose:

SOC operations.

Permissions:

```
asset.read

telemetry.read

alert.read

alert.update

threat.read

report.read

```

Can:

- Monitor assets
- Investigate threats
- Update alerts

Cannot:

- Delete assets
- Manage users

---

# 4. Employee

Purpose:

Basic user access.

Permissions:

```
profile.read

profile.update

assigned_asset.read

```

Can:

- View own information
- View assigned devices

Cannot:

- Access SOC features

---

# 5. Endpoint Agent

Purpose:

Machine identity.

Permissions:

```
telemetry.submit

heartbeat.submit

status.update

```

Cannot:

- Access user APIs
- Access dashboard APIs

---

# Permission Naming Convention

Permissions follow:

```
resource.action

```

Examples:

```
user.create

user.read

user.update

user.delete


asset.create

asset.read

asset.update

asset.delete


alert.read

alert.resolve

```

---

# Permission Categories

## User Permissions

```
user.create

user.read

user.update

user.delete

```

---

## Asset Permissions

```
asset.create

asset.read

asset.update

asset.delete

```

---

## Telemetry Permissions

```
telemetry.read

telemetry.export

telemetry.submit

```

---

## Threat Permissions

```
threat.read

threat.investigate

```

---

## Alert Permissions

```
alert.read

alert.update

alert.resolve

```

---

## Report Permissions

```
report.create

report.read

report.export

```

---

# Role Assignment

A user may have:

```
One primary role

+

Future additional roles

```

Example:

```
John Smith

Role:

Security Analyst

```

---

# Permission Evaluation Flow

Every protected request follows:

```
API Request

↓

Authentication Middleware

↓

Identify User

↓

Load Role

↓

Check Permission

↓

Check Organization

↓

Allow / Deny

```

---

# Authorization Middleware

Protected routes should use:

```
Permission Dependency

```

Example:

```
GET /assets

Requires:

asset.read

```

---

# Access Decision Rules

Allow request when:

```
Valid Token

+

Active User

+

Correct Organization

+

Required Permission

```

---

Deny request when:

```
Invalid Token

OR

Missing Permission

OR

Wrong Organization

```

---

# Resource-Level Access

Future versions may support:

```
Role Permission

+

Specific Resource Rules

```

Example:

A security analyst can view:

```
Department A assets

```

but not:

```
Department B assets

```

---

# Asset Ownership Rules

Assets belong to:

```
Organization

```

Optional future:

```
Department

Employee

Location

```

---

# Sensitive Operations

The following require elevated permissions:

- Delete asset
- Delete user
- Modify roles
- Export security data
- Change security configuration

---

# Role Management Rules

Only authorized administrators may:

- Create roles
- Modify permissions
- Assign roles

Every role change must create:

```
Audit Event

```

---

# Audit Requirements

RBAC events must be logged.

Examples:

Role assigned:

```
ROLE_ASSIGNED

```

Permission changed:

```
PERMISSION_UPDATED

```

Access denied:

```
ACCESS_DENIED

```

---

# API Security Rules

Every protected endpoint must define:

Required role:

or

Required permission:

Example:

```
GET /alerts

Permission:

alert.read

```

---

# Database RBAC Model

Recommended tables:

```
users

roles

permissions

user_roles

role_permissions

```

---

# Example Relationship

```
User

↓

user_roles

↓

Role

↓

role_permissions

↓

Permission

```

---

# Forbidden Practices

Never:

- Hardcode permissions inside controllers
- Check roles manually everywhere
- Give admin privileges by default
- Skip organization validation

---

# AI Assistant RBAC Rules

Before modifying authorization logic, AI must read:

```
RBAC.md

AUTHENTICATION.md

DATABASE_SCHEMA.md

API_SPECIFICATION.md

```

AI must never:

- Create unsecured endpoints
- Bypass permission checks
- Add administrator privileges automatically
- Remove tenant isolation

---

# Testing Requirements

RBAC requires:

## Unit Tests

Test:

- Permission checking
- Role loading
- Access decisions

---

## Integration Tests

Test:

- User access
- Organization isolation
- Forbidden actions

---

## Security Tests

Test:

- Privilege escalation
- Cross-organization access
- Token misuse

---

# Future RBAC Enhancements

Possible future features:

- Attribute-Based Access Control
- Custom organization roles
- Temporary permissions
- Approval workflows
- Privileged access management

---

# Final RBAC Principle

RBAC ensures:

```
The right person

gets

the right access

to

the right resources

at

the right time

```

Security is enforced by default.

---

# Related Documents

- AUTHENTICATION.md
- SECURITY_MODEL.md
- API_SPECIFICATION.md
- DATABASE_SCHEMA.md
- AUDIT_LOGGING.md
