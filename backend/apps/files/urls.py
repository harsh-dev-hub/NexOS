from django.urls import path
from .views import FileDetailAPIView, FileListCreateAPIView

urlpatterns = [
    path('', FileListCreateAPIView.as_view(), name='files-list-create'),
    path('<int:file_id>/', FileDetailAPIView.as_view(), name='files-detail'),
]
