# SentinelTwin AI

## Repository Folder Structure

### Version: 1.0.0

### Status: Active

### Last Updated: July 2026

---

# Purpose

This document defines the official repository structure used by SentinelTwin AI.

The repository structure is a critical part of the platform architecture because it establishes where every component belongs and how modules are organized.

This document defines:

- Repository organization
- Folder responsibilities
- Module ownership
- Import boundaries
- Dependency rules
- Naming conventions
- Expansion policies

Every implementation must follow this structure.

Any structural modification requires architecture review and documentation updates.

---

# Repository Philosophy

The SentinelTwin AI repository is designed around modular engineering principles.

Every folder has a single responsibility.

Every module has a clearly defined owner.

Every implementation should be discoverable without requiring developers to search through unrelated directories.

The repository is designed for:

- Maintainability
- Scalability
- Security
- Readability
- Predictability

Large systems become difficult to maintain when files are placed in arbitrary locations.

Therefore:

Every file should have exactly one logical home.

Duplicate implementations are forbidden.

Random folder creation is forbidden.

Business logic must never leak into presentation layers.

Infrastructure code must remain isolated from application code.

Documentation should evolve alongside implementation.

---

# Repository Organization Principles

The repository follows these principles.

## Separation of Responsibilities

Every top-level folder owns one engineering domain.

Examples:

- Frontend owns the user interface.
- Backend owns APIs and business logic.
- AI owns machine learning components.
- Endpoint Agent owns asset monitoring.
- Infrastructure owns deployment resources.
- Documentation owns engineering knowledge.

Responsibilities must never overlap.

---

## Predictable Navigation

Developers should be able to locate files quickly.

Repository organization should remain consistent regardless of project growth.

Folders should describe responsibility rather than technology.

Good examples:

backend/

frontend/

endpoint-agent/

docs/

Poor examples:

misc/

new/

temp/

stuff/

---

## Layered Development

The repository mirrors the architectural layers described in:

- 01_SYSTEM_ARCHITECTURE.md
- 02_TECH_STACK.md

Implementation should follow the same dependency direction.

Frontend

↓

Backend API

↓

Business Services

↓

Repositories

↓

Database

No reverse dependency is permitted.

---

# Top-Level Repository Structure

The official SentinelTwin AI repository layout is:

```text
sentineltwin-ai/

├── frontend/
├── backend/
├── endpoint-agent/
├── ai/
├── docs/
├── infrastructure/
├── docker/
├── scripts/
├── tests/
├── tools/
├── .github/
├── .vscode/
├── assets/
├── README.md
├── LICENSE
├── docker-compose.yml
├── pyproject.toml
├── package.json
└── .gitignore
# Frontend Repository Structure

The frontend contains the complete Presentation Layer of SentinelTwin AI.

Its responsibility is to provide secure, responsive, and maintainable user interfaces for interacting with the platform.

The frontend must never contain backend business logic or direct database access.

Official structure:

```text
frontend/

├── public/
├── src/
├── tests/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# Frontend Source Structure

All application source code resides inside:

```text
frontend/src/
```

Official layout:

```text
src/

├── app/
├── assets/
├── components/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
├── constants/
├── contexts/
└── main.tsx
```

Every folder has a defined engineering responsibility.

---

# app/

Purpose:

Application initialization.

Contains:

- Application bootstrap
- Global providers
- Theme provider
- Router configuration
- Query client
- Authentication initialization

Example:

```text
app/

App.tsx

providers.tsx

router.tsx
```

This folder represents the application entry layer.

---

# assets/

Purpose:

Stores static frontend resources.

Examples:

```text
assets/

images/

icons/

logos/

fonts/
```

Rules:

- No executable code
- No business logic
- Optimized assets only

Large media files should not be committed unnecessarily.

---

# components/

Purpose:

Reusable user interface components.

Examples:

```text
components/

buttons/

cards/

dialogs/

forms/

tables/

charts/

navigation/

common/
```

Component examples:

- Button
- Card
- Modal
- Badge
- Data Table
- Sidebar
- Navbar
- Spinner
- Empty State
- Tooltip

Components should:

- Be reusable
- Be independent
- Accept properties
- Avoid application-specific logic

Components must never:

- Fetch API data directly
- Store global business state
- Contain page-specific workflows

---

# features/

Purpose:

Contains feature-oriented modules.

Each feature owns everything required for one business capability.

Examples:

```text
features/

authentication/

assets/

alerts/

reports/

users/

digital-twin/
```

Each feature may contain:

```text
authentication/

components/

hooks/

services/

types/

pages/
```

Advantages:

- High cohesion
- Easier maintenance
- Better scalability

