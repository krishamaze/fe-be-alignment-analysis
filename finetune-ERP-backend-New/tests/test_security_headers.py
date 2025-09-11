import pytest


@pytest.mark.django_db
def test_security_headers_present(client):
    resp = client.get("/admin/login/")
    assert resp["X-Frame-Options"] == "DENY"
    assert resp["X-Content-Type-Options"] == "nosniff"
    assert resp["Referrer-Policy"] == "same-origin"
    assert resp["Cross-Origin-Opener-Policy"] == "same-origin"
    assert resp["X-XSS-Protection"] == "1; mode=block"
    csp = resp["Content-Security-Policy"]
    assert "default-src 'self'" in csp
