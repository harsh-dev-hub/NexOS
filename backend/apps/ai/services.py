from django.conf import settings

from .providers.base import AIRequest
from .providers.mock_provider import MockAIProvider


class AIProviderRegistry:
    def __init__(self):
        self.providers = {
            'mock': MockAIProvider(),
        }

    def get(self, name: str):
        return self.providers.get(name, self.providers['mock'])


registry = AIProviderRegistry()


def get_active_provider_name() -> str:
    return getattr(settings, 'AI_PROVIDER', 'mock')


async def explain_code(payload: dict) -> dict:
    provider = registry.get(get_active_provider_name())
    request = AIRequest(task='explain', **payload)
    return await provider.explain_code(request)


async def debug_code(payload: dict) -> dict:
    provider = registry.get(get_active_provider_name())
    request = AIRequest(task='debug', **payload)
    return await provider.debug_code(request)
