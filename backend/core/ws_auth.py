from urllib.parse import parse_qs

from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


@sync_to_async
def get_user_for_token(raw_token: str):
    auth = JWTAuthentication()
    validated = auth.get_validated_token(raw_token)
    return auth.get_user(validated)


class JwtQueryAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        token = parse_qs(query_string).get('token', [None])[0]
        if token:
            try:
                scope['user'] = await get_user_for_token(token)
            except Exception:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await self.app(scope, receive, send)
