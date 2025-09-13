# Test Guide

## Backend

Install dependencies:

```bash
pip install -e .[backend,dev,test]
```

Apply migrations so the test database has the latest schemas:

```bash
python manage.py makemigrations catalog marketing
python manage.py migrate
```

`pytest.ini` sets `DJANGO_SETTINGS_MODULE = finetune_ERP_backend_New.settings`, so tests can run without additional environment variables. The backend tests rely on **freezegun** to mock datetimes in booking lifecycle scenarios.

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

`jsdom` is installed as a dev dependency and `vitest.config.js` specifies `environment: "jsdom"` for dashboard tests.

Run tests:

```bash
npm test
```

## Related Guides
- [CI Guide](project/CI_GUIDE.md)
- [API Guide](API_GUIDE.md)
