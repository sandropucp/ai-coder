from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

DATABASE_URL = "sqlite:///./kanban.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    boards = relationship("Board", back_populates="owner")

class Board(Base):
    __tablename__ = "boards"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    owner = relationship("User", back_populates="boards")
    columns = relationship("KanbanColumn", back_populates="board", order_by="KanbanColumn.position")

class KanbanColumn(Base):
    __tablename__ = "columns"
    id = Column(String, primary_key=True)
    board_id = Column(Integer, ForeignKey("boards.id"))
    title = Column(String)
    position = Column(Integer)
    board = relationship("Board", back_populates="columns")
    cards = relationship("Card", back_populates="column", order_by="Card.position")

class Card(Base):
    __tablename__ = "cards"
    id = Column(String, primary_key=True)
    column_id = Column(String, ForeignKey("columns.id"))
    title = Column(String)
    details = Column(Text)
    position = Column(Integer)
    column = relationship("KanbanColumn", back_populates="cards")

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have a user
    if not db.query(User).filter(User.username == "user").first():
        # Seed default data
        demo_user = User(username="user", password="password")
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        demo_board = Board(user_id=demo_user.id, name="My Project")
        db.add(demo_board)
        db.commit()
        db.refresh(demo_board)
        
        initial_data = [
            ("col-1", "To Do", 0, [
                ("card-1", "Research competitors", "Analyze top 3 competitors in the space", 0),
                ("card-2", "Design system", "Create a consistent color palette and typography", 1),
            ]),
            ("col-2", "In Progress", 1, [
                ("card-3", "API implementation", "Set up the basic Express server", 0),
            ]),
            ("col-3", "Review", 2, [
                ("card-4", "Unit tests", "Write tests for the main business logic", 0),
            ]),
            ("col-4", "Testing", 3, []),
            ("col-5", "Done", 4, [
                ("card-5", "Deployment", "Configure CI/CD pipeline", 0),
            ]),
        ]
        
        for col_id, title, col_pos, cards_data in initial_data:
            col = KanbanColumn(id=col_id, board_id=demo_board.id, title=title, position=col_pos)
            db.add(col)
            for card_id, c_title, c_details, c_pos in cards_data:
                card = Card(id=card_id, column_id=col_id, title=c_title, details=c_details, position=c_pos)
                db.add(card)
        
        db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
