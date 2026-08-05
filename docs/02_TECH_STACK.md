# SentinelTwin AI
## Approved Technology Stack
### Version: 1.0.0
### Status: Active
### Last Updated: July 2026

---

# Purpose

This document defines the officially approved technology stack for SentinelTwin AI.

Every implementation must use the technologies listed in this document.

Technology changes require updating both this document and the Project Constitution.

---

# Technology Selection Principles

The technology stack has been selected based on the following principles:

- Production readiness
- Open-source ecosystem
- Strong community support
- Long-term maintainability
- Performance
- Security
- Scalability
- Learning value
- Cross-platform compatibility

---

# Overall Architecture

SentinelTwin AI consists of the following major layers:

Frontend

↓

Backend API

↓

Business Services

↓

Digital Twin Engine

↓

AI Engine

↓

Database

↓

Endpoint Agent

Each layer has clearly defined responsibilities.

---

# Frontend Stack

## Framework

React 19

Purpose:

- User Interface
- Component architecture
- Dashboard

---

## Language

TypeScript

Purpose:

- Type safety
- Better maintainability
- Improved developer experience

Strict mode must always remain enabled.

---

## Build Tool

Vite

Purpose:

- Development server
- Production builds
- Fast HMR

---

## Styling

Tailwind CSS

Purpose:

- Utility-first styling
- Responsive layouts
- Consistent design system

---

## UI Components

shadcn/ui

Purpose:

- Accessible UI components
- Reusable interface elements

---

## Icons

Lucide React

Purpose:

- Consistent iconography

---

## Routing

React Router

Purpose:

- Client-side routing
- Protected routes

---

## Server State

TanStack Query

Purpose:

- API communication
- Data caching
- Synchronization

---

## Forms

React Hook Form

Purpose:

- Form handling
- Validation integration

---

## Validation

Zod

Purpose:

- Runtime validation
- Type inference

---

## Charts

Recharts

Purpose:

- Analytics
- Reports
- Dashboard metrics

---

## Graph Visualization

React Flow

Purpose:

- Network topology
- Asset relationships

---

## 3D Visualization

Three.js

@react-three/fiber

@react-three/drei

Purpose:

- Digital Twin visualization
- Interactive infrastructure view
- Threat visualization

Three.js must not replace traditional UI components.

---

## Animations

Framer Motion

Purpose:

- Smooth transitions
- Status animations
- Improved UX

---

# Backend Stack

## Language

Python 3.13

Purpose:

- API
- Business logic
- AI integration

---

## Framework

FastAPI

Purpose:

- REST API
- Authentication
- WebSockets

---

## Data Validation

Pydantic v2

Purpose:

- Request validation
- Response models

---

## ORM

SQLAlchemy 2.x

Purpose:

- Database abstraction
- ORM
- Query building

---

## Database Migrations

Alembic

Purpose:

- Schema versioning
- Database migrations

---

## Authentication

JWT

Purpose:

- Stateless authentication
- Secure access tokens

---

## Password Hashing

Passlib

Purpose:

- Password hashing
- Verification

---

## Logging

Loguru

Purpose:

- Centralized logging
- Debugging
- Error tracking

---

## HTTP Client

httpx

Purpose:

- Internal API communication
- Endpoint Agent communication

---

## Real-Time Communication

FastAPI WebSockets

Purpose:

- Live dashboard updates
- Alert notifications

---

# Database

## Primary Database

PostgreSQL

Purpose:

- Relational data
- Historical telemetry
- Multi-tenant architecture

Reasons:

- ACID compliance
- Excellent indexing
- Mature ecosystem
- Strong relationship support

---

## Cache

Redis

Purpose:

- Temporary caching
- Session storage
- Future scalability

Redis is optional during early development and may be introduced after the core features are functional.

---

# AI Stack

## Machine Learning

Scikit-learn

Purpose:

- Classification
- Anomaly detection

---

## Algorithms

Random Forest

Purpose:

- Risk classification

Isolation Forest

Purpose:

- Anomaly detection

---

## Data Processing

Pandas

Purpose:

- Feature engineering
- Dataset preparation

NumPy

Purpose:

- Numerical computation

---

## Model Persistence

Joblib

Purpose:

- Save trained models

---

# Endpoint Agent

## Language

Python

Purpose:

- Cross-platform compatibility

---

## System Information

psutil

Purpose:

- CPU usage
- Memory usage
- Disk usage
- Processes
- Network statistics

---

## Networking

socket

Purpose:

- Host information

---

## Platform Detection

platform

Purpose:

- Operating system details

---

## Asynchronous Processing

asyncio

Purpose:

- Efficient background tasks

---

## Secure Communication

httpx

Purpose:

- HTTPS communication

cryptography

Purpose:

- Secure key handling
- Encryption utilities

---

# Development Tools

Git

Purpose:

- Version control

---

GitHub

Purpose:

- Repository hosting
- Collaboration

---

GitHub Actions

Purpose:

- Continuous Integration

---

Docker

Purpose:

- Local development
- Deployment consistency

---

Docker Compose

Purpose:

- Multi-service orchestration

---

pytest

Purpose:

- Automated testing

---

pre-commit

Purpose:

- Code quality checks

---

# API Standards

REST API

Primary communication method.

WebSockets

Used only for:

- Live telemetry
- Dashboard updates
- Alert notifications

---

# Data Formats

JSON

Primary communication format.

UTF-8

Required encoding.

ISO 8601

Required timestamp format.

UTC

Required server timezone.

---

# Security Standards

Authentication:

JWT

Authorization:

RBAC

Password Hashing:

bcrypt via Passlib

Encryption:

HTTPS

Secrets:

Environment variables only

Sensitive information must never be hardcoded.

---

# Browser Support

Latest versions of:

- Chrome
- Edge
- Firefox

---

# Operating System Support

Version 1 officially supports:

- Windows
- Linux

macOS support may be added in future versions.

---

# Future Technology Considerations

Potential future additions include:

- Apache Kafka
- Elasticsearch
- OpenSearch
- PyTorch
- Transformers
- Graph Neural Networks
- Kubernetes
- Terraform

These technologies are not part of Version 1.

---

# Technology Approval Policy

No technology may be replaced without:

1. Updating this document.
2. Updating the Project Constitution.
3. Reviewing architecture impacts.
4. Updating implementation documentation.

---

# Related Documents

- 00_PROJECT_CONSTITUTION.md
- 00_AI_ENGINEERING_RULES.md
- 01_PROJECT_OVERVIEW.md
- 03_SYSTEM_ARCHITECTURE.md