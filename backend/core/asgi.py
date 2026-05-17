import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from core.routing import websocket_urlpatterns
from core.ws_auth import JwtQueryAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        'http': django_asgi_app,
        'websocket': JwtQueryAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
