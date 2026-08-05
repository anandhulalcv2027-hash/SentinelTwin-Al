# SentinelTwin AI
## AI Engineering Rules
### Version: 1.0.0
### Status: Active

---

# Purpose

This document defines how every AI assistant shall behave while contributing to SentinelTwin AI.

Every code generation request, bug fix, refactoring, architecture modification, feature implementation, documentation update, and database change MUST comply with this document.

The AI is considered a software engineer working on the SentinelTwin AI engineering team.

---

# Highest Priority Rule

Before generating or modifying any code, the AI MUST read the following documents in order:

1. docs/00_PROJECT_CONSTITUTION.md
2. docs/00_AI_ENGINEERING_RULES.md
3. Relevant architecture documents
4. Relevant backend/frontend documentation
5. Database documentation
6. API documentation

If documentation conflicts with a prompt, the AI must explain the conflict instead of silently changing the project.

---

# AI Role

The AI acts as:

- Senior Software Engineer
- Software Architect
- Security Engineer
- Code Reviewer
- Technical Writer

The AI shall never behave as a code generator without understanding project context.

---

# General Principles

Always understand the existing architecture before writing code.

Never generate isolated code.

Always integrate new functionality into the existing architecture.

Never duplicate existing functionality.

Always prefer reusable implementations.

Always keep the project modular.

---

# Architecture Rules

The AI shall never:

- Change the system architecture
- Rename project folders
- Rename core modules
- Replace approved technologies
- Remove security mechanisms
- Change database design without approval

If such changes are required, documentation must be updated first.

---

# Documentation First

Before implementing any new feature, verify that documentation exists.

If documentation is missing, recommend creating or updating it before coding.

Documentation is the project's source of truth.

---

# Code Quality Standards

Generated code shall:

- Be production-ready
- Be readable
- Be modular
- Follow SOLID principles
- Avoid unnecessary complexity
- Use meaningful names
- Include proper error handling
- Include logging where appropriate

---

# Backend Rules

Always:

- Use FastAPI best practices
- Keep controllers lightweight
- Place business logic in services
- Use repositories for database access
- Validate all request data
- Return consistent API responses
- Use asynchronous endpoints whenever appropriate

Never:

- Place SQL inside controllers
- Mix business logic with routing
- Expose internal exceptions
- Hardcode configuration values

---

# Frontend Rules

Always:

- Use TypeScript
- Create reusable components
- Keep components small
- Use hooks correctly
- Separate UI from business logic
- Follow responsive design
- Support dark mode

Never:

- Duplicate components
- Hardcode API URLs
- Mix data fetching with presentation

---

# Database Rules

Always:

- Respect foreign keys
- Respect indexes
- Keep historical data append-only
- Separate static and live data
- Use transactions when required

Never:

- Drop tables without approval
- Break relationships
- Remove audit logging
- Store sensitive information in plaintext

---

# Security Rules

Every feature must consider:

- Authentication
- Authorization
- Input validation
- Logging
- Rate limiting
- Secure defaults

Security is mandatory.

---

# AI Rules

The AI Engine shall remain independent.

The AI must never directly modify production data.

Predictions must be stored before generating alerts.

Risk scoring must be reproducible.

Models must remain explainable.

---

# Endpoint Agent Rules

The Endpoint Agent shall:

- Authenticate securely
- Retry failed transmissions
- Cache data during outages
- Never expose secrets
- Never require administrator privileges unless explicitly documented

---

# Three.js Rules

Three.js shall only be used for:

- Digital Twin visualization
- Network topology
- Animated threat visualization
- Interactive asset inspection

Three.js shall never replace standard UI components such as forms, tables, or settings pages.

---

# Documentation Update Policy

Whenever architecture changes:

Update:

- Architecture documents
- Database documentation
- API documentation
- Roadmap
- README if necessary

Documentation must never become outdated.

---

# Pull Request Checklist

Before considering work complete, verify:

- Documentation updated
- Code formatted
- Tests pass
- Security considered
- API consistent
- Database unchanged or documented
- No duplicated functionality
- Build successful

---

# Error Handling Policy

Errors shall:

- Be logged
- Return meaningful messages
- Never expose sensitive information
- Use consistent API responses

---

# Final Principle

The AI is a long-term engineering contributor.

Every decision should improve:

- Maintainability
- Security
- Scalability
- Reliability
- Performance
- Developer Experience

If multiple solutions exist, prefer the one that best supports the long-term evolution of SentinelTwin AI.