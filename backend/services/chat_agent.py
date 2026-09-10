import os
import json
from typing import Dict, Any, List, Optional
from services.knowledge_base import query_knowledge_base

def build_agronomic_context(
    user_query: str,
    sensor_data: Optional[Dict[str, Any]] = None,
    weather_data: Optional[Dict[str, Any]] = None,
    latest_scan: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Gathers and standardizes field telemetry, weather forecast, scan history,
    and retrieves relevant domain documents from the Tomato RAG database.
    """
    # 1. Fallback / Default Sensor Values if not provided
    sensors = {
        "soil_moisture": sensor_data.get("soil_moisture", 28) if sensor_data else 28,
        "temperature": sensor_data.get("temperature", 31) if sensor_data else 31,
        "humidity": sensor_data.get("humidity", 76) if sensor_data else 76,
        "water_quality": sensor_data.get("water_quality", "Good") if sensor_data else "Good",
        "crop": "Tomato",
        "growth_stage": "Flowering & Fruit Setting"
    }

    # 2. Weather context
    weather = {
        "rain_probability_6h": weather_data.get("rain_probability_6h", 82) if weather_data else 82,
        "rain_probability_24h": weather_data.get("rain_probability_24h", 91) if weather_data else 91,
        "forecast_desc": weather_data.get("forecast_desc", "Scattered thunderstorms expected") if weather_data else "Scattered thunderstorms expected",
        "location": weather_data.get("location", "Coimbatore, Tamil Nadu") if weather_data else "Coimbatore, Tamil Nadu"
    }

    # 3. Latest scan
    scan = latest_scan or {
        "disease": "Late blight",
        "confidence": 88.5,
        "severity": "Moderate",
        "future_risk": "HIGH"
    }

    # 4. RAG retrieval
    relevant_docs = query_knowledge_base(user_query, top_k=2)

    return {
        "sensors": sensors,
        "weather": weather,
        "scan": scan,
        "knowledge_docs": relevant_docs
    }

def generate_agricultural_response(user_query: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Synthesizes the final contextual response using deterministic agronomic rules + RAG.
    If OPENAI_API_KEY is available in environment, queries OpenAI API with the structured prompt.
    Otherwise, executes deterministic AgriSense agronomic reasoning engine.
    """
    sensors = context["sensors"]
    weather = context["weather"]
    scan = context["scan"]
    docs = context["knowledge_docs"]

    # Check if OpenAI API is configured
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            import urllib.request
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key}"
            }
            system_prompt = (
                "You are AgriSense, an expert precision agricultural AI assistant for tomato farmers. "
                "You synthesize live IoT sensor telemetry, weather forecasts, scan results, and agronomic knowledge. "
                "Always be actionable, clear, and direct. Explain the reasoning behind each recommendation."
            )
            context_str = f"""
LIVE FIELD TELEMETRY:
- Soil Moisture: {sensors['soil_moisture']}%
- Ambient Temperature: {sensors['temperature']}°C
- Relative Humidity: {sensors['humidity']}%
- Water Quality: {sensors['water_quality']}
- Crop Stage: {sensors['growth_stage']}

WEATHER FORECAST ({weather['location']}):
- Rain probability next 6 hours: {weather['rain_probability_6h']}%
- Rain probability next 24 hours: {weather['rain_probability_24h']}%
- Forecast: {weather['forecast_desc']}

LATEST CROP SCAN:
- Disease Detected: {scan['disease']} (Confidence: {scan['confidence']}%, Severity: {scan['severity']}, Future Risk: {scan['future_risk']})

AGRONOMIC KNOWLEDGE (RAG):
{chr(10).join(['- ' + d['topic'] + ': ' + d['content'] for d in docs])}
"""
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"{context_str}\n\nFARMER QUERY: {user_query}"}
                ],
                "temperature": 0.3
            }
            req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=json.dumps(payload).encode(), headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                ai_text = data["choices"][0]["message"]["content"]
                return {
                    "reply": ai_text,
                    "telemetry_used": {
                        "soil_moisture": f"{sensors['soil_moisture']}%",
                        "rain_prob_6h": f"{weather['rain_probability_6h']}%",
                        "humidity": f"{sensors['humidity']}%",
                        "disease_alert": scan['disease']
                    },
                    "cited_topics": [d["topic"] for d in docs]
                }
        except Exception as e:
            print(f"OpenAI API call error, falling back to AgriSense Engine: {e}")

    # =========================================================================
    # AgriSense Deterministic Agronomic Reasoning Engine (Offline/Local Mode)
    # =========================================================================
    q = user_query.lower()
    telemetry_used = {
        "soil_moisture": f"{sensors['soil_moisture']}%",
        "rain_prob_6h": f"{weather['rain_probability_6h']}%",
        "humidity": f"{sensors['humidity']}%",
        "disease_alert": scan['disease']
    }

    # Query 1: Irrigation & Watering
    if any(w in q for w in ["water", "irrigate", "irrigation", "soil dry", "moisture"]):
        if weather["rain_probability_6h"] >= 65:
            reply = (
                f"**AgriSense Recommendation: Postpone Irrigation** ⏳\n\n"
                f"Although your current soil moisture is relatively low at **{sensors['soil_moisture']}%**, "
                f"the weather forecast indicates an **{weather['rain_probability_6h']}% probability of rain within the next 6 hours** "
                f"(and {weather['rain_probability_24h']}% over the next 24 hours).\n\n"
                f"**Why?** Applying additional water right before heavy rainfall can cause waterlogging, root asphyxiation, "
                f"and rapid splash-dispersal of fungal spores (such as {scan['disease']}).\n\n"
                f"💡 **Action Plan:** Recheck soil moisture after the rain event. If rainfall is inadequate and soil moisture "
                f"remains below 30%, resume drip irrigation at root level."
            )
        elif sensors["soil_moisture"] < 30:
            reply = (
                f"**AgriSense Recommendation: Irrigate Now** 💧\n\n"
                f"Your soil moisture is at **{sensors['soil_moisture']}%** (below the 35-55% optimal range for {sensors['growth_stage']}), "
                f"and rain probability is low ({weather['rain_probability_6h']}%).\n\n"
                f"💡 **Action Plan:** Apply drip irrigation to bring moisture back to ~45%. Ensure you water at the plant base "
                f"without wetting the leaf canopy."
            )
        else:
            reply = (
                f"**AgriSense Recommendation: Soil Moisture is Optimal** ✅\n\n"
                f"Current soil moisture is **{sensors['soil_moisture']}%**, which is within the safe range for tomatoes in the {sensors['growth_stage']} phase. "
                f"No additional irrigation is needed at this moment."
            )

    # Query 2: Disease / Health / Leaf Scan
    elif any(w in q for w in ["disease", "blight", "fungus", "risk", "scan", "leaf", "spots", "curl", "virus", "mold", "alert"]):
        doc_snippet = docs[0]["content"] if docs else "Inspect leaves and maintain good air circulation."
        reply = (
            f"**AgriSense Crop Health Diagnosis: {scan['disease']} ({scan['future_risk']} Risk)** 🛡️\n\n"
            f"Your latest scan detected **{scan['disease']} with {scan['confidence']}% confidence**.\n\n"
            f"**Environmental Trigger Analysis:**\n"
            f"• Field Humidity is **{sensors['humidity']}%** (favorable for fungal proliferation)\n"
            f"• Temperature is **{sensors['temperature']}°C**\n"
            f"• Forecasted rain (**{weather['rain_probability_6h']}%**) will elevate leaf wetness\n\n"
            f"**Agronomic Advisory:**\n"
            f"{doc_snippet}\n\n"
            f"💡 **Immediate Action:** Remove severely infected lower leaves, avoid overhead watering, and apply recommended protective spray."
        )

    # Query 3: Fertilizer & Nutrition
    elif any(w in q for w in ["fertilizer", "npk", "nutrient", "feed", "growth", "nitrogen", "potassium"]):
        reply = (
            f"**Tomato Nutrition Plan ({sensors['growth_stage']})** 🧪\n\n"
            f"During the {sensors['growth_stage']} stage, tomato plants transition from vegetative demand to heavy Potassium (K) and Phosphorus (P) demand:\n\n"
            f"• **Recommended NPK Ratio:** High Potassium formula like **NPK 5-10-20** or **9-15-30**\n"
            f"• **Calcium Supplement:** Apply Calcium Nitrate foliar spray or gypsum to prevent *Blossom End Rot*\n"
            f"• **Application Advice:** Fertigate via drip lines when soil moisture is adequate ({sensors['soil_moisture']}%) to prevent root burn."
        )

    # Query 4: General / Fallback
    else:
        topics_covered = ", ".join([d["topic"] for d in docs]) if docs else "Irrigation & Disease Management"
        reply = (
            f"**AgriSense Field Telemetry Summary for Tomato:**\n\n"
            f"• **Soil Moisture:** {sensors['soil_moisture']}% (Target: 35-55%)\n"
            f"• **Temperature:** {sensors['temperature']}°C | **Humidity:** {sensors['humidity']}%\n"
            f"• **Rain Probability:** {weather['rain_probability_6h']}% (Next 6h)\n"
            f"• **Crop State:** {scan['disease']} ({scan['future_risk']} Risk)\n\n"
            f"Based on your query, here is relevant guidance from our tomato knowledge base:\n"
            f"{docs[0]['content'] if docs else 'Feel free to ask about irrigation timing, disease treatments, or fertilizer requirements!'}"
        )

    return {
        "reply": reply,
        "telemetry_used": telemetry_used,
        "cited_topics": [d["topic"] for d in docs]
    }
