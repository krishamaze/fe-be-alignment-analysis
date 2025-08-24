# Test Guide

## Backend

Install dependencies:

```bash
pip install -r requirements-dev.txt
```

The backend tests rely on **freezegun** to mock datetimes in booking lifecycle scenarios.

Run tests:

```bash
pytest
```

## Frontend

Install dependencies:

```bash
npm ci
```

Vitest is configured with a **jsdom** environment for React component tests.

Run tests:

```bash
npm test
```
