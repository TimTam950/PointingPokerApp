from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.connection_manager import ConnectionManager
from app.models.connection import Connection
from app.models.outgoing_message import OutgoingMessage
import app.models.message_types as MessageTypes
from fastapi.logger import logger
router = APIRouter()

connection_manager = ConnectionManager()


@router.websocket("/ws/{lobby_name}/{client_name}")
async def websocket_endpoint(websocket: WebSocket, lobby_name: str, client_name: str):
    connection = Connection(client_name, lobby_name, websocket)
    await connection_manager.connect(connection)
    logger.info(f"{client_name} has connected to {lobby_name} successfully")
    try:
        while True:
            data = await websocket.receive_text()
            message = OutgoingMessage(client_name, data, MessageTypes.VOTE_CAST[0])
            await connection_manager.broadcast(connection, message)
    except WebSocketDisconnect:
        connection_manager.disconnect(lobby_name, connection)
        await connection_manager.broadcast(lobby_name, "Client #{client_id} left the chat")

