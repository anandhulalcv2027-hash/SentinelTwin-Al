# SentinelTwin AI
## Digital Twin UI
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

The Digital Twin UI provides an interactive, real-time visualization of organizational assets and their operational state.

Unlike traditional dashboards that display static charts and tables, the Digital Twin UI presents a living representation of the organization's infrastructure.

Every monitored asset is represented visually and continuously synchronized with live telemetry collected from the Endpoint Agent.

The Digital Twin UI is the flagship feature of SentinelTwin AI.

---

# Objectives

The Digital Twin shall allow users to:

- View organizational assets visually
- Monitor live asset health
- Observe network topology
- Detect threats instantly
- Inspect individual assets
- View AI-generated risk scores
- Navigate between infrastructure components
- Understand relationships between assets

---

# Design Philosophy

The Digital Twin should prioritize:

- Real-time visibility
- Clarity
- Performance
- Interactivity
- Scalability

It is not intended to replicate a physical office in Version 1.

Instead, it visualizes the logical security infrastructure.

---

# Supported Visualization Modes

Version 1 provides two visualization modes.

## 1. Network Topology View (Default)

Built using:

React Flow

Purpose:

Visualize assets and their logical relationships.

---

## 2. 3D Infrastructure View

Built using:

Three.js

Purpose:

Provide an interactive 3D representation of infrastructure for demonstrations and advanced monitoring.

---

# Workspace Layout

```
+---------------------------------------------------------------+
| Header                                                        |
+---------------------------------------------------------------+
| Toolbar                                                       |
+---------------------------------------------------------------+
|                                                             |
|                 Digital Twin Canvas                         |
|                                                             |
|                                                             |
+-------------------------+-----------------------------------+
| Selected Asset Panel    | Live Telemetry                   |
+-------------------------+-----------------------------------+
```

---

# Toolbar

The toolbar provides quick actions.

Functions:

- Zoom In
- Zoom Out
- Fit View
- Reset Layout
- Toggle Labels
- Toggle Animations
- Search Asset
- Switch View
- Refresh

---

# Asset Representation

Each monitored asset is represented as a node.

Supported asset types:

- Laptop
- Desktop
- Server
- Firewall

Future:

- Router
- Switch
- Cloud VM
- IoT Device

---

# Node Appearance

Every node displays:

- Asset Icon
- Asset Name
- Health Indicator
- Risk Indicator
- Online Status

Example

```
+----------------------+
| 🖥 Finance-PC-07      |
| Online               |
| Health 96%           |
| Risk 12             |
+----------------------+
```

---

# Node Colors

Healthy

Green

Warning

Yellow

Critical

Red

Offline

Gray

Maintenance

Blue

Color shall never be the only indicator.

Icons and labels must accompany colors.

---

# Connection Types

The following logical connections are supported.

Employee Device

↓

Firewall

↓

Server

↓

Database

Connections represent communication paths.

---

# Animated Connections

Healthy communication

Green animated pulse

Suspicious communication

Orange pulse

Threat detected

Red pulse

Disconnected

Gray dashed line

---

# Asset Selection

Clicking an asset opens the Asset Inspector.

The inspector displays:

- Asset Information
- Operating System
- Assigned Employee
- Department
- IP Address
- MAC Address
- Health Score
- AI Risk Score
- Live Metrics
- Recent Alerts

---

# Asset Inspector Layout

```
Asset Summary

↓

Health

↓

Telemetry

↓

Threat History

↓

AI Analysis

↓

Recent Alerts

↓

Actions
```

---

# Asset Actions

Supported actions:

- View Details
- Open Full Asset Page
- View Telemetry
- View Alert History
- Highlight Connections
- Center View

Future:

- Isolate Asset
- Remote Investigation
- Automated Response

---

# Live Telemetry Panel

Displays real-time metrics.

Metrics:

CPU Usage

Memory Usage

Disk Usage

Network Usage

Running Processes

Temperature (when available)

System Uptime

Last Heartbeat

Charts update continuously.

---

# Health Visualization

Health Score

0–100

Displayed as:

- Circular Progress
- Percentage
- Status Label

Categories:

90–100 Healthy

70–89 Good

50–69 Warning

30–49 Critical

0–29 Failure

---

# AI Risk Visualization

Risk Score

0–100

Displayed using:

- Gauge
- Color Indicator
- Trend Arrow

Risk Levels:

Low

Medium

High

Critical

---

# Threat Visualization

Detected threats trigger visual indicators.

Examples:

Malware

↓

Red pulse around node

Unauthorized Access

↓

Blinking warning icon

Offline Asset

↓

Gray node

Suspicious Process

↓

Orange glow

Firewall Alert

↓

Red connection animation

---

# Alert Integration

Selecting an alert automatically:

- Focuses the asset
- Highlights affected connections
- Opens the Asset Inspector

---

# Search

Users may search by:

- Asset Name
- Hostname
- Employee
- Department
- IP Address

Matching assets are highlighted.

---

# Filtering

Supported filters:

- Organization
- Asset Type
- Department
- Online Status
- Health
- Risk
- Threat Level

Filters update the visualization immediately.

---

# Navigation

Supported interactions:

Mouse

- Pan
- Zoom
- Select
- Drag

Keyboard

- Arrow Navigation
- Search
- Escape
- Delete Selection

---

# Mini Map

The Digital Twin includes a Mini Map.

Purpose:

Provide quick navigation in large infrastructures.

---

# Real-Time Updates

The following updates occur automatically.

WebSocket Events

↓

Asset Online

↓

Health Updated

↓

Risk Changed

↓

Threat Detected

↓

Alert Generated

↓

UI Updated

No manual refresh is required.

---

# Performance Guidelines

The UI shall support:

Version 1

Up to 500 assets

Future

Thousands of assets

Optimizations:

- Virtual rendering
- Lazy loading
- Incremental updates
- Efficient animations

---

# Three.js View

The optional 3D mode provides:

- Asset Models
- Connection Lines
- Camera Controls
- Animated Threats
- Environmental Lighting

The 3D view is intended for visualization and demonstrations.

Administrative tasks remain in the standard dashboard.

---

# Accessibility

The Digital Twin shall support:

- Keyboard navigation
- Screen reader labels
- High contrast mode
- Zoom controls
- Alternative textual information

---

# Future Enhancements

Planned capabilities include:

- Building/Floor layouts
- Interactive office maps
- Geographic infrastructure view
- Cloud asset visualization
- Multi-site organizations
- VPN topology
- Threat replay mode
- Time-travel visualization
- AI-generated attack paths

---

# Related Documents

- 01_UI_SYSTEM.md
- 02_SOC_DASHBOARD.md
- DIGITAL_TWIN_ENGINE.md
- DATA_FLOW.md
- API_SPECIFICATION.md

---

# Final Principle

The Digital Twin UI is the visual identity of SentinelTwin AI.

It shall provide a clear, real-time, and interactive representation of the organization's infrastructure, enabling users to understand operational state, identify threats, and investigate incidents through intuitive visual interaction while maintaining high performance and scalability.