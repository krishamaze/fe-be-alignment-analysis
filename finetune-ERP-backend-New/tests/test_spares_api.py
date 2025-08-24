import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from spares.models import Spare


@pytest.mark.django_db
def test_anonymous_can_list_spares():
    Spare.objects.create(name="Wheel", sku="WH1", price=10)
    client = APIClient()
    resp = client.get("/api/spares")
    assert resp.status_code == 200
    data = resp.json()["content"][0]
    assert data["sku"] == "WH1"
    assert "price" not in data


@pytest.mark.django_db
def test_only_admin_can_create_spare():
    client = APIClient()
    # Anonymous should be unauthorized
    resp = client.post("/api/spares", {"name": "Seat", "sku": "ST1", "price": 20})
    assert resp.status_code in (401, 403)

    user = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client.force_authenticate(user=user)
    resp = client.post("/api/spares", {"name": "Seat", "sku": "ST1", "price": 20})
    assert resp.status_code == 201
    assert Spare.objects.filter(sku="ST1").exists()


@pytest.mark.django_db
def test_admin_sees_price_in_list():
    Spare.objects.create(name="Wheel", sku="WH1", price=10)
    admin = CustomUser.objects.create_user(
        username="a", email="a@b.com", password="x", role="system_admin"
    )
    client = APIClient()
    client.force_authenticate(user=admin)
    resp = client.get("/api/spares")
    assert resp.status_code == 200
    assert resp.json()["content"][0]["price"] == "10.00"


@pytest.mark.django_db
def test_search_by_sku():
    Spare.objects.create(name="Wheel", sku="WH1", price=10)
    Spare.objects.create(name="Seat", sku="ST1", price=20)
    client = APIClient()
    resp = client.get("/api/spares?search=ST1")
    data = resp.json()["content"]
    assert len(data) == 1
    assert data[0]["sku"] == "ST1"