Feature modules should remain independent whenever possible.

---

# hooks/

Purpose:

Reusable React hooks.

Examples:

```text
hooks/

useAuth.ts

useTelemetry.ts

useAssets.ts

usePagination.ts

useTheme.ts
```

Hooks should encapsulate:

- Shared logic
- State management
- Reusable behaviors

Hooks must never render UI.

---

# layouts/

Purpose:

Application layouts.

Examples:

```text
layouts/

DashboardLayout.tsx

AdminLayout.tsx

AuthLayout.tsx
```

Responsibilities:

- Navigation
- Header
- Sidebar
- Footer
- Shared page composition

Layouts coordinate pages.

They should not contain business logic.

---

# pages/

Purpose:

Represents complete application screens.

Examples:

```text
pages/

Dashboard/

Assets/

Alerts/

Reports/

Settings/

Users/

Login/
```

Each page is responsible for:

- Rendering the screen
- Coordinating components
- Loading required feature modules

Pages should remain thin.

Complex business rules belong in services.

---

# routes/

Purpose:

Application routing.

Examples:

```text
routes/

ProtectedRoute.tsx

PublicRoute.tsx

index.tsx
```

Responsibilities:

- Route definitions
- Route guards
- Authentication checks
- Navigation rules

Routing should never contain business logic.

---

# services/

Purpose:

Frontend service layer.

Examples:

```text
services/

auth.service.ts

asset.service.ts

alert.service.ts

report.service.ts
```

Responsibilities:

- API communication
- Data mapping
- Request orchestration
- Error normalization

Services isolate the frontend from backend implementation details.

Business decisions remain in the backend.

---

# store/

Purpose:

Global application state.

Examples:

```text
store/

auth/

theme/

preferences/

notifications/
```

Only true global state belongs here.

Examples:

- Logged-in user
- UI preferences
- Theme
- Session information

Server state should use TanStack Query instead of global stores whenever possible.

---

# styles/

Purpose:

Application styling.

Contains:

```text
styles/

globals.css

theme.css

variables.css
```

Responsibilities:

- Global styling
- Theme variables
- Shared utility styles

Component-specific styling should remain close to the component.

---

# types/

Purpose:

Shared TypeScript definitions.

Examples:

```text
types/

user.ts

asset.ts

alert.ts

telemetry.ts

digitalTwin.ts
```

Rules:

- Interfaces only
- Type aliases
- Shared enums

Implementation logic is forbidden.

---

# utils/

Purpose:

Generic helper functions.

Examples:

```text
utils/

date.ts

format.ts

validation.ts

math.ts

storage.ts
```

Utilities should be:

- Pure
- Reusable
- Independent

Utilities must not depend on React.

---

# constants/

Purpose:

Shared application constants.

Examples:

```text
constants/

api.ts

routes.ts

roles.ts

permissions.ts
```

Constants prevent duplicated hard-coded values.

---

# contexts/

Purpose:

React Context providers.

Examples:

```text
contexts/

AuthContext.tsx

ThemeContext.tsx

NotificationContext.tsx
```

Contexts should expose shared application state.

Large business workflows belong in services.

---

# Frontend Ownership Rules

Frontend owns:

- User Interface
- User Experience
- Client-side validation
- Navigation
- Visualization
- User interaction

Frontend does NOT own:

- Authentication decisions
- Business rules
- Database access
- AI processing
- Risk calculation
- Alert generation

Those responsibilities belong to backend services.

---

# Frontend Engineering Rules

Every frontend module should satisfy the following principles:

- Single Responsibility
- Reusable Components
- Type Safety
- Predictable State
- Minimal Side Effects
- Clear Separation of Concerns

The frontend exists to present information—not to implement platform logic.

---
# Backend Repository Structure

The backend is the core implementation layer of SentinelTwin AI.

It provides:

- REST APIs
- Business logic
- Authentication
- Authorization
- Digital Twin management
- Telemetry processing
- AI integration
- Data persistence

The backend follows Layered Architecture and the Repository Pattern.

Business rules must remain independent from HTTP requests and database implementation.

Official structure:

```text
backend/

├── app/
├── tests/
├── migrations/
├── scripts/
├── pyproject.toml
├── alembic.ini
├── Dockerfile
└── README.md
```

---

# Application Structure

All production code resides inside:

```text
backend/app/
```

Official layout:

```text
app/

├── api/
├── core/
├── database/
├── middleware/
├── models/
├── repositories/
├── schemas/
├── security/
├── services/
├── websocket/
├── workers/
├── ai/
├── telemetry/
├── utils/
├── exceptions/
├── dependencies/
└── main.py
```

