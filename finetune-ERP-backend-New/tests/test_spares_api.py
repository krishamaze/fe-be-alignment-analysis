import pytest
from rest_framework.test import APIClient
from spares.models import Spare


@pytest.mark.django_db
class TestSpareAPI:
    def test_list_spares(self):
        Spare.objects.create(name="Wheel", type="bike", is_available=True, sku="WH1", price=10)
        client = APIClient()
        resp = client.get("/api/spares/")
        assert resp.status_code == 200
        data = resp.json()
        item = data["content"][0]
        assert item["name"] == "Wheel"

    def test_retrieve_spare(self):
        spare = Spare.objects.create(name="Seat", type="bike", is_available=False, sku="ST1", price=20)
        client = APIClient()
        resp = client.get(f"/api/spares/{spare.id}/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == spare.id
        assert data["is_available"] is False
