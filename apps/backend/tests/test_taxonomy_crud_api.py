import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from catalog.models import Department, Category, SubCategory


@pytest.mark.django_db
def test_department_crud_and_validations():
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    client = APIClient()

    resp = client.post("/api/departments", {"name": "Electronics"}, format="json")
    assert resp.status_code in (401, 403)

    client.force_authenticate(user=admin)
    resp = client.post("/api/departments", {"name": "Electronics"}, format="json")
    assert resp.status_code == 201
    slug = resp.json()["slug"]

    resp = client.post("/api/departments", {"name": "Electronics"}, format="json")
    assert resp.status_code == 400

    resp = client.put(
        f"/api/departments/{slug}", {"name": "New", "slug": "new"}, format="json"
    )
    assert resp.status_code == 200
    assert resp.json()["slug"] == slug

    resp = client.delete(f"/api/departments/{slug}")
    assert resp.status_code == 204


@pytest.mark.django_db
def test_category_crud_and_validations():
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    dept = Department.objects.create(name="Electronics")
    client = APIClient()

    resp = client.post(
        "/api/categories",
        {"name": "Phones", "department": dept.id},
        format="json",
    )
    assert resp.status_code in (401, 403)

    client.force_authenticate(user=admin)
    resp = client.post("/api/categories", {"name": "Phones"}, format="json")
    assert resp.status_code == 400

    resp = client.post(
        "/api/categories",
        {"name": "Phones", "department": dept.id},
        format="json",
    )
    assert resp.status_code == 201
    slug = resp.json()["slug"]

    resp = client.post(
        "/api/categories",
        {"name": "Phones", "department": dept.id},
        format="json",
    )
    assert resp.status_code == 400

    resp = client.put(
        f"/api/categories/{slug}",
        {"name": "Gadgets", "department": dept.id, "slug": "new"},
        format="json",
    )
    assert resp.status_code == 200
    assert resp.json()["slug"] == slug


@pytest.mark.django_db
def test_subcategory_crud_and_validations():
    admin = CustomUser.objects.create_user(
        username="admin", email="a@b.com", password="x", role="system_admin"
    )
    dept = Department.objects.create(name="Electronics")
    cat = Category.objects.create(name="Phones", department=dept)
    client = APIClient()

    resp = client.post(
        "/api/subcategories",
        {"name": "Smartphones", "category": cat.id},
        format="json",
    )
    assert resp.status_code in (401, 403)

    client.force_authenticate(user=admin)
    resp = client.post("/api/subcategories", {"name": "Smartphones"}, format="json")
    assert resp.status_code == 400

    resp = client.post(
        "/api/subcategories",
        {"name": "Smartphones", "category": cat.id},
        format="json",
    )
    assert resp.status_code == 201
    slug = resp.json()["slug"]

    resp = client.post(
        "/api/subcategories",
        {"name": "Smartphones", "category": cat.id},
        format="json",
    )
    assert resp.status_code == 400

    resp = client.put(
        f"/api/subcategories/{slug}",
        {"name": "Mobiles", "category": cat.id, "slug": "new"},
        format="json",
    )
    assert resp.status_code == 200
    assert resp.json()["slug"] == slug