Every folder represents one architectural responsibility.

No folder should duplicate another folder's responsibility.

---

# api/

Purpose:

Defines the public REST API.

Responsibilities:

- Route definitions
- Request validation
- Response formatting
- HTTP status handling
- Dependency injection

Example:

```text
api/

auth/

users/

organizations/

assets/

telemetry/

alerts/

reports/

agents/

health/
```

Each API module should expose:

```text
router.py

endpoints.py
```

Rules:

- No database queries
- No business logic
- No AI execution
- No direct SQL

Routes call Services only.

---

# core/

Purpose:

Contains global backend configuration.

Examples:

```text
core/

config.py

logging.py

constants.py

settings.py
```

Responsibilities:

- Application settings
- Environment loading
- Logging configuration
- Global constants
- Startup configuration

The Core module should remain lightweight.

---

# database/

Purpose:

Provides database connectivity.

Contains:

```text
database/

session.py

base.py

connection.py
```

Responsibilities:

- Database engine
- Session management
- Base ORM model
- Connection lifecycle

No business logic belongs here.

---

# middleware/

Purpose:

Processes every incoming request before it reaches the API.

Examples:

```text
middleware/

authentication.py

logging.py

request_id.py

rate_limit.py

cors.py
```

Responsibilities:

- Authentication middleware
- Logging
- Request tracing
- Security headers
- Rate limiting

Middleware should never implement business workflows.

---

# models/

Purpose:

Contains SQLAlchemy ORM models.

Examples:

```text
models/

user.py

organization.py

asset.py

digital_twin.py

telemetry.py

alert.py

report.py
```

Responsibilities:

- Database schema
- Table definitions
- Relationships
- Constraints

Models represent stored data only.

Business logic must not be embedded inside ORM models.

---

# repositories/

Purpose:

Database access layer.

Examples:

```text
repositories/

user_repository.py

asset_repository.py

telemetry_repository.py

alert_repository.py

report_repository.py
```

Responsibilities:

- CRUD operations
- Query construction
- Transaction handling
- Data retrieval

Repositories isolate SQLAlchemy from business services.

Rules:

- Services call repositories.
- Repositories call ORM.
- API must never call repositories directly.

---

# schemas/

Purpose:

Contains API request and response models.

Examples:

```text
schemas/

auth.py

user.py

asset.py

telemetry.py

alert.py

report.py
```

Responsibilities:

- Validation
- Serialization
- API contracts
- Type safety

Schemas use Pydantic.

Schemas should never contain database code.

---

# security/

Purpose:

Centralized security implementation.

Examples:

```text
security/

jwt.py

password.py

permissions.py

rbac.py

tokens.py
```

Responsibilities:

- JWT handling
- Password hashing
- Role validation
- Permission evaluation
- Token verification

All security-related code belongs here.

Security implementations must never be duplicated.

---

# services/

Purpose:

Contains business logic.

Examples:

```text
services/

authentication_service.py

organization_service.py

asset_service.py

telemetry_service.py

digital_twin_service.py

alert_service.py

report_service.py
```

Responsibilities:

- Business rules
- Workflow execution
- Validation
- Service coordination

Example flow:

```text
API

↓

Authentication Service

↓

Repository

↓

Database
```

Services represent the heart of backend functionality.

---

# websocket/

Purpose:

Handles real-time communication.

Examples:

```text
websocket/

manager.py

events.py

broadcast.py

connections.py
```

Responsibilities:

- Connection management
- Dashboard updates
- Live notifications
- Event broadcasting

WebSocket code should remain independent from REST APIs.

---

# workers/

Purpose:

Background task execution.

Examples:

```text
workers/

telemetry_worker.py

report_worker.py

cleanup_worker.py

scheduler.py
```

Responsibilities:

- Background processing
- Scheduled jobs
- Queue execution
- Long-running tasks

Workers should not expose HTTP endpoints.

---

# ai/

Purpose:

Backend AI integration layer.

Responsibilities:

- Model loading
- Prediction requests
- Feature preparation
- Risk evaluation

Examples:

```text
ai/

predictor.py

risk_engine.py

model_loader.py
```

This folder connects backend services to AI modules.

Training code belongs in the standalone AI repository—not here.

---

# telemetry/

Purpose:

Telemetry processing pipeline.

Examples:

```text
telemetry/

collector.py

processor.py

validator.py

normalizer.py
```

Responsibilities:

- Telemetry validation
- Metric normalization
- Event processing
- Twin synchronization

Telemetry processing must remain isolated from API routing.

---

# utils/

Purpose:

Reusable backend utilities.

Examples:

```text
utils/

datetime.py

hashing.py

network.py

parsers.py

helpers.py
```

