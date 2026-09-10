from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from services.disease_model import predict_disease
from services.decision_engine import analyze_crop_state
from typing import Optional

app = FastAPI(
    title="AgriSense API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AgriSense API is running"
    }

@app.post("/analyze")
async def analyze_crop(
    file: UploadFile = File(...),
    soil_moisture: Optional[float] = Form(None),
    temperature: Optional[float] = Form(None),
    humidity: Optional[float] = Form(None),
    rain_probability: Optional[float] = Form(None)
):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    predictions = predict_disease(image)
    top_prediction = predictions[0]
    
    analysis = analyze_crop_state(
        disease=top_prediction["label"],
        confidence=top_prediction["confidence"],
        soil_moisture=soil_moisture,
        temperature=temperature,
        humidity=humidity,
        rain_probability=rain_probability
    )
    
    return {
        "success": True,
        "predictions": predictions,
        "analysis": analysis
    }
