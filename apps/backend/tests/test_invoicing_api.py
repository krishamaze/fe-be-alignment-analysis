import pytest
from datetime import date, time
from rest_framework.test import APIClient
from bookings.models import Booking


@pytest.mark.django_db
def test_invoice_creation_and_payment(admin_user):
    booking = Booking.objects.create(
        name="John Doe", date=date.today(), time=time(10, 0)
    )
    client = APIClient()
    client.force_authenticate(user=admin_user)

    payload = {
        "booking": booking.id,
        "cgst": 9,
        "sgst": 9,
        "igst": 0,
        "line_items": [
            {
                "description": "Service",
                "hsn_code": "1234",
                "quantity": 1,
                "unit_price": "100.00",
            }
        ],
    }

    resp = client.post("/api/invoices/", payload, format="json")
    assert resp.status_code == 201
    invoice_id = resp.data["id"]
    assert resp.data["invoice_no"].startswith("FT-INV-")

    # TODO(v1.1): Enable invoice PDF once Railway system libraries available

    pay_payload = {
        "invoice": invoice_id,
        "mode": "cash",
        "amount": "50.00",
        "ref_no": "", 
        "date": str(date.today()),
    }
    pay_resp = client.post("/api/payments/", pay_payload, format="json")
    assert pay_resp.status_code == 201
