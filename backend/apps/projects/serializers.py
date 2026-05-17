from rest_framework import serializers
from .models import Project, ProjectNode


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name', 'description')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'created_at', 'updated_at')


class ProjectNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectNode
        fields = ('id', 'project', 'parent', 'node_type', 'name', 'path', 'content', 'language', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'project')

    def validate_node_type(self, value):
        if value not in {'file', 'folder'}:
            raise serializers.ValidationError('node_type must be file or folder.')
        return value


class ProjectNodeUpdateSerializer(serializers.Serializer):
    content = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(required=False, min_length=1, max_length=255)
