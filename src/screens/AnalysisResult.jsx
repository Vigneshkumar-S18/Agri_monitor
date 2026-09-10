import React from 'react'
import { ArrowLeft, Bug, AlertTriangle, CloudRain, Droplets, Thermometer, Leaf, Activity } from 'lucide-react'

export default function AnalysisResult({ result, onBack }) {
  if (!result || !result.analysis) {
    return (
      <div>
        <div className="screen-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft />
          </button>
          <h1>Analysis Result</h1>
          <div style={{ width: 30 }}></div>
        </div>
        <div className="analysis-result" style={{ textAlign: 'center', marginTop: 40 }}>
          <p>No analysis data available.</p>
        </div>
      </div>
    )
  }

  const { analysis } = result
  
  // Choose color based on future risk
  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return '#ef4444' // red
    if (risk === 'MODERATE') return '#f59e0b' // orange
    return '#22c55e' // green
  }
  
  const riskColor = getRiskColor(analysis.future_risk)

  return (
    <div>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center' }}>Crop Health Analysis</h1>
        <div style={{ width: 30 }}></div>
      </div>

      <div className="analysis-result" style={{ padding: '0 16px 24px' }}>
        
        {/* Analyzed Image Mock Viewfinder */}
        <div className="analysis-image animate-in" style={{ height: 160, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #5ca04e 0%, #3d7a32 40%, #2d6625 80%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <div style={{
              width: '60%', height: '80%',
              background: 'linear-gradient(145deg, #6ab55c 0%, #4a9040 40%, #357a2a 80%)',
              borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
              position: 'relative'
            }}>
              {/* Disease spots to imply image was taken */}
              <div style={{ position: 'absolute', top: '25%', left: '35%', width: 20, height: 20, background: '#8B6914', borderRadius: '50%', opacity: 0.8 }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '55%', width: 16, height: 16, background: '#8B6914', borderRadius: '50%', opacity: 0.7 }}></div>
              <div style={{ position: 'absolute', top: '35%', left: '60%', width: 14, height: 14, background: '#A07018', borderRadius: '50%', opacity: 0.6 }}></div>
            </div>
            <div style={{ position: 'absolute', bottom: 8, right: 12, color: 'white', fontSize: 12, fontWeight: '600', opacity: 0.8 }}>
              LEAF IMAGE
            </div>
          </div>
        </div>

        {/* Disease Badge */}
        <div className="disease-badge animate-in" style={{ animationDelay: '0.05s', background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div className="disease-icon" style={{ background: '#fef2f2', color: '#ef4444', padding: 12, borderRadius: 12 }}>
            <Leaf size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, color: '#111', textTransform: 'uppercase' }}>
              {analysis.disease}
            </h3>
            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#666' }}>
              <span>Confidence: <strong>{analysis.confidence}%</strong></span>
              <span>Severity: <strong>{analysis.severity}</strong></span>
            </div>
          </div>
        </div>

        {/* Current State */}
        <div className="analysis-section animate-in" style={{ animationDelay: '0.1s', background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 8px', color: '#444', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} /> CURRENT STATE
          </h4>
          <p style={{ margin: 0, color: '#222', fontSize: 15, lineHeight: 1.5 }}>
            {analysis.current_state}
          </p>
        </div>

        {/* Future Risk */}
        <div className="analysis-section animate-in" style={{ animationDelay: '0.15s', background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 12px', color: '#444', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} /> FUTURE RISK
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 24, fontWeight: '800', color: riskColor }}>
              {analysis.future_risk}
            </span>
            <div style={{ display: 'flex', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>24h</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24', margin: '0 auto' }}></div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>3 Days</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', margin: '0 auto' }}></div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>7 Days</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', margin: '0 auto' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Why? (Context variables) */}
        <div className="analysis-section animate-in" style={{ animationDelay: '0.2s', background: '#fff', border: '1px solid #eee', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 12px', color: '#444', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            WHY?
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Droplets size={16} color="#3b82f6" />
              <span style={{ fontSize: 14, color: '#444' }}>Humidity 86%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CloudRain size={16} color="#0ea5e9" />
              <span style={{ fontSize: 14, color: '#444' }}>Rain forecast 78%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Thermometer size={16} color="#f97316" />
              <span style={{ fontSize: 14, color: '#444' }}>Temperature 28°C</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="analysis-section recommendations animate-in" style={{ animationDelay: '0.25s', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.15) 100%)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <h4 style={{ margin: '0 0 12px', color: '#166534', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            💡 AGRISENSE ACTION
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#14532d', fontSize: 14, lineHeight: 1.6 }}>
            {analysis.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Detailed Guide Button */}
        <button className="btn-detailed animate-in" style={{ animationDelay: '0.3s', width: '100%', padding: 14, background: '#fff', border: '1px solid #16a34a', color: '#16a34a', borderRadius: 12, fontWeight: '600', fontSize: 15, cursor: 'pointer' }}>
          VIEW FULL PLAN
        </button>
      </div>
    </div>
  )
}
