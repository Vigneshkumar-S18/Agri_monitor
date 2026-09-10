import React from 'react'
import { ArrowLeft, Camera, Image, Sparkles, Sun, Target } from 'lucide-react'

export default function ScanScreen({ onAnalyze }) {
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

        {/* Action Buttons */}
        <div className="scan-actions animate-in" style={{ animationDelay: '0.2s' }}>
          <button className="btn-capture" onClick={onAnalyze}>
            <Camera />
            Capture Photo
          </button>
          <button className="btn-upload" onClick={onAnalyze}>
            <Image />
            Upload from Gallery
          </button>
        </div>
      </div>
    </div>
  )
}
