import json


class OutgoingMessage:

    def __init__(self, client_name: str, message: str):
        self.client_name = client_name
        self.message = message

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=0)
