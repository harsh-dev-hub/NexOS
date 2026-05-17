from django.db import models


class Project(models.Model):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [models.Index(fields=['owner', 'updated_at'])]


class ProjectNode(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='nodes')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    node_type = models.CharField(max_length=10)  # file|folder
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=1000)
    content = models.TextField(blank=True, default='')
    language = models.CharField(max_length=40, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['path']
        indexes = [models.Index(fields=['project', 'path']), models.Index(fields=['project', 'node_type'])]
        constraints = [models.UniqueConstraint(fields=['project', 'path'], name='unique_project_path')]
