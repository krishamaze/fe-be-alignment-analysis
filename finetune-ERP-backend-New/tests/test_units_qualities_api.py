import pytest
from rest_framework.test import APIClient
from marketing.models import Brand
from catalog.models import (
    Department,
    Category,
    SubCategory,
    Product,
    Variant,
    Unit,
    Quality,
)
from spares.models import Spare


@pytest.mark.django_db
def test_list_units():
    Unit.objects.create(name="Piece")
    client = APIClient()
    resp = client.get("/api/units")
    assert resp.status_code == 200
    assert resp.json()["content"][0]["slug"] == "piece"


@pytest.mark.django_db
def test_list_qualities():
    Quality.objects.create(name="Premium")
    client = APIClient()
    resp = client.get("/api/qualities")
    assert resp.status_code == 200
    assert resp.json()["content"][0]["slug"] == "premium"


@pytest.mark.django_db
def test_spare_includes_quality():
    q = Quality.objects.create(name="Premium")
    Spare.objects.create(name="Wheel", sku="WH1", price=10, quality=q)
    client = APIClient()
    resp = client.get("/api/spares")
    data = resp.json()["content"][0]
    assert data["quality_slug"] == "premium"
    assert data["quality_name"] == "Premium"


@pytest.mark.django_db
def test_product_and_variant_include_unit():
    unit = Unit.objects.create(name="Piece")
    brand = Brand.objects.create(name="B1")
    dept = Department.objects.create(name="Electronics")
    cat = Category.objects.create(name="Phones", department=dept)
    sub = SubCategory.objects.create(name="Smartphones", category=cat)
    product = Product.objects.create(
        name="P1", brand=brand, subcategory=sub, price=10, stock=1, unit=unit
    )
    Variant.objects.create(product=product, variant_name="V1", price=5, stock=1)
    client = APIClient()
    resp = client.get("/api/products")
    pdata = resp.json()["content"][0]
    assert pdata["unit_slug"] == "piece"
    resp = client.get(f"/api/variants?product={product.slug}")
    vdata = resp.json()["content"][0]
    assert vdata["unit_name"] == "Piece"