Utilities should:

- Be reusable
- Be deterministic
- Avoid business rules

---

# exceptions/

Purpose:

Centralized exception definitions.

Examples:

```text
exceptions/

authentication.py

authorization.py

validation.py

telemetry.py
```

Responsibilities:

- Domain exceptions
- API exception mapping
- Standardized error handling

Custom exceptions improve maintainability.

---

# dependencies/

Purpose:

Dependency Injection helpers.

Examples:

```text
dependencies/

authentication.py

permissions.py

database.py

organization.py
```

Responsibilities:

- Shared FastAPI dependencies
- Authentication injection
- Permission validation
- Common request dependencies

Dependencies should remain lightweight.

---

# main.py

Purpose:

Application entry point.

Responsibilities:

- Initialize FastAPI
- Register middleware
- Load routers
- Configure startup events
- Configure shutdown events

Business logic must never exist inside main.py.

---

# Backend Ownership Rules

Backend owns:

- APIs
- Authentication
- Authorization
- Business rules
- Digital Twins
- AI integration
- Telemetry processing
- Report generation
- Data persistence

Backend does NOT own:

- User interface
- Endpoint telemetry collection
- Machine learning training
- Infrastructure provisioning

Those responsibilities belong to other engineering domains.

---

# Backend Engineering Principles

Every backend module should satisfy:

- Single Responsibility
- Dependency Injection
- Layered Architecture
- Repository Pattern
- Type Safety
- Testability
- Security by Default

The backend exists to coordinate platform behavior while remaining independent of presentation and infrastructure concerns.

---
# AI Repository Structure

The AI repository contains the complete intelligence layer of SentinelTwin AI.

Its purpose is to transform telemetry into actionable security intelligence using machine learning, statistical analysis, and future AI models.

The AI repository is completely independent from the frontend and communicates with the backend only through well-defined interfaces.

Official structure:

```text
ai/

├── datasets/
├── feature_engineering/
├── models/
├── prediction/
├── training/
├── evaluation/
├── pipelines/
├── experiments/
├── utils/
├── tests/
└── README.md
```

The AI repository is responsible for model development, evaluation, and runtime inference.

---

# datasets/

Purpose:

Stores datasets used during model development.

Examples:

```text
datasets/

raw/

processed/

training/

validation/

testing/
```

Responsibilities:

- Raw telemetry datasets
- Processed datasets
- Validation data
- Benchmark datasets

Rules:

- Production telemetry must never be committed.
- Sensitive organizational data must remain outside version control.
- Every dataset should include metadata describing its origin.

---

# feature_engineering/

Purpose:

Transforms telemetry into machine-learning features.

Examples:

```text
feature_engineering/

cpu.py

memory.py

network.py

system.py

preprocessing.py
```

Responsibilities:

- Feature extraction
- Data normalization
- Missing value handling
- Feature scaling
- Feature selection

Feature engineering should remain deterministic.

---

# models/

Purpose:

Stores trained machine learning models.

Examples:

```text
models/

random_forest.joblib

isolation_forest.joblib

metadata.json
```

Responsibilities:

- Model storage
- Version tracking
- Model metadata

Rules:

- Every production model must include version information.
- Deprecated models should remain archived until officially removed.

---

# prediction/

Purpose:

Runtime inference.

Examples:

```text
prediction/

predict.py

risk_score.py

anomaly_detection.py

classification.py
```

Responsibilities:

- Load trained models
- Execute predictions
- Generate confidence scores
- Produce structured results

Prediction modules must never retrain models.

---

# training/

Purpose:

Machine learning training pipelines.

Examples:

```text
training/

train_random_forest.py

train_isolation_forest.py

hyperparameter_search.py
```

Responsibilities:

- Model training
- Hyperparameter optimization
- Dataset preparation
- Cross validation

Training code is never executed inside production APIs.

---

# evaluation/

Purpose:

Model evaluation.

Examples:

```text
evaluation/

metrics.py

benchmark.py

confusion_matrix.py

validation.py
```

Responsibilities:

- Accuracy evaluation
- Precision
- Recall
- F1 score
- ROC analysis

Every production model should be evaluated before deployment.

---

# pipelines/

Purpose:

End-to-end machine learning workflows.

Examples:

```text
pipelines/

training_pipeline.py

prediction_pipeline.py

evaluation_pipeline.py
```

Responsibilities:

- Workflow orchestration
- Pipeline execution
- Repeatable experiments

---

# experiments/

Purpose:

Research and experimentation.

Examples:

```text
experiments/

experiment_001/

experiment_002/

notes.md
```

Responsibilities:

- Prototype models
- Research ideas
- Experimental configurations

