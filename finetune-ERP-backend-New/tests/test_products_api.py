import pytest
from rest_framework.test import APIClient
from accounts.models import CustomUser
from products.models import Product, Variant


@pytest.mark.django_db
def test_anonymous_can_list_products():
    Product.objects.create(name='Phone', brand='ACME', category='Mobile', price=100)
    client = APIClient()
    resp = client.get('/api/products')
    assert resp.status_code == 200
    assert resp.json()['content'][0]['brand'] == 'ACME'


@pytest.mark.django_db
def test_filter_by_brand_and_price():
    Product.objects.create(name='Phone', brand='ACME', category='Mobile', price=100)
    Product.objects.create(name='Tablet', brand='ACME', category='Tablet', price=200)
    Product.objects.create(name='Laptop', brand='Mega', category='Laptop', price=150)
    client = APIClient()
    resp = client.get('/api/products?brand=ACME&min_price=150')
    data = resp.json()['content']
    assert len(data) == 1
    assert data[0]['name'] == 'Tablet'


@pytest.mark.django_db
def test_only_admin_can_create_product():
    client = APIClient()
    resp = client.post('/api/products', {'name': 'Cam', 'brand': 'ACME', 'category': 'Camera', 'price': 50})
    assert resp.status_code in (401, 403)
    user = CustomUser.objects.create_user(username='admin', email='a@b.com', password='x', role='system_admin')
    client.force_authenticate(user=user)
    resp = client.post('/api/products', {'name': 'Cam', 'brand': 'ACME', 'category': 'Camera', 'price': 50})
    assert resp.status_code == 201
    assert Product.objects.filter(name='Cam').exists()


@pytest.mark.django_db
def test_variant_filters_and_permissions():
    p1 = Product.objects.create(name='Phone', brand='ACME', category='Mobile', price=100)
    Variant.objects.create(product=p1, name='64GB', sku='P64', price=110)
    client = APIClient()
    resp = client.get(f'/api/variants?product={p1.id}')
    assert resp.status_code == 200
    assert resp.json()['content'][0]['sku'] == 'P64'
    resp = client.post('/api/variants', {'product': p1.id, 'name': '128GB', 'sku': 'P128', 'price': 120})
    assert resp.status_code in (401, 403)
    user = CustomUser.objects.create_user(username='admin', email='b@b.com', password='x', role='system_admin')
    client.force_authenticate(user=user)
    resp = client.post('/api/variants', {'product': p1.id, 'name': '128GB', 'sku': 'P128', 'price': 120})
    assert resp.status_code == 201
    assert Variant.objects.filter(sku='P128').exists()
