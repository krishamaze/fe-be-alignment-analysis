# Testing

## Running tests

```bash
npm test
```

Vitest discovers files ending in `.test.js` or `.test.jsx`.

## Patterns

- Use `describe`/`it` from Vitest.
- Mock API calls via `vi.fn()` or Axios mock adapters when needed.

Example:

```js
import { describe, it, expect } from 'vitest';

describe('math', () => {
  it('adds numbers', () => {
    expect(1 + 1).toBe(2);
  });
});
```

## Coverage

Aim for **80%** statement coverage. Run with `vitest run --coverage` to generate reports.
