from fastapi import FastAPI
from app.routers import websocket_router

app = FastAPI()

app.include_router(websocket_router.router)


@app.get("/")
def hello_world():
    return "hello"
