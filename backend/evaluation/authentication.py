"""DRF authentication for local Django authentication tokens."""

from rest_framework.authentication import TokenAuthentication


class BearerTokenAuthentication(TokenAuthentication):
    """Token authentication supporting the Bearer keyword."""

    keyword = 'Bearer'
