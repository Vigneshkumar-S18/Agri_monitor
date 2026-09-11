import React from 'react'
import {
  Bell, MapPin, Droplets, Thermometer, CloudRain,
  Beaker, Leaf, Activity, Zap
} from 'lucide-react'

const sensorData = [
  {
    id: 'moisture',
    name: 'Soil Moisture',
    value: '28%',
    status: 'Optimal',
    statusClass: 'optimal',
    iconClass: 'moisture',
    icon: Droplets,
    unit: '%',
    numValue: 28,
    chartData: [22, 25, 28, 32, 35, 38, 42, 45, 48, 40, 35, 30, 28, 25, 23, 22, 28, 32, 35, 30, 27, 25, 24, 22],
    min: { value: '22%', time: '10:30 AM' },
    max: { value: '48%', time: '02:20 PM' },
    avg: '32%',
    insight: 'Soil moisture is within the optimal range for tomato at this growth stage.'
  },
  {
    id: 'temperature',
    name: 'Soil Temperature',
    value: '24°C',
    status: 'Normal',
    statusClass: 'normal',
    iconClass: 'temperature',
    icon: Thermometer,
    unit: '°C',
    numValue: 24,
    chartData: [20, 21, 22, 23, 24, 25, 26, 27, 28, 27, 26, 25, 24, 23, 22, 21, 20, 21, 22, 23, 24, 25, 24, 23],
    min: { value: '20°C', time: '05:00 AM' },
    max: { value: '28°C', time: '02:00 PM' },
    avg: '24°C',
    insight: 'Soil temperature is ideal for tomato root development and nutrient absorption.'
  },
  {
    id: 'humidity',
    name: 'Humidity',
    value: '68%',
    status: 'Normal',
    statusClass: 'normal',
    iconClass: 'humidity',
    icon: CloudRain,
    unit: '%',
    numValue: 68,
    chartData: [72, 70, 68, 65, 60, 58, 55, 52, 50, 52, 55, 58, 62, 65, 68, 70, 72, 74, 75, 73, 71, 70, 69, 68],
    min: { value: '50%', time: '02:30 PM' },
    max: { value: '75%', time: '06:00 PM' },
    avg: '64%',
    insight: 'Humidity levels are within a healthy range. Monitor for disease risk if levels exceed 80%.'
  },
  {
    id: 'ph',
    name: 'pH',
    value: '6.5',
    status: 'Optimal',
    statusClass: 'optimal',
    iconClass: 'ph',
    icon: Beaker,
    unit: '',
    numValue: 6.5,
    chartData: [6.3, 6.4, 6.5, 6.5, 6.6, 6.5, 6.4, 6.5, 6.6, 6.5, 6.4, 6.5, 6.5, 6.4, 6.5, 6.6, 6.5, 6.4, 6.5, 6.5, 6.6, 6.5, 6.4, 6.5],
    min: { value: '6.3', time: '08:00 AM' },
    max: { value: '6.6', time: '12:00 PM' },
    avg: '6.5',
    insight: 'pH level is ideal for tomato cultivation (6.0-6.8 range). Nutrient absorption is optimal.'
  },
  {
    id: 'npk',
    name: 'NPK Sensor',
    value: 'N:32 P:24 K:36',
    status: 'Low N/P',
    statusClass: 'warning',
    iconClass: 'npk',
    icon: Leaf,
    unit: 'mg/kg',
    numValue: 32,
    chartData: [45, 42, 40, 38, 36, 35, 34, 33, 32, 32, 31, 32, 32, 33, 32, 32, 31, 32, 32, 33, 32, 32, 32, 32],
    min: { value: '24 mg/kg', time: '06:00 AM' },
    max: { value: '45 mg/kg', time: 'Yesterday' },
    avg: '32 mg/kg',
    insight: 'Nitrogen and Phosphorus levels are below optimum for flowering. Tap to view AI Fertilizer & Organic advice.'
  },
  {
    id: 'tds',
    name: 'Water Quality',
    value: '320 ppm',
    status: 'Good',
    statusClass: 'good',
    iconClass: 'tds',
    icon: Zap,
    unit: 'ppm',
    numValue: 320,
    chartData: [310, 315, 320, 318, 322, 325, 320, 315, 310, 312, 318, 320, 322, 320, 318, 315, 312, 315, 318, 320, 322, 320, 318, 320],
    min: { value: '310 ppm', time: '06:00 AM' },
    max: { value: '325 ppm', time: '01:00 PM' },
    avg: '318 ppm',
    insight: 'Water quality is good for irrigation. TDS is within the acceptable range for tomato crops.'
  }
]

export default function HomeScreen({ onSensorClick, onWeatherClick, onAlertsClick }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  })
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', minute: '2-digit', hour12: true 
  })

  return (
    <div>
      {/* Header */}
      <div className="home-header">
        <div className="home-greeting">
          <h2>Good Morning, Farmer! 👋</h2>
          <button
            className="notification-btn"
            onClick={onAlertsClick}
            title="View alerts and notifications"
            aria-label="Alerts"
          >
            <Bell />
            <span className="notification-dot"></span>
          </button>
        </div>
        <div className="home-meta">
          <div className="location">
            <MapPin />
            <span>My Tomato Farm ▾</span>
          </div>
          <div
            className="weather-badge"
            onClick={onWeatherClick}
            title="Click to view detailed weather forecast"
            role="button"
            tabIndex={0}
          >
            <span className="weather-icon">⛅</span>
            <span>28°C</span>
            <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>Partly Cloudy</span>
          </div>
        </div>
        <p className="home-date">📅 {dateStr} • {timeStr}</p>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner animate-in">
        <div className="hero-banner-content">
          <h3>Healthy Crops<br/>Brighter Tomorrow</h3>
          <p>Monitor • Predict • Grow</p>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="sensor-grid">
        {sensorData.map((sensor, i) => {
          const Icon = sensor.icon
          return (
            <div
              key={sensor.id}
              className="sensor-card animate-in"
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
              onClick={() => onSensorClick(sensor)}
            >
              <div className="sensor-card-header">
                <div className={`sensor-icon ${sensor.iconClass}`}>
                  <Icon />
                </div>
                <span>{sensor.name}</span>
              </div>
              <div className="sensor-value">{sensor.value}</div>
              <span className={`sensor-status ${sensor.statusClass}`}>
                {sensor.status}
              </span>
            </div>
          )
        })}
      </div>

      {/* Field Health Score */}
      <div className="field-health animate-in" style={{ animationDelay: '0.35s' }}>
        <div className="field-health-title">
          <Activity />
          Field Health Score
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="health-score-circle" style={{ '--score': 78 }}>
            <div className="health-score-inner">
              <span className="score">78</span>
              <span className="total">/100</span>
            </div>
          </div>
          <div className="health-info">
            <p>Your tomato crop is in good condition 🌱</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { sensorData }
