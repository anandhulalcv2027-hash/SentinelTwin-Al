# SentinelTwin AI
## Entity Relationship Diagram Specification
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the Entity Relationship Model (ERM) for SentinelTwin AI.

The ER model represents:

- Database entities
- Relationships
- Ownership boundaries
- Cardinality
- Data flow dependencies

This document is the reference for:

- SQLAlchemy relationship definitions
- Database migrations
- Repository design
- API response structures

---

# Database Architecture Philosophy

SentinelTwin AI follows a tenant-centered architecture.

The highest-level ownership hierarchy is:

```

Organization

        |

        |

        +----------------+

        |                |

      Users          Employees

                         |

                         |

                      Devices

                         |

        +----------------+----------------+

        |                |                |

 Digital Twin      Telemetry        Heartbeats

                         |

                         |

                  AI Predictions

                         |

                         |

                  Threat Events

                         |

                         |

                      Alerts

```

---

# Complete ER Overview

```

┌─────────────────┐
│ Organizations   │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼

┌─────────────────┐
│ Users           │
└────────┬────────┘
         │
         │ N:M
         │
         ▼

┌─────────────────┐
│ Roles           │
└─────────────────┘


Organization

         │

         │ 1:N

         ▼


┌─────────────────┐
│ Employees       │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼

┌─────────────────┐
│ Devices         │
└────────┬────────┘
         │
         │ 1:1
         │
         ▼

┌─────────────────┐
│ Digital Twins   │
└─────────────────┘


Devices

         │

         ├───────────────┐

         │               │

         ▼               ▼


┌────────────────┐   ┌──────────────────┐
│ Live State     │   │ Telemetry        │
└────────────────┘   └──────────────────┘


Devices

         │

         │ 1:N

         ▼


┌────────────────┐
│ Heartbeats     │
└────────────────┘


Devices

         │

         │ 1:N

         ▼


┌────────────────┐
│ AI Predictions │
└───────┬────────┘
        │
        │
        ▼

┌────────────────┐
│ Threat Events  │
└───────┬────────┘
        │
        │
        ▼

┌────────────────┐
│ Alerts         │
└────────────────┘


```

---

# Entity Relationships

---

# Organization Relationships

## Organization → Users

Relationship:

```
Organization 1 ---- N Users
```

Meaning:

One organization can contain many users.

A user belongs to exactly one organization.

Database:

```
users.organization_id

references

organizations.id
```

---

## Organization → Employees

Relationship:

```
Organization 1 ---- N Employees
```

Employees are organization-owned identities.

They do not require platform accounts.

Example:

```
Employee:

John Smith

Laptop:

john-laptop

User Account:

None

```

---

## Organization → Devices

Relationship:

```
Organization 1 ---- N Devices
```

Every monitored device belongs to one organization.

This enforces tenant isolation.

---

# User and Role Relationships

## Users ↔ Roles

Relationship:

```
Users N ---- M Roles
```

Implemented using:

```
user_roles
```

Example:

A security administrator may have:

```
Organization Admin

+

Security Analyst

```

---

# Employee and Device Relationships

## Employee → Device

Relationship:

```
Employee 1 ---- N Devices
```

Reason:

An employee may have:

- Laptop
- Desktop
- Mobile device (future)

However, employee assignment is optional.

A server does not belong to an employee.

Example:

```
Employee:

Alice


Device:

Alice-Laptop

```

Server:

```
Database Server

employee_id = NULL

```

---

# Device Core Relationships

The Device entity is the center of SentinelTwin AI.

```

                 Device

                    |

     +--------------+--------------+

     |              |              |

     ▼              ▼              ▼

Digital Twin   Live State    Telemetry


```

---

# Device → Digital Twin

Relationship:

```
Device 1 ---- 1 Digital Twin
```

Rule:

Every registered device must have exactly one Digital Twin.

Reason:

The Digital Twin represents the software identity of the physical device.

---

# Device → Live State

