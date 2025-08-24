import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from store.models import Store


@pytest.mark.django_db
def test_public_read_hides_authority_fields():
    Store.objects.create(store_name="S1", code="S1")
    client = APIClient()
    resp = client.get("/api/stores")
    data = resp.json()["content"][0]
    assert "authority" not in data
    assert "authority_name" not in data
    assert "authority_email" not in data


@pytest.mark.django_db
def test_admin_sees_authority_fields():
    bh = CustomUser.objects.create_user(
        username="bh",
        email="bh@x.com",
        password="x",
        role="branch_head",
        first_name="B",
    )
    store = Store.objects.create(store_name="S1", code="S1", authority=bh)
    admin = CustomUser.objects.create_user(
        username="a", email="a@x.com", password="x", role="system_admin"
    )
    client = APIClient()
    client.force_authenticate(user=admin)
    resp = client.get("/api/stores")
    data = next(x for x in resp.json()["content"] if x["id"] == store.id)
    assert data["authority"] == bh.id
    assert data["authority_name"]
    assert data["authority_email"] == bh.email
