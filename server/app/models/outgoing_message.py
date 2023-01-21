import json


class OutgoingMessage:

    def __init__(self, client_name: str, message: str, message_type: str):
        self.client_name = client_name
        self.message = message
        self.message_type = message_type

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__)
