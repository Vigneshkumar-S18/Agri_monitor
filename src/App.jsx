import React, { useState } from 'react'
import SplashScreen from './screens/SplashScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import SensorDetail from './screens/SensorDetail.jsx'
import ScanScreen from './screens/ScanScreen.jsx'
import AnalysisResult from './screens/AnalysisResult.jsx'
import WeatherScreen from './screens/WeatherScreen.jsx'
import AlertsScreen from './screens/AlertsScreen.jsx'
import RecommendScreen from './screens/RecommendScreen.jsx'
import IrrigationScreen from './screens/IrrigationScreen.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')
  const [activeTab, setActiveTab] = useState('home')
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Splash -> Login transition
  const handleSplashEnd = () => setCurrentScreen('login')
  
  // Login -> App transition
  const handleLogin = () => {
    setCurrentScreen('app')
    setActiveTab('home')
  }

  // Navigate to sensor detail
  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor)
    setCurrentScreen('sensorDetail')
  }

  // Back from sensor detail
  const handleBackFromSensor = () => {
    setCurrentScreen('app')
    setSelectedSensor(null)
  }

  // Scan result navigation
  const handleShowAnalysis = () => setShowAnalysis(true)
  const handleBackFromAnalysis = () => setShowAnalysis(false)

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentScreen('app')
    setShowAnalysis(false)
    setSelectedSensor(null)
  }

  // Render splash
  if (currentScreen === 'splash') {
    return (
      <div className="mobile-frame">
        <SplashScreen onFinish={handleSplashEnd} />
      </div>
    )
  }

  // Render login
  if (currentScreen === 'login') {
    return (
      <div className="mobile-frame">
        <LoginScreen onLogin={handleLogin} />
      </div>
    )
  }

  // Render sensor detail
  if (currentScreen === 'sensorDetail' && selectedSensor) {
    return (
      <div className="mobile-frame">
        <div className="app-layout">
          <div className="app-content">
            <SensorDetail sensor={selectedSensor} onBack={handleBackFromSensor} />
          </div>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>
    )
  }

  // Render main app screens
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onSensorClick={handleSensorClick} />
      case 'scan':
        if (showAnalysis) {
          return <AnalysisResult onBack={handleBackFromAnalysis} />
        }
        return <ScanScreen onAnalyze={handleShowAnalysis} />
      case 'weather':
        return <WeatherScreen />
      case 'alerts':
        return <AlertsScreen />
      case 'recommend':
        return <RecommendScreen />
      case 'irrigation':
        return <IrrigationScreen />
      default:
        return <HomeScreen onSensorClick={handleSensorClick} />
    }
  }

  return (
    <div className="mobile-frame">
      <div className="app-layout">
        <div className="app-content">
          {renderScreen()}
        </div>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
