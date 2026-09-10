import React, { useEffect, useState } from 'react'
import { Leaf } from 'lucide-react'

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(onFinish, 600)
    }, 2500)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-logo-container">
        <div className="splash-logo-icon">
          <Leaf strokeWidth={2.5} />
        </div>
        <h1 className="splash-title">AgriSense</h1>
        <p className="splash-tagline">
          Smarter Farming<br />Healthier Tomorrow
        </p>
      </div>
      <div className="splash-bottom">
        <p>Powered by Technology<br />For a Greener Tomorrow</p>
      </div>
    </div>
  )
}
