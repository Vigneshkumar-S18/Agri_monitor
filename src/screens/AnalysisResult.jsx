import React from 'react'
import { ArrowLeft, AlertTriangle, Bug, Droplets, Wind, Scissors } from 'lucide-react'

export default function AnalysisResult({ onBack }) {
  return (
    <div>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1>Analysis Result</h1>
        <div style={{ width: 30 }}></div>
      </div>

      <div className="analysis-result">
        {/* Analyzed Image */}
        <div className="analysis-image animate-in">
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #5ca04e 0%, #3d7a32 40%, #2d6625 80%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '60%',
              height: '80%',
              background: 'linear-gradient(145deg, #6ab55c 0%, #4a9040 40%, #357a2a 80%)',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: '25%', left: '35%',
                width: 20, height: 20, background: '#8B6914',
                borderRadius: '50%', opacity: 0.8
              }}></div>
              <div style={{
                position: 'absolute', top: '50%', left: '55%',
                width: 16, height: 16, background: '#8B6914',
                borderRadius: '50%', opacity: 0.7
              }}></div>
              <div style={{
                position: 'absolute', top: '35%', left: '60%',
                width: 14, height: 14, background: '#A07018',
                borderRadius: '50%', opacity: 0.6
              }}></div>
            </div>
          </div>
        </div>

        {/* Disease Badge */}
        <div className="disease-badge animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="disease-icon">
            <Bug />
          </div>
          <div>
            <h3>Early Blight</h3>
            <p className="disease-confidence">Confidence: 91%</p>
          </div>
        </div>

        {/* What's Happening */}
        <div className="analysis-section animate-in" style={{ animationDelay: '0.15s' }}>
          <h4>What's happening?</h4>
          <p>Fungal infection (Early Blight) detected on tomato leaf. Brown concentric ring patterns indicate Alternaria solani infection.</p>
        </div>

        {/* Possible Causes */}
        <div className="analysis-section animate-in" style={{ animationDelay: '0.2s' }}>
          <h4>Possible Causes</h4>
          <ul>
            <li>High humidity conditions</li>
            <li>Poor air circulation</li>
            <li>Overhead irrigation</li>
            <li>Nutrient deficiency (K)</li>
          </ul>
        </div>

        {/* Recommendations */}
        <div className="analysis-section recommendations animate-in" style={{ animationDelay: '0.25s' }}>
          <h4>Recommendations</h4>
          <ul>
            <li>Avoid overhead irrigation</li>
            <li>Remove affected leaves</li>
            <li>Use recommended Fungicide (Mancozeb/Chlorothalonil)</li>
            <li>Improve air circulation around plants</li>
            <li>Apply potassium-rich fertilizer</li>
          </ul>
        </div>

        {/* Detailed Guide Button */}
        <button className="btn-detailed animate-in" style={{ animationDelay: '0.3s' }}>
          View Detailed Guide
        </button>
      </div>
    </div>
  )
}
