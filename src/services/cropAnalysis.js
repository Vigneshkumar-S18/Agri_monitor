export async function analyzeCrop(image, context) {
  const formData = new FormData();
  formData.append("file", image);
  
  if (context?.soilMoisture !== undefined) {
    formData.append("soil_moisture", context.soilMoisture.toString());
  }
  if (context?.temperature !== undefined) {
    formData.append("temperature", context.temperature.toString());
  }
  if (context?.humidity !== undefined) {
    formData.append("humidity", context.humidity.toString());
  }
  if (context?.rainProbability !== undefined) {
    formData.append("rain_probability", context.rainProbability.toString());
  }
  
  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  });
  
  if (!response.ok) {
    throw new Error("Crop analysis failed");
  }
  return response.json();
}
