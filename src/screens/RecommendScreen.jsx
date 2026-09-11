import React, { useState } from 'react'
import {
  Sparkles, Droplets, Leaf, Beaker, Flower2,
  Cpu, CheckCircle2, AlertTriangle, RefreshCw, MessageSquare,
  Sliders, Info, Zap, CloudRain, Thermometer, ChevronDown, ChevronUp,
  ShieldAlert, Clock
} from 'lucide-react'
import { getFertilizerRecommendation } from '../services/fertilizerService'

const SOIL_TYPES = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Red Soil']

export default function RecommendScreen({ onNavigateToChat }) {
  // Fixed stage: Fruiting (as requested)
  const stage = 'Fruiting'

  const [isManualEntry, setIsManualEntry] = useState(false)
  const [soilType, setSoilType] = useState('Loamy')
  const [soilPh, setSoilPh] = useState(6.5)

  // Live NPK Telemetry for Fruiting
  const [nitrogen, setNitrogen] = useState(32)
  const [phosphorus, setPhosphorus] = useState(24)
  const [potassium, setPotassium] = useState(36)

  // Environmental context
  const soilMoisture = 28
  const temperature = 31
  const humidity = 76
  const rainProbability = 82

  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [activeSolutionTab, setActiveSolutionTab] = useState('chemical') // 'chemical' | 'organic'
  const [expandedSection, setExpandedSection] = useState(null) // 'precautions' | 'protocol' | 'verification'
  const [copiedToast, setCopiedToast] = useState(false)

  // Trigger recommendation only on user request / button click
  const handleGenerateRecommendation = async () => {
    setLoading(true)
    try {
      const res = await getFertilizerRecommendation({
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        soil_moisture: soilMoisture,
        temperature,
        humidity,
        soil_type: soilType,
        crop_stage: 'Fruiting',
        soil_ph: Number(soilPh),
        rain_probability: rainProbability
      })
      setRecommendation(res)
      setHasGenerated(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleResetToSensor = () => {
    setIsManualEntry(false)
    setNitrogen(32)
    setPhosphorus(24)
    setPotassium(36)
    setSoilPh(6.5)
  }

  const toggleAccordion = (key) => {
    setExpandedSection(prev => (prev === key ? null : key))
  }

  const handleAskAdvisor = () => {
    if (onNavigateToChat && recommendation) {
      const prompt = `My tomato crop is in the Fruiting stage with NPK readings (N:${nitrogen}, P:${phosphorus}, K:${potassium}). How and when should I apply ${activeSolutionTab === 'chemical' ? recommendation.chemical_solution.name : recommendation.organic_solution.name}?`
      onNavigateToChat(prompt)
    }
  }

  const handleCopyPrescription = () => {
    if (!recommendation) return
    const text = `AgriSense Tomato Prescription (Fruiting Stage):\n• Fast Chemical: ${recommendation.chemical_solution.name} (${recommendation.chemical_solution.dosage})\n• Organic Alternative: ${recommendation.organic_solution.name} (${recommendation.organic_solution.dosage})\n• Application: Drip Fertigation at root zone.`
    navigator.clipboard?.writeText(text)
    setCopiedToast(true)
    setTimeout(() => setCopiedToast(false), 2500)
  }

  return (
    <div className="recommend-screen-wrapper">
      {/* Screen Header */}
      <div className="screen-header" style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff' }}>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, margin: 0 }}>
          Fertilizer & Nutrient Advisor
        </h1>
      </div>

      <div className="recommend-screen" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ACTIVE STAGE CARD: Tomato Fruiting Stage */}
        <div className="active-stage-card animate-in">
          <div className="stage-banner-header">
            <div className="stage-badge-icon">🍅</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="stage-active-tag">Active Growth Phase</span>
                <span className="stage-crop-tag">Tomato</span>
              </div>
              <h3 style={{ margin: '3px 0 2px', fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                Fruiting & Fruit Expansion Stage
              </h3>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.4 }}>
            High <strong>Potassium (K)</strong> and <strong>Calcium (Ca)</strong> demand for fruit expansion, sugar content (brix), and Blossom End Rot prevention.
          </p>
        </div>

        {/* SOIL & NPK TELEMETRY CARD */}
        <div className="soil-condition animate-in" style={{ animationDelay: '0.05s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>
              Live Field & Nutrient Readings
            </h4>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`toggle-source-btn ${!isManualEntry ? 'active' : ''}`}
                onClick={handleResetToSensor}
              >
                📡 IoT Sensors
              </button>
              <button
                className={`toggle-source-btn ${isManualEntry ? 'active' : ''}`}
                onClick={() => setIsManualEntry(true)}
              >
                ✍️ Soil Lab Test
              </button>
            </div>
          </div>

          {/* N-P-K Display Cards */}
          <div className="npk-display">
            <div className="npk-pill n">
              <div className="npk-label">N</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(Number(e.target.value))}
                  className="npk-manual-input"
                  min="0"
                  max="120"
                />
              ) : (
                <div className="npk-val">{nitrogen} <span className="unit">mg/kg</span></div>
              )}
              <div className="npk-status sensor-status warning">Low N</div>
            </div>

            <div className="npk-pill p">
              <div className="npk-label">P</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(Number(e.target.value))}
                  className="npk-manual-input"
                  min="0"
                  max="100"
                />
              ) : (
                <div className="npk-val">{phosphorus} <span className="unit">mg/kg</span></div>
              )}
              <div className="npk-status sensor-status warning">Low P</div>
            </div>

            <div className="npk-pill k">
              <div className="npk-label">K</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={potassium}
                  onChange={(e) => setPotassium(Number(e.target.value))}
                  className="npk-manual-input"
                  min="0"
                  max="120"
                />
              ) : (
                <div className="npk-val">{potassium} <span className="unit">mg/kg</span></div>
              )}
              <div className="npk-status sensor-status danger">Suboptimal K</div>
            </div>
          </div>


          {/* Telemetry Context Chips */}
          <div className="env-telemetry-chips">
            <span className="env-chip">
              <Droplets size={12} color="#3b82f6" /> Moisture: <strong>{soilMoisture}%</strong>
            </span>
            <span className="env-chip">
              <Thermometer size={12} color="#ea580c" /> Temp: <strong>{temperature}°C</strong>
            </span>
            <span className="env-chip">
              <CloudRain size={12} color="#0284c7" /> Rain (6h): <strong>{rainProbability}%</strong>
            </span>
          </div>
        </div>

        {/* PROMINENT RECOMMENDATION TRIGGER BUTTON */}
        <div className="generate-action-box animate-in" style={{ animationDelay: '0.1s' }}>
          <button
            className="btn-generate-rec"
            onClick={handleGenerateRecommendation}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="spin" size={18} />
                <span>Analyzing Fruiting Nutrition...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{hasGenerated ? 'Re-calculate Recommendation' : 'Recommend Fertilizer & Organic Solution'}</span>
              </>
            )}
          </button>
          {!hasGenerated && (
            <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 11, color: 'var(--gray-500)' }}>
              ⚡ Tap to run Poshan ML + AgriSense Agronomic Validation for your fruiting tomato crop.
            </p>
          )}
        </div>

        {/* RESULTS SECTION: REVEALED CLEANLY ONLY AFTER USER CLICKS RECOMMENDATION */}
        {hasGenerated && recommendation && (
          <div className="recommendation-results-clean animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Model & Diagnosis Tag */}
            <div className="model-tag-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={14} color="#16a34a" />
                <span>Candidate ML: <strong>Poshan-fertilizer-recommendation</strong> (94.7% Acc)</span>
              </div>
              <span className="deficiency-pill">K & P Deficiency Flagged</span>
            </div>

            {/* Stage Agronomic Focus */}
            <div className="focus-summary-box">
              <span className="focus-tag">🎯 Agronomic Fruiting Focus</span>
              <p>{recommendation.primary_focus}</p>
            </div>

            {/* TAB SELECTOR: FAST CHEMICAL VS NATURAL ORGANIC (Clean, non-congested toggle) */}
            <div className="solution-tabs-nav">
              <button
                className={`sol-tab-btn ${activeSolutionTab === 'chemical' ? 'active chemical' : ''}`}
                onClick={() => setActiveSolutionTab('chemical')}
              >
                🚀 Fast Chemical Fertilizer
              </button>
              <button
                className={`sol-tab-btn ${activeSolutionTab === 'organic' ? 'active organic' : ''}`}
                onClick={() => setActiveSolutionTab('organic')}
              >
                🌿 Natural / Organic Alternative
              </button>
            </div>

            {/* ACTIVE SOLUTION CARD */}
            {activeSolutionTab === 'chemical' ? (
              <div className="solution-card chemical animate-in">
                <div className="solution-badge chemical">
                  <span>🚀 FAST CHEMICAL CORRECTION</span>
                  <span className="speed-pill">Response: 3–5 Days</span>
                </div>
                <h4 className="sol-name">{recommendation.chemical_solution.name}</h4>
                <div className="sol-grade">{recommendation.chemical_solution.grade}</div>

                <div className="sol-meta-grid">
                  <div>
                    <span className="sol-meta-label">Prescription Dosage:</span>
                    <p className="sol-meta-val">{recommendation.chemical_solution.dosage}</p>
                  </div>
                  <div>
                    <span className="sol-meta-label">Application Method:</span>
                    <p className="sol-meta-val">{recommendation.chemical_solution.application_method}</p>
                  </div>
                </div>

                <div className="sol-why-box">
                  <strong>Agronomic Selection Reason:</strong> {recommendation.chemical_solution.why_selected}
                </div>
              </div>
            ) : (
              <div className="solution-card organic animate-in">
                <div className="solution-badge organic">
                  <span>🌿 NATURAL / ORGANIC ALTERNATIVE</span>
                  <span className="speed-pill">Sustainable Soil Health</span>
                </div>
                <h4 className="sol-name">{recommendation.organic_solution.name}</h4>

                <div className="sol-meta-grid">
                  <div>
                    <span className="sol-meta-label">Organic Dosage:</span>
                    <p className="sol-meta-val">{recommendation.organic_solution.dosage}</p>
                  </div>
                  <div>
                    <span className="sol-meta-label">Application Method:</span>
                    <p className="sol-meta-val">{recommendation.organic_solution.application_method}</p>
                  </div>
                </div>

                <div className="sol-why-box organic">
                  <strong>Soil Health Benefit:</strong> {recommendation.organic_solution.why_selected}
                </div>
              </div>
            )}

            {/* EXPANDABLE ACCORDIONS (Declutters precautions, protocols, and verification) */}
            <div className="accordion-group">

              {/* Accordion 1: Precautions & Rain Alert */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('precautions')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={15} color="#ea580c" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#9a3412' }}>
                      Field & Weather Precautions (Rain Warning)
                    </span>
                  </div>
                  {expandedSection === 'precautions' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'precautions' && (
                  <div className="accordion-content precaution animate-in">
                    <ul className="rec-bullet-list precaution">
                      {recommendation.weather_precautions.map((p, idx) => (
                        <li key={idx}><strong>{p.title}:</strong> {p.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Application Protocol */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('protocol')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={15} color="var(--green-600)" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                      Application Protocol & Schedule
                    </span>
                  </div>
                  {expandedSection === 'protocol' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'protocol' && (
                  <div className="accordion-content animate-in">
                    <div className="action-checklist">
                      {recommendation.action_steps.map((step, idx) => (
                        <div key={idx} className="action-check-item">
                          <div className="check-number">{idx + 1}</div>
                          <p>{step.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Closed-Loop Sensor Verification */}
              <div className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion('verification')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RefreshCw size={15} color="var(--green-600)" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                      Closed-Loop IoT Verification (3–7 Days)
                    </span>
                  </div>
                  {expandedSection === 'verification' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'verification' && (
                  <div className="accordion-content animate-in">
                    <p style={{ fontSize: 12, color: 'var(--gray-600)', margin: '0 0 8px', lineHeight: 1.4 }}>
                      After applying fertilizer or organic mulch, re-test your IoT NPK sensor probe in <strong>3–7 days</strong>.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f0fdf4', padding: '8px 10px', borderRadius: 6, fontSize: 11, color: '#166534', fontWeight: 600 }}>
                      <span>Target Potassium: &gt; 65 mg/kg</span>
                      <span>Target Phosphorus: &gt; 45 mg/kg</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                className="btn-rec-action advisor"
                onClick={handleAskAdvisor}
                style={{ flex: 1 }}
              >
                <MessageSquare size={16} />
                Ask Advisor in Chat
              </button>
              <button
                className="btn-rec-action apply"
                onClick={handleCopyPrescription}
                style={{ flex: 1 }}
              >
                <Zap size={16} />
                {copiedToast ? 'Prescription Copied!' : 'Copy Prescription'}
              </button>
            </div>

          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}

