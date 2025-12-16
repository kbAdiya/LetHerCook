from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """Session auth without CSRF enforcement for API-only usage."""

    def enforce_csrf(self, request):
        return None

