import pytest
from django.test import override_settings

SECURITY_HEADERS = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-XSS-Protection": "1; mode=block",
}

ENDPOINTS = [
    "/api/spares",
    "/admin/login/",
    "/api/products",
]


def _assert_headers(response):
    for header, expected in SECURITY_HEADERS.items():
        assert response[header] == expected
    csp = response["Content-Security-Policy"]
    assert "default-src 'self'" in csp
    assert "object-src 'none'" in csp
    assert "'unsafe-inline'" not in csp


@pytest.mark.django_db
@pytest.mark.parametrize("endpoint", ENDPOINTS)
@override_settings(DEBUG=True)
def test_security_headers_debug_true(client, endpoint):
    resp = client.get(endpoint)
    _assert_headers(resp)


@pytest.mark.django_db
@pytest.mark.parametrize("endpoint", ENDPOINTS)
@override_settings(DEBUG=False)
def test_security_headers_debug_false(client, endpoint):
    resp = client.get(endpoint)
    _assert_headers(resp)
