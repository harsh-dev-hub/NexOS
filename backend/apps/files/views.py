from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import FileItem
from .serializers import FileItemSerializer, FileRenameSerializer, FileUploadSerializer
from .services import upload_user_file


class FileListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        folder = request.query_params.get('folder')
        queryset = FileItem.objects.filter(owner=request.user)
        if folder:
            queryset = queryset.filter(folder=folder)
        return Response(FileItemSerializer(queryset, many=True).data)

    def post(self, request):
        serializer = FileUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = upload_user_file(request.user, serializer.validated_data['file'], serializer.validated_data['folder'])
        return Response(FileItemSerializer(item).data, status=status.HTTP_201_CREATED)


class FileDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, file_id):
        item = get_object_or_404(FileItem, id=file_id, owner=request.user)
        serializer = FileRenameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item.name = serializer.validated_data['name']
        item.save(update_fields=['name', 'updated_at'])
        return Response(FileItemSerializer(item).data)

    def delete(self, request, file_id):
        item = get_object_or_404(FileItem, id=file_id, owner=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
