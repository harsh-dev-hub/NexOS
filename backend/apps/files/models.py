from django.db import models


class FileItem(models.Model):
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='file_items')
    name = models.CharField(max_length=255)
    file_url = models.URLField(max_length=1000)
    file_type = models.CharField(max_length=50, blank=True)
    folder = models.CharField(max_length=255, default='root')
    size_bytes = models.BigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=['owner', 'folder']), models.Index(fields=['owner', 'name'])]
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.owner_id}:{self.name}'
