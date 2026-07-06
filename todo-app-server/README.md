# Todo Backend Server Application

This is the backend API server application for the Todo Management App, built with NestJS, TypeScript, and MongoDB (via Mongoose).

## Architecture and Design Patterns

The server is built with scalability, testability, and strict decoupling in mind. Key architectural features include:

### 1. Modular Directory Design
- Organized into feature modules (`AuthModule`, `UserModule`, `TodoModule`) where each module encapsulates its own controllers, services, schemas, and dependency injections.
- Promotes strict boundary isolation and modular cohesion.

### 2. Controller-Service-Repository Flow
- **Controllers:** Map REST endpoints, handle request parsing, and enforce input schema validation using class-validator DTOs.
- **Services:** Contain business rules, domain orchestration, and workflow logic.
- **Schemas/Models:** Define MongoDB collections using Mongoose schemas and compile them into injectable document models.

### 3. Middleware & Security Filters
- **Authentication Guards:** A passport-jwt strategy validates token integrity, extracts the user payload, and injects it into authenticated request contexts.
- **Dynamic CORS:** Restricts requests to allowed origins configured dynamically using the CORS_ORIGINS environment variable.
- **Configurable Expirations:** Supports configurable JWT token lifetimes via environment settings (JWT_EXPIRY).

---

## How to Run

To run the server locally, run end-to-end tests, or deploy using Docker Compose, please refer to the main repository documentation:

Please visit: **[Root README](../README.md)**
