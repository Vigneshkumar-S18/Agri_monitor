"""
AgriSense Scoped Context Manager
Enforces strict source boundary isolation:
The Answer Engine receives ONLY the data sources explicitly selected by the Query Router.
"""

from typing import Dict, Any, List, Optional
from services.knowledge_base import query_knowledge_base

def build_scoped_context(
    user_query: str,
    route: Dict[str, Any],
    sensor_data: Optional[Dict[str, Any]] = None,
    weather_data: Optional[Dict[str, Any]] = None,
    latest_scan: Optional[Dict[str, Any]] = None,
    crop_history: Optional[Dict[str, Any]] = None,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Selectively retrieves and structures data for ONLY the required sources.
    Valid Sources: 'SENSOR', 'WEATHER', 'DISEASE_SCAN', 'CROP_HISTORY', 'RAG'
    """
    # Accept both 'required_sources' and 'sources' keys from the router
    raw_sources = route.get("required_sources") or route.get("sources") or []
    required_sources = set(raw_sources)
    
    entities = route.get("entities", {})
    time_ref = entities.get("time", "today").lower()

    context: Dict[str, Any] = {
        "intent": route.get("intent", "GENERAL_AGRICULTURE"),
        "domain": route.get("domain", "AGRISENSE"),
        "required_sources": list(required_sources),
        "entities": entities,
        "routing_reason": route.get("reason", ""),
        "requires_decision_engine": route.get("requires_decision_engine", False)
    }

    # -------------------------------------------------------------------------
    # 1. IoT Sensor Telemetry (Only if SENSOR source is required)
    # -------------------------------------------------------------------------
    if "SENSOR" in required_sources:
        default_sensors = {
            "soil_moisture": 28,
            "temperature": 31,
            "humidity": 76,
            "water_quality": "Good",
            "crop": "Tomato",
            "growth_stage": "Flowering & Fruit Setting"
        }
        if sensor_data:
            default_sensors.update({k: v for k, v in sensor_data.items() if v is not None})
        context["sensors"] = default_sensors

    # -------------------------------------------------------------------------
    # 2. Weather Forecast Telemetry (Only if WEATHER source is required)
    # -------------------------------------------------------------------------
    if "WEATHER" in required_sources:
        rain_6h = 82
        rain_24h = 91
        temp = 31
        humidity = 76
        forecast_desc = "Scattered thunderstorms expected"
        location = "Coimbatore, Tamil Nadu"

        if weather_data:
            rain_6h = weather_data.get("rain_probability_6h", rain_6h)
            rain_24h = weather_data.get("rain_probability_24h", rain_24h)
            temp = weather_data.get("temperature", temp)
            humidity = weather_data.get("humidity", humidity)
            forecast_desc = weather_data.get("forecast_desc", forecast_desc)
            location = weather_data.get("location", location)

        # Build weather context with explicit temporal alignment
        if "tomorrow" in time_ref or "tmrw" in time_ref:
            context["weather"] = {
                "target_day": "Tomorrow",
                "rain_probability": rain_24h, # Tomorrow's rain probability
                "rain_probability_tomorrow": rain_24h,
                "temperature": max(26, temp - 2),
                "humidity": humidity,
                "forecast_desc": "High probability of afternoon showers and localized rain",
                "location": location
            }
        else:
            context["weather"] = {
                "target_day": "Today",
                "rain_probability_6h": rain_6h,
                "rain_probability_24h": rain_24h,
                "temperature": temp,
                "humidity": humidity,
                "forecast_desc": forecast_desc,
                "location": location
            }

    # -------------------------------------------------------------------------
    # 3. Disease Vision Scan (Only if DISEASE_SCAN source is required)
    # -------------------------------------------------------------------------
    if "DISEASE_SCAN" in required_sources:
        context["scan"] = latest_scan or {
            "disease": "Late blight",
            "confidence": 88.5,
            "severity": "Moderate",
            "future_risk": "HIGH"
        }

    # -------------------------------------------------------------------------
    # 4. Crop History (Only if CROP_HISTORY source is required)
    # -------------------------------------------------------------------------
    if "CROP_HISTORY" in required_sources:
        context["history"] = crop_history or {
            "planting_date": "28 days ago",
            "variety": "Arka Rakshak (Tomato)",
            "last_irrigation": "2 days ago",
            "last_spray": "Neem oil (5 days ago)"
        }

    # -------------------------------------------------------------------------
    # 5. Tomato Agronomic RAG (Only if RAG source is required)
    # -------------------------------------------------------------------------
    if "RAG" in required_sources or route.get("rag_required", False):
        rag_query = user_query
        if entities.get("topic"):
            rag_query = f"{entities['topic']} {user_query}"
        context["knowledge_docs"] = query_knowledge_base(rag_query, top_k=2)
    else:
        context["knowledge_docs"] = []

    # -------------------------------------------------------------------------
    # 6. Conversation Memory
    # -------------------------------------------------------------------------
    if conversation_history:
        context["conversation_history"] = conversation_history[-4:]

    return context
