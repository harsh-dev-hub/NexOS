from asgiref.sync import async_to_sync
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import AITaskSerializer
from .services import debug_code, explain_code


class AIExplainAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AITaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = async_to_sync(explain_code)(serializer.validated_data)
        return Response(result)


class AIDebugAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AITaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = async_to_sync(debug_code)(serializer.validated_data)
        return Response(result)