Relationship:

```
Device 1 ---- 1 Live State
```

Purpose:

Stores current device condition.

Example:

```
CPU:

35%

Memory:

62%

Status:

ONLINE

```

Only the latest state exists.

Historical information belongs to telemetry.

---

# Device → Telemetry

Relationship:

```
Device 1 ---- N Telemetry
```

Purpose:

Stores historical observations.

Example:

```
10:00

CPU 40%


10:01

CPU 42%


10:02

CPU 45%

```

Telemetry is append-only.

---

# Device → Heartbeats

Relationship:

```
Device 1 ---- N Heartbeats
```

Purpose:

Tracks endpoint availability.

Example:

```
Device checked in:

10:30:05

Status:

ONLINE

```

---

# Device → AI Predictions

Relationship:

```
Device 1 ---- N AI Predictions
```

Reason:

A device receives many predictions over time.

Example:

```
Prediction 1:

Low Risk


Prediction 2:

Suspicious Process


Prediction 3:

High Risk

```

Predictions are historical.

---

# AI Prediction → Threat Event

Relationship:

```
AI Prediction 1 ---- 0..N Threat Events
```

Not every prediction becomes a threat.

Example:

Prediction:

```
Risk score:

35%

```

No threat generated.

---

Prediction:

```
Risk score:

95%

```

Creates threat event.

---

# Threat Event → Alert

Relationship:

```
Threat Event 1 ---- 0..N Alerts
```

Reason:

A single threat may generate:

- Dashboard alert
- Email notification
- Security ticket

(Future versions)

---

# Reports Relationships

## Organization → Reports

Relationship:

```
Organization 1 ---- N Reports
```

Reports belong to organizations.

---

## User → Reports

Relationship:

```
User 1 ---- N Reports
```

Tracks who generated reports.

---

# Audit Log Relationships

## Organization → Audit Logs

Relationship:

```
Organization 1 ---- N Audit Logs
```

Every tenant has independent audit history.

---

## User → Audit Logs

Relationship:

```
User 1 ---- N Audit Logs
```

Tracks user activity.

Example:

```
User:

Admin


Action:

Deleted Device


Time:

12:30

```

---

# Data Ownership Rules

The following ownership rules are mandatory.

---

## Organization Owns

```
Users

Employees

Devices

Reports

Alerts

Audit Logs

```

---

## Device Owns

```
Digital Twin

Live State

Telemetry

Heartbeats

AI Predictions

Threat Events

```

---

# Delete Behavior

## Organization Delete

Default:

Restricted

Reason:

Security data should not disappear accidentally.

---

## Device Delete

Recommended:

Soft delete.

Keep:

- Telemetry
- Threat history
- Audit history

---

## User Delete

Soft delete.

Preserve:

- Audit logs
- Report history

---

# Tenant Isolation Rules

Every query involving customer data MUST filter:

```
organization_id
```

Example:

Allowed:

```
SELECT *

FROM devices

WHERE organization_id = current_user.organization_id;

```

Forbidden:

```
SELECT *

FROM devices;

```

---

# Database Dependency Order

Tables should be created in this order:

```
1. organizations

2. roles

3. permissions

4. users

5. user_roles

6. employees

7. devices

8. device_credentials

9. digital_twins

10. device_live_state

11. device_telemetry

12. device_heartbeats

13. ai_predictions

14. threat_events

15. alerts

16. reports

17. audit_logs

18. refresh_tokens

```

---

# Final ER Principle

The database represents the operational reality of an organization.

The relationship chain is:

```

Organization

↓

People

↓

Assets

↓

Digital Representation

↓

Observed Behavior

↓

AI Intelligence

↓

Security Response

```

Every future database modification must preserve this logical flow.

---

# Related Documents

- DATABASE_SCHEMA.md
- DATA_DICTIONARY.md
- INDEXING_STRATEGY.md
- MIGRATION_STRATEGY.md
- DATA_RETENTION_POLICY.md
