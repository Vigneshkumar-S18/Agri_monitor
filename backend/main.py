from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from services.crop_validator import validate_tomato_image
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
    
    # =========================================================================
    # STAGE 1: Tomato Crop & Image Quality Validation (OOD Rejection)
    # =========================================================================
    validation = validate_tomato_image(image)
    if not validation["is_valid_crop"]:
        return {
            "success": False,
            "is_valid_crop": False,
            "error_type": "IRRELEVANT_IMAGE",
            "title": "Image Not Suitable",
            "message": "This image does not appear to contain a tomato leaf or tomato plant.",
            "detected_category": validation.get("detected_category", "Non-crop object"),
            "guidance": [
                "Ensure you photograph a tomato plant or leaf.",
                "Capture the photo under clear, natural lighting.",
                "Keep the camera focused on the leaf surface (15–25 cm away).",
                "Avoid blurry shots, hands, animals, screens, or non-crop objects."
            ]
        }
    
    # =========================================================================
    # STAGE 2: ViT Disease Classification
    # =========================================================================
    predictions = predict_disease(image)
    top_prediction = predictions[0]
    
    # =========================================================================
    # STAGE 3: Decision Engine (Environmental Context + Risk Scoring)
    # =========================================================================
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
        "is_valid_crop": True,
        "validation": validation,
        "predictions": predictions,
        "analysis": analysis
    }

