import React, { useState } from 'react'
import {
  AlertTriangle, Droplets, Thermometer, Leaf, 
  Shield, Beaker, ChevronRight, ArrowLeft,
  CheckCircle2, Sparkles, RefreshCw, MessageSquare, Clock,
  Info, ExternalLink, Flame, ShieldAlert, Cpu,
  ChevronDown, ChevronUp, Sliders
} from 'lucide-react'

const alertsData = [
  {
    id: 'n_low',
    type: 'critical',
    severity: 'High',
    icon: Leaf,
    category: 'NPK Nutrition',
    title: 'Low Nitrogen Level Detected',
    shortDesc: 'Soil Nitrogen is 24 mg/kg (optimal: 50–65). Lower tomato leaves show pale yellowing and reduced vine vigor.',
    time: 'Just now',
    currentVal: '24 mg/kg',
    targetVal: '50–65 mg/kg',
    growthStage: 'Flowering & Fruit Setting',
    whyHappened: [
      'Soil nitrogen level dropped 56% below the minimum target for the flowering stage.',
      'Rapid vegetative growth and heavy tomato fruit set demands elevated bioavailable nitrogen.',
      'Recent irrigation or rainfall has accelerated nitrate downward leaching in porous soil.'
    ],
    fastSolution: {
      name: 'Urea (46-0-0)',
      grade: '46% Fast-Acting Bioavailable N',
      dosage: '25–30 kg/acre (or 3.5 g/plant)',
      method: 'Drip fertigation directly at root zone (or band placement 10 cm from stem)',
      whySelected: 'Urea quickly hydrolyzes in moist soil to replenish chlorophyll synthesis and restore deep green foliage within 3–5 days.',
      speed: '3–5 Days',
      confidence: '96%'
    },
    organicSolution: {
      name: 'Well-Decomposed Farmyard Manure (FYM) + Neem Seed Cake',
      dosage: '4–5 tons FYM/acre + 100 kg Neem Cake',
      method: 'Soil trenching around drip circle followed by light irrigation',
      whySelected: 'Enriches soil organic matter, provides steady nitrogen release without chemical scorch, and Neem Cake suppresses root nematodes.',
      speed: '7–14 Days (Gradual soil conditioning)',
      confidence: '92%'
    },
    precautions: [
      '🌧️ Rain Forecast Warning: Rain probability is currently high (82%). Avoid surface broadcasting to prevent nitrate runoff.',
      '💧 Moisture Check: Ensure soil moisture is above 35% before applying to prevent fertilizer root scorch.'
    ],
    actionSteps: [
      '1. Select either Fast Chemical Correction (Urea) for immediate recovery or Organic Alternative (FYM + Neem Cake).',
      '2. Deliver fertilizer via drip fertigation 10 cm away from main stems.',
      '3. Re-test IoT NPK sensor probe in 3–5 days to verify recovery to target range.'
    ],
    verification: {
      metric: 'Nitrogen (N)',
      baseline: '24 mg/kg',
      target: '55 mg/kg',
      window: '3–5 days'
    }
  },
  {
    id: 'p_low',
    type: 'warning',
    severity: 'Moderate',
    icon: Leaf,
    category: 'NPK Nutrition',
    title: 'Phosphorus Level Low',
    shortDesc: 'Soil Phosphorus is 18 mg/kg (target: 45–55). Suboptimal flower cluster emergence and weak root anchoring.',
    time: '10:00 AM',
    currentVal: '18 mg/kg',
    targetVal: '45–55 mg/kg',
    growthStage: 'Flowering & Bud Initiation',
    whyHappened: [
      'Phosphorus uptake increases dramatically during flower bud induction.',
      'Soil pH is slightly acidic, which can temporarily bind orthophosphates with soil minerals.'
    ],
    fastSolution: {
      name: 'DAP (Diammonium Phosphate 18-46-0)',
      grade: '18% N, 46% P₂O₅ High Solubility',
      dosage: '20–25 kg/acre',
      method: 'Root band placement followed by light drip watering',
      whySelected: 'DAP supplies high-concentration water-soluble phosphate critical for flower energy transfer (ATP) and bud retention.',
      speed: '4–6 Days',
      confidence: '94%'
    },
    organicSolution: {
      name: 'Steamed Bone Meal + Phosphate Solubilizing Bacteria (PSB)',
      dosage: '150 kg Bone Meal + 2 kg PSB bio-culture',
      method: 'Broadcasting into moist soil followed by mulching',
      whySelected: 'PSB bacteria secrete organic acids that solubilize native fixed phosphates into absorbable plant nutrients.',
      speed: '10–14 Days',
      confidence: '90%'
    },
    precautions: [
      '🧪 Check soil pH: Maintain pH between 6.2–6.8 for maximum phosphorus availability.',
      '⚠️ Do not mix soluble phosphorus with concentrated calcium in the same fertigation tank to avoid precipitate clogging.'
    ],
    actionSteps: [
      '1. Apply DAP or Bone Meal + PSB at root zone depth (5–8 cm).',
      '2. Lightly irrigate to dissolve nutrients into the root zone.',
      '3. Verify flower bud set in 5 days.'
    ],
    verification: {
      metric: 'Phosphorus (P)',
      baseline: '18 mg/kg',
      target: '48 mg/kg',
      window: '5–7 days'
    }
  },
  {
    id: 'k_low',
    type: 'warning',
    severity: 'Moderate',
    icon: Leaf,
    category: 'NPK Nutrition',
    title: 'Potassium Level Suboptimal',
    shortDesc: 'Potassium is 32 mg/kg (target: 60–75). High risk of blossom drop, poor fruit sizing, and leaf edge scorching.',
    time: '09:15 AM',
    currentVal: '32 mg/kg',
    targetVal: '60–75 mg/kg',
    growthStage: 'Fruit Expansion & Setting',
    whyHappened: [
      'Tomatoes are heavy potassium consumers during fruit setting and ripening.',
      'Rapid transpiration under warm temperatures increases plant potassium consumption.'
    ],
    fastSolution: {
      name: 'SOP (Sulphate of Potash 0-0-50 + 17% S)',
      grade: '50% K₂O + 17% Sulfur (Chloride Free)',
      dosage: '15–20 kg/acre fertigation',
      method: 'Drip fertigation at root zone',
      whySelected: 'SOP provides chloride-free potassium essential for fruit sugar accumulation, firm skin, and preventing blossom end drop.',
      speed: '3–5 Days',
      confidence: '95%'
    },
    organicSolution: {
      name: 'Hardwood Ash (Wood Ash) + Fermented Banana Peel Jivamrutha',
      dosage: '50 kg Wood Ash/acre + 15 L fermented banana tea',
      method: 'Dust around plant drip line and irrigate',
      whySelected: 'Supplies natural potash, calcium, and trace minerals to strengthen fruit cell walls naturally.',
      speed: '7–10 Days',
      confidence: '91%'
    },
    precautions: [
      'Avoid high-chloride MOP if soil salinity is elevated; use SOP instead.',
      'Apply during morning hours for optimal stomatal intake.'
    ],
    actionSteps: [
      '1. Deliver SOP or Wood Ash extract around drip lines.',
      '2. Maintain steady irrigation to facilitate potassium ion mobility.',
      '3. Recheck fruit firmness and sensor K levels in 5 days.'
    ],
    verification: {
      metric: 'Potassium (K)',
      baseline: '32 mg/kg',
      target: '65 mg/kg',
      window: '4–6 days'
    }
  },
  {
    id: 'moisture_low',
    type: 'critical',
    severity: 'Critical',
    icon: Droplets,
    category: 'Irrigation & Soil',
    title: 'Low Soil Moisture Deficit',
    shortDesc: 'Soil moisture dropped to 22% (optimal: 35%–55%). Root dehydration alert; imminent vegetative stress.',
    time: '12:34 PM',
    currentVal: '22%',
    targetVal: '35% – 55%',
    growthStage: 'Flowering & Fruiting',
    whyHappened: [
      'High ambient evaporation rate and delayed scheduled irrigation cycle.',
      'Active transpiration from lush tomato foliage.'
    ],
    fastSolution: {
      name: 'Precision Drip Irrigation Cycle (35–45 min)',
      grade: 'Root-Targeted Hydration',
      dosage: '4–6 Liters per plant',
      method: 'Drip emitters directly at root zone (avoid wetting leaves)',
      whySelected: 'Quickly elevates root zone moisture to optimal 45% without creating humid canopy microclimates for fungal spores.',
      speed: '2–4 Hours',
      confidence: '98%'
    },
    organicSolution: {
      name: 'Paddy Straw / Coconut Coir Mulching (3-inch layer)',
      dosage: '2 tons dry straw/acre',
      method: 'Spread around beds leaving 5 cm collar space around stems',
      whySelected: 'Reduces soil evaporation by 60%, keeps root zone cool, and builds organic matter over time.',
      speed: 'Long-term moisture retention',
      confidence: '95%'
    },
    precautions: [
      '🌧️ Note: Rain forecast shows 82% chance in next 6-12h. Irrigate moderately (25 min) rather than heavy soaking.',
      'Do not use overhead sprinklers during flowering to protect pollen.'
    ],
    actionSteps: [
      '1. Start drip irrigation for 30 minutes.',
      '2. Check moisture telemetry reaching 40%–48%.',
      '3. Apply organic straw mulch to conserve moisture.'
    ],
    verification: {
      metric: 'Soil Moisture',
      baseline: '22%',
      target: '42%',
      window: '2 hours'
    }
  },
  {
    id: 'disease_risk',
    type: 'info',
    severity: 'Warning',
    icon: ShieldAlert,
    category: 'Crop Pathology',
    title: 'High Fungal Disease Risk',
    shortDesc: 'Relative humidity is 84% + rain forecast. High risk for Early Blight and Late Blight spore development.',
    time: '09:30 AM',
    currentVal: '84% Humidity',
    targetVal: '< 70% RH',
    growthStage: 'Flowering Stage',
    whyHappened: [
      'Prolonged relative humidity (>80%) creates favorable conditions for fungal zoospores.',
      'Incoming rain will cause water splashing that spreads fungal pathogens from soil onto lower foliage.'
    ],
    fastSolution: {
      name: 'Protective Copper Oxychloride (50% WP) or Mancozeb (75% WP)',
      grade: 'Broad-Spectrum Contact Fungicide',
      dosage: '2.5 g / Liter water foliar spray',
      method: 'Fine mist spray covering upper and under leaf surfaces before rain',
      whySelected: 'Forms a protective chemical barrier that prevents fungal spore penetration into tomato leaf tissue.',
      speed: '24 Hours Protective Coat',
      confidence: '95%'
    },
    organicSolution: {
      name: 'Trichoderma harzianum + Neem Oil (10,000 ppm) Organic Spray',
      dosage: '5 g Trichoderma/L + 5 ml Neem Oil/L emulsified with liquid soap',
      method: 'Foliar and root drench spray',
      whySelected: 'Beneficial bio-fungus Trichoderma parasitizes pathogen mycelium, while Neem oil strengthens plant cuticles naturally.',
      speed: '48–72 Hours Bio-Colonization',
      confidence: '90%'
    },
    precautions: [
      'Spray during clear weather window (morning or evening) before rainfall begins.',
      'Prune lower 15 cm leaves to improve airflow and prevent soil splash.'
    ],
    actionSteps: [
      '1. Prune yellowed bottom leaves.',
      '2. Apply preventive Copper Oxychloride or Trichoderma spray.',
      '3. Re-scan leaves using AgriSense AI Scanner in 3 days.'
    ],
    verification: {
      metric: 'Leaf Pathology Scan',
      baseline: 'High Fungal Risk',
      target: 'Healthy / Protected',
      window: '3 days'
    }
  },
  {
    id: 'water_salinity',
    type: 'info',
    severity: 'Low',
    icon: Beaker,
    category: 'Water Quality',
    title: 'Water TDS Moderately Elevated',
    shortDesc: 'Irrigation water TDS is 450 ppm. Moderate salinity index; may impact delicate root nutrient uptake.',
    time: '08:45 AM',
    currentVal: '450 ppm',
    targetVal: '< 350 ppm',
    growthStage: 'All Stages',
    whyHappened: [
      'Seasonal decline in groundwater recharge leading to increased dissolved mineral salts.'
    ],
    fastSolution: {
      name: 'Agricultural Gypsum (Calcium Sulfate) Treatment',
      grade: 'Soil & Water Salinity Buffer',
      dosage: '50–75 kg/acre',
      method: 'Broadcast or mix with irrigation sump',
      whySelected: 'Calcium ions replace sodium on soil exchange complexes, improving soil permeability and mitigating osmotic stress.',
      speed: '3–7 Days',
      confidence: '92%'
    },
    organicSolution: {
      name: 'Humic Acid (12% Liquid Formulation) + Heavy Mulching',
      dosage: '2 Liters Humic Acid/acre via drip',
      method: 'Drip fertigation with irrigation cycle',
      whySelected: 'Humic substances chelate excess salts and protect tomato root tip membranes from ionic toxicity.',
      speed: '5–10 Days',
      confidence: '89%'
    },
    precautions: [
      'Blend borewell water with rainwater runoff when available to lower overall TDS.'
    ],
    actionSteps: [
      '1. Apply humic acid or gypsum to buffer water salinity.',
      '2. Flush drip lines periodically to prevent emitter mineral clogging.'
    ],
    verification: {
      metric: 'Root Zone Salinity',
      baseline: '450 ppm',
      target: '< 350 ppm',
      window: '7 days'
    }
  }
]

