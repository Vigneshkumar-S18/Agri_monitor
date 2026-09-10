const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,apparent_temperature,visibility",
    hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,rain,wind_speed_10m,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code",
    timezone: "auto"
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  return response.json();
}

// Helper to map WMO weather codes to emojis and descriptions
export function getWeatherMapping(code) {
  const map = {
    0: { icon: '☀️', desc: 'Clear sky' },
    1: { icon: '🌤️', desc: 'Mainly clear' },
    2: { icon: '⛅', desc: 'Partly cloudy' },
    3: { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Fog' },
    48: { icon: '🌫️', desc: 'Depositing rime fog' },
    51: { icon: '🌧️', desc: 'Light drizzle' },
    53: { icon: '🌧️', desc: 'Moderate drizzle' },
    55: { icon: '🌧️', desc: 'Dense drizzle' },
    56: { icon: '🌧️', desc: 'Light freezing drizzle' },
    57: { icon: '🌧️', desc: 'Dense freezing drizzle' },
    61: { icon: '🌧️', desc: 'Slight rain' },
    63: { icon: '🌧️', desc: 'Moderate rain' },
    65: { icon: '🌧️', desc: 'Heavy rain' },
    66: { icon: '🌧️', desc: 'Light freezing rain' },
    67: { icon: '🌧️', desc: 'Heavy freezing rain' },
    71: { icon: '🌨️', desc: 'Slight snow fall' },
    73: { icon: '🌨️', desc: 'Moderate snow fall' },
    75: { icon: '🌨️', desc: 'Heavy snow fall' },
    77: { icon: '🌨️', desc: 'Snow grains' },
    80: { icon: '🌧️', desc: 'Slight rain showers' },
    81: { icon: '🌧️', desc: 'Moderate rain showers' },
    82: { icon: '🌧️', desc: 'Violent rain showers' },
    85: { icon: '🌨️', desc: 'Slight snow showers' },
    86: { icon: '🌨️', desc: 'Heavy snow showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm with slight hail' },
    99: { icon: '⛈️', desc: 'Thunderstorm with heavy hail' },
  };
  return map[code] || { icon: '⛅', desc: 'Unknown' };
}
