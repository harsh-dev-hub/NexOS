from django.urls import path
from .views import ExecutionDetailAPIView, ExecutionListCreateAPIView

urlpatterns = [
    path('', ExecutionListCreateAPIView.as_view(), name='execution-list-create'),
    path('<int:job_id>/', ExecutionDetailAPIView.as_view(), name='execution-detail'),
]
