from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    raw_score = Column(Float)
    sector = Column(String, default="unknown")
    case_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
