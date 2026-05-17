import logging
from rest_framework.views import exception_handler

logger = logging.getLogger('nexos.error')


def drf_exception_handler(exc, context):
    response = exception_handler(exc, context)
    request = context.get('request')
    logger.exception(
        'api_exception',
        extra={
            'path': getattr(request, 'path', '-'),
            'method': getattr(request, 'method', '-'),
            'user_id': getattr(getattr(request, 'user', None), 'id', None),
        },
    )
    return response
