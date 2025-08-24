import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
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


@pytest.mark.django_db
def test_admin_crud_and_validations():
    brand = Brand.objects.create(name="B1")
    cat = Category.objects.create(name="Phones", slug="phones")
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client = APIClient()

    # Anonymous create forbidden
    resp = client.post(
        "/api/products",
        {
            "name": "P1",
            "brand": brand.id,
            "category": cat.id,
            "price": 10,
            "stock": 5,
            "availability": True,
        },
        format="json",
    )
    assert resp.status_code in (401, 403)

    client.force_authenticate(user=admin)
    # Negative price
    resp = client.post(
        "/api/products",
        {
            "name": "P1",
            "brand": brand.id,
            "category": cat.id,
            "price": -1,
            "stock": 5,
            "availability": True,
        },
        format="json",
    )
    assert resp.status_code == 400

    # Availability vs stock
    resp = client.post(
        "/api/products",
        {
            "name": "P2",
            "brand": brand.id,
            "category": cat.id,
            "price": 5,
            "stock": 0,
            "availability": True,
        },
        format="json",
    )
    assert resp.status_code == 400

    resp = client.post(
        "/api/products",
        {
            "name": "P2",
            "brand": brand.id,
            "category": cat.id,
            "price": 5,
            "stock": 0,
            "availability": False,
        },
        format="json",
    )
    assert resp.status_code == 201
    slug = resp.json()["slug"]

    # Update should not change slug
    resp = client.patch(
        f"/api/products/{slug}",
        {"slug": "new-slug", "name": "New"},
        format="json",
    )
    assert resp.status_code == 200
    prod = Product.objects.get(slug=slug)
    assert prod.name == "New"
    assert prod.slug == slug

    # Variant validations and slug immutability
    resp = client.post(
        "/api/variants",
        {
            "product": slug,
            "variant_name": "V1",
            "price": 1,
            "stock": 0,
            "availability": True,
        },
        format="json",
    )
    assert resp.status_code == 400

    resp = client.post(
        "/api/variants",
        {
            "product": slug,
            "variant_name": "V1",
            "price": 1,
            "stock": 0,
            "availability": False,
        },
        format="json",
    )
    assert resp.status_code == 201
    v_slug = resp.json()["slug"]
    resp = client.patch(
        f"/api/variants/{v_slug}",
        {"slug": "new", "price": 2},
        format="json",
    )
    assert resp.status_code == 200
    var = Variant.objects.get(slug=v_slug)
    assert var.price == 2
    assert var.slug == v_slug

    # Delete product
    resp = client.delete(f"/api/products/{slug}")
    assert resp.status_code == 204
