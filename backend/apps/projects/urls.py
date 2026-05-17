from django.urls import path
from .views import ProjectListCreateAPIView, ProjectNodeCreateAPIView, ProjectNodeDetailAPIView, ProjectTreeAPIView

urlpatterns = [
    path('', ProjectListCreateAPIView.as_view(), name='projects-list-create'),
    path('<int:project_id>/tree/', ProjectTreeAPIView.as_view(), name='projects-tree'),
    path('<int:project_id>/nodes/', ProjectNodeCreateAPIView.as_view(), name='projects-node-create'),
    path('<int:project_id>/nodes/<int:node_id>/', ProjectNodeDetailAPIView.as_view(), name='projects-node-detail'),
]
