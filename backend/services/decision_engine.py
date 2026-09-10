def analyze_crop_state(
    disease,
    confidence,
    soil_moisture=None,
    temperature=None,
    humidity=None,
    rain_probability=None
):
    disease_lower = disease.lower()
    
    # -----------------------------
    # Current state
    # -----------------------------
    if "healthy" in disease_lower:
        current_state = "Healthy tomato leaf"
        severity = "Low"
    elif confidence >= 85:
        current_state = f"Strong visual evidence of {disease.replace('Tomato___', '').replace('_', ' ')}"
        severity = "High"
    elif confidence >= 60:
        current_state = f"Possible {disease.replace('Tomato___', '').replace('_', ' ')}"
        severity = "Moderate"
    else:
        current_state = "Uncertain crop condition"
        severity = "Unknown"

    # -----------------------------
    # Risk calculation
    # -----------------------------
    risk_score = 0
    if confidence >= 80 and "healthy" not in disease_lower:
        risk_score += 40
    elif confidence >= 60 and "healthy" not in disease_lower:
        risk_score += 25
        
    if humidity is not None:
        if humidity >= 85:
            risk_score += 25
        elif humidity >= 75:
            risk_score += 15
            
    if rain_probability is not None:
        if rain_probability >= 70:
            risk_score += 20
        elif rain_probability >= 40:
            risk_score += 10
            
    if temperature is not None:
        if 20 <= temperature <= 30:
            risk_score += 10

    # -----------------------------
    # Risk level
    # -----------------------------
    if risk_score >= 70:
        future_risk = "HIGH"
    elif risk_score >= 40:
        future_risk = "MODERATE"
    else:
        future_risk = "LOW"

    # -----------------------------
    # Recommendations
    # -----------------------------
    recommendations = []
    
    if "healthy" in disease_lower:
        recommendations.append("Continue regular crop monitoring.")
    else:
        recommendations.append(f"Monitor the crop for progression of {disease.replace('Tomato___', '').replace('_', ' ')}.")
        recommendations.append("Inspect nearby tomato plants for similar symptoms.")
        
    if humidity is not None and humidity >= 80:
        recommendations.append(
            "High humidity detected. Increase monitoring for disease progression and avoid unnecessary leaf wetness."
        )
        
    if rain_probability is not None and rain_probability >= 70:
        recommendations.append(
            "High rainfall probability. Reconsider irrigation before applying additional water."
        )
        
    return {
        "current_state": current_state,
        "disease": disease.replace('Tomato___', '').replace('_', ' '),
        "confidence": confidence,
        "severity": severity,
        "future_risk": future_risk,
        "risk_score": min(risk_score, 100),
        "recommendations": recommendations
    }
