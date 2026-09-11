import React from 'react'
import { Home, Scan, Cloud, Bell, Sprout, Droplets, Bot } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: Scan },
  { id: 'chat', label: 'Advisor', icon: Bot },
  { id: 'recommend', label: 'Recommend', icon: Sprout },
  { id: 'alerts', label: 'Alerts', icon: Bell },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
