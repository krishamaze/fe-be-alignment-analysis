# Testing

Install test dependencies and run `pytest`:
```bash
pip install -e .[backend,dev,test]
pytest
```

Fixtures live in `tests/conftest.py` providing users, stores and helper factories. Integration tests use `rest_framework.test.APIClient` and `freezegun` for time control.

Example:
```python
client = APIClient()
client.force_authenticate(user=advisor1)
resp = client.post('/api/attendance/check-in', {...}, format='multipart')
assert resp.status_code == 201
```
