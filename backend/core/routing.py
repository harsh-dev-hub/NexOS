from apps.execution.routing import websocket_urlpatterns as execution_ws
from apps.terminal.routing import websocket_urlpatterns as terminal_ws
from django.urls import re_path
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class HealthConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send_json({'message': 'nexos websocket connected'})


websocket_urlpatterns = [
    re_path(r'^ws/health/$', HealthConsumer.as_asgi()),
    *terminal_ws,
    *execution_ws,
]
