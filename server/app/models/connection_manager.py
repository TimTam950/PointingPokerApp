from app.core.logger_factory import create_logger
from app.models.connection import Connection
from app.models.outgoing_message import OutgoingMessage
import app.models.message_types as MessageTypes
from typing import List, Dict

logger = create_logger(__name__)


class ConnectionManager:

    def __init__(self):
        self.active_connections: Dict[str, List] = {}

    async def connect(self, connection: Connection):
        await connection.socket.accept()
        lobby_connections = self.__get_lobby_connections(connection.lobby_name)
        if lobby_connections:
            lobby_connections.append(connection)
        else:
            self.active_connections[connection.lobby_name] = [connection]
        await self.__send_current_clients(connection)

    async def disconnect(self, connection: Connection):
        lobby_connections = self.__get_lobby_connections(connection.lobby_name)
        lobby_connections.remove(connection)
        if len(lobby_connections) == 0:
            self.active_connections.pop(connection.lobby_name)
        disconnect_message = OutgoingMessage(connection.client_name, "", MessageTypes.DISCONNECT)
        await self.broadcast(connection, disconnect_message)

    async def broadcast(self, connection: Connection, message: OutgoingMessage):
        logger.info(f'broadcasting: {message}')
        lobby_connections = self.__get_lobby_connections(connection.lobby_name)
        for lobby_connection in lobby_connections:
            await lobby_connection.socket.send_json(message.to_json())

    def __get_lobby_connections(self, lobby_name):
        if lobby_name not in self.active_connections:
            self.active_connections[lobby_name] = []
        return self.active_connections[lobby_name]

    async def __send_current_clients(self, connection: Connection):
        current_connections = self.__get_lobby_connections(connection.lobby_name)
        current_connection_names = [connection.client_name for connection in current_connections]
        current_clients_message = OutgoingMessage(connection.client_name, ','.join(current_connection_names),
                                                  MessageTypes.NEW_USER_CONNECTED[0])

        await self.broadcast(connection, current_clients_message)
