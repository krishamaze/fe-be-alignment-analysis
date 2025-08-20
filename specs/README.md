# API Specifications

This directory contains the canonical API specifications for the Finetune ERP system.

## Files

### `openapi.yaml`
Complete OpenAPI 3.0.3 specification for the Finetune ERP API, including:

- **Authentication endpoints** (login, logout, token refresh)
- **User management** (CRUD operations, role-based access)
- **Store management** (stores, branch head assignment)
- **Attendance system** (check-in/out, status tracking)
- **Comprehensive schemas** for all data models
- **Error handling** patterns and validation rules

## Usage

### For Frontend Development
```bash
# Generate TypeScript types
npx @openapitools/openapi-generator-cli generate \
  -i specs/openapi.yaml \
  -g typescript-fetch \
  -o src/api/generated

# Generate React Query hooks
npx @rtk-query/codegen-openapi specs/openapi.yaml \
  --output-file src/api/generated.ts
```

### For Backend Development
```bash
# Validate API implementation against spec
pip install openapi-spec-validator
openapi-spec-validator specs/openapi.yaml

# Generate documentation
redoc-cli build specs/openapi.yaml --output docs/api.html
```

### For Testing
```bash
# Generate test cases
npm install -g @apidevtools/swagger-parser
swagger-parser validate specs/openapi.yaml
```

## Integration with CI/CD

The OpenAPI specification should be:

1. **Validated** in CI to ensure it's syntactically correct
2. **Used to generate** client code for frontend
3. **Tested against** the actual backend implementation
4. **Published** as documentation for API consumers

## Specification Maintenance

### When to Update
- Adding new endpoints
- Changing request/response schemas
- Modifying authentication requirements
- Adding new error codes
- Changing validation rules

### Best Practices
- Keep schemas DRY using `$ref` and `allOf`
- Include comprehensive examples
- Document all error scenarios
- Use semantic versioning for breaking changes
- Validate changes against existing implementations

## Tools and Resources

### Editors
- [Swagger Editor](https://editor.swagger.io/) - Online editor
- [Insomnia](https://insomnia.rest/) - API client with OpenAPI support
- [Postman](https://www.postman.com/) - API testing with OpenAPI import

### Validation
- [OpenAPI Spec Validator](https://github.com/p1c2u/openapi-spec-validator)
- [Spectral](https://stoplight.io/open-source/spectral) - OpenAPI linter
- [Redoc](https://redocly.github.io/redoc/) - Documentation generator

### Code Generation
- [OpenAPI Generator](https://openapi-generator.tech/) - Multi-language client generation
- [RTK Query](https://redux-toolkit.js.org/rtk-query/usage/code-generation) - React Query hooks
- [FastAPI](https://fastapi.tiangolo.com/) - Python server generation

## Current Status

✅ **Core endpoints documented**:
- Authentication (login, logout, token management)
- User management (CRUD, roles)
- Store management (CRUD, branch head assignment)
- Attendance (check-in/out, status)

🔄 **In Progress**:
- Admin attendance endpoints
- Workledger endpoints
- File upload specifications

📋 **TODO**:
- Add more comprehensive examples
- Include webhook specifications
- Add rate limiting documentation
- Document batch operations

## Validation

To validate the current specification:

```bash
# Install validator
pip install openapi-spec-validator

# Validate spec
openapi-spec-validator specs/openapi.yaml
```

## Contributing

When updating the API specification:

1. **Validate** your changes locally
2. **Test** against actual API implementation
3. **Update** any generated client code
4. **Document** breaking changes in CHANGELOG
5. **Review** with both frontend and backend teams

The specification serves as the **single source of truth** for API contracts between frontend and backend teams.