export default function AlertsScreen({ onBack, onNavigateToChat, onNavigateToRecommend }) {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [treatmentStatus, setTreatmentStatus] = useState({}) // { [alertId]: 'applied' | 'verified' | 'resolved' }
  const [isVerifying, setIsVerifying] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  
  // Clean click-to-reveal state in alert detail
  const [hasRevealedPlan, setHasRevealedPlan] = useState(false)
  const [activeSolutionTab, setActiveSolutionTab] = useState('chemical') // 'chemical' | 'organic'
  const [expandedSection, setExpandedSection] = useState(null) // 'why' | 'precautions' | 'protocol' | 'verification'

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleApplyTreatment = (alertId) => {
    setTreatmentStatus(prev => ({ ...prev, [alertId]: 'applied' }))
    showToast('🚀 Treatment scheduled & marked as In Progress!')
  }

  const handleVerifySensors = (alertId) => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setTreatmentStatus(prev => ({ ...prev, [alertId]: 'verified' }))
      showToast('✅ IoT Sensors Verified: Nutrient levels moving back to optimal range!')
    }, 1400)
  }

  const handleMarkResolved = (alertId) => {
    setTreatmentStatus(prev => ({ ...prev, [alertId]: 'resolved' }))
    showToast('✨ Alert marked as Resolved!')
    setTimeout(() => {
      setSelectedAlert(null)
      setHasRevealedPlan(false)
    }, 1200)
  }

  const toggleAccordion = (key) => {
    setExpandedSection(prev => (prev === key ? null : key))
  }

  const handleAskAdvisor = (alert) => {
    if (onNavigateToChat) {
      onNavigateToChat(`I received an alert for ${alert.title}. How should I apply the recommended fertilizer and organic treatment?`)
    }
  }

  // =========================================================================
  // VIEW 1: Detailed Actionable Recommendation View (When an alert is clicked)
  // =========================================================================
  if (selectedAlert) {
    const alert = selectedAlert
    const status = treatmentStatus[alert.id]
    const Icon = alert.icon

    return (
      <div className="recommendation-detail-page">
        {/* Header */}
        <div className="screen-header" style={{ position: 'sticky', top: 0, zIndex: 30, background: '#fff' }}>
          <button
            className="back-btn"
            onClick={() => { setSelectedAlert(null); setHasRevealedPlan(false); setExpandedSection(null); }}
            aria-label="Back to Alert List"
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--gray-900)' }}>
              Actionable Alert Advisor
            </h1>
            <span style={{ fontSize: 11, color: 'var(--green-600)', fontWeight: 600 }}>
              AgriSense Recommendation Engine
            </span>
          </div>
          <div style={{ width: 32 }} />
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="alert-action-toast animate-in">
            {toastMessage}
          </div>
        )}

        <div className="recommendation-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Problem Header Banner */}
          <div className={`recommend-problem-banner ${alert.type} animate-in`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div className={`alert-indicator ${alert.type}`}>
                <Icon />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="rec-badge-category">{alert.category}</span>
                  <span className={`rec-badge-severity ${alert.type}`}>{alert.severity} Priority</span>
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>
                  {alert.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--gray-700)', lineHeight: 1.45, margin: 0 }}>
              {alert.shortDesc}
            </p>

            <div className="rec-metrics-row">
              <div className="rec-metric-box">
                <span className="label">Current Sensor Reading</span>
                <span className="val current">{alert.currentVal}</span>
              </div>
              <div className="rec-metric-box">
                <span className="label">Optimal Target Range</span>
                <span className="val target">{alert.targetVal}</span>
              </div>
              <div className="rec-metric-box">
                <span className="label">Crop Phase</span>
                <span className="val stage">🍅 Fruiting Stage</span>
              </div>
            </div>
          </div>

          {/* Model Attribution Badge */}
          <div className="model-tag-bar animate-in" style={{ animationDelay: '0.05s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} color="#16a34a" />
              <span>Candidate ML: <strong>Poshan-fertilizer-recommendation</strong> (94.7% Acc)</span>
            </div>
            <span className="deficiency-pill">{alert.severity} Deficit</span>
          </div>

          {/* PROMINENT RECOMMENDATION TRIGGER BUTTON */}
          <div className="generate-action-box animate-in" style={{ animationDelay: '0.1s' }}>
            <button
              className="btn-generate-rec"
              onClick={() => setHasRevealedPlan(true)}
            >
              <Sparkles size={18} />
              <span>{hasRevealedPlan ? 'Remediation Plan Active' : 'Suggest Fertilizer & Organic Solution'}</span>
            </button>
            {!hasRevealedPlan && (
              <p style={{ margin: '8px 0 0', textAlign: 'center', fontSize: 11, color: 'var(--gray-500)' }}>
                ⚡ Tap to generate targeted chemical and organic treatments to cure this alert.
              </p>
            )}
          </div>

          {/* REVEALED RESULTS: DUAL-TRACK SOLUTION (Clean Tab Switcher) */}
          {hasRevealedPlan && (
            <div className="recommendation-results-clean animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              {/* TAB SELECTOR */}
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
                    <span className="speed-pill">Response: {alert.fastSolution.speed}</span>
                  </div>
                  <h4 className="sol-name">{alert.fastSolution.name}</h4>
                  <div className="sol-grade">{alert.fastSolution.grade}</div>
                  
                  <div className="sol-meta-grid">
                    <div>
                      <span className="sol-meta-label">Prescription Dosage:</span>
                      <p className="sol-meta-val">{alert.fastSolution.dosage}</p>
                    </div>
                    <div>
                      <span className="sol-meta-label">Application Method:</span>
                      <p className="sol-meta-val">{alert.fastSolution.method}</p>
                    </div>
                  </div>

                  <div className="sol-why-box">
                    <strong>Why this was selected:</strong> {alert.fastSolution.whySelected}
                  </div>
                </div>
              ) : (
                <div className="solution-card organic animate-in">
                  <div className="solution-badge organic">
                    <span>🌿 NATURAL / LOW-COST ALTERNATIVE</span>
                    <span className="speed-pill">Sustainable Release</span>
                  </div>
                  <h4 className="sol-name">{alert.organicSolution.name}</h4>

                  <div className="sol-meta-grid">
                    <div>
                      <span className="sol-meta-label">Organic Dosage:</span>
                      <p className="sol-meta-val">{alert.organicSolution.dosage}</p>
                    </div>
                    <div>
                      <span className="sol-meta-label">Application Method:</span>
                      <p className="sol-meta-val">{alert.organicSolution.method}</p>
                    </div>
                  </div>

                  <div className="sol-why-box organic">
                    <strong>Soil Health Benefit:</strong> {alert.organicSolution.whySelected}
                  </div>
                </div>
              )}

              {/* CLEAN EXPANDABLE ACCORDIONS */}
              <div className="accordion-group">
                
                {/* Accordion 1: Why this happened */}
                <div className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion('why')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Info size={15} color="var(--green-600)" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                        Why this happened (Root Cause Analysis)
                      </span>
                    </div>
                    {expandedSection === 'why' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedSection === 'why' && (
                    <div className="accordion-content animate-in">
                      <ul className="rec-bullet-list">
                        {alert.whyHappened.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Field & Weather Precautions */}
                {alert.precautions && alert.precautions.length > 0 && (
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
                          {alert.precautions.map((prec, idx) => (
                            <li key={idx}>{prec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Accordion 3: What to do (Protocol Checklist) */}
                <div className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion('protocol')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={15} color="var(--green-600)" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                        What to Do (Step-by-Step Protocol)
                      </span>
                    </div>
                    {expandedSection === 'protocol' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedSection === 'protocol' && (
                    <div className="accordion-content animate-in">
                      <div className="action-checklist">
                        {alert.actionSteps.map((step, idx) => (
                          <div key={idx} className="action-check-item">
                            <div className="check-number">{idx + 1}</div>
                            <p>{step.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion 4: Closed-Loop Sensor Verification */}
                <div className="accordion-item">
                  <button
                    className="accordion-header"
                    onClick={() => toggleAccordion('verification')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={15} color="var(--green-600)" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                        Closed-Loop IoT Verification ({alert.verification.window})
                      </span>
                    </div>
                    {expandedSection === 'verification' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expandedSection === 'verification' && (
                    <div className="accordion-content animate-in">
                      <p style={{ fontSize: 12, color: 'var(--gray-600)', margin: '0 0 8px', lineHeight: 1.4 }}>
                        AgriSense monitors your field sensors to verify that treatment cures the deficiency.
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f0fdf4', padding: '8px 10px', borderRadius: 6, fontSize: 11, color: '#166534', fontWeight: 600 }}>
                        <span>Target: <strong>{alert.verification.target}</strong></span>
                        <span>Re-test: <strong>{alert.verification.window}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons Bar */}
              <div className="rec-action-buttons animate-in" style={{ marginTop: 4 }}>
                <button
                  className={`btn-rec-action apply ${status === 'applied' ? 'in-progress' : ''}`}
                  onClick={() => handleApplyTreatment(alert.id)}
                >
                  <Flame size={16} />
                  {status === 'applied' ? 'Treatment in Progress' : 'Apply / Schedule Treatment'}
                </button>

                <button
                  className="btn-rec-action verify"
                  onClick={() => handleVerifySensors(alert.id)}
                  disabled={isVerifying}
                >
                  <RefreshCw size={16} className={isVerifying ? 'spin' : ''} />
                  {isVerifying ? 'Scanning IoT Sensors...' : 'Verify with IoT Sensors'}
                </button>

                <button
                  className="btn-rec-action advisor"
                  onClick={() => handleAskAdvisor(alert)}
                >
                  <MessageSquare size={16} />
                  Ask AgriSense Chat Advisor
                </button>

                <button
                  className="btn-rec-action resolve"
                  onClick={() => handleMarkResolved(alert.id)}
                >
                  <CheckCircle2 size={16} />
                  Mark Alert as Resolved
                </button>
              </div>

            </div>
          )}

          <div style={{ height: 20 }} />
        </div>
      </div>
    )
  }


  // =========================================================================
  // VIEW 2: Alert List Screen (Default View)
  // =========================================================================
  const highPriorityCount = alertsData.filter(a => a.severity === 'High' || a.severity === 'Critical').length

  return (
    <div>
      <div className="screen-header">
        {onBack && (
          <button
            className="back-btn"
            onClick={onBack}
            aria-label="Back to Home"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: 18, fontWeight: 700 }}>
          Alerts & Recommendations
        </h1>
        {onBack && <div style={{ width: 32 }} />}
      </div>

      <div className="alerts-screen">
        {/* Summary Card */}
        <div className="alert-summary animate-in">
          <AlertTriangle />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              You have {highPriorityCount} high-priority field alerts.
            </p>
            <span style={{ fontSize: 11, color: 'var(--gray-600)' }}>
              Tap any alert to view AI fertilizer solution & organic alternative.
            </span>
          </div>
        </div>

        {/* Live Alert List */}
        <div className="alert-list">
          {alertsData.map((alert, i) => {
            const Icon = alert.icon
            const status = treatmentStatus[alert.id]
            return (
              <div 
                className={`alert-card interactive animate-in ${alert.type}`} 
                key={alert.id}
                style={{ 
                  animationDelay: `${0.05 + i * 0.05}s`, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className={`alert-indicator ${alert.type}`}>
                  <Icon />
                </div>
                <div className="alert-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="alert-category-tag">{alert.category}</span>
                      {status && (
                        <span className={`status-pill-small ${status}`}>
                          {status === 'applied' ? 'Applied' : status === 'verified' ? 'Verified' : 'Resolved'}
                        </span>
                      )}
                    </div>
                    <span className="alert-time">{alert.time}</span>
                  </div>

                  <h4 style={{ margin: '2px 0 4px', fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>
                    {alert.title}
                  </h4>
                  
                  <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: '1.4' }}>
                    {alert.shortDesc}
                  </p>

                  <div className="alert-tap-hint">
                    <span>💡 Tap for Fertilizer & Organic Recommendation</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

