"""
AgriSense Query Understanding & Router Layer
Analyzes farmer queries to determine intent, required data sources,
and whether RAG knowledge retrieval or decision engine execution is needed.
"""

from typing import Dict, Any, List

def route_query(query: str) -> Dict[str, Any]:
    """
    Classifies farmer query into intent and selectively declares required data sources:
    Sources: SENSOR, WEATHER, DISEASE_SCAN, CROP_HISTORY, RAG_KNOWLEDGE, NONE
    """
    q = query.lower().strip()

    # -------------------------------------------------------------------------
    # 1. GREETING INTENT (Zero data retrieval needed)
    # -------------------------------------------------------------------------
    greeting_exact = {"hi", "hello", "hey", "hii", "heyy", "good morning", "good evening", "good afternoon", "namaste", "vanakkam", "help", "who are you", "what can you do"}
    if q in greeting_exact or any(q.startswith(g + " ") or q.endswith(" " + g) for g in ["hi", "hello", "hey", "namaste", "vanakkam"]):
        if not any(k in q for k in ["water", "soil", "rain", "disease", "fertilizer", "crop", "leaf", "blight", "spray"]):
            return {
                "intent": "GREETING",
                "sources": [],
                "rag_required": False,
                "decision_required": False,
                "reason": "Greeting or introduction query requires no external telemetry or agronomic data retrieval."
            }

    # -------------------------------------------------------------------------
    # 2. SOIL MOISTURE / STATUS (Sensor only)
    # -------------------------------------------------------------------------
    soil_keywords = [
        "soil moisture", "moisture level", "soil wet", "soil dry", "how wet is my soil",
        "moisture percentage", "current soil", "soil status", "moisture reading", "is soil dry"
    ]
    irrigation_action_words = ["water", "watering", "irrigate", "irrigation", "pump", "should i", "can i", "turn on", "when to"]
    
    if any(k in q for k in soil_keywords) and not any(w in q for w in irrigation_action_words):
        return {
            "intent": "SOIL_STATUS",
            "sources": ["SENSOR"],
            "rag_required": False,
            "decision_required": False,
            "reason": "Direct soil telemetry inquiry requires only IoT sensor data."
        }

    # -------------------------------------------------------------------------
    # 3. WEATHER ONLY QUERY (Weather only)
    # -------------------------------------------------------------------------
    weather_keywords = [
        "will it rain", "rain today", "rain tomorrow", "weather forecast", "temperature today",
        "wind speed", "is rain coming", "how hot is it", "rain in next", "is it going to rain",
        "rain probability", "chance of rain", "humidity forecast", "weather today", "weather update"
    ]
    if any(k in q for k in weather_keywords) and not any(w in q for w in ["water", "irrigate", "irrigation", "spray", "disease", "blight"]):
        return {
            "intent": "WEATHER_QUERY",
            "sources": ["WEATHER"],
            "rag_required": False,
            "decision_required": False,
            "reason": "Meteorological inquiry requires only Open-Meteo weather telemetry."
        }

    # -------------------------------------------------------------------------
    # 4. IRRIGATION DECISION (Multi-source: Sensor + Weather + RAG + Decision Engine)
    # -------------------------------------------------------------------------
    irrigation_keywords = [
        "water", "watering", "irrigate", "irrigation", "pump", "can i water",
        "should i water", "when to water", "need water", "turn on irrigation",
        "water my tomato", "water my plants", "start watering", "should i irrigate"
    ]
    if any(k in q for k in irrigation_keywords):
        return {
            "intent": "IRRIGATION_DECISION",
            "sources": ["SENSOR", "WEATHER", "RAG_KNOWLEDGE"],
            "rag_required": True,
            "decision_required": True,
            "reason": "Irrigation decisions require correlating current soil moisture with upcoming rainfall forecasts."
        }

    # -------------------------------------------------------------------------
    # 5. FERTILIZER & NPK NUTRITION (RAG + Crop Stage)
    # -------------------------------------------------------------------------
    fertilizer_keywords = [
        "fertilizer", "fertiliser", "npk", "nutrient", "nitrogen", "phosphorus",
        "potassium", "calcium", "blossom end rot", "feed the crop", "urea", "dap",
        "micronutrient", "manure", "fertigation", "nutrient deficiency"
    ]
    if any(k in q for k in fertilizer_keywords):
        return {
            "intent": "FERTILIZER_ADVICE",
            "sources": ["RAG_KNOWLEDGE"],
            "rag_required": True,
            "decision_required": True,
            "reason": "Nutritional management requires tomato growth stage and NPK knowledge retrieval."
        }

    # -------------------------------------------------------------------------
    # 6. CROP RISK & MULTI-FACTOR ALERT (Sensors + Weather + Scan + RAG + Decision Engine)
    # -------------------------------------------------------------------------
    risk_keywords = [
        "crop risk", "danger", "crop health", "why high risk", "why is my crop at risk",
        "alert risk", "field risk", "is my crop safe", "crop in danger", "is my tomato safe",
        "overall risk", "why high disease risk"
    ]
    if any(k in q for k in risk_keywords):
        return {
            "intent": "CROP_RISK",
            "sources": ["SENSOR", "WEATHER", "DISEASE_SCAN", "CROP_HISTORY", "RAG_KNOWLEDGE"],
            "rag_required": True,
            "decision_required": True,
            "reason": "Comprehensive crop risk assessment synthesizes visual scan, humidity, and forecast rain."
        }

    # -------------------------------------------------------------------------
    # 7. DISEASE / SYMPTOMS / SPRAY (Disease Scan + RAG)
    # -------------------------------------------------------------------------
    disease_keywords = [
        "disease", "blight", "early blight", "late blight", "septoria", "leaf mold",
        "bacterial spot", "mosaic", "yellow leaf curl", "spider mites", "fungus",
        "spots on leaf", "white mold", "spray", "fungicide", "treatment", "cure",
        "infected", "infection", "pesticide", "leaf yellowing", "curl"
    ]
    if any(k in q for k in disease_keywords):
        return {
            "intent": "DISEASE_QUERY",
            "sources": ["DISEASE_SCAN", "RAG_KNOWLEDGE"],
            "rag_required": True,
            "decision_required": False,
            "reason": "Disease inquiry requires tomato pathology RAG retrieval and scan context."
        }

    # -------------------------------------------------------------------------
    # 8. GENERAL AGRICULTURE DEFAULT (RAG only)
    # -------------------------------------------------------------------------
    return {
        "intent": "GENERAL_AGRICULTURE",
        "sources": ["RAG_KNOWLEDGE"],
        "rag_required": True,
        "decision_required": False,
        "reason": "General farming question retrieved from domain knowledge base."
    }
