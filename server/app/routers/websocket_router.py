import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError

from app.models.connection_manager import ConnectionManager
from app.models.connection import Connection
from app.models.incoming_message import IncomingMessage
from app.models.outgoing_message import OutgoingMessage
import app.models.message_types as MessageTypes
from app.core.logger_factory import create_logger

router = APIRouter()

connection_manager = ConnectionManager()

logger = create_logger(__name__)


@router.websocket("/ws/{lobby_name}/{client_name}")
async def websocket_endpoint(websocket: WebSocket, lobby_name: str, client_name: str):
    try:
        connection = Connection(client_name, lobby_name, websocket)
        await connection_manager.connect(connection)
        logger.info(f"{connection.client_name} has connected to {connection.lobby_name}")
        while True:
            data = await websocket.receive_text()
            incoming_message = IncomingMessage(**json.loads(data))
            logger.info(f"lobby id {lobby_name} incoming message type {incoming_message.message_type}, incoming message {incoming_message.message}")
            if incoming_message.message_type == MessageTypes.VOTE_CAST:
                message = OutgoingMessage(client_name, incoming_message.message, MessageTypes.VOTE_CAST)
            elif incoming_message.message_type == MessageTypes.SHOW_VOTES:
                message = OutgoingMessage(client_name, "", MessageTypes.SHOW_VOTES)
            elif incoming_message.message_type == MessageTypes.CLEAR_VOTES:
                message = OutgoingMessage(client_name, "", MessageTypes.CLEAR_VOTES)
            await connection_manager.broadcast(connection, message)
    except (ConnectionClosedError, WebSocketDisconnect):
        await __user_disconnects(connection)


async def __user_disconnects(connection: Connection):
    await connection_manager.disconnect(connection)