Experimental code must never be imported by production systems.

---

# utils/

Purpose:

Reusable AI utilities.

Examples:

```text
utils/

serialization.py

statistics.py

visualization.py
```

Utilities should remain framework independent whenever possible.

---

# AI Ownership Rules

The AI repository owns:

- Machine learning models
- Feature engineering
- Risk prediction
- Threat classification
- Anomaly detection
- Model evaluation

The AI repository does NOT own:

- Authentication
- Database management
- API routing
- User management
- Endpoint communication

---

# Endpoint Agent Repository Structure

The Endpoint Agent is the trusted telemetry collection layer of SentinelTwin AI.

Its purpose is to observe monitored systems and securely report telemetry to the backend.

The Endpoint Agent never performs security decisions.

Official structure:

```text
endpoint-agent/

├── agent/
├── collectors/
├── communication/
├── security/
├── storage/
├── config/
├── logging/
├── scheduler/
├── utils/
├── tests/
└── README.md
```

---

# agent/

Purpose:

Application startup.

Examples:

```text
agent/

main.py

bootstrap.py

lifecycle.py
```

Responsibilities:

- Initialization
- Startup
- Shutdown
- Component registration

---

# collectors/

Purpose:

Telemetry collection.

Examples:

```text
collectors/

cpu.py

memory.py

disk.py

network.py

processes.py

system.py
```

Responsibilities:

- CPU metrics
- Memory metrics
- Disk statistics
- Network information
- Running processes
- Operating system information

Collectors observe only.

They must never modify the monitored asset.

---

# communication/

Purpose:

Backend communication.

Examples:

```text
communication/

registration.py

authentication.py

heartbeat.py

telemetry.py

retry.py
```

Responsibilities:

- Registration
- Authentication
- Heartbeats
- Telemetry upload
- Retry management

All communication must follow ENDPOINT_AGENT_PROTOCOL.md.

---

# security/

Purpose:

Agent security.

Examples:

```text
security/

credentials.py

encryption.py

certificates.py
```

Responsibilities:

- Credential storage
- Encryption
- Certificate validation
- Secure identity

Secrets must never be exposed through logs.

---

# storage/

Purpose:

Temporary local storage.

Examples:

```text
storage/

queue.py

cache.py

offline.py
```

Responsibilities:

- Offline telemetry queue
- Temporary cache
- Retry persistence

Stored data must remain encrypted.

---

# config/

Purpose:

Configuration management.

Examples:

```text
config/

settings.py

defaults.py
```

Responsibilities:

- Agent configuration
- Runtime settings
- Communication intervals

Configuration should be externalized whenever possible.

---

# logging/

Purpose:

Agent logging.

Examples:

```text
logging/

logger.py

handlers.py
```

Responsibilities:

- Connection events
- Collection status
- Error logging

Sensitive information must never appear in logs.

---

# scheduler/

Purpose:

Task scheduling.

Examples:

```text
scheduler/

heartbeat.py

telemetry.py

jobs.py
```

Responsibilities:

- Heartbeat scheduling
- Metric collection intervals
- Retry scheduling

Scheduling should remain independent from collectors.

---

# utils/

Purpose:

Reusable helper functions.

Examples:

```text
utils/

datetime.py

platform.py

network.py
```

Utilities should remain lightweight and reusable.

---

# Endpoint Agent Ownership Rules

The Endpoint Agent owns:

- Telemetry collection
- Asset discovery
- Health monitoring
- Secure communication
- Temporary offline storage

The Endpoint Agent does NOT own:

- AI inference
- Risk calculation
- Alert generation
- Database access
- User authentication

The agent is a trusted sensor, not a decision-making component.

---

# AI and Agent Engineering Principles

Both repositories follow:

- Single Responsibility
- Modular Design
- Secure Communication
- Clear Ownership
- Independent Deployment
- Minimal Dependencies

The AI repository provides intelligence.

The Endpoint Agent provides observation.

Neither should assume responsibilities owned by the backend.

---
# Documentation Repository Structure

The documentation repository preserves the engineering knowledge of SentinelTwin AI.

Documentation is considered part of the product.

Every architectural, security, and engineering decision must be documented before implementation.

Official structure:

```text
docs/

├── architecture/
├── backend/
├── frontend/
├── security/
├── deployment/
├── development/
├── api/
├── ai/
├── endpoint-agent/
├── operations/
├── research/
└── assets/
```

Documentation should evolve together with the source code.

---

# architecture/

Purpose:

Contains the official engineering architecture.

Examples:

