from dataclasses import dataclass


@dataclass
class AIRequest:
    task: str
    code: str
    language: str = ''
    context: str = ''


class BaseAIProvider:
    provider_name = 'base'

    async def explain_code(self, request: AIRequest) -> dict:
        raise NotImplementedError

    async def debug_code(self, request: AIRequest) -> dict:
        raise NotImplementedError
