# SentinelTwin AI
## Frontend UI System
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the official User Interface (UI) standards for SentinelTwin AI.

It serves as the single source of truth for the design language, application layout, navigation, reusable components, state management, API integration, accessibility, responsiveness, and user interaction patterns.

Every React component, page, layout, and UI feature shall comply with this document.

---

# Design Philosophy

SentinelTwin AI is designed as a modern Security Operations Center (SOC) platform.

The interface must enable security analysts to quickly understand system health, identify threats, investigate incidents, and manage organizational assets with minimal cognitive effort.

The UI follows five guiding principles:

- Clarity over decoration
- Information hierarchy
- Consistency
- Real-time awareness
- Accessibility

---

# Design Goals

The UI shall be:

- Clean
- Professional
- Responsive
- Accessible
- Fast
- Modular
- Reusable

Users should never feel overwhelmed by unnecessary visual elements.

---

# Official Technology Stack

Frontend Framework

- React 19

Language

- TypeScript (Strict Mode)

Build Tool

- Vite

Styling

- Tailwind CSS

Component Library

- shadcn/ui

Icons

- Lucide React

Forms

- React Hook Form
- Zod

Data Fetching

- TanStack Query

Routing

- React Router

Visualization

- Recharts
- React Flow
- Three.js

Animations

- Framer Motion

---

# Layout Architecture

Every authenticated page follows the same layout.

```
+------------------------------------------------------+
| Header                                               |
+-----------+------------------------------------------+
| Sidebar   |                                          |
|           |                                          |
|           |            Main Content                  |
|           |                                          |
|           |                                          |
+-----------+------------------------------------------+
| Footer / Status Bar                                  |
+------------------------------------------------------+
```

This layout remains consistent across the application.

---

# Header

The Header shall contain:

- Organization Selector
- Search Bar
- Notifications
- Theme Toggle
- User Profile
- Logout

The header remains fixed while scrolling.

---

# Sidebar Navigation

The sidebar is the primary navigation component.

Main navigation:

```
Dashboard

Organizations

Employees

Assets

Digital Twin

Threats

Alerts

Reports

Audit Logs

Settings
```

Features:

- Collapsible
- Responsive
- Active route highlighting
- Icon support
- Nested navigation (future)

---

# Main Content Area

The content area displays:

- Dashboard widgets
- Data tables
- Charts
- Forms
- Digital Twin visualization
- Reports

Every page begins with:

- Breadcrumb
- Page Title
- Description
- Action Buttons

---

# Status Bar

The status bar displays:

- Backend Connection
- WebSocket Status
- Logged-in User
- Application Version
- Current Organization

---

# Routing Structure

```
/

login

forgot-password

/dashboard

/organizations

/employees

/assets

/assets/:id

/digital-twin

/threats

/alerts

/reports

/audit-logs

/settings

/profile
```

Protected routes require authentication.

---

# State Management

Global State

Managed using:

- React Context
- TanStack Query

Global state includes:

- User
- Organization
- Theme
- Authentication
- WebSocket Connection

Local component state shall use React Hooks.

---

# API Integration

All API communication shall pass through a centralized API service.

Structure:

```
src/

services/

api.ts

auth.ts

asset.ts

organization.ts

report.ts
```

Components must never make direct fetch calls.

---

# Authentication Flow

```
Login

↓

JWT Access Token

↓

Refresh Token

↓

Protected Routes

↓

API Authorization
```

Unauthorized users are redirected to Login.

---

# Theme System

Supported themes:

- Light
- Dark

Dark mode is the default.

Theme preference is stored locally.

---

# Color System

Primary

Blue

Success

Green

Warning

Yellow

Danger

Red

Information

Cyan

Neutral

Gray

Colors must always be accompanied by icons or labels.

---

# Typography

Hierarchy:

```
H1

Page Title

H2

Section

H3

Card Title

Body

Caption
```

Typography should prioritize readability over stylistic effects.

---

# Icons

Official icon library:

Lucide React

Examples:

- Shield
- Laptop
- Server
- Bell
- Activity
- Alert Triangle
- Database
- User
- Building
- Network

Icons should always accompany navigation labels.

---

# Reusable Components

The frontend shall use reusable components.

Core components include:

```
Button

Input

Select

Modal

Dialog

Toast

Card

Badge

Avatar

Tooltip

Table

DataTable

Pagination

Breadcrumb

Sidebar

Navbar

StatusIndicator

LoadingSpinner

Skeleton

SearchBar

ConfirmationDialog
```

Components shall never duplicate functionality.

---

# Forms

All forms use:

- React Hook Form
- Zod Validation

Forms shall:

- Validate instantly
- Display inline errors
- Prevent duplicate submission
- Show loading state

---

# Tables

Tables shall support:

- Search
- Sort
- Filter
- Pagination
- Column Visibility
- Export (Future)

Large datasets should use virtualization where appropriate.

---

# Charts

Charts use Recharts.

Supported chart types:

- Line Chart
- Area Chart
- Pie Chart
- Bar Chart
- Radar Chart

Charts shall support:

- Tooltips
- Legends
- Responsive resizing

---

# Notifications

Notifications include:

Success

Information

Warning

Error

Critical alerts remain visible until acknowledged.

---

# Loading States

Every asynchronous operation shall display:

- Skeleton loaders
- Loading spinner
- Progress bar (when applicable)

Blank screens are prohibited.

---

# Error Handling

Errors shall:

- Explain the problem
- Suggest corrective action
- Never expose internal server details

---

# Responsive Design

Primary target:

Desktop

Supported:

- Desktop
- Laptop
- Tablet

Minimum supported width:

1024px

Mobile support is optional for Version 1.

---

# Accessibility

The UI shall comply with WCAG 2.1 AA where practical.

Requirements:

- Keyboard navigation
- Visible focus states
- Screen reader compatibility
- Proper ARIA labels
- High color contrast

---

# Performance Guidelines

Frontend shall:

- Lazy-load pages
- Code split routes
- Cache API requests
- Minimize unnecessary re-renders
- Optimize bundle size

---

# Folder Structure

```
frontend/

src/

components/

layouts/

pages/

hooks/

services/

contexts/

types/

utils/

assets/

styles/

routes/
```

---

# Development Principles

The frontend shall:

- Prefer composition over inheritance
- Keep components small
- Separate UI from business logic
- Avoid duplicated components
- Use reusable hooks
- Keep API logic outside components

---

# Related Documents

- 02_SOC_DASHBOARD.md
- 03_DIGITAL_TWIN_UI.md
- API_SPECIFICATION.md
- AUTHENTICATION.md
- SYSTEM_ARCHITECTURE.md

---

# Final Principle

The SentinelTwin AI frontend shall present a consistent, professional, and responsive Security Operations Center experience.

Every interface should prioritize clarity, real-time visibility, and operational efficiency while maintaining a modular architecture that supports future expansion.