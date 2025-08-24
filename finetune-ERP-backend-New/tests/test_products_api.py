import pytest
from rest_framework.test import APIClient
from marketing.models import Brand
from catalog.models import Category, Product, Variant


@pytest.mark.django_db
def test_product_list_and_detail_by_slug():
    brand = Brand.objects.create(name="B1")
    cat = Category.objects.create(name="Phones", slug="phones")
    product = Product.objects.create(name="P1", brand=brand, category=cat, price=10, stock=5)
    client = APIClient()
    resp = client.get("/api/products")
    assert resp.status_code == 200
    assert resp.json()["content"][0]["slug"] == product.slug
    resp = client.get(f"/api/products/{product.slug}")
    assert resp.status_code == 200
    assert resp.json()["id"] == product.id


@pytest.mark.django_db
def test_product_filter_brand_availability():
    brand1 = Brand.objects.create(name="B1")
    brand2 = Brand.objects.create(name="B2")
    cat = Category.objects.create(name="Phones", slug="phones")
    Product.objects.create(name="P1", brand=brand1, category=cat, price=10, stock=5, availability=True)
    Product.objects.create(name="P2", brand=brand2, category=cat, price=20, stock=0, availability=False)
    client = APIClient()
    resp = client.get(f"/api/products?brand={brand1.id}")
    assert len(resp.json()["content"]) == 1
    resp = client.get("/api/products?availability=true")
    assert len(resp.json()["content"]) == 1


@pytest.mark.django_db
def test_variant_list_and_detail():
    brand = Brand.objects.create(name="B1")
    cat = Category.objects.create(name="Phones", slug="phones")
    product = Product.objects.create(name="P1", brand=brand, category=cat, price=10, stock=5)
    v1 = Variant.objects.create(product=product, variant_name="V1", price=5, stock=1)
    Variant.objects.create(product=product, variant_name="V2", price=6, stock=1)
    client = APIClient()
    resp = client.get(f"/api/variants?product={product.slug}")
    assert resp.status_code == 200
    assert len(resp.json()["content"]) == 2
    resp = client.get(f"/api/variants/{v1.slug}")
    assert resp.status_code == 200
    assert resp.json()["slug"] == v1.slug
