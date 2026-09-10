import React from 'react'
import { MapPin, Droplets, Wind, Eye, Thermometer } from 'lucide-react'

const hourlyData = [
  { time: 'Now', icon: '⛅', temp: '28°' },
  { time: '1 PM', icon: '☀️', temp: '30°' },
  { time: '2 PM', icon: '☀️', temp: '31°' },
  { time: '3 PM', icon: '⛅', temp: '29°' },
  { time: '4 PM', icon: '🌤️', temp: '28°' },
  { time: '5 PM', icon: '🌥️', temp: '27°' },
  { time: '6 PM', icon: '🌥️', temp: '25°' },
  { time: '7 PM', icon: '🌙', temp: '23°' },
  { time: '8 PM', icon: '🌙', temp: '22°' },
]

const dailyData = [
  { day: 'Today', icon: '⛅', desc: 'Partly Cloudy', high: '31°', low: '22°' },
  { day: 'Tue', icon: '☀️', desc: 'Sunny', high: '33°', low: '23°' },
  { day: 'Wed', icon: '🌧️', desc: 'Light Rain', high: '28°', low: '21°' },
  { day: 'Thu', icon: '⛈️', desc: 'Thunderstorm', high: '26°', low: '20°' },
  { day: 'Fri', icon: '🌤️', desc: 'Mostly Sunny', high: '30°', low: '22°' },
  { day: 'Sat', icon: '☀️', desc: 'Clear', high: '32°', low: '23°' },
  { day: 'Sun', icon: '⛅', desc: 'Partly Cloudy', high: '29°', low: '21°' },
]

export default function WeatherScreen() {
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
            <span>Coimbatore, Tamil Nadu</span>
          </div>
        </div>

        {/* Current Weather */}
        <div className="weather-current animate-in" style={{ animationDelay: '0.05s' }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>⛅</div>
          <div className="weather-temp-main">28°C</div>
          <div className="weather-desc">Partly Cloudy</div>
        </div>

        {/* Weather Stats */}
        <div className="weather-stats animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="weather-stat">
            <div className="ws-icon"><Droplets /></div>
            <div className="ws-value">68%</div>
            <div className="ws-label">Humidity</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Wind /></div>
            <div className="ws-value">12 km/h</div>
            <div className="ws-label">Wind</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Eye /></div>
            <div className="ws-value">8 km</div>
            <div className="ws-label">Visibility</div>
          </div>
          <div className="weather-stat">
            <div className="ws-icon"><Thermometer /></div>
            <div className="ws-value">32°C</div>
            <div className="ws-label">Feels Like</div>
          </div>
        </div>

        {/* 24-Hour Forecast */}
        <div className="animate-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="weather-section-title">24-Hour Forecast</h3>
          <div className="hourly-scroll">
            {hourlyData.map((item, i) => (
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
            {dailyData.map((item, i) => (
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
