from rest_framework import serializers
from .models import FileItem


class FileItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileItem
        fields = ('id', 'name', 'file_url', 'file_type', 'folder', 'size_bytes', 'created_at', 'updated_at')
        read_only_fields = ('id', 'file_url', 'created_at', 'updated_at')


class FileRenameSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, min_length=1)


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    folder = serializers.CharField(max_length=255, required=False, default='root')

    def validate_file(self, value):
        if value.size > 20 * 1024 * 1024:
            raise serializers.ValidationError('Max file size is 20MB.')
        return value
