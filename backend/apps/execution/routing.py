from django.urls import re_path
from .consumers import ExecutionConsumer

websocket_urlpatterns = [
    re_path(r'^ws/execution/(?P<job_id>\d+)/$', ExecutionConsumer.as_asgi()),
]
