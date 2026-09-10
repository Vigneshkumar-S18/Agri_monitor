from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from services.crop_validator import validate_tomato_image
from services.disease_model import predict_disease
from services.decision_engine import analyze_crop_state
from services.query_router import route_query
from services.chat_agent import build_agronomic_context, generate_agricultural_response
from typing import Optional, Dict, Any
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    sensor_data: Optional[Dict[str, Any]] = None
    weather_data: Optional[Dict[str, Any]] = None
    latest_scan: Optional[Dict[str, Any]] = None
    crop_history: Optional[Dict[str, Any]] = None

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
        "message": "AgriSense API is running",
        "architecture": "5-Layer Query-Aware Agronomic Reasoning Engine"
    }

@app.post("/chat")
async def chat_with_agrisense(req: ChatRequest):
    # Layer 1: Query Understanding & Intent Routing
    route = route_query(req.message)
    print(f"\n[QUERY ROUTER] Query: '{req.message}' | Intent: {route['intent']} | Sources: {route['sources']}")
    
    # Layer 2 & 3: Selective Data Retrieval & RAG
    context = build_agronomic_context(
        user_query=req.message,
        route=route,
        sensor_data=req.sensor_data,
        weather_data=req.weather_data,
        latest_scan=req.latest_scan,
        crop_history=req.crop_history
    )
    
    # Layer 4 & 5: Decision Engine & Answer Synthesis
    result = generate_agricultural_response(req.message, route, context)
    
    return {
        "success": True,
        "reply": result["reply"],
        "intent": result["intent"],
        "sources_used": result["sources_used"],
        "routing_reason": result["routing_reason"],
        "telemetry_used": result["telemetry_used"],
        "cited_topics": result["cited_topics"]
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
