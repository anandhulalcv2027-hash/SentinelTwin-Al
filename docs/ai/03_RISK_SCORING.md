# SentinelTwin AI
## Risk Scoring
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the Risk Scoring framework used by SentinelTwin AI.

The Risk Scoring Engine converts telemetry, AI predictions, detected threats, historical behavior, and asset health into a single numerical score representing the current cybersecurity risk of an asset.

Risk scores provide security analysts with a simple, consistent, and explainable way to prioritize investigations.

---

# Objectives

The Risk Scoring Engine shall:

- Quantify asset risk
- Prioritize threats
- Support SOC analysts
- Assist AI predictions
- Track historical trends
- Trigger alerts
- Improve decision making

---

# Scope

Version 1 calculates risk using:

- System Telemetry
- AI Predictions
- Threat Severity
- Asset Health
- Historical Behavior

Version 1 does NOT include:

- Threat Intelligence Feeds
- CVSS Integration
- Vulnerability Scanners
- External Reputation Services
- Zero Trust Scores

---

# Risk Score Overview

Every monitored asset has one current risk score.

Range

```
0 – 100
```

Higher values indicate greater cybersecurity risk.

---

# Risk Levels

| Score | Level | Status |
|--------|-------|--------|
| 0–20 | Very Low | Healthy |
| 21–40 | Low | Stable |
| 41–60 | Medium | Monitor |
| 61–80 | High | Investigate |
| 81–100 | Critical | Immediate Action |

---

# Risk Calculation Workflow

```
Telemetry

↓

Feature Engineering

↓

AI Prediction

↓

Threat Detection

↓

Risk Calculation

↓

Risk Storage

↓

Dashboard Update

↓

Alert Evaluation
```

---

# Risk Components

The final score combines multiple components.

| Component | Contribution |
|------------|-------------:|
| System Health | 20% |
| AI Prediction | 30% |
| Threat Severity | 30% |
| Historical Behavior | 10% |
| Heartbeat Status | 10% |

Total

```
100%
```

---

# System Health

Health metrics include:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Utilization
- Process Stability

Example

```
Healthy

↓

Low Risk Contribution
```

```
Resource Exhaustion

↓

Higher Risk Contribution
```

---

# AI Prediction Contribution

The AI Engine provides:

- Threat Probability
- Confidence Score
- Predicted Threat Category

Example

```
Confidence

95%

↓

Higher Influence
```

Low-confidence predictions have less influence.

---

# Threat Severity Contribution

Threats increase risk according to severity.

| Severity | Risk Increase |
|-----------|--------------:|
| Informational | +2 |
| Low | +5 |
| Medium | +15 |
| High | +30 |
| Critical | +45 |

Multiple threats may increase the score further.

---

# Historical Behavior

Historical analysis considers:

- Previous threats
- Risk trends
- Telemetry stability
- Asset reliability

Assets with recurring issues receive higher scores.

---

# Heartbeat Status

Heartbeat monitoring affects risk.

Examples

Normal heartbeat

```
↓

No Risk Increase
```

Heartbeat delay

```
↓

Medium Increase
```

Heartbeat missing

```
↓

High Increase
```

---

# Example Calculation

```
System Health

18

+

AI Prediction

25

+

Threat Severity

30

+

Historical Behavior

8

+

Heartbeat

10

=

91
```

Final Score

```
91

↓

Critical Risk
```

---

# Score Update Triggers

Risk is recalculated when:

- New telemetry arrives
- Threat detected
- AI prediction changes
- Heartbeat changes
- Asset status changes

---

# Risk Decay

Risk should decrease gradually after an incident.

Example

```
Day 1

85

↓

Day 2

80

↓

Day 3

75

↓

Healthy

↓

40
```

Risk does not immediately return to zero.

---

# Risk History

Historical scores are retained.

Used for:

- Reporting
- Trend Analysis
- Dashboard Graphs
- AI Evaluation

Historical records are append-only.

---

# Dashboard Integration

Each asset displays:

- Current Risk Score
- Risk Level
- Risk Trend
- Last Updated
- Active Threat Count

Example

```
Laptop-023

Risk

78

High

▲ Increasing
```

---

# Digital Twin Integration

The Digital Twin reflects the current risk.

| Risk Level | Visualization |
|-------------|---------------|
| Very Low | Green |
| Low | Light Green |
| Medium | Yellow |
| High | Orange |
| Critical | Red |

Animated effects may indicate increasing risk.

---

# Alert Thresholds

Alerts are generated automatically.

| Score | Action |
|--------|--------|
| 0–40 | No Alert |
| 41–60 | Warning |
| 61–80 | High Alert |
| 81–100 | Critical Alert |

---

# Recommended Actions

Low

- Continue monitoring

Medium

- Review telemetry

High

- Investigate asset

Critical

- Immediate administrator response

Future versions may support automated containment.

---

# Risk Persistence

The current risk score is stored in the asset's Live State.

Historical risk values are stored separately.

Current score:

```
latest_risk_score
```

History:

```
risk_score_history
```

---

# Explainability

Every score must include:

- Component breakdown
- Triggering threats
- AI confidence
- Timestamp
- Asset ID
- Model Version

Analysts must understand why a score was assigned.

---

# Performance Requirements

Risk calculation latency:

Target

```
< 500 ms
```

Maximum

```
< 2 seconds
```

---

# Error Handling

If scoring fails:

```
Log Error

↓

Retain Previous Score

↓

Notify Monitoring Service
```

Risk calculation failures must never interrupt platform operation.

---

# Logging

The system logs:

- Score Calculated
- Score Updated
- Threshold Crossed
- Alert Generated
- Calculation Failure

---

# Future Enhancements

Future versions may include:

- CVSS Integration
- Vulnerability Risk
- Threat Intelligence
- Asset Criticality Weighting
- Business Impact Analysis
- Zero Trust Scoring
- Predictive Risk Forecasting

---

# Related Documents

- AI_ENGINE.md
- THREAT_DETECTION.md
- DIGITAL_TWIN_ENGINE.md
- THREAT_MODEL.md
- SECURITY_MODEL.md
- SOC_DASHBOARD.md

---

# Final Principle

Risk scoring provides a unified and explainable measure of an asset's cybersecurity posture.

By combining telemetry, AI predictions, historical behavior, heartbeat monitoring, and detected threats, SentinelTwin AI enables analysts to quickly identify high-risk assets, prioritize investigations, and monitor organizational security in real time.

The Risk Score is the primary indicator of asset health throughout the SentinelTwin AI platform and serves as the foundation for alerts, Digital Twin visualization, reporting, and security decision-making.