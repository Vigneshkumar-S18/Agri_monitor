import React, { useState, useRef } from 'react'
import { ArrowLeft, Camera, Image as ImageIcon, Sparkles, Sun, Target, Loader2 } from 'lucide-react'
import { analyzeCrop } from '../services/cropAnalysis'

export default function ScanScreen({ onAnalyze }) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      // Pass the actual file plus some contextual mock data
      const result = await analyzeCrop(file, {
        soilMoisture: 32,
        temperature: 28,
        humidity: 86,
        rainProbability: 78
      })
      
      // Pass the API result back to the parent (App)
      onAnalyze(result)
    } catch (error) {
      console.error("Failed to analyze crop:", error)
      alert("Failed to analyze crop. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="screen-header">
        <h1 style={{ flex: 1, textAlign: 'center' }}>Scan Crop</h1>
      </div>

      <div className="scan-screen">
        {/* Viewfinder */}
        <div className="scan-viewfinder animate-in">
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2d5a27 0%, #4a8c3f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Simulated leaf image */}
            <div style={{
              width: '70%',
              height: '70%',
              background: 'linear-gradient(145deg, #5ca04e 0%, #3d7a32 40%, #2d6625 80%)',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              position: 'relative',
              opacity: 0.9
            }}>
              {/* Leaf veins */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '10%',
                right: '10%',
                height: 2,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 2
              }}></div>
              {/* Disease spots */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                width: 16,
                height: 16,
                background: '#8B6914',
                borderRadius: '50%',
                opacity: 0.7
              }}></div>
              <div style={{
                position: 'absolute',
                top: '55%',
                left: '55%',
                width: 12,
                height: 12,
                background: '#8B6914',
                borderRadius: '50%',
                opacity: 0.6
              }}></div>
              <div style={{
                position: 'absolute',
                top: '40%',
                left: '65%',
                width: 10,
                height: 10,
                background: '#8B6914',
                borderRadius: '50%',
                opacity: 0.5
              }}></div>
            </div>
            
            {loading && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                zIndex: 10
              }}>
                <Loader2 className="spin" size={48} style={{ marginBottom: 16 }} />
                <h3>Analyzing Crop...</h3>
                <p>Running AI Vision Model</p>
              </div>
            )}
          </div>
          <div className="scan-corners"></div>
          <div className="scan-corners-bottom"></div>
        </div>

        {/* Instructions */}
        <div className="scan-instructions animate-in" style={{ animationDelay: '0.1s' }}>
          <h3>Take a clear photo of the leaf</h3>
          <div className="scan-tip">
            <Sun />
            <span>Ensure good lighting</span>
          </div>
          <div className="scan-tip">
            <Target />
            <span>Focus on the affected area</span>
          </div>
          <div className="scan-tip">
            <Sparkles />
            <span>Keep the leaf steady</span>
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        {/* Action Buttons */}
        <div className="scan-actions animate-in" style={{ animationDelay: '0.2s' }}>
          <button className="btn-capture" onClick={handleUploadClick} disabled={loading}>
            <Camera />
            Capture Photo
          </button>
          <button className="btn-upload" onClick={handleUploadClick} disabled={loading}>
            <ImageIcon />
            Upload from Gallery
          </button>
        </div>
      </div>
      
      <style>{`
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
