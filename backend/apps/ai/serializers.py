from rest_framework import serializers


class AITaskSerializer(serializers.Serializer):
    code = serializers.CharField()
    language = serializers.CharField(required=False, allow_blank=True, default='')
    context = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_code(self, value):
        if len(value) > 100_000:
            raise serializers.ValidationError('Code payload exceeds size limit.')
        return value
