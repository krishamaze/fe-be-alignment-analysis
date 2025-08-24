import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


@pytest.mark.django_db
def test_login_without_store():
    User = get_user_model()
    User.objects.create_user(
        username="nostore", password="pw", email="nostore@example.com", role="advisor"
    )
    client = APIClient()
    resp = client.post(
        "/api/auth/login", {"username": "nostore", "password": "pw"}, format="json"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "nostore"
    assert data["role"] == "advisor"
    assert data["store"] is None


@pytest.mark.django_db
def test_login_with_store(store_s1):
    User = get_user_model()
    User.objects.create_user(
        username="withstore",
        password="pw",
        email="withstore@example.com",
        role="advisor",
        store=store_s1,
    )
    client = APIClient()
    resp = client.post(
        "/api/auth/login", {"username": "withstore", "password": "pw"}, format="json"
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "withstore"
    assert data["role"] == "advisor"
    assert data["store"] == store_s1.id


@pytest.mark.django_db
def test_login_throttle():
    client = APIClient()
    for _ in range(5):
        client.post(
            "/api/auth/login", {"username": "bad", "password": "pw"}, format="json"
        )
    resp = client.post(
        "/api/auth/login", {"username": "bad", "password": "pw"}, format="json"
    )
    assert resp.status_code == 429