```text
architecture/

01_SYSTEM_ARCHITECTURE.md

02_TECH_STACK.md

03_FOLDER_STRUCTURE.md

04_DATA_FLOW.md

05_DIGITAL_TWIN_ENGINE.md

06_TELEMETRY_PIPELINE.md
```

Responsibilities:

- System architecture
- Component interactions
- Module boundaries
- Engineering principles

Architecture documents define how the platform is built.

---

# backend/

Purpose:

Backend engineering documentation.

Examples:

```text
backend/

API_SPECIFICATION.md

AUTHENTICATION.md

RBAC.md

DATABASE_DESIGN.md

ENDPOINT_AGENT_PROTOCOL.md
```

Responsibilities:

- API standards
- Backend modules
- Security implementation
- Service architecture

---

# frontend/

Purpose:

Frontend engineering documentation.

Examples:

```text
frontend/

UI_GUIDELINES.md

COMPONENT_LIBRARY.md

STATE_MANAGEMENT.md

ROUTING.md
```

Responsibilities:

- UI standards
- Component patterns
- Client architecture
- Design system

---

# security/

Purpose:

Platform security documentation.

Examples:

```text
security/

SECURITY_MODEL.md

ZERO_TRUST.md

CRYPTOGRAPHY.md

INCIDENT_RESPONSE.md
```

Responsibilities:

- Security architecture
- Authentication
- Authorization
- Secure development practices

---

# deployment/

Purpose:

Deployment documentation.

Examples:

```text
deployment/

DOCKER.md

KUBERNETES.md

ENVIRONMENTS.md

BACKUP.md
```

Responsibilities:

- Deployment process
- Infrastructure
- Production configuration
- Disaster recovery

---

# development/

Purpose:

Developer documentation.

Examples:

```text
development/

SETUP.md

CONTRIBUTING.md

CODING_STANDARDS.md

DEVELOPMENT_RULES.md
```

Responsibilities:

- Local development
- Coding standards
- Repository workflow
- Best practices

---

# api/

Purpose:

Public API documentation.

Examples:

```text
api/

REST_API.md

WEBSOCKET_API.md

ERROR_CODES.md
```

Responsibilities:

- API reference
- Payload specifications
- Response formats
- Integration guidance

---

# ai/

Purpose:

Artificial Intelligence documentation.

Examples:

```text
ai/

MODEL_ARCHITECTURE.md

TRAINING_GUIDE.md

FEATURE_ENGINEERING.md
```

Responsibilities:

- AI models
- Training process
- Evaluation
- Prediction pipeline

---

# endpoint-agent/

Purpose:

Endpoint Agent documentation.

Examples:

```text
endpoint-agent/

INSTALLATION.md

CONFIGURATION.md

COMMUNICATION.md
```

Responsibilities:

- Agent deployment
- Configuration
- Lifecycle
- Maintenance

---

# operations/

Purpose:

Operational documentation.

Examples:

```text
operations/

MONITORING.md

RUNBOOKS.md

MAINTENANCE.md
```

Responsibilities:

- Daily operations
- Monitoring
- Troubleshooting
- Incident handling

---

# research/

Purpose:

Engineering research.

Examples:

```text
research/

POC/

EXPERIMENTS/

DESIGN_NOTES/
```

Research documentation is informational only.

It does not define production architecture.

---

# assets/

Purpose:

Shared documentation resources.

Examples:

```text
assets/

diagrams/

images/

logos/

icons/
```

Used by engineering documentation only.

---

# Infrastructure Repository Structure

Infrastructure resources define how SentinelTwin AI is deployed.

Official structure:

```text
infrastructure/

docker/

kubernetes/

terraform/

monitoring/

nginx/

certificates/

scripts/
```

Infrastructure should remain independent from application code.

---

# docker/

Purpose:

Container definitions.

Examples:

```text
docker/

frontend/

backend/

agent/

database/

redis/
```

Responsibilities:

- Image definitions
- Development containers
- Production containers

Docker files should remain environment independent.

---

# kubernetes/

Purpose:

Container orchestration.

Examples:

```text
kubernetes/

deployments/

services/

configmaps/

secrets/

ingress/
```

Responsibilities:

- Production deployment
- Scaling
- High availability

---

# terraform/

Purpose:

Infrastructure provisioning.

Examples:

```text
terraform/

aws/

azure/

gcp/

modules/
```

Responsibilities:

- Infrastructure as Code
- Cloud provisioning
- Resource management

---

# monitoring/

Purpose:

Monitoring configuration.

Examples:

```text
monitoring/

prometheus/

grafana/

alerts/
```

Responsibilities:

- Metrics
- Dashboards
- Alert rules
- System health

---

# nginx/

Purpose:

Reverse proxy configuration.

Examples:

