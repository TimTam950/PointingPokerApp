from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.connection_manager import ConnectionManager
from app.models.connection import Connection
from fastapi.logger import logger
router = APIRouter()

connection_manager = ConnectionManager()


@router.websocket("/ws/{lobby_name}/{client_name}")
async def websocket_endpoint(websocket: WebSocket, lobby_name: str, client_name: str):
    connection = Connection(client_name, lobby_name, websocket)
    await connection_manager.connect(lobby_name, connection)
    logger.info(f"{client_name} has connected to {lobby_name} successfully")
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"{client_name} has sent the text: {data}")
            await connection_manager.broadcast(connection, data)
    except WebSocketDisconnect:
        connection_manager.disconnect(lobby_name, connection)
        await connection_manager.broadcast(lobby_name, "Client #{client_id} left the chat")

