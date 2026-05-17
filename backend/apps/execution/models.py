from django.db import models


class ExecutionJob(models.Model):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='execution_jobs')
    language = models.CharField(max_length=20)
    source_code = models.TextField()
    stdin = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, default='queued')
    output = models.TextField(blank=True, default='')
    error = models.TextField(blank=True, default='')
    exit_code = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['owner', 'created_at']), models.Index(fields=['language', 'status'])]
