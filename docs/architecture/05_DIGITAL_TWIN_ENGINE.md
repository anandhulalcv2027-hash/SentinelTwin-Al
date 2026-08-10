# SentinelTwin AI
## Digital Twin Engine Architecture
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

The Digital Twin Engine is the core subsystem of SentinelTwin AI.

It is responsible for creating, maintaining, and synchronizing a software representation (Digital Twin) of every monitored asset in real time.

The Digital Twin provides a continuously updated view of an asset's identity, health, telemetry, security posture, and AI-driven risk assessment.

Every monitored asset shall have exactly one Digital Twin.

---

# Objectives

The Digital Twin Engine shall provide:

- Real-time asset representation
- Continuous synchronization
- Health monitoring
- Historical awareness
- AI integration
- Threat visibility
- Dashboard visualization
- Event publishing

---

# What is a Digital Twin?

A Digital Twin is not merely a database record.

A Digital Twin is a continuously synchronized software model of a physical asset.

It combines:

- Static Information
- Live Operational State
- Historical Telemetry
- Health Metrics
- Security Information
- AI Risk Analysis
- Threat History

into one logical representation.

---

# Digital Twin Lifecycle

```
Asset Registered
        │
        ▼
Twin Created
        │
        ▼
Telemetry Received
        │
        ▼
Twin Updated
        │
        ▼
AI Analysis
        │
        ▼
Dashboard Synchronization
        │
        ▼
Continuous Monitoring
        │
        ▼
Asset Retired
        │
        ▼
Twin Archived
```

---

# Twin Creation

A Digital Twin is automatically created when an asset is successfully registered.

Creation includes:

- Unique Twin ID
- Asset Association
- Organization Association
- Initial Metadata
- Initial Health Status
- Initial Live State

No manual creation shall exist.

---

# Twin Identity

Every Twin contains:

- Twin ID
- Asset ID
- Organization ID
- Asset Type
- Hostname
- Operating System
- Agent Version
- Registration Date

Identity information rarely changes.

---

# Twin Components

Each Digital Twin consists of six logical components.

## 1. Static Metadata

Contains information that changes infrequently.

Examples:

- Hostname
- Operating System
- CPU Model
- RAM Capacity
- Disk Capacity
- MAC Address
- Serial Number
- Organization
- Department
- Assigned Employee

Static metadata shall never be overwritten by telemetry.

---

## 2. Live State

Represents the current condition of the asset.

Examples:

- Online Status
- Current CPU Usage
- Current RAM Usage
- Current Disk Usage
- Current Network Activity
- Logged-in User
- Active Processes
- Last Heartbeat

The Live State always reflects the latest telemetry.

---

## 3. Historical Metrics

Historical information is stored separately.

Examples:

- CPU History
- Memory History
- Network History
- Process History
- Login History

Historical records are append-only.

No historical information shall be deleted except through retention policies.

---

## 4. Health Status

Health is calculated using operational metrics.

Health Categories:

- Excellent
- Good
- Warning
- Critical
- Offline

Health considers:

- CPU
- Memory
- Disk
- Connectivity
- Heartbeat
- Service Status

---

## 5. AI Risk Assessment

The AI Engine continuously evaluates every Twin.

Information stored:

- Risk Score
- Confidence Score
- Predicted Threat
- Detected Anomalies
- Recommendation

Risk Levels:

- Low
- Medium
- High
- Critical

The AI Engine updates this component.

---

## 6. Threat History

Stores security events associated with the Twin.

Examples:

- Malware Detection
- Unauthorized Login
- Firewall Disabled
- Suspicious Process
- Network Anomaly

Threat history is immutable.

---

# Twin Synchronization

Synchronization begins whenever telemetry arrives.

```
Telemetry
     │
     ▼
Validation
     │
     ▼
Locate Twin
     │
     ▼
Update Live State
     │
     ▼
Recalculate Health
     │
     ▼
AI Analysis
     │
     ▼
Publish Event
```

Synchronization must complete atomically.

---

# Synchronization Frequency

Default intervals:

Heartbeat

30 seconds

Telemetry

10 seconds

Health Calculation

Every telemetry update

Risk Score

Every AI prediction

Threat Events

Immediately

Dashboard Updates

Real Time

---

# Health Calculation

Health Score is calculated from several indicators.

Factors include:

- CPU Utilization
- Memory Usage
- Disk Usage
- Network Availability
- Heartbeat Status
- Running Services
- Agent Status

The Health Engine produces:

```
Health Percentage

↓

Health Category

↓

Dashboard Status
```

---

# State Transition Model

```
Registered

↓

Online

↓

Monitoring

↓

Warning

↓

Critical

↓

Offline

↓

Recovered
```

Transitions occur automatically.

---

# Event Model

Every Twin generates events.

Examples:

- Twin Created
- Twin Updated
- Heartbeat Received
- Health Changed
- Risk Changed
- Alert Generated
- Asset Offline
- Asset Online

Events are published to the Event Bus.

---

# Dashboard Synchronization

Whenever a Twin changes:

```
Twin Updated

↓

Event Published

↓

WebSocket Broadcast

↓

Dashboard Refresh
```

No dashboard polling is required.

---

# AI Integration

The Digital Twin provides the AI Engine with:

- Current Metrics
- Historical Metrics
- Asset Metadata
- Health Status

The AI Engine returns:

- Risk Score
- Prediction
- Confidence
- Threat Classification

The Twin stores AI output but never performs AI inference itself.

---

# Alert Integration

When AI detects abnormal behavior:

```
AI Prediction

↓

Alert Engine

↓

Alert Created

↓

Twin Updated

↓

Dashboard Notification
```

---

# Twin Relationships

A Digital Twin relates to:

- One Asset
- One Organization
- Many Telemetry Records
- Many Alerts
- Many Threats
- Many Audit Logs
- One Live State

---

# Fault Tolerance

If telemetry stops arriving:

1. Continue displaying the last known state.
2. Mark heartbeat as stale.
3. Transition health to Warning.
4. Transition to Offline after timeout.
5. Generate an alert if configured.

---

# Performance Considerations

The Digital Twin Engine shall:

- Minimize database writes.
- Cache frequently accessed state.
- Update only changed values.
- Support asynchronous processing.
- Scale independently.

---

# Security Considerations

The Twin Engine shall:

- Trust only authenticated telemetry.
- Validate all incoming data.
- Never expose sensitive information.
- Maintain complete audit logs.
- Respect organization boundaries.

Cross-organization access is prohibited.

---

# Scalability

The architecture supports future asset types without redesign.

Future assets:

- Router
- Switch
- Cloud VM
- Kubernetes Node
- Container
- Mobile Device
- IoT Device

The Twin model remains identical.

---

# Future Enhancements

Future versions may include:

- Predictive Maintenance
- Configuration Drift Detection
- Digital Twin Snapshots
- Historical Replay
- Simulation Mode
- Autonomous Response
- Dependency Mapping

These enhancements shall extend, not replace, the existing Twin architecture.

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 04_DATA_FLOW.md
- 06_TELEMETRY_PIPELINE.md
- DATABASE_SCHEMA.md
- AI_ENGINE.md
- SOC_DASHBOARD.md

---

# Final Principle

The Digital Twin Engine is the authoritative representation of every monitored asset within SentinelTwin AI.

All operational monitoring, AI analysis, dashboard visualization, alerting, and reporting shall derive from the Digital Twin to ensure consistency, traceability, and real-time situational awareness.