```text
nginx/

default.conf

ssl.conf
```

Responsibilities:

- Reverse proxy
- HTTPS
- Load balancing
- Static asset serving

---

# certificates/

Purpose:

Certificate management.

Examples:

```text
certificates/

development/

staging/

production/
```

Production certificates must never be committed to version control.

---

# scripts/

Purpose:

Infrastructure automation.

Examples:

```text
scripts/

deploy.sh

backup.sh

restore.sh
```

Scripts should remain idempotent whenever possible.

---

# Testing Repository Structure

Testing validates every engineering layer.

Official structure:

```text
tests/

unit/

integration/

security/

performance/

fixtures/

data/
```

Testing is considered a first-class engineering responsibility.

---

# unit/

Purpose:

Unit testing.

Responsibilities:

- Individual modules
- Services
- Utilities
- Components

Unit tests should remain isolated.

---

# integration/

Purpose:

Integration testing.

Responsibilities:

- API testing
- Database interaction
- Service coordination
- Authentication flow

Integration tests validate module interaction.

---

# security/

Purpose:

Security testing.

Examples:

- Authentication testing
- Authorization testing
- Token validation
- Injection testing
- Permission validation

Security testing should execute independently from functional testing.

---

# performance/

Purpose:

Performance benchmarking.

Examples:

- API throughput
- Database performance
- Telemetry ingestion
- WebSocket scalability

Performance testing should simulate realistic workloads.

---

# fixtures/

Purpose:

Reusable test resources.

Examples:

```text
fixtures/

users/

organizations/

telemetry/

alerts/
```

Fixtures improve test consistency.

---

# data/

Purpose:

Testing datasets.

Examples:

- Sample telemetry
- Mock users
- Mock organizations
- Synthetic alerts

Production data must never be committed to the repository.

---

# Shared Repository Resources

The repository also contains shared engineering resources.

Examples:

```text
.github/

.vscode/

README.md

LICENSE

.gitignore

docker-compose.yml
```

These files provide:

- Development workflows
- Repository configuration
- Documentation
- Licensing
- Local development

They are shared across all engineering domains.

---
# Naming Conventions

Consistent naming is required across the entire SentinelTwin AI repository.

Naming conventions improve:

- Readability
- Discoverability
- Maintainability
- Automation support
- AI-assisted development

Every module must follow these standards.

---

# Folder Naming

All folders use:

```text
lowercase-with-hyphens
```

Examples:

```text
endpoint-agent

feature-engineering

security-model

digital-twin
```

Invalid examples:

```text
EndpointAgent

FeatureEngineering

feature_engineering

Feature_Engineering
```

Folder naming must remain consistent across the repository.

---

# Python File Naming

All Python files use:

```text
snake_case.py
```

Examples:

```text
asset_service.py

telemetry_processor.py

risk_engine.py

authentication.py
```

Invalid examples:

```text
AssetService.py

TelemetryProcessor.py

RiskEngine.py
```

---

# TypeScript File Naming

Standard TypeScript files use:

```text
camelCase.ts
```

Examples:

```text
assetService.ts

alertApi.ts

telemetryUtils.ts
```

---

# React Component Naming

React components use:

```text
PascalCase.tsx
```

Examples:

```text
Dashboard.tsx

AssetTable.tsx

AlertCard.tsx

TwinViewer.tsx
```

Component names must describe purpose.

Avoid generic names such as:

```text
Component.tsx

Item.tsx

Thing.tsx
```

---

# Class Naming

All classes use:

```text
PascalCase
```

Examples:

```text
AssetService

TelemetryProcessor

RiskEngine

AlertManager
```

---

# Function Naming

Python:

```text
snake_case
```

Examples:

```text
calculate_risk()

process_telemetry()

generate_report()
```

TypeScript:

```text
camelCase
```

Examples:

```text
calculateRisk()

processTelemetry()

generateReport()
```

---

# Variable Naming

Variables should be descriptive.

Good examples:

```text
telemetry_record

organization_id

risk_score

alert_count
```

Poor examples:

```text
x

tmp

data

value
```

Names should communicate intent.

---

# Constant Naming

Constants use:

```text
UPPER_SNAKE_CASE
```

Examples:

```text
MAX_TELEMETRY_SIZE

JWT_EXPIRATION_HOURS

DEFAULT_HEARTBEAT_INTERVAL
```

---

# Database Naming

Tables:

```text
snake_case
```

Examples:

```text
users

organizations

assets

digital_twins

telemetry_records
```

Columns:

```text
snake_case
```

Examples:

```text
organization_id

asset_id

created_at

updated_at
```

---

# API Naming

REST endpoints use:

