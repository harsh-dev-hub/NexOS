from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    return JsonResponse({'status': 'ok', 'service': 'nexos-backend'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health'),
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/files/', include('apps.files.urls')),
    path('api/v1/execution/', include('apps.execution.urls')),
    path('api/v1/projects/', include('apps.projects.urls')),
    path('api/v1/ai/', include('apps.ai.urls')),
]
