import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from marketing.models import Brand


@pytest.mark.django_db
def test_non_admin_cannot_create_brand():
    client = APIClient()
    # unauthenticated
    resp = client.post("/api/brands/", {"name": "B1"})
    assert resp.status_code in (401, 403)

    user = CustomUser.objects.create_user(
        username="u", email="u@example.com", password="x", role="advisor"
    )
    client.force_authenticate(user=user)
    resp = client.post("/api/brands/", {"name": "B1"})
    assert resp.status_code == 403


@pytest.mark.django_db
def test_admin_can_crud_brand():
    client = APIClient()
    admin = CustomUser.objects.create_user(
        username="a", email="a@example.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=admin)
    resp = client.post("/api/brands/", {"name": "B1"})
    assert resp.status_code == 201
    brand_id = resp.json()["id"]

    resp = client.put(f"/api/brands/{brand_id}/", {"name": "B2"})
    assert resp.status_code == 200
    assert Brand.objects.get(id=brand_id).name == "B2"

    resp = client.delete(f"/api/brands/{brand_id}/")
    assert resp.status_code == 204
    assert not Brand.objects.filter(id=brand_id).exists()
