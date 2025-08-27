import pytest
from rest_framework.test import APIClient

from accounts.models import CustomUser
from catalog.models import Product, Variant, Category, Department
from marketing.models import Brand
from inventory.models import StockLedger, PriceLog


@pytest.mark.django_db
def test_stock_entry_updates_ledger(store_s1):
    user = CustomUser.objects.create_user(
        username="u", email="u@example.com", password="x", role="system_admin"
    )
    client = APIClient()
    client.force_authenticate(user=user)

    brand = Brand.objects.create(name="B1")
    dept = Department.objects.create(name="D1")
    cat = Category.objects.create(name="C1", department=dept)
    product = Product.objects.create(name="P1", brand=brand, price=1, stock=0)
    variant = Variant.objects.create(product=product, variant_name="V1", price=1, stock=0)

    resp = client.post(
        "/api/stock-entries/",
        {
            "entry_type": "purchase",
            "store": store_s1.id,
            "product_variant": variant.id,
            "quantity": 5,
            "unit_price": "10",
        },
        format="json",
    )
    assert resp.status_code == 201
    ledger = StockLedger.objects.get(store=store_s1, product_variant=variant)
    assert ledger.quantity == 5


@pytest.mark.django_db
def test_price_log_created_on_variant_change():
    brand = Brand.objects.create(name="B1")
    dept = Department.objects.create(name="D1")
    cat = Category.objects.create(name="C1", department=dept)
    product = Product.objects.create(name="P1", brand=brand, price=1, stock=0)
    variant = Variant.objects.create(product=product, variant_name="V1", price=1, stock=0)

    variant.price = 2
    variant.save()
    log = PriceLog.objects.filter(product_variant=variant).first()
    assert log and float(log.old_price) == 1 and float(log.new_price) == 2
