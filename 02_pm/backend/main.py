from fastapi import FastAPI, HTTPException, Body, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
from .database import init_db, get_db, Board, KanbanColumn, Card, User
from .ai_service import call_ai, call_ai_chat

app = FastAPI(title="Project Management MVP API")

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()

class LoginRequest(BaseModel):
    username: str
    password: str

# API Health check
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Mock Login Endpoint (Now checks DB)
@app.post("/api/login")
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials.username, User.password == credentials.password).first()
    if user:
        return {"token": "fake-jwt-token-for-mvp", "username": user.username}
    raise HTTPException(status_code=401, detail="Invalid username or password")

# Get Board State
@app.get("/api/board")
async def get_board(db: Session = Depends(get_db)):
    # For MVP, just get the first board
    board = db.query(Board).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    result = {
        "cards": {},
        "columns": {},
        "columnOrder": []
    }
    
    for col in board.columns:
        result["columnOrder"].append(col.id)
        result["columns"][col.id] = {
            "id": col.id,
            "title": col.title,
            "cardIds": [card.id for card in col.cards]
        }
        for card in col.cards:
            result["cards"][card.id] = {
                "id": card.id,
                "title": card.title,
                "details": card.details or ""
            }
            
    return result

# Update Board State (Full sync for simplicity in MVP)
class BoardUpdate(BaseModel):
    cards: dict
    columns: dict
    columnOrder: list

@app.post("/api/board")
async def update_board(update: BoardUpdate, db: Session = Depends(get_db)):
    board = db.query(Board).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Simple strategy for MVP: Clear and Re-insert
    # In a real app, we would do granular updates
    db.query(Card).delete()
    db.query(KanbanColumn).delete()
    
    for idx, col_id in enumerate(update.columnOrder):
        col_data = update.columns[col_id]
        new_col = KanbanColumn(id=col_id, board_id=board.id, title=col_data["title"], position=idx)
        db.add(new_col)
        
        for c_idx, card_id in enumerate(col_data["cardIds"]):
            card_data = update.cards[card_id]
            new_card = Card(
                id=card_id, 
                column_id=col_id, 
                title=card_data["title"], 
                details=card_data.get("details", ""), 
                position=c_idx
            )
            db.add(new_card)
            
    db.commit()
    return {"status": "success"}

# AI Chat
class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/api/ai/chat")
async def chat_ai(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Get current board state
    current_board = await get_board(db)
    
    # 2. Call AI
    try:
        ai_response = await call_ai_chat(request.message, current_board, request.history)
        
        # 3. If AI requested a board update, save it
        if ai_response.get("board_update"):
            board_update_data = ai_response["board_update"]
            # We can reuse the logic from update_board
            # But we need to convert the dict to a BoardUpdate model or just pass it
            update_model = BoardUpdate(**board_update_data)
            await update_board(update_model, db)
            
        return {
            "answer": ai_response["answer"],
            "boardUpdated": ai_response.get("board_update") is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# AI Test Endpoint
@app.get("/api/ai/test")
async def test_ai():
    try:
        response = await call_ai("What is 2+2? Answer only with the number.")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve static files from the 'static' directory
# This must be mounted after API routes to avoid shadowing them
if os.path.exists("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Serve the index.html for any route not matched by the API
        # This allows React Router (if used) or just general SPA behavior
        return FileResponse("static/index.html")
else:
    from fastapi.responses import HTMLResponse
    @app.get("/", response_class=HTMLResponse)
    async def root():
        return "<h1>Static directory not found. Please build the frontend.</h1>"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
