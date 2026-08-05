# SentinelTwin AI
## API Specification
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official API contract for SentinelTwin AI.

The API provides communication between:

- Frontend Dashboard
- Backend Services
- Endpoint Agents
- Digital Twin Engine
- AI Engine
- Future Integrations

All API implementations MUST follow this specification.

---

# API Design Principles

The SentinelTwin AI API follows:

- REST architecture
- JSON communication
- Versioned endpoints
- Secure authentication
- Consistent responses
- Strong validation

---

# Base URL

Development:

```
http://localhost:8000/api/v1
```

Production:

```
https://api.sentineltwin.ai/api/v1
```

---

# API Versioning

All endpoints must include version number.

Format:

```
/api/v1/resource
```

Example:

```
/api/v1/assets
```

Future breaking changes:

```
/api/v2/assets
```

---

# HTTP Methods

Supported methods:

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create resource |
| PUT | Full update |
| PATCH | Partial update |
| DELETE | Remove resource |

---

# Content Type

All requests:

```
Content-Type: application/json
```

---

# Authentication

Most APIs require:

```
Authorization: Bearer <JWT_TOKEN>
```

Example:

```
GET /api/v1/assets

Authorization:
Bearer eyJhbGci...
```

---

# Public Endpoints

Allowed public endpoints:

```
POST /auth/login

POST /auth/refresh

POST /auth/logout

```

All other endpoints require authentication.

---

# API Response Standard

Every response follows:

```json
{
    "success": true,
    "data": {},
    "message": "Operation successful"
}
```

---

# Error Response

Standard:

```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Readable message"
    }
}
```

---

# Pagination

Large collections must support pagination.

Example:

```
GET /assets?page=1&limit=50
```

Response:

```json
{
    "success": true,
    "data": {
        "items": [],
        "page":1,
        "limit":50,
        "total":500
    }
}
```

---

# Filtering

Supported:

Example:

```
GET /assets?status=online
```

---

# Sorting

Example:

```
GET /alerts?sort=created_at_desc
```

---

# Authentication API

---

# Login

## Endpoint

```
POST /auth/login
```

Purpose:

Authenticate user.

---

Request:

```json
{
    "email":"admin@example.com",
    "password":"password"
}
```

---

Response:

```json
{
    "access_token":"jwt",
    "refresh_token":"token",
    "token_type":"bearer"
}
```

---

# Refresh Token

## Endpoint

```
POST /auth/refresh
```

Purpose:

Generate new access token.

---

Request:

```json
{
    "refresh_token":"token"
}
```

---

# Logout

## Endpoint

```
POST /auth/logout
```

Purpose:

Invalidate refresh token.

---

# Organization API

Organizations represent tenants.

---

# Create Organization

```
POST /organizations
```

Request:

```json
{
    "name":"Example Corporation"
}
```

---

# Get Organizations

```
GET /organizations
```

---

# Get Organization

```
GET /organizations/{organization_id}
```

---

# Update Organization

```
PATCH /organizations/{organization_id}
```

---

# User API

---

# Create User

```
POST /users
```

Request:

```json
{
"name":"John Smith",
"email":"john@example.com",
"role":"security_admin"
}
```

---

# List Users

```
GET /users
```

---

# Update User

```
PATCH /users/{user_id}
```

---

# Delete User

```
DELETE /users/{user_id}
```

Deletion uses soft delete.

---

# Asset API

Assets are the core monitored resources.

Supported:

```
Laptop

Desktop

Server

Firewall

```

---

# Register Asset

```
POST /assets
```

Request:

```json
{
"name":"Finance Laptop",
"type":"laptop",
"employee_id":"123"
}
```

---

Response:

```json
{
"id":"asset_uuid",
"status":"registered"
}
```

---

# List Assets

```
GET /assets
```

---

# Get Asset

```
GET /assets/{asset_id}
```

---

# Update Asset

```
PATCH /assets/{asset_id}
```

---

# Remove Asset

