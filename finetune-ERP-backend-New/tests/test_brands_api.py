import pytest
from rest_framework.test import APIClient
from brands.models import Brand


@pytest.mark.django_db
class TestBrandAPI:
    def test_list_brands(self):
        Brand.objects.create(name="BrandA", logo="http://example.com/logo.png")
        client = APIClient()
        resp = client.get("/api/brands/")
        assert resp.status_code == 200
        data = resp.json()
        item = data["content"][0]
        assert item["name"] == "BrandA"

    def test_retrieve_brand(self):
        brand = Brand.objects.create(name="BrandB", logo="http://ex.com/l.png")
        client = APIClient()
        resp = client.get(f"/api/brands/{brand.id}/")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == brand.id
        assert data["logo"] == "http://ex.com/l.png"
