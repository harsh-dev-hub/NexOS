from .base import AIRequest, BaseAIProvider


class MockAIProvider(BaseAIProvider):
    provider_name = 'mock'

    async def explain_code(self, request: AIRequest) -> dict:
        summary = request.code.strip().splitlines()[:5]
        return {
            'provider': self.provider_name,
            'task': 'explain',
            'result': 'This code appears to define logic that can be summarized line-by-line.',
            'highlights': summary,
            'language': request.language,
        }

    async def debug_code(self, request: AIRequest) -> dict:
        return {
            'provider': self.provider_name,
            'task': 'debug',
            'result': 'Potential issue detected: verify variable initialization and exception paths.',
            'suggestions': [
                'Add input validation for null/empty values.',
                'Add explicit error handling around external calls.',
                'Add tests for edge-case branches.',
            ],
            'language': request.language,
        }
