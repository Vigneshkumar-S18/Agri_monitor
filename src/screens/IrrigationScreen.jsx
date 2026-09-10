import React, { useState } from 'react'
import { Power, Droplets, Play, Square, Settings } from 'lucide-react'

const historyItems = [
  { date: 'Sep 9, 2025', detail: 'Auto mode • 30 min', duration: '6:00 AM' },
  { date: 'Sep 8, 2025', detail: 'Manual • 45 min', duration: '7:15 AM' },
  { date: 'Sep 6, 2025', detail: 'Auto mode • 25 min', duration: '6:30 AM' },
]

export default function IrrigationScreen() {
  const [motorOn, setMotorOn] = useState(false)
  const [mode, setMode] = useState('auto')

  return (
    <div>
      <div className="screen-header">
        <h1 style={{ flex: 1, textAlign: 'center' }}>Irrigation & Motor Control</h1>
      </div>

      <div className="irrigation-screen">
        {/* Motor Status */}
        <div className="motor-status-card animate-in">
          <div className={`motor-indicator ${motorOn ? 'on' : 'off'}`}>
            <Power />
          </div>
          <div className="motor-info">
            <h4>Current Status</h4>
            <div className={`motor-state ${motorOn ? 'on' : 'off'}`}>
              {motorOn ? '● ON' : '● OFF'}
            </div>
          </div>
          <div className="motor-moisture">
            <div className="mm-label">Soil Moisture</div>
            <div className="mm-value">28%</div>
          </div>
        </div>

        {/* Target Moisture */}
        <div className="threshold-card animate-in" style={{ animationDelay: '0.05s' }}>
          <h4>Target Moisture</h4>
          <div className="threshold-range">
            <span>30 – 35%</span>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mode-section animate-in" style={{ animationDelay: '0.1s' }}>
          <div 
            className={`mode-option ${mode === 'auto' ? 'active' : ''}`}
            onClick={() => setMode('auto')}
          >
            <div className="mode-radio"></div>
            <div className="mode-label">
              <h5>Auto Mode</h5>
              <p>Automatic irrigation based on sensor data</p>
            </div>
          </div>
          <div 
            className={`mode-option ${mode === 'manual' ? 'active' : ''}`}
            onClick={() => setMode('manual')}
          >
            <div className="mode-radio"></div>
            <div className="mode-label">
              <h5>Manual Control</h5>
              <p>Manually start and stop the motor</p>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="animate-in" style={{ animationDelay: '0.15s' }}>
          {!motorOn ? (
            <button className="btn-irrigation btn-start" onClick={() => setMotorOn(true)}>
              <Play />
              Start Irrigation
            </button>
          ) : (
            <button className="btn-irrigation btn-stop" onClick={() => setMotorOn(false)}>
              <Square />
              Stop Irrigation
            </button>
          )}
        </div>

        {/* Irrigation History */}
        <div className="history-section animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="history-header">
            <h4>Irrigation History</h4>
            <a href="#">View All</a>
          </div>
          {historyItems.map((item, i) => (
            <div className="history-item" key={i}>
              <div className="history-dot"></div>
              <div className="history-info">
                <span className="hi-date">{item.date}</span>
                <span className="hi-detail">{item.detail}</span>
              </div>
              <span className="history-duration">{item.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
