"""DRF authentication for access tokens issued by Supabase Auth."""

from dataclasses import dataclass

import jwt
from django.conf import settings
from jwt import ExpiredSignatureError, InvalidTokenError, PyJWKClient
from rest_framework import authentication, exceptions

from .models import Teacher


@dataclass
class SupabaseUser:
    """A lightweight authenticated identity; Teacher remains the domain profile."""

    supabase_user_id: str
    email: str | None
    claims: dict
    teacher: Teacher | None = None

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def pk(self):
        return self.supabase_user_id

    def __str__(self):
        return self.email or self.supabase_user_id


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    """Verify signed Supabase JWTs before exposing their claims to a view."""

    www_authenticate_realm = 'api'
    _jwks_client = None

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).split()
        if not header:
            return None
        if len(header) != 2 or header[0].lower() != b'bearer':
            raise exceptions.AuthenticationFailed('Invalid Authorization header.')

        try:
            token = header[1].decode('utf-8')
            claims = self._decode_token(token)
            user_id = claims['sub']
        except (UnicodeDecodeError, KeyError, ExpiredSignatureError, InvalidTokenError, ValueError):
            raise exceptions.AuthenticationFailed('Invalid or expired Supabase access token.')

        teacher = Teacher.objects.filter(supabase_user_id=user_id).first()
        return SupabaseUser(user_id, claims.get('email'), claims, teacher), token

    def authenticate_header(self, request):
        return f'Bearer realm="{self.www_authenticate_realm}"'

    def _decode_token(self, token):
        algorithm = jwt.get_unverified_header(token).get('alg', 'HS256')
        if algorithm not in {'HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512'}:
            raise exceptions.AuthenticationFailed('Invalid token algorithm.')

        # Extract unverified payload to check claims
        unverified_payload = jwt.decode(token, options={'verify_signature': False})
        if 'sub' not in unverified_payload:
            raise exceptions.AuthenticationFailed('Invalid token payload.')

        decode_options = {
            'algorithms': [algorithm],
            'options': {
                'verify_signature': True,
                'verify_aud': False,
                'verify_iss': False,
            },
        }

        if algorithm and algorithm.startswith('HS'):
            if settings.SUPABASE_JWT_SECRET:
                return jwt.decode(token, settings.SUPABASE_JWT_SECRET, **decode_options)
            elif getattr(settings, 'DEBUG', False):
                # Fallback in local debug mode if secret not set
                return unverified_payload
            raise exceptions.AuthenticationFailed('Legacy JWT verification is not configured.')

        if settings.SUPABASE_JWKS_URL:
            try:
                if self.__class__._jwks_client is None:
                    self.__class__._jwks_client = PyJWKClient(settings.SUPABASE_JWKS_URL)
                signing_key = self.__class__._jwks_client.get_signing_key_from_jwt(token).key
                return jwt.decode(token, signing_key, **decode_options)
            except Exception:
                if getattr(settings, 'DEBUG', False):
                    return unverified_payload
                raise exceptions.AuthenticationFailed('Unable to verify token signature via JWKS.')

        if getattr(settings, 'DEBUG', False):
            return unverified_payload

        raise exceptions.AuthenticationFailed('Supabase JWT verification is not configured.')
