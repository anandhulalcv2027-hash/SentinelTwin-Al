# SentinelTwin AI
## AI Engine
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the architecture, responsibilities, workflow, and operational principles of the SentinelTwin AI Engine.

The AI Engine is responsible for analyzing telemetry collected from monitored assets and generating risk scores, predictions, anomaly detections, and threat indicators.

The AI Engine assists security analysts but never replaces human decision-making.

---

# Objectives

The AI Engine shall:

- Analyze telemetry
- Detect anomalies
- Generate risk scores
- Predict threats
- Identify suspicious behavior
- Support security analysts
- Produce explainable results
- Operate independently from the dashboard

---

# Scope

Version 1 supports:

- Anomaly Detection
- Risk Scoring
- Threat Prediction
- Telemetry Analysis
- Historical Analysis
- Alert Generation Support

Version 1 does NOT support:

- Autonomous Response
- Endpoint Isolation
- Self-Learning Models
- LLM-Based Decision Making
- Reinforcement Learning
- Automatic Firewall Rule Creation

---

# AI Design Principles

The AI Engine shall follow:

- Explainability
- Reproducibility
- Determinism
- Modularity
- Traceability
- Independence
- Human Oversight

Every prediction must be explainable.

---

# AI Architecture

```
Endpoint Agents

↓

Telemetry Collection

↓

Telemetry Pipeline

↓

Feature Engineering

↓

AI Engine

↓

Threat Detection

↓

Risk Scoring

↓

Prediction Storage

↓

Alert Generation

↓

Dashboard Notification
```

The AI Engine never communicates directly with the frontend.

---

# Responsibilities

The AI Engine shall:

- Receive telemetry
- Analyze telemetry
- Calculate features
- Detect anomalies
- Generate predictions
- Calculate risk scores
- Store predictions
- Trigger alerts
- Notify the Dashboard

---

# AI Workflow

```
Receive Telemetry

↓

Validate Telemetry

↓

Feature Engineering

↓

Anomaly Detection

↓

Threat Detection

↓

Risk Scoring

↓

Store Prediction

↓

Generate Alert

↓

Notify Dashboard
```

Predictions are stored before alerts are generated.

---

# Input Sources

Telemetry originates from:

- Laptop Agents
- Desktop Agents
- Server Agents
- Firewall Monitoring

Future:

- Routers
- Switches
- Cloud Assets
- IoT Devices

---

# Telemetry Categories

Supported telemetry:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Usage
- Process Count
- Running Processes
- Uptime
- Failed Login Attempts
- Open Ports
- Firewall Events
- Heartbeats

---

# Feature Engineering

The AI Engine converts telemetry into features.

Examples:

```
cpu_average

cpu_spike_count

memory_average

memory_spike_count

disk_growth_rate

network_spike_count

heartbeat_delay

failed_login_frequency
```

Features are calculated before prediction.

---

# Feature Categories

Supported feature groups:

- Performance Features
- Security Features
- Behavioral Features
- Historical Features
- Availability Features

---

# Explainability Requirement

Every prediction must include:

- Risk Score
- Threat Category
- Confidence Score
- Triggering Factors
- Timestamp
- Asset ID

Predictions must be explainable to analysts.

---

# Example Prediction

```json
{
  "asset_id": 42,
  "risk_score": 84,
  "threat": "Suspicious Process",
  "confidence": 0.92,
  "factors": [
    "CPU spike",
    "Unknown process",
    "Repeated network connections"
  ]
}
```

---

# AI Output Schema

Every prediction contains:

- Prediction ID
- Asset ID
- Timestamp
- Risk Score
- Confidence Score
- Threat Type
- Prediction Result
- Feature Snapshot
- Model Version

---

# Model Versioning

Every trained model must have:

- Model ID
- Version Number
- Training Date
- Dataset Version
- Feature Version

Example:

```
risk_model_v1.0.0.joblib
```

---

# Supported Models

Version 1 uses:

## Random Forest

Purpose:

Threat Classification

---

## Isolation Forest

Purpose:

Anomaly Detection

---

# Why These Models

Advantages:

- Fast
- Explainable
- Lightweight
- Easy to train
- Low resource usage
- Suitable for tabular telemetry

---

# Model Persistence

Models are stored using:

Joblib

Example:

```
models/

risk_model_v1.joblib

anomaly_model_v1.joblib
```

---

# Prediction Storage

Predictions are stored permanently.

Predictions are historical records.

Predictions must never overwrite previous predictions.

Historical predictions support:

- Reporting
- Analytics
- Risk Trends
- Model Evaluation

---

# Confidence Scores

Every prediction contains:

```
0.00

↓

1.00
```

Example:

```
0.94
```

Confidence indicates prediction certainty.

Confidence does NOT represent risk.

---

# Human Oversight

The AI Engine:

May:

- Recommend actions
- Generate alerts
- Increase risk scores

May NOT:

- Delete assets
- Modify data
- Change roles
- Isolate endpoints
- Execute commands

Human approval is always required.

---

# Training Pipeline

```
Dataset

↓

Cleaning

↓

Feature Engineering

↓

Training

↓

Validation

↓

Evaluation

↓

Export Model

↓

Production
```

---

# Retraining

Version 1 retraining is:

Manual

Future versions may support:

- Scheduled retraining
- Automated retraining
- Continuous learning

---

# Performance Requirements

Prediction latency:

Target:

< 500 milliseconds

Maximum:

< 2 seconds

---

# Error Handling

If AI prediction fails:

```
Log Error

↓

Store Failure Event

↓

Continue Platform Operation
```

AI failures must never crash the platform.

---

# Logging

The AI Engine logs:

- Prediction Generated
- Prediction Failure
- Model Loaded
- Model Version
- Training Completed
- Retraining Completed

---

# Security Principles

AI shall:

- Never modify production data
- Never execute remote commands
- Never access unauthorized assets
- Never bypass RBAC
- Never expose secrets

---

# Future Enhancements

Future versions may support:

- UEBA
- Deep Learning
- Graph Neural Networks
- Threat Intelligence Feeds
- LLM Explanations
- SOAR Integration
- Automated Containment
- Federated Learning

---

# Related Documents

- THREAT_DETECTION.md
- RISK_SCORING.md
- AI_ENGINEERING_RULES.md
- THREAT_MODEL.md
- DIGITAL_TWIN_ENGINE.md
- TELEMETRY_PIPELINE.md

---

# Final Principle

The SentinelTwin AI Engine exists to assist human defenders through explainable intelligence.

It continuously analyzes telemetry, detects anomalies, calculates risk, and identifies threats while remaining transparent, reproducible, secure, and under human control at all times.