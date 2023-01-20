import json

from app.models.connection import Connection
from app.models.outgoing_message import OutgoingMessage
from typing import List, Dict


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List] = {}

    async def connect(self, lobby_name: str, connection: Connection):
        await connection.socket.accept()
        lobby_connections = self.__get_lobby_connections(lobby_name)
        if lobby_connections:
            lobby_connections.append(connection)
        else:
            self.active_connections[lobby_name] = [connection]

    def disconnect(self, lobby_name: str, connection: Connection):
        lobby_connections = self.__get_lobby_connections(lobby_name)
        lobby_connections.remove(connection)

    async def broadcast(self, connection: Connection, message: str):
        lobby_connections = self.__get_lobby_connections(connection.lobby_name)
        message = OutgoingMessage(connection.client_name, message)
        for connection in lobby_connections:
            await connection.socket.send_json(message.to_json())

    def __get_lobby_connections(self, lobby_name):
        if lobby_name not in self.active_connections:
            self.active_connections[lobby_name] = []
        return self.active_connections[lobby_name]
