import time
import uuid
import logging

logger = logging.getLogger('nexos.request')


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
        start = time.perf_counter()
        request.request_id = request_id
        response = self.get_response(request)
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            'request_completed',
            extra={
                'request_id': request_id,
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'elapsed_ms': elapsed_ms,
            },
        )
        response['X-Request-ID'] = request_id
        return response
