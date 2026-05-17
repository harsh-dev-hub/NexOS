import cloudinary
import cloudinary.uploader
from django.conf import settings
from .models import FileItem


def configure_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def upload_user_file(owner, file_obj, folder):
    configure_cloudinary()
    result = cloudinary.uploader.upload(file_obj, folder=f'nexos/{owner.id}/{folder}')
    return FileItem.objects.create(
        owner=owner,
        name=file_obj.name,
        file_url=result['secure_url'],
        file_type=file_obj.content_type or '',
        folder=folder,
        size_bytes=file_obj.size,
    )
