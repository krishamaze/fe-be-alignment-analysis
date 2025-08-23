import pytest
from rest_framework.test import APIClient
from django.core.exceptions import ValidationError
from departments.models import Department
from categories.models import Category


@pytest.mark.django_db
def test_category_three_level_limit():
    d = Department.objects.create(name='Electronics', slug='electronics')
    r = Category.objects.create(name='Root', slug='root', department=d)
    c = Category.objects.create(name='Child', slug='child', department=d, parent=r)
    g = Category.objects.create(name='Grand', slug='grand', department=d, parent=c)
    with pytest.raises(ValidationError):
        Category.objects.create(name='Great', slug='great', department=d, parent=g)


@pytest.mark.django_db
def test_category_list_nested_and_redirect():
    d = Department.objects.create(name='Electronics', slug='electronics')
    r = Category.objects.create(name='Phones', slug='phones', department=d)
    Category.objects.create(name='Smart', slug='smart', department=d, parent=r)
    client = APIClient()
    resp = client.get('/api/categories')
    assert resp.status_code == 200
    assert resp.json()['content'][0]['children'][0]['slug'] == 'smart'
    resp = client.get(f'/api/category/{r.id}', follow=False)
    assert resp.status_code in (301, 302)
    assert resp['Location'].endswith('/api/categories/phones')


@pytest.mark.django_db
def test_department_redirect():
    d = Department.objects.create(name='Electronics', slug='electronics')
    client = APIClient()
    resp = client.get(f'/api/department/{d.id}', follow=False)
    assert resp.status_code in (301, 302)
    assert resp['Location'].endswith('/api/departments/electronics')
