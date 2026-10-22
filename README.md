# SentinelTwin AI

SentinelTwin AI is a cybersecurity digital twin platform designed to monitor endpoints, collect telemetry, detect threats, and provide AI-powered risk analysis.

## Technology Stack

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy 2.0 & Alembic
- **Auth:** JWT Authentication & Argon2 Password Hashing
- **AI/ML:** Scikit-learn (Random Forest, Isolation Forest) for Threat Detection

### Frontend
- **Framework:** React + TypeScript (Vite)
- **State/Query:** React Query, Zustand
- **UI:** Tailwind CSS, Radix UI, Lucide Icons, Recharts
- **Digital Twin 3D View:** React Three Fiber (Three.js)

### Agent
- **Endpoint Agent:** Python-based cross-platform collector (psutil)

## Features Fully Implemented
- **Organization & RBAC:** Multi-tenant organization support and user roles.
- **Agent Enrollment & Telemetry:** Dynamic agent packaging and real-time endpoint telemetry collection.
- **AI Threat Detection:** Risk Engine applying rules and machine learning models to surface Threat Events.
- **Incident Management:** Full lifecycle tracking for security incidents derived from threat events.
- **Web UI & Dashboard:** Real-time digital twin visualization, interactive topology, SOC dashboard, and telemetry charts.
- **WebSockets:** Live telemetry streams mapped to visual digital twin endpoints.

*Note: Features such as SIEM integrations, advanced playbooks, automated response actions, and containerized deployment were considered out of scope for the current phase.*