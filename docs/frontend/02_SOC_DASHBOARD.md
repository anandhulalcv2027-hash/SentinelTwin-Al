# SentinelTwin AI
## Security Operations Center (SOC) Dashboard
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

The Security Operations Center (SOC) Dashboard is the primary operational interface of SentinelTwin AI.

It provides security analysts and administrators with a centralized, real-time view of organizational assets, system health, security events, Digital Twin status, AI predictions, and operational metrics.

The dashboard shall prioritize visibility, situational awareness, and rapid incident response.

---

# Dashboard Objectives

The dashboard shall enable users to:

- Monitor organizational security posture
- Observe asset health in real time
- Detect abnormal activity
- View AI-generated risk scores
- Respond to alerts quickly
- Analyze historical trends
- Navigate efficiently to detailed asset information

---

# Dashboard Principles

The dashboard shall be:

- Real-time
- Data-driven
- Modular
- Responsive
- Interactive
- Minimalistic
- High-performance

Information should be immediately understandable without excessive navigation.

---

# Primary Layout

```
+--------------------------------------------------------------------+
| Header                                                             |
+--------------------------------------------------------------------+
| Sidebar | Dashboard Toolbar                                        |
|         +----------------------------------------------------------+
|         | KPI Cards                                                 |
|         +----------------------------------------------------------+
|         | Health + Threat Charts                                   |
|         +----------------------------------------------------------+
|         | Digital Twin Summary | Live Activity Feed                |
|         +----------------------------------------------------------+
|         | Assets Table                                              |
|         +----------------------------------------------------------+
|         | Recent Alerts                                             |
+--------------------------------------------------------------------+
```

---

# Dashboard Sections

The dashboard consists of the following major sections:

1. KPI Summary
2. Organization Health
3. Asset Overview
4. AI Risk Overview
5. Digital Twin Summary
6. Threat Monitoring
7. Alert Feed
8. Live Activity Feed
9. Resource Utilization
10. Historical Trends

---

# Dashboard Toolbar

The toolbar provides quick access to dashboard controls.

Features:

- Organization Selector
- Time Range Filter
- Refresh Dashboard
- Export Dashboard
- Search Assets
- Notification Center

---

# KPI Summary Cards

Displayed at the top of the dashboard.

Cards include:

- Total Organizations
- Total Assets
- Online Assets
- Offline Assets
- Active Alerts
- Critical Threats
- Average Risk Score
- AI Predictions Today

Each card displays:

- Icon
- Current Value
- Percentage Change
- Trend Indicator

---

# Organization Health Overview

Displays the overall operational status of the organization.

Metrics:

- Healthy Assets
- Warning Assets
- Critical Assets
- Offline Assets

Visualization:

- Donut Chart
- Progress Indicators

---

# Asset Overview

Displays statistics grouped by asset type.

Supported asset types:

- Laptop
- Desktop
- Server
- Firewall

Each asset type displays:

- Total Count
- Online Count
- Offline Count
- Average Health
- Average Risk Score

Visualization:

Bar Chart

---

# Digital Twin Summary

Displays Digital Twin synchronization status.

Metrics:

- Total Twins
- Synced Twins
- Pending Synchronization
- Failed Synchronization

Visualization:

Status Cards

---

# AI Risk Overview

Displays AI-generated security predictions.

Metrics:

- Average Risk Score
- High Risk Assets
- Medium Risk Assets
- Low Risk Assets

Visualization:

Gauge Chart

Trend Line

---

# Threat Overview

Displays detected threats.

Threat Categories:

- Malware
- Ransomware
- Unauthorized Access
- Suspicious Process
- High CPU Usage
- Data Exfiltration
- Firewall Events

Visualization:

Pie Chart

---

# Alert Feed

Displays recent security alerts.

Each alert contains:

- Timestamp
- Severity
- Asset Name
- Threat Type
- Description
- Status

Severity Levels:

- Critical
- High
- Medium
- Low
- Informational

Alerts shall be color-coded.

---

# Live Activity Feed

Displays real-time events.

Examples:

```
Laptop-12 connected

↓

CPU Usage Increased

↓

AI Risk Updated

↓

Threat Detected

↓

Alert Generated
```

Newest events appear at the top.

---

# Resource Utilization

Displays system metrics.

Metrics:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Usage

Visualization:

Line Charts

Area Charts

---

# Historical Trends

Shows historical security information.

Metrics:

- Alerts per Day
- Threats per Week
- Risk Score Trend
- Asset Availability

Visualization:

Line Charts

---

# Recent Assets

Displays recently registered assets.

Columns:

- Asset Name
- Asset Type
- Operating System
- Status
- Health
- Risk Score
- Last Seen

Actions:

- View
- Edit
- Open Digital Twin

---

# Asset Health Indicators

Health states:

🟢 Healthy

🟡 Warning

🟠 Degraded

🔴 Critical

⚫ Offline

Health calculation is provided by the AI Engine.

---

# Risk Indicators

Risk Levels:

Low

0–30

Medium

31–60

High

61–80

Critical

81–100

Risk values shall be displayed numerically and visually.

---

# Dashboard Widgets

Supported widgets:

- KPI Card
- Status Card
- Chart
- Data Table
- Alert Feed
- Timeline
- Activity Feed
- Gauge
- Heatmap (Future)

Widgets shall remain independent and reusable.

---

# Filtering

Dashboard supports filtering by:

- Organization
- Asset Type
- Department
- Risk Level
- Status
- Date Range

Filters update all widgets simultaneously.

---

# Search

Global dashboard search supports:

- Asset Name
- Hostname
- Employee
- IP Address
- Alert ID

---

# Auto Refresh

Dashboard updates automatically.

Intervals:

- Live Feed: Real-time (WebSocket)
- KPI Cards: Every 30 seconds
- Charts: Every 60 seconds

Manual refresh is also supported.

---

# WebSocket Integration

The following components update via WebSocket:

- Live Activity Feed
- Alert Feed
- Asset Status
- Digital Twin Status
- Risk Score
- Notifications

---

# Notification Center

Notifications include:

- New Alerts
- AI Predictions
- Device Offline
- Device Online
- Failed Agent
- Organization Events

Unread notifications display a badge.

---

# Empty States

If no data exists, widgets display informative placeholders.

Example:

```
No Active Threats

Your infrastructure is currently secure.
```

Blank widgets are prohibited.

---

# Error States

Widgets display meaningful error messages.

Example:

```
Unable to load threat statistics.

Retry
```

---

# Performance Requirements

Dashboard shall:

- Load within 3 seconds
- Use lazy loading
- Cache API responses
- Avoid unnecessary re-renders
- Efficiently process WebSocket updates

---

# Accessibility

Dashboard supports:

- Keyboard navigation
- Screen readers
- High contrast
- Focus indicators
- ARIA labels

---

# Future Enhancements

Planned features:

- Custom Dashboard Layouts
- Drag-and-Drop Widgets
- Saved Dashboard Views
- Multi-Monitor Mode
- Interactive Threat Heatmaps
- Geographical Asset View
- AI Recommendations Panel

---

# Related Documents

- 01_UI_SYSTEM.md
- 03_DIGITAL_TWIN_UI.md
- AI_ENGINE.md
- API_SPECIFICATION.md
- DIGITAL_TWIN_ENGINE.md

---

# Final Principle

The SentinelTwin AI SOC Dashboard shall provide a comprehensive, real-time operational view of the organization's cybersecurity posture.

Every widget, chart, and metric must contribute to faster threat detection, improved situational awareness, and effective incident response while maintaining a clean, responsive, and intuitive user experience.