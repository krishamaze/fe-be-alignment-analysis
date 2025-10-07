# Testing Guide

This guide covers testing strategies and execution for both the Django backend and React frontend.

## Backend Testing

### Running Tests

Install test dependencies and run `pytest`:
```bash
pip install -e .[backend,dev,test]
pytest finetune-ERP-backend-New/tests -q
```

### Test Fixtures

Fixtures live in `tests/conftest.py` providing users, stores and helper factories. Integration tests use `rest_framework.test.APIClient` and `freezegun` for time control.

### Integration Test Example

```python
from rest_framework.test import APIClient

client = APIClient()
client.force_authenticate(user=advisor1)
resp = client.post('/api/attendance/check-in', {...}, format='multipart')
assert resp.status_code == 201
```

## Frontend Testing

### Running Tests

```bash
pnpm --dir finetune-ERP-frontend-New test
```

Vitest discovers files ending in `.test.js` or `.test.jsx`.

### Test Patterns

- Use `describe`/`it` from Vitest.
- Mock API calls via `vi.fn()` or Axios mock adapters when needed.

### DOM Testing

- Add `// @vitest-environment jsdom` to files that require the DOM.
- Set `globalThis.IS_REACT_ACT_ENVIRONMENT = true` before calling React's `act()`.

### Test Example

```js
import { describe, it, expect } from 'vitest';

describe('math', () => {
  it('adds numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Coverage Goals

Aim for **80%** statement coverage. Run with `vitest run --coverage` to generate reports.

## Related Documentation

- [Developer Guide](DEVELOPER_GUIDE.md) – Development workflows
- [Architecture Guide](ARCHITECTURE.md) – System architecture overview

