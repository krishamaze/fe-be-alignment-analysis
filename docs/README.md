# Finetune ERP Documentation

Welcome to the Finetune ERP documentation. This directory contains comprehensive guides and references for the monorepo.

## 📚 Documentation Structure

### Getting Started
- [Getting Started](./GETTING_STARTED.md) - Quick setup and first steps
- [Developer Guide](./DEVELOPER_GUIDE.md) - Day-to-day development workflows
- [Configuration](./CONFIGURATION.md) - Environment and settings

### Architecture & Design
- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [Database](./DATABASE.md) - Database schema and design
- [Authentication](./AUTHENTICATION.md) - Auth system documentation
- [Security](./SECURITY.md) - Security guidelines and practices

### Frontend Development
- [Frontend Features](./FRONTEND_FEATURES.md) - Feature documentation
- [UI Components](./UI_COMPONENTS.md) - Component library
- [State Management](./STATE_MANAGEMENT.md) - Redux and state patterns

### Operations
- [Deployment](./DEPLOYMENT.md) - Deployment guides
- [Performance](./PERFORMANCE.md) - Performance optimization
- [Testing](./TESTING.md) - Testing strategies
- [Runbook](./RUNBOOK.md) - Operational procedures

### References
- [API Reference](./API_REFERENCE.md) - API documentation
- [API Routes](./reference/API_ROUTES.md) - Generated API routes
- [Frontend Routes](./reference/FRONTEND_ROUTES.md) - Frontend routing
- [Environment Keys](./reference/ENVIRONMENT_KEYS.md) - Environment variables

### Archive
- [Archive](./archive/) - Historical documentation and deprecated guides

## 🔄 Keeping Documentation Updated

Documentation is automatically generated for:
- API routes (`reference/API_ROUTES.md`)
- Environment variables (`reference/ENVIRONMENT_KEYS.md`)
- Frontend routes (`reference/FRONTEND_ROUTES.md`)

To regenerate references:
```bash
python tools/scripts/generate_references.py
```

## 📝 Contributing to Documentation

When adding new features or making changes:
1. Update relevant documentation files
2. Regenerate references if routes or environment variables change
3. Follow the [Diátaxis](https://diataxis.fr/) documentation framework:
   - **Tutorials**: Learning-oriented
   - **How-to guides**: Problem-oriented (like DEVELOPER_GUIDE.md)
   - **Reference**: Information-oriented (like API_REFERENCE.md)
   - **Explanation**: Understanding-oriented (like ARCHITECTURE.md)
