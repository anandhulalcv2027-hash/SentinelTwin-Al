# SentinelTwin AI
## Authentication Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official authentication architecture for SentinelTwin AI.

It establishes rules for:

- User authentication
- Token management
- Password security
- Session management
- Agent authentication
- Authentication middleware
- Security requirements

Every authentication-related implementation MUST follow this document.

---

# Authentication Philosophy

SentinelTwin AI follows a:

```
Zero Trust Authentication Model
```

Every request must be:

- Authenticated
- Verified
- Authorized
- Logged

No internal component should automatically trust another component.

---

# Authentication Components

The authentication system consists of:

```
User

↓

Authentication Service

↓

JWT Token Service

↓

Authorization Middleware

↓

Protected Resources

```

---

# Supported Authentication Methods

Version 1 supports:

## User Authentication

Used by:

- Administrators
- Security Analysts
- Employees


Method:

```
Email + Password

+

JWT Authentication

```

---

## Endpoint Agent Authentication

Used by:

- Endpoint Agents
- Server Agents
- Security Connectors


Method:

```
Agent Identity

+

Secure Token

+

Cryptographic Verification

```

---

# Authentication Technology Stack

The system uses:

JWT:

```
JSON Web Tokens
```

Password Hashing:

```
Passlib

bcrypt

```

Token Storage:

```
PostgreSQL

+

Redis Cache

```

---

# User Authentication Flow

The standard login flow:

```
User

↓

Login Request

↓

Authentication Service

↓

Validate Credentials

↓

Generate Tokens

↓

Return Access Token

↓

User Accesses APIs

```

---

# Login Process

Endpoint:

```
POST /api/v1/auth/login
```

Request:

```json
{
    "email":"admin@example.com",
    "password":"password"
}
```

---

Processing:

```
Receive credentials

↓

Find user

↓

Verify password hash

↓

Check account status

↓

Generate tokens

↓

Create audit event

↓

Return response

```

---

# Password Security

Passwords must NEVER be stored directly.

Forbidden:

```
password = "admin123"
```

---

Required:

```
Plain Password

↓

bcrypt Hash

↓

Database Storage

```

Example:

Database stores:

```
$2b$12$xxxxxxxxxxxx

```

Not:

```
admin123

```

---

# Password Requirements

Minimum:

```
8 characters
```

Recommended:

```
12+ characters
```

Should contain:

- Uppercase characters
- Lowercase characters
- Numbers
- Special characters

---

# JWT Architecture

SentinelTwin AI uses:

```
Access Token

+

Refresh Token

```

---

# Access Token

Purpose:

Short-term API access.

Contains:

```
User ID

Organization ID

Role

Expiration Time

Token ID

```

Lifetime:

Recommended:

```
15 minutes

```

---

# Refresh Token

Purpose:

Generate new access tokens.

Lifetime:

Recommended:

```
7-30 days

```

Stored securely.

---

# Token Flow

```
Login

↓

Access Token

+

Refresh Token

↓

Access Token expires

↓

Refresh Token submitted

↓

New Access Token generated

```

---

# JWT Payload Example

```json
{
    "sub":"user_uuid",
    "organization_id":"org_uuid",
    "role":"security_admin",
    "exp":1720000000
}
```

---

# Token Security Rules

Tokens must:

- Have expiration time
- Be signed securely
- Be validated on every request
- Be rotated when required


Never:

- Store JWT secrets in code
- Share tokens
- Log tokens

---

# Refresh Token Security

Refresh tokens must:

- Be stored hashed
- Support revocation
- Have expiration dates
- Be linked to users

Database:

```
refresh_tokens

id

user_id

token_hash

expires_at

created_at

revoked

```

---

# Logout Flow

Endpoint:

```
POST /api/v1/auth/logout
```

Process:

```
Receive refresh token

↓

Invalidate token

↓

Create audit log

↓

Complete logout

```

---

# Account Status

Every user has a status.

Example:

```
ACTIVE

INACTIVE

LOCKED

SUSPENDED

DELETED

```

Only:

```
ACTIVE

```

users may authenticate.

---

# Failed Login Protection

The system must protect against brute force attacks.

Rules:

Track:

- Failed attempts
- Last attempt time
- Account status


Example:

```
5 failed attempts

↓

Temporary lock

```

---

# Multi-Tenant Authentication

SentinelTwin AI is multi-tenant.

Every authenticated user belongs to:

```
Organization

```

Example:

```
User

↓

Organization A

↓

Assets belonging to A

```

A user must never access another organization's data.

---

# Authentication Middleware

Every protected API request follows:

```
HTTP Request

↓

JWT Middleware

↓

Validate Token

↓

Extract Identity

↓

Check Permissions

↓

Allow Request

```

---

# Dependency Injection

FastAPI authentication should use:

```
Depends()

```

Example:

```
Protected Endpoint

↓

Current User Dependency

↓

Permission Check

↓

Business Logic

```

---

# Agent Authentication

Endpoint agents are different from users.

Agents require:

```
Agent Identity

+

Secure Credential

```

---

# Agent Registration Flow

```
Administrator creates asset

↓

Agent registration token generated

↓

Agent installs

↓

Agent authenticates

↓

Agent receives identity

↓

Telemetry begins

```

---

# Agent Credentials

Each agent has:

```
Agent ID

Secret

Certificate/Key

Status

Last Seen

```

---

# Agent Security Rules

Agents must:

- Authenticate every connection
- Encrypt communication
- Rotate credentials when required
- Support revocation

---

# Authentication Events

The system must log:

Successful login:

```
USER_LOGIN_SUCCESS

```

Failed login:

```
USER_LOGIN_FAILED

```

Logout:

```
USER_LOGOUT

```

Token refresh:

```
TOKEN_REFRESH

```

Agent authentication:

```
AGENT_AUTH_SUCCESS

```

---

# Audit Integration

Authentication events are stored in:

```
audit_logs

```

Required fields:

```
User

Organization

Action

Timestamp

IP Address

Result

```

---

# Security Headers

Authentication-related responses should include:

```
Secure Headers

HTTPS Only

No Sensitive Cache

```

---

# Session Management

The system must support:

- Multiple sessions
- Session revocation
- Device tracking

Future:

```
Active Sessions Dashboard

```

---

# Authentication Errors

Never expose:

Wrong:

```
Email exists but password incorrect

```

Correct:

```
Invalid credentials

```

---

# API Authentication Rules

Public:

```
/auth/login

/auth/refresh

```

Protected:

```
Everything else

```

Unless explicitly documented.

---

# AI Assistant Rules

Before modifying authentication code, AI must read:

```
AUTHENTICATION.md

RBAC.md

API_SPECIFICATION.md

SECURITY_MODEL.md

```

AI must never:

- Remove authentication checks
- Store plaintext passwords
- Disable token validation
- Create unsecured endpoints

---

# Testing Requirements

Authentication requires:

## Unit Tests

Test:

- Password hashing
- Token generation
- Token validation

---

## Integration Tests

Test:

- Login
- Logout
- Refresh flow

---

## Security Tests

Test:

- Expired tokens
- Invalid tokens
- Brute force protection
- Unauthorized access

---

# Final Authentication Principle

Authentication is the first security boundary of SentinelTwin AI.

The system must always ensure:

```
Correct Identity

+

Secure Verification

+

Controlled Access

+

Complete Audit Trail

```

---

# Related Documents

- RBAC.md
- SECURITY_MODEL.md
- API_SPECIFICATION.md
- AUDIT_LOGGING.md
- ENDPOINT_AGENT_PROTOCOL.md
