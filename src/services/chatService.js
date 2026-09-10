const BASE_URL = "http://localhost:8000";

export async function sendChatMessage(message, contextData = {}) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      sensor_data: contextData.sensors || {
        soil_moisture: 28,
        temperature: 31,
        humidity: 76,
        water_quality: "Good"
      },
      weather_data: contextData.weather || {
        rain_probability_6h: 82,
        rain_probability_24h: 91,
        location: contextData.locationName || "Coimbatore, Tamil Nadu"
      },
      latest_scan: contextData.latestScan || null
    })
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with AgriSense Assistant");
  }

  return response.json();
}
