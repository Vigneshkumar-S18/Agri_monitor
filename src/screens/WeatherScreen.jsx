import React, { useState, useEffect } from 'react'
import { MapPin, Droplets, Wind, Eye, Thermometer } from 'lucide-react'
import { getWeather, getWeatherMapping } from '../services/weatherService'

export default function WeatherScreen() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Default to a location if geolocation fails or before it loads (e.g., Coimbatore)
  const [location, setLocation] = useState({ name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558 })

  useEffect(() => {
    // Optional: Get actual location, or just use default for hackathon
    // For now, we'll just fetch for the default location to ensure it works instantly
    async function fetchWeather() {
      try {
        setLoading(true)
        const data = await getWeather(location.lat, location.lon)
        setWeatherData(data)
      } catch (err) {
        console.error("Failed to fetch weather:", err)
        setError("Could not load weather data.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchWeather()
  }, [location])

  if (loading) {
    return (
      <div>
        <div className="screen-header">
          <h1 style={{ flex: 1, textAlign: 'center' }}>Weather</h1>
        </div>
        <div className="weather-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div>Loading weather data...</div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div>
        <div className="screen-header">
          <h1 style={{ flex: 1, textAlign: 'center' }}>Weather</h1>
        </div>
        <div className="weather-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ color: 'red' }}>{error || "No data available."}</div>
        </div>
      </div>
    )
  }

  const { current, hourly, daily } = weatherData;
  const currentMapping = getWeatherMapping(current.weather_code);

  // Format hourly data (next 24 hours)
  // We'll take the next 12 hours for display
  const currentHourIndex = hourly.time.findIndex(t => new Date(t) > new Date())
  const displayHours = []
  const startIndex = currentHourIndex === -1 ? 0 : Math.max(0, currentHourIndex - 1)
  
  for (let i = 0; i < 12; i++) {
    const idx = startIndex + i;
    if (idx >= hourly.time.length) break;
    
    const time = new Date(hourly.time[idx]);
    const isNow = i === 0;
    
    displayHours.push({
      time: isNow ? 'Now' : time.toLocaleTimeString([], { hour: 'numeric' }),
      icon: getWeatherMapping(hourly.weather_code[idx]).icon,
      temp: Math.round(hourly.temperature_2m[idx]) + '°'
    })
  }

  // Format daily data
  const displayDays = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(daily.time[i]);
    const isToday = i === 0;
    
    displayDays.push({
      day: isToday ? 'Today' : date.toLocaleDateString([], { weekday: 'short' }),
      icon: getWeatherMapping(daily.weather_code[i]).icon,
      desc: getWeatherMapping(daily.weather_code[i]).desc,
      high: Math.round(daily.temperature_2m_max[i]) + '°',
      low: Math.round(daily.temperature_2m_min[i]) + '°'
    })
  }

  // Agrisense Insight Logic
  // Look at next 12 hours rain probability
  const next12HoursRainProb = hourly.precipitation_probability.slice(startIndex, startIndex + 12);
  const maxRainProb = Math.max(...next12HoursRainProb);
  
  let insightTitle = "🌱 AGRISENSE INSIGHT";
  let insightText = "Weather conditions are optimal. Standard irrigation schedule can be maintained.";
  
  if (maxRainProb > 70) {
    insightText = `High probability of rain (${maxRainProb}%) in the coming hours. Postpone irrigation to avoid unnecessary watering and waterlogging.`;
  } else if (current.temperature_2m > 35) {
    insightText = `High temperatures detected (${Math.round(current.temperature_2m)}°C). Ensure adequate soil moisture to prevent heat stress on crops.`;
  } else if (current.relative_humidity_2m > 85 && maxRainProb > 30) {
    insightText = "High humidity and potential rain detected. Conditions are favorable for fungal diseases. Monitor crops closely.";
  }

  return (
    <div>
      <div className="screen-header">
        <h1 style={{ flex: 1, textAlign: 'center' }}>Weather</h1>
      </div>

      <div className="weather-screen">
        {/* Location */}
        <div className="weather-location animate-in">
          <div className="loc-name">
            <MapPin />
            <span>{location.name}</span>
          </div>
        </div>

        {/* Current Weather */}
        <div className="weather-current animate-in" style={{ animationDelay: '0.05s' }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>{currentMapping.icon}</div>
          <div className="weather-temp-main">{Math.round(current.temperature_2m)}°C</div>
          <div className="weather-desc">{currentMapping.desc}</div>
        </div>

        {/* Weather Stats */}
        <div className="weather-stats animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="weather-stat">
            <div className="ws-icon"><Droplets /></div>
            <div className="ws-value">{Math.round(current.relative_humidity_2m)}%</div>
            <div className="ws-label">Humidity</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Wind /></div>
            <div className="ws-value">{Math.round(current.wind_speed_10m)} km/h</div>
            <div className="ws-label">Wind</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Eye /></div>
            <div className="ws-value">{(current.visibility / 1000).toFixed(1)} km</div>
            <div className="ws-label">Visibility</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Thermometer /></div>
            <div className="ws-value">{Math.round(current.apparent_temperature)}°C</div>
            <div className="ws-label">Feels Like</div>
          </div>
        </div>
        
        {/* Agrisense Insight */}
        <div className="animate-in" style={{ animationDelay: '0.12s', marginTop: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.2) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {insightTitle}
            </h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', opacity: 0.9 }}>
              {insightText}
            </p>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="animate-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="weather-section-title">Hourly Forecast</h3>
          <div className="hourly-scroll">
            {displayHours.map((item, i) => (
              <div className="hourly-item" key={i}>
                <div className="h-time">{item.time}</div>
                <div className="h-icon">{item.icon}</div>
                <div className="h-temp">{item.temp}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="animate-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="weather-section-title">7-Day Forecast</h3>
          <div className="daily-list">
            {displayDays.map((item, i) => (
              <div className="daily-item" key={i}>
                <span className="d-day">{item.day}</span>
                <span className="d-icon">{item.icon}</span>
                <span className="d-desc">{item.desc}</span>
                <div className="d-temps">
                  <span className="d-high">{item.high}</span>
                  <span className="d-low">{item.low}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
