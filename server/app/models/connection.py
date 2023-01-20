from fastapi import WebSocket


class Connection:
    def __init__(self, client_name: str, lobby_name: str, socket: WebSocket):
        self.client_name = client_name
        self.lobby_name = lobby_name
        self.socket = socket
