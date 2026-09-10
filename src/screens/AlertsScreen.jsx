import React, { useState } from 'react'
import {
  AlertTriangle, Droplets, Thermometer, Leaf, 
  Shield, Beaker, Bell, ChevronDown, ChevronUp
} from 'lucide-react'

const alerts = [
  {
    id: 1,
    type: 'critical',
    icon: Droplets,
    title: 'Low Soil Moisture',
    description: 'Soil moisture dropped below 25%. Immediate irrigation recommended.',
    time: '12:34 PM',
  },
  {
    id: 2,
    type: 'warning',
    icon: Thermometer,
    title: 'High Temperature',
    description: 'Temperature above 35°C. Consider shade nets or increased irrigation.',
    time: '11:15 AM',
  },
  {
    id: 3,
    type: 'warning',
    icon: Leaf,
    title: 'Possible Nutrient Deficiency',
    description: 'Potassium levels low (K:41). Supplement with potassium-rich fertilizer.',
    time: '10:00 AM',
  },
  {
    id: 4,
    type: 'info',
    icon: Shield,
    title: 'Disease Risk Increased',
    description: 'High humidity (>80%) increases risk of fungal infections. Monitor leaves.',
    time: '9:30 AM',
  },
  {
    id: 5,
    type: 'info',
    icon: Beaker,
    title: 'Water Quality Alert',
    description: 'TDS slightly elevated at 450 ppm. Consider water treatment before irrigation.',
    time: '8:45 AM',
  },
]

export default function AlertsScreen() {
  const highPriorityCount = alerts.filter(a => a.type === 'critical' || a.type === 'warning').length
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div>
      <div className="screen-header">
        <h1 style={{ flex: 1, textAlign: 'center' }}>Alerts</h1>
      </div>

      <div className="alerts-screen">
        {/* Summary */}
        <div className="alert-summary animate-in">
          <AlertTriangle />
          <p>You have {highPriorityCount} high-priority alerts. Take action to keep crops healthy.</p>
        </div>

        {/* Alert List */}
        <div className="alert-list">
          {alerts.map((alert, i) => {
            const Icon = alert.icon
            const isExpanded = expandedId === alert.id
            return (
              <div 
                className="alert-card animate-in" 
                key={alert.id}
                style={{ 
                  animationDelay: `${0.05 + i * 0.05}s`, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
                onClick={() => toggleExpand(alert.id)}
              >
                <div className={`alert-indicator ${alert.type}`}>
                  <Icon />
                </div>
                <div className="alert-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0 }}>{alert.title}</h4>
                    {isExpanded ? <ChevronUp size={16} color="#888" /> : <ChevronDown size={16} color="#888" />}
                  </div>
                  
                  {isExpanded && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eaeaea' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                        {alert.description}
                      </p>
                    </div>
                  )}
                  
                  <span className="alert-time" style={{ display: 'block', marginTop: '6px' }}>
                    {alert.time}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
