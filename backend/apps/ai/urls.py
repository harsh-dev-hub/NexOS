from django.urls import path
from .views import AIDebugAPIView, AIExplainAPIView

urlpatterns = [
    path('explain/', AIExplainAPIView.as_view(), name='ai-explain'),
    path('debug/', AIDebugAPIView.as_view(), name='ai-debug'),
]
