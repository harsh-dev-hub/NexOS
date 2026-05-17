from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, ProjectNode
from .serializers import (
    ProjectCreateSerializer,
    ProjectNodeSerializer,
    ProjectNodeUpdateSerializer,
    ProjectSerializer,
)
from .services import bootstrap_project, rename_node


class ProjectListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(owner=request.user)
        return Response(ProjectSerializer(projects, many=True).data)

    def post(self, request):
        serializer = ProjectCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = Project.objects.create(owner=request.user, **serializer.validated_data)
        bootstrap_project(project)
        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)


class ProjectTreeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id, owner=request.user)
        nodes = ProjectNode.objects.filter(project=project)
        return Response(ProjectNodeSerializer(nodes, many=True).data)


class ProjectNodeCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id, owner=request.user)
        serializer = ProjectNodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        parent = serializer.validated_data.get('parent')
        if parent and parent.project_id != project.id:
            return Response({'detail': 'Invalid parent.'}, status=status.HTTP_400_BAD_REQUEST)
        node = ProjectNode.objects.create(project=project, **serializer.validated_data)
        return Response(ProjectNodeSerializer(node).data, status=status.HTTP_201_CREATED)


class ProjectNodeDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, project_id, node_id):
        project = get_object_or_404(Project, id=project_id, owner=request.user)
        node = get_object_or_404(ProjectNode, id=node_id, project=project)
        serializer = ProjectNodeUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if 'content' in serializer.validated_data and node.node_type == 'file':
            node.content = serializer.validated_data['content']
            node.save(update_fields=['content', 'updated_at'])
        if 'name' in serializer.validated_data:
            rename_node(node, serializer.validated_data['name'])
        return Response(ProjectNodeSerializer(node).data)

    def delete(self, request, project_id, node_id):
        project = get_object_or_404(Project, id=project_id, owner=request.user)
        node = get_object_or_404(ProjectNode, id=node_id, project=project)
        node.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