```text
lowercase-with-hyphens
```

Examples:

```text
/api/v1/assets

/api/v1/alerts

/api/v1/digital-twins
```

Actions should be represented through HTTP methods rather than endpoint names.

Preferred:

```text
POST /api/v1/assets
```

Avoid:

```text
POST /api/v1/create-asset
```

---

# Documentation Naming

Documentation files use:

```text
UPPERCASE_WITH_UNDERSCORES.md
```

Examples:

```text
SYSTEM_ARCHITECTURE.md

AUTHENTICATION.md

TELEMETRY_PIPELINE.md

DIGITAL_TWIN_ENGINE.md
```

Numbered architecture documents use:

```text
01_SYSTEM_ARCHITECTURE.md

02_TECH_STACK.md

03_FOLDER_STRUCTURE.md
```

---

# Module Ownership Rules

Every module has a clearly defined owner.

Ownership prevents responsibility overlap.

Each module should answer:

```text
Who owns this functionality?
```

with exactly one answer.

---

# Frontend Ownership

Frontend owns:

- User interaction
- Navigation
- Visualization
- Client-side validation
- Dashboard rendering

Frontend does NOT own:

- Authentication decisions
- Risk calculations
- Alert generation
- Database access
- AI execution

---

# Backend Ownership

Backend owns:

- APIs
- Authentication
- Authorization
- Business workflows
- Digital Twins
- Telemetry processing
- Report generation

Backend does NOT own:

- UI rendering
- Model training
- Infrastructure provisioning

---

# AI Ownership

AI owns:

- Model training
- Model evaluation
- Prediction
- Risk scoring
- Threat classification

AI does NOT own:

- Authentication
- User management
- Database administration
- Frontend state

---

# Endpoint Agent Ownership

Endpoint Agent owns:

- Telemetry collection
- Asset discovery
- Health monitoring
- Secure communication

Endpoint Agent does NOT own:

- Risk decisions
- Alert generation
- AI models
- Database access

---

# Infrastructure Ownership

Infrastructure owns:

- Deployment
- Networking
- Containerization
- Provisioning
- Monitoring

Infrastructure does NOT own:

- Application logic
- Business rules
- User workflows

---

# Import Rules

The repository follows strict import boundaries.

Modules should only import from approved layers.

---

# Allowed Imports

Frontend:

```text
components

↓

features

↓

services

↓

api
```

Backend:

```text
api

↓

services

↓

repositories

↓

database
```

AI:

```text
datasets

↓

feature_engineering

↓

training

↓

prediction
```

---

# Forbidden Imports

Frontend:

```text
Frontend

↓

Database
```

Forbidden.

---

Backend:

```text
API

↓

Database
```

Forbidden.

Must use:

```text
API

↓

Services

↓

Repositories

↓

Database
```

---

AI:

```text
Prediction

↓

Training
```

Forbidden.

Prediction must remain independent from training.

---

Endpoint Agent:

```text
Agent

↓

Database
```

Forbidden.

Communication must occur through official APIs only.

---

# Dependency Rules

Dependencies must always move downward through architectural layers.

Official dependency direction:

```text
Frontend

↓

Backend API

↓

Business Services

↓

Repositories

↓

Database
```

AI consumes telemetry produced by backend services.

The AI layer must never become a dependency of authentication systems.

---

# Circular Dependencies

Circular dependencies are forbidden.

Example:

```text
AssetService

↓

AlertService

↓

AssetService
```

Forbidden.

Services must remain independently testable.

---

# Shared Utilities Rule

Utilities may be shared only when:

- Reusable
- Independent
- Stateless
- Generic

Business logic must never be moved into utility modules.

---

# Repository Expansion Policy

The repository is expected to grow.

Growth must remain controlled.

Every new folder requires:

1. Defined responsibility
2. Architectural justification
3. Documentation update
4. Ownership assignment

---

# Creating New Modules

Before creating a new module ask:

```text
Can this responsibility belong to an existing module?
```

If yes:

Do not create a new module.

If no:

Create a documented module.

---

# Top-Level Folder Expansion

Adding a new top-level folder requires:

- Architecture review
- Engineering approval
- Documentation update

Top-level folders represent major engineering domains.

They should remain stable.

---

# Repository Stability Principle

Repository structure should evolve slowly.

Frequent structural changes increase:

- Complexity
- Technical debt
- Developer confusion
- AI implementation errors

Stability is preferred over constant reorganization.

---

# Engineering Constraints

The repository must always maintain:

- Clear ownership
- Single responsibility
- Predictable structure
- Architectural consistency
- Secure boundaries

Any implementation violating these constraints should be considered an architectural defect.

---