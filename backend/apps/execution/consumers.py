from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ExecutionConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        if not user or user.is_anonymous:
            await self.close(code=4401)
            return
        self.job_id = self.scope['url_route']['kwargs']['job_id']
        self.group_name = f'exec_{self.job_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, _code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def execution_message(self, event):
        await self.send_json({'type': 'output', **event['payload']})
