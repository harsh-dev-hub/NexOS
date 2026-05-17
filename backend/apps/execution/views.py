import threading

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import ExecutionJob
from .serializers import ExecutionCreateSerializer, ExecutionJobSerializer
from .services import run_execution_job


class ExecutionListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        jobs = ExecutionJob.objects.filter(owner=request.user)
        return Response(ExecutionJobSerializer(jobs, many=True).data)

    def post(self, request):
        serializer = ExecutionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        job = ExecutionJob.objects.create(owner=request.user, **serializer.validated_data)
        threading.Thread(target=run_execution_job, args=(job,), daemon=True).start()
        return Response(ExecutionJobSerializer(job).data, status=status.HTTP_201_CREATED)


class ExecutionDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, job_id):
        job = get_object_or_404(ExecutionJob, id=job_id, owner=request.user)
        return Response(ExecutionJobSerializer(job).data)
