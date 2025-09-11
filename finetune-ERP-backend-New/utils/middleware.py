from django.conf import settings


class SecurityHeadersMiddleware:
    """Apply legacy security headers not covered by Django core."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        xss = getattr(settings, "X_XSS_PROTECTION", None)
        if xss:
            response.setdefault("X-XSS-Protection", xss)
        csp = getattr(settings, "CSP_HEADER_VALUE", None)
        if csp:
            response.setdefault("Content-Security-Policy", csp)
        return response
