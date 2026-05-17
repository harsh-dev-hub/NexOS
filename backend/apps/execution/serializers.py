from rest_framework import serializers

from .models import ExecutionJob


ALLOWED_LANGUAGES = {'python', 'node', 'c', 'cpp', 'java'}


class ExecutionCreateSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=20)
    source_code = serializers.CharField()
    stdin = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_language(self, value):
        if value not in ALLOWED_LANGUAGES:
            raise serializers.ValidationError('Unsupported language.')
        return value

    def validate_source_code(self, value):
        if len(value) > 200_000:
            raise serializers.ValidationError('Source code is too large.')
        return value


class ExecutionJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionJob
        fields = ('id', 'language', 'status', 'output', 'error', 'exit_code', 'created_at', 'updated_at')