```
DELETE /assets/{asset_id}
```

---

# Digital Twin API

Every asset has one Digital Twin.

---

# Get Digital Twin

```
GET /assets/{asset_id}/twin
```

Response:

```json
{
"asset_id":"123",
"health":"healthy",
"risk_score":20,
"status":"online"
}
```

---

# Get Twin History

```
GET /assets/{asset_id}/twin/history
```

---

# Telemetry API

Telemetry is received from endpoint agents.

---

# Submit Telemetry

Endpoint:

```
POST /telemetry
```

Authentication:

Agent authentication required.

---

Request:

```json
{
"asset_id":"123",
"cpu":40,
"memory":65,
"network":120
}
```

---

# Get Telemetry

```
GET /assets/{asset_id}/telemetry
```

---

# Heartbeat API

Used by endpoint agents.

---

# Send Heartbeat

```
POST /agents/heartbeat
```

Request:

```json
{
"agent_id":"abc",
"timestamp":"2026-07-28T10:00:00"
}
```

---

# AI Prediction API

---

# Generate Prediction

Internal service endpoint.

```
POST /ai/predict
```

---

Input:

```json
{
"asset_id":"123",
"features":{}
}
```

---

Output:

```json
{
"risk_score":75,
"severity":"high",
"explanation":"Unusual process activity"
}
```

---

# Get AI Predictions

```
GET /ai/predictions
```

---

# Alert API

---

# Get Alerts

```
GET /alerts
```

---

# Get Alert

```
GET /alerts/{alert_id}
```

---

# Update Alert Status

```
PATCH /alerts/{alert_id}
```

Example:

```json
{
"status":"resolved"
}
```

---

# Report API

---

# Generate Report

```
POST /reports
```

---

Request:

```json
{
"type":"security_summary",
"range":"30_days"
}
```

---

# Download Report

```
GET /reports/{report_id}/download
```

---

# Audit API

---

# Get Audit Logs

```
GET /audit/logs
```

Access:

Administrator only.

---

# WebSocket API

Used for real-time updates.

Connection:

```
ws://localhost:8000/ws
```

---

# WebSocket Events

Supported events:

```
asset.status.changed

alert.created

threat.detected

telemetry.updated

```

Example:

```json
{
"type":"alert.created",
"data":{
"id":"123",
"severity":"high"
}
}
```

---

# Agent API Rules

Endpoint agents communicate through:

```
/agents/*
```

Agent APIs require:

- Agent authentication
- Encrypted communication
- Request signing

---

# Rate Limiting

API limits:

Authentication:

```
5 requests/minute
```

General API:

```
100 requests/minute
```

Agent telemetry:

Configurable.

---

# Security Requirements

Every endpoint must consider:

- Authentication
- Authorization
- Input validation
- Logging
- Rate limiting

---

# API Naming Rules

Use:

```
plural nouns
```

Correct:

```
/assets

/users

/alerts

```

Incorrect:

```
/getAsset

/createUser

```

---

# API Deprecation Policy

Deprecated endpoints:

Must:

- Remain available temporarily
- Be documented
- Provide migration path

---

# API Documentation

Generated documentation:

```
OpenAPI / Swagger

```

Available at:

```
/docs
```

---

# AI Assistant API Rules

Before creating or modifying APIs, AI must read:

```
API_SPECIFICATION.md

DATABASE_SCHEMA.md

BACKEND_GUIDELINES.md

AUTHENTICATION.md

RBAC.md

```

AI must never:

- Create undocumented endpoints
- Change response formats silently
- Remove authentication
- Break existing clients

---

# Final API Principle

The SentinelTwin AI API is a stable communication contract.

Every endpoint must be:

```
Secure

Predictable

Documented

Versioned

Maintainable

```

---

# Related Documents

- BACKEND_GUIDELINES.md
- AUTHENTICATION.md
- RBAC.md
- ENDPOINT_AGENT_PROTOCOL.md
- DATABASE_SCHEMA.md
