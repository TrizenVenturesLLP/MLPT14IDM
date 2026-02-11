from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import os
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from . import models, database

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Fingerprint Liveness Detection API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fingerprint_altered_easy_vs_real.h5")

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/")
async def root():
    return {"message": "Fingerprint Liveness Detection API is running"}

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    case_id: str = Form(None),
    sector: str = Form("unknown"),
    db: Session = Depends(database.get_db)
):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server")
    
    try:
        # Read the file
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Resize image for model
        img = img.resize((128, 128))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Perform prediction
        prediction_val = model.predict(img_array, verbose=0)[0][0]
        
        if prediction_val > 0.5:
            label = "Real"
            confidence = float(prediction_val)
        else:
            label = "Altered-Easy"
            confidence = float(1 - prediction_val)
        
        # Save to database
        db_prediction = models.Prediction(
            filename=file.filename,
            prediction=label,
            confidence=round(confidence * 100, 2),
            raw_score=float(prediction_val),
            sector=sector,
            case_id=case_id
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return {
            "id": db_prediction.id,
            "prediction": label,
            "confidence": round(confidence * 100, 2),
            "raw_score": float(prediction_val)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

@app.get("/stats")
async def get_stats(db: Session = Depends(database.get_db)):
    total = db.query(models.Prediction).count()
    real = db.query(models.Prediction).filter(models.Prediction.prediction == "Real").count()
    suspicious = total - real
    
    # Calculate daily activity for last 7 days
    days = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        date = now - timedelta(days=i)
        date_str = date.strftime("%a")
        count = db.query(models.Prediction).filter(
            func.date(models.Prediction.timestamp) == date.date()
        ).count()
        alerts = db.query(models.Prediction).filter(
            func.date(models.Prediction.timestamp) == date.date(),
            models.Prediction.prediction == "Altered-Easy"
        ).count()
        days.append({"name": date_str, "analyses": count, "alerts": alerts})

    return {
        "total": total,
        "suspicious": suspicious,
        "highRisk": db.query(models.Prediction).filter(models.Prediction.confidence > 95, models.Prediction.prediction == "Altered-Easy").count(),
        "totalRecords": total,
        "activity": days
    }

@app.get("/history")
async def get_history(limit: int = 5, db: Session = Depends(database.get_db)):
    predictions = db.query(models.Prediction).order_by(models.Prediction.timestamp.desc()).limit(limit).all()
    
    history = []
    for p in predictions:
        history.append({
            "id": p.id,
            "type": "high" if (p.prediction == "Altered-Easy" and p.confidence > 90) else ("suspicious" if p.prediction == "Altered-Easy" else "normal"),
            "title": f"{p.prediction} fingerprint usage detected" if p.prediction == "Altered-Easy" else "Routine verification completed",
            "caseId": p.case_id or f"FP-{p.id:04d}",
            "time": p.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "sector": p.sector
        })
    return history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
