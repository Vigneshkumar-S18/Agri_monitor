import os
import json
from typing import Dict, Any, List, Optional
from services.query_router import route_query
from services.knowledge_base import query_knowledge_base

def build_agronomic_context(
    user_query: str,
    route: Dict[str, Any],
    sensor_data: Optional[Dict[str, Any]] = None,
    weather_data: Optional[Dict[str, Any]] = None,
    latest_scan: Optional[Dict[str, Any]] = None,
    crop_history: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Selectively gathers ONLY the required data sources determined by the Query Router.
    Data sources: SENSOR, WEATHER, DISEASE_SCAN, CROP_HISTORY, RAG_KNOWLEDGE
    """
    context: Dict[str, Any] = {
        "intent": route["intent"],
        "sources": route["sources"],
        "reason": route["reason"]
    }
    sources = set(route.get("sources", []))

    # 1. IoT Sensor Telemetry (Only if requested)
    if "SENSOR" in sources:
        context["sensors"] = {
            "soil_moisture": sensor_data.get("soil_moisture", 28) if sensor_data else 28,
            "temperature": sensor_data.get("temperature", 31) if sensor_data else 31,
            "humidity": sensor_data.get("humidity", 76) if sensor_data else 76,
            "water_quality": sensor_data.get("water_quality", "Good") if sensor_data else "Good",
            "crop": "Tomato",
            "growth_stage": "Flowering & Fruit Setting"
        }

    # 2. Weather Forecast Telemetry (Only if requested)
    if "WEATHER" in sources:
        context["weather"] = {
            "rain_probability_6h": weather_data.get("rain_probability_6h", 82) if weather_data else 82,
            "rain_probability_24h": weather_data.get("rain_probability_24h", 91) if weather_data else 91,
            "temperature": weather_data.get("temperature", 31) if weather_data else 31,
            "humidity": weather_data.get("humidity", 76) if weather_data else 76,
            "forecast_desc": weather_data.get("forecast_desc", "Scattered thunderstorms expected") if weather_data else "Scattered thunderstorms expected",
            "location": weather_data.get("location", "Coimbatore, Tamil Nadu") if weather_data else "Coimbatore, Tamil Nadu"
        }

    # 3. Disease Vision Scan (Only if requested)
    if "DISEASE_SCAN" in sources:
        context["scan"] = latest_scan or {
            "disease": "Late blight",
            "confidence": 88.5,
            "severity": "Moderate",
            "future_risk": "HIGH"
        }

    # 4. Crop History (Only if requested)
    if "CROP_HISTORY" in sources:
        context["history"] = crop_history or {
            "planting_date": "28 days ago",
            "variety": "Arka Rakshak (Tomato)",
            "last_irrigation": "2 days ago",
            "last_spray": "Neem oil (5 days ago)"
        }

    # 5. Domain Knowledge (RAG)
    if route.get("rag_required", False):
        context["knowledge_docs"] = query_knowledge_base(user_query, top_k=2)
    else:
        context["knowledge_docs"] = []

    return context

def generate_agricultural_response(user_query: str, route: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a contextual response using the routed information.
    Uses OpenAI LLM if configured, otherwise falls back to AgriSense Precision Agronomic Engine.
    """
    intent = route.get("intent", "GENERAL_AGRICULTURE")
    sources = set(route.get("sources", []))
    docs = context.get("knowledge_docs", [])
    cited_topics = [d["topic"] for d in docs]

    # Build telemetry_used metadata map for observability and UI display
    telemetry_used: Dict[str, Any] = {}
    if "sensors" in context:
        telemetry_used["soil_moisture"] = f"{context['sensors']['soil_moisture']}%"
        telemetry_used["temp"] = f"{context['sensors']['temperature']}°C"
    if "weather" in context:
        telemetry_used["rain_prob_6h"] = f"{context['weather']['rain_probability_6h']}%"
    if "scan" in context:
        telemetry_used["disease_alert"] = context["scan"]["disease"]

    # =========================================================================
    # OPTION A: OpenAI LLM Explanation Layer (if API key is present)
    # =========================================================================
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key and intent != "GREETING":
        try:
            import urllib.request
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key}"
            }
            system_prompt = (
                "You are AgriSense, an expert precision agronomic AI assistant for tomato farmers. "
                "CRITICAL INSTRUCTION: Answer ONLY the user's specific query using the provided context. "
                "Do NOT invent or mention unrelated data sources (e.g. do not discuss disease or rainfall if the user asked only about soil or greetings). "
                "Keep recommendations clear, direct, and actionable."
            )
            
            context_blocks = []
            if "sensors" in context:
                s = context["sensors"]
                context_blocks.append(f"FIELD SENSORS: Soil Moisture={s['soil_moisture']}%, Temp={s['temperature']}°C, Humidity={s['humidity']}%, Crop Stage={s['growth_stage']}")
            if "weather" in context:
                w = context["weather"]
                context_blocks.append(f"WEATHER ({w['location']}): Rain Prob 6h={w['rain_probability_6h']}%, Rain Prob 24h={w['rain_probability_24h']}%, Forecast={w['forecast_desc']}")
            if "scan" in context:
                sc = context["scan"]
                context_blocks.append(f"CROP SCAN: Disease={sc['disease']} (Confidence={sc['confidence']}%, Risk={sc['future_risk']})")
            if docs:
                context_blocks.append("AGRONOMIC KNOWLEDGE:\n" + "\n".join([f"- {d['topic']}: {d['content']}" for d in docs]))

            context_str = "\n\n".join(context_blocks)
            user_prompt = f"INTENT: {intent}\n\nRETRIEVED CONTEXT:\n{context_str}\n\nFARMER QUERY: {user_query}"

            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2
            }
            req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=json.dumps(payload).encode(), headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                ai_text = data["choices"][0]["message"]["content"]
                return {
                    "reply": ai_text,
                    "intent": intent,
                    "sources_used": route.get("sources", []),
                    "routing_reason": route.get("reason", ""),
                    "telemetry_used": telemetry_used,
                    "cited_topics": cited_topics
                }
        except Exception as e:
            print(f"OpenAI call fallback: {e}")

    # =========================================================================
    # OPTION B: AgriSense Precision Agronomic Engine (Local Deterministic)
    # =========================================================================

    # 1. GREETING
    if intent == "GREETING":
        reply = (
            "👋 Hello! I am your **AgriSense Precision Agricultural Assistant**.\n\n"
            "I can help you with:\n"
            "• **Irrigation Guidance** (correlating soil moisture & rain probability)\n"
            "• **Weather Forecasts** (upcoming precipitation & humidity)\n"
            "• **Soil Moisture Status** (live IoT telemetry)\n"
            "• **Tomato Disease Diagnosis & Treatment** (Early/Late Blight, Septoria, etc.)\n"
            "• **Fertilizer & NPK Advisory** (tailored to growth stages)\n"
            "• **Multi-Factor Crop Risk Analysis**\n\n"
            "What would you like to know about your crop today?"
        )

    # 2. SOIL STATUS (Sensor Only)
    elif intent == "SOIL_STATUS":
        s = context.get("sensors", {"soil_moisture": 28, "temperature": 31, "growth_stage": "Flowering & Fruit Setting"})
        moisture = s["soil_moisture"]
        if moisture < 35:
            status_desc = f"**{moisture}%**, which is **below the optimal target range of 35%–55%** for tomatoes in the {s['growth_stage']} phase. The soil is currently relatively dry."
        elif moisture > 55:
            status_desc = f"**{moisture}%**, which is **above optimal range (35%–55%)**, indicating saturated soil."
        else:
            status_desc = f"**{moisture}%**, which is **within the healthy target range (35%–55%)**."
            
        reply = (
            f"🌱 **Soil Moisture Telemetry:**\n\n"
            f"Your current soil moisture reading is {status_desc}\n\n"
            f"• **Current Moisture:** {moisture}%\n"
            f"• **Target Range:** 35% – 55%\n"
            f"• **Crop Phase:** {s['growth_stage']}"
        )

    # 3. WEATHER QUERY (Weather Only)
    elif intent == "WEATHER_QUERY":
        w = context.get("weather", {
            "rain_probability_6h": 82,
            "rain_probability_24h": 91,
            "temperature": 31,
            "humidity": 76,
            "forecast_desc": "Scattered thunderstorms expected",
            "location": "Coimbatore, Tamil Nadu"
        })
        reply = (
            f"🌧️ **Weather Forecast for {w['location']}:**\n\n"
            f"• **Rain Probability (Next 6 Hours):** {w['rain_probability_6h']}%\n"
            f"• **Rain Probability (Next 24 Hours):** {w['rain_probability_24h']}%\n"
            f"• **Temperature:** {w.get('temperature', 31)}°C\n"
            f"• **Humidity:** {w.get('humidity', 76)}%\n"
            f"• **Forecast Condition:** {w['forecast_desc']}\n\n"
            f"💡 **Agricultural Note:** High precipitation chance will provide natural moisture and increase canopy wetness."
        )

    # 4. IRRIGATION DECISION (Sensor + Weather + RAG + Decision Engine)
    elif intent == "IRRIGATION_DECISION":
        s = context.get("sensors", {"soil_moisture": 28, "growth_stage": "Flowering & Fruit Setting"})
        w = context.get("weather", {"rain_probability_6h": 82, "rain_probability_24h": 91})
        moisture = s["soil_moisture"]
        rain_6h = w["rain_probability_6h"]

        if rain_6h >= 65:
            reply = (
                f"⏳ **Recommendation: Postpone Irrigation**\n\n"
                f"Although your current soil moisture is relatively low at **{moisture}%**, "
                f"there is an **{rain_6h}% probability of rain within the next 6 hours** (and {w['rain_probability_24h']}% in 24h).\n\n"
                f"**Agronomic Reason:** Starting irrigation before heavy rain causes waterlogging, root asphyxiation, and promotes fungal spore dispersal.\n\n"
                f"💡 **Action Plan:** Hold off watering. Recheck soil moisture after the rain window; if rainfall does not occur and moisture remains below 30%, resume drip irrigation at base."
            )
        elif moisture < 35:
            reply = (
                f"💧 **Recommendation: Start Irrigation**\n\n"
                f"Your soil moisture is at **{moisture}%** (below optimal 35%–55%), and rain probability is low ({rain_6h}%).\n\n"
                f"💡 **Action Plan:** Apply drip irrigation to bring moisture back to ~45%. Ensure water is delivered to root level without wetting foliage."
            )
        else:
            reply = (
                f"✅ **Recommendation: No Irrigation Needed**\n\n"
                f"Your soil moisture is **{moisture}%**, which is within the optimal 35%–55% range for {s['growth_stage']} tomatoes."
            )

    # 5. FERTILIZER ADVICE (RAG + Crop Stage)
    elif intent == "FERTILIZER_ADVICE":
        doc_snippet = docs[0]["content"] if docs else (
            "During flowering, tomatoes require higher Potassium (K) and Phosphorus (P) with calcium supplementation."
        )
        reply = (
            f"🌼 **Tomato Nutritional & Fertilizer Guidance (Flowering & Fruit Phase)** 🧪\n\n"
            f"During flowering and fruit set, tomato crops transition from vegetative nitrogen demand to heavy Potassium and Calcium requirements:\n\n"
            f"• **Recommended NPK Ratio:** High potassium blend such as **NPK 5-10-20** or **9-15-30**\n"
            f"• **Calcium Supplement:** Apply Calcium Nitrate or Gypsum to prevent *Blossom End Rot*\n"
            f"• **Application Method:** Apply water-soluble fertilizers via drip fertigation directly at root zone when soil is moist to prevent root scorch.\n\n"
            f"📖 **Agronomic Reference:**\n{doc_snippet}"
        )

    # 6. CROP RISK (Multi-Source Synthesis)
    elif intent == "CROP_RISK":
        s = context.get("sensors", {"soil_moisture": 28, "humidity": 76, "temperature": 31})
        w = context.get("weather", {"rain_probability_6h": 82})
        sc = context.get("scan", {"disease": "Late blight", "confidence": 88.5, "severity": "Moderate", "future_risk": "HIGH"})

        reply = (
            f"⚠️ **Multi-Factor Crop Risk Assessment: {sc['future_risk']} RISK**\n\n"
            f"**Synthesis of Environmental & Visual Indicators:**\n"
            f"• **Visual Scan:** {sc['disease']} detected ({sc['confidence']}% confidence, {sc['severity']} severity)\n"
            f"• **Relative Humidity:** {s['humidity']}% (High humidity accelerates fungal spore germination)\n"
            f"• **Rain Probability:** {w['rain_probability_6h']}% in 6 hours (Rain splash exacerbates spread)\n"
            f"• **Ambient Temperature:** {s['temperature']}°C\n\n"
            f"**Recommended Action Plan:**\n"
            f"1. Immediately inspect nearby rows and remove severely infected lower foliage.\n"
            f"2. Avoid overhead sprinkler irrigation to keep leaf canopies dry.\n"
            f"3. Apply targeted protective fungicide (e.g. Copper oxychloride / Mancozeb) before heavy rainfall."
        )

    # 7. DISEASE QUERY (Disease Scan + RAG)
    elif intent == "DISEASE_QUERY":
        sc = context.get("scan", {"disease": "Late blight", "confidence": 88.5, "future_risk": "HIGH"})
        doc_snippet = docs[0]["content"] if docs else "Inspect leaves and maintain good air circulation."
        reply = (
            f"🛡️ **Pathology Diagnosis & Guidance:**\n\n"
            f"• **Detected Disease:** {sc['disease']} (Confidence: {sc['confidence']}%)\n"
            f"• **Risk Level:** {sc.get('future_risk', 'MODERATE')}\n\n"
            f"**Agronomic Protocol:**\n{doc_snippet}\n\n"
            f"💡 **Key Management Tip:** Sanitize pruning shears between plants, prune bottom leaves to improve airflow, and avoid working in wet foliage."
        )

    # 8. GENERAL AGRICULTURE
    else:
        doc_snippet = docs[0]["content"] if docs else "AgriSense provides precise crop management, disease diagnosis, and irrigation intelligence."
        reply = (
            f"🌱 **AgriSense Precision Agronomy:**\n\n"
            f"{doc_snippet}\n\n"
            f"Feel free to ask about your live soil moisture, irrigation recommendations, disease scans, or fertilizer planning."
        )

    return {
        "reply": reply,
        "intent": intent,
        "sources_used": route.get("sources", []),
        "routing_reason": route.get("reason", ""),
        "telemetry_used": telemetry_used,
        "cited_topics": cited_topics
    }
