import React, { useState } from 'react'
import {
  ArrowLeft, Share2, ChevronRight, CheckCircle2, Droplets,
  Thermometer, CloudRain
} from 'lucide-react'

export default function RecommendScreen({ onBack, onNavigateToChat }) {
  const [selectedNutrient, setSelectedNutrient] = useState('K') // 'N' | 'P' | 'K' (default to K as requested)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isManualEntry, setIsManualEntry] = useState(false)

  // Live telemetry readings
  const [telemetry, setTelemetry] = useState({
    n: 32,
    p: 24,
    k: 36,
    moisture: 28,
    temp: 31,
    rain: 82
  })

  // Comprehensive Deficiency & Prescription Knowledge Base
  const deficiencyData = {
    K: {
      key: 'K',
      title: 'Potassium Deficiency',
      subtitle: 'Fertilizer & Natural Solutions',
      severity: 'Suboptimal',
      badgeClass: 'danger',
      iconBg: '#f59e0b',
      summary: (
        <>
          Your soil potassium level is <strong>suboptimal ({telemetry.k} mg/kg)</strong> for the tomato fruiting stage,
          which restricts fruit sizing, brix sugar accumulation, and causes marginal leaf scorching.
        </>
      ),
      fertilizer: {
        name: 'Potassium Nitrate (13:0:45)',
        image: '/assets/potassium_nitrate_bag.svg',
        desc: 'A high-grade water-soluble potassium fertilizer for rapid fruit expansion & firmness.',
        rateMain: '4.5 – 5.0 g per Litre of irrigation water',
        rateSub: 'Apply via drip fertigation early morning (06:00 – 08:30 AM)',
        reasons: [
          'High potassium content (45% K₂O)',
          'Boosts tomato fruit size, brix sugar, and skin thickness',
          'Free of chlorides (prevents salinity stress & scorch)',
          'Readily absorbed via micro-irrigation fertigation'
        ]
      },
      organic: {
        name: 'Wood Ash Extract + Fermented Banana Peel + FYM',
        image: '/assets/banana_woodash_extract.svg',
        points: [
          'Rich in bio-available organic potassium',
          'Enhances fruit ripening and sweetness naturally',
          'Drench 200 ml diluted extract per plant weekly'
        ],
        otherOptions: 'Vermicompost, Kelp / Seaweed extract, Neem cake'
      },
      tips: [
        'Maintain soil moisture (45–55%) to facilitate potassium ion mobility.',
        'Postpone foliar sprays when rain forecast is high (82%) to prevent wash-off.',
        'Combine with calcium nitrate to prevent Blossom End Rot in expanding fruits.',
        'Recheck soil potassium level via IoT sensor after 4–5 days of application.',
        'Monitor fruit firmness and leaf margins for greening and recovery.'
      ]
    },
    N: {
      key: 'N',
      title: 'Nitrogen Deficiency',
      subtitle: 'Fertilizer & Natural Solutions',
      severity: 'Moderate',
      badgeClass: 'warning',
      iconBg: '#f59e0b',
      summary: (
        <>
          Your soil nitrogen level is <strong>low ({telemetry.n} mg/kg)</strong>, which can cause
          yellowing leaves, slow growth, and reduced fruit yield in tomato.
        </>
      ),
      fertilizer: {
        name: 'Urea (46% N)',
        image: '/assets/urea_fertilizer_bag.svg',
        desc: 'A fast-acting nitrogen fertilizer suitable for tomato crops.',
        rateMain: '50 – 60 kg per acre',
        rateSub: 'Apply in split doses (2–3 times during the season)',
        reasons: [
          'High nitrogen content (46% N)',
          'Quickly accessible to plants',
          'Supports healthy leaf and stem growth',
          'Widely available and cost-effective'
        ]
      },
      organic: {
        name: 'Compost / Farmyard Manure (FYM)',
        image: '/assets/compost_manure.svg',
        points: [
          'Improves soil organic matter',
          'Slow and steady nutrient release',
          'Use 2–5 tons per acre before planting'
        ],
        otherOptions: 'Vermicompost, Green manure (e.g., dhaincha), Neem cake'
      },
      tips: [
        'Maintain soil moisture after application.',
        'Avoid over-application (can cause excessive vegetative growth).',
        'Combine with phosphorus and potassium as per crop stage.',
        'Recheck soil NPK levels after 3–4 weeks.',
        'Monitor leaf color and growth for improvement.'
      ]
    },
    P: {
      key: 'P',
      title: 'Phosphorus Deficiency',
      subtitle: 'Fertilizer & Natural Solutions',
      severity: 'Moderate',
      badgeClass: 'warning',
      iconBg: '#8b5cf6',
      summary: (
        <>
          Your soil phosphorus level is <strong>low ({telemetry.p} mg/kg)</strong>, which impairs
          root branching, reduces flower bud set, and causes purplish tint on lower leaf veins.
        </>
      ),
      fertilizer: {
        name: 'Single Super Phosphate (SSP 16% P₂O₅)',
        image: '/assets/ssp_phosphorus_bag.svg',
        desc: 'Essential phosphorus & sulphur fertilizer for root branching and prolific bloom.',
        rateMain: '75 – 100 kg per acre',
        rateSub: 'Apply in basal placement near root zone',
        reasons: [
          'High available phosphorus (16% P₂O₅)',
          'Supplies 11% Sulphur and 19% Calcium',
          'Stimulates profuse flower bud formation',
          'Improves plant drought and cold resilience'
        ]
      },
      organic: {
        name: 'Phosphate Rich Organic Manure (PROM) / Bone Meal',
        image: '/assets/prom_organic_manure.svg',
        points: [
          'High organic phosphorus bioavailability',
          'Safe for beneficial mycorrhizal soil fungi',
          'Apply 100–150 kg per acre in planting beds'
        ],
        otherOptions: 'PSB (Phosphorus Solubilizing Biofertilizer), VAM, Rock Phosphate'
      },
      tips: [
        'Place phosphorus deep in root zone as phosphorus has low soil mobility.',
        'Ensure soil pH stays between 6.0–6.8 for optimal phosphorus absorption.',
        'Pair with organic mycorrhizae to multiply root uptake efficiency.',
        'Recheck soil P levels in 3 weeks.',
        'Monitor new shoot vigor and flower cluster development.'
      ]
    }
  }

  const current = deficiencyData[selectedNutrient] || deficiencyData.K

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `AgriSense - ${current.title}`,
        text: `AgriSense Recommendation for Tomato:\n• ${current.title} (${current.severity})\n• Recommended: ${current.fertilizer.name}\n• Organic: ${current.organic.name}`
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(
        `AgriSense Recommendation - ${current.title}\n• Recommended: ${current.fertilizer.name}\n• Organic: ${current.organic.name}`
      )
      alert('Prescription copied to clipboard!')
    }
  }

  return (
    <div className="recommend-view-wrapper">
      {/* 1. TOP HEADER */}
      <div className="recommend-top-bar">
        <button className="top-icon-btn" onClick={onBack} aria-label="Go Back">
          <ArrowLeft size={22} color="#111827" />
        </button>
        <h1 className="top-title">Recommendation</h1>
        <button className="top-icon-btn" onClick={handleShare} aria-label="Share">
          <Share2 size={20} color="#111827" />
        </button>
      </div>

      {/* SCROLLABLE MAIN CONTENT */}
      <div className="recommend-content-body">
        
        {/* LIVE TELEMETRY & NPK SELECTOR CARD */}
        <div className="live-telemetry-panel">
          <div className="telemetry-header-row">
            <h3 className="telemetry-panel-title">Live Field &amp; Nutrient Readings</h3>
            <div className="source-toggle-group">
              <button
                className={`src-toggle-btn ${!isManualEntry ? 'active' : ''}`}
                onClick={() => setIsManualEntry(false)}
              >
                📡 IoT Sensors
              </button>
              <button
                className={`src-toggle-btn ${isManualEntry ? 'active' : ''}`}
                onClick={() => setIsManualEntry(true)}
              >
                ✍️ Soil Lab Test
              </button>
            </div>
          </div>

          {/* Interactive 3-Card NPK Row */}
          <div className="npk-cards-grid">
            
            {/* Nitrogen Card */}
            <div
              className={`npk-card-item n ${selectedNutrient === 'N' ? 'selected' : ''}`}
              onClick={() => setSelectedNutrient('N')}
            >
              <div className="npk-avatar n">N</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={telemetry.n}
                  onChange={(e) => setTelemetry({ ...telemetry, n: Number(e.target.value) })}
                  className="npk-input-mini"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="npk-reading">
                  <strong>{telemetry.n}</strong> <span className="unit">mg/kg</span>
                </div>
              )}
              <div className="npk-pill-tag warning">Low N</div>
            </div>

            {/* Phosphorus Card */}
            <div
              className={`npk-card-item p ${selectedNutrient === 'P' ? 'selected' : ''}`}
              onClick={() => setSelectedNutrient('P')}
            >
              <div className="npk-avatar p">P</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={telemetry.p}
                  onChange={(e) => setTelemetry({ ...telemetry, p: Number(e.target.value) })}
                  className="npk-input-mini"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="npk-reading">
                  <strong>{telemetry.p}</strong> <span className="unit">mg/kg</span>
                </div>
              )}
              <div className="npk-pill-tag warning">Low P</div>
            </div>

            {/* Potassium Card */}
            <div
              className={`npk-card-item k ${selectedNutrient === 'K' ? 'selected' : ''}`}
              onClick={() => setSelectedNutrient('K')}
            >
              <div className="npk-avatar k">K</div>
              {isManualEntry ? (
                <input
                  type="number"
                  value={telemetry.k}
                  onChange={(e) => setTelemetry({ ...telemetry, k: Number(e.target.value) })}
                  className="npk-input-mini"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="npk-reading">
                  <strong>{telemetry.k}</strong> <span className="unit">mg/kg</span>
                </div>
              )}
              <div className="npk-pill-tag danger">Suboptimal K</div>
            </div>

          </div>

          {/* Environmental Telemetry Bottom Chips */}
          <div className="telemetry-env-chips-row">
            <span className="telemetry-chip">
              <Droplets size={13} color="#3b82f6" /> Moisture: <strong>{telemetry.moisture}%</strong>
            </span>
            <span className="telemetry-chip">
              <Thermometer size={13} color="#ea580c" /> Temp: <strong>{telemetry.temp}°C</strong>
            </span>
            <span className="telemetry-chip">
              <CloudRain size={13} color="#0284c7" /> Rain (6h): <strong>{telemetry.rain}%</strong>
            </span>
          </div>
        </div>

        {/* 2. DYNAMIC DEFICIENCY HERO BANNER (Updates based on selected nutrient) */}
        <div className="deficiency-banner-card animate-fade">
          <div className="deficiency-icon-box" style={{ background: current.iconBg }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 20h10" />
              <path d="M10 20c0-5 2-7 2-12" />
              <path d="M12 8c2-3 6-4 8-4-1 4-3 7-8 7" />
              <path d="M12 11c-2-3-6-4-8-4 1 4 3 7 8 7" />
            </svg>
          </div>
          <div className="deficiency-meta">
            <h2 className="deficiency-title">{current.title}</h2>
            <p className="deficiency-sub">{current.subtitle}</p>
          </div>
          <div className={`deficiency-status-badge ${current.badgeClass}`}>
            <span className="bar-icon">
              <span className="b1"></span>
              <span className="b2"></span>
              <span className="b3"></span>
            </span>
            <span>{current.severity}</span>
          </div>
        </div>

        {/* 3. HORIZONTAL SEGMENTED PILLS */}
        <div className="recommend-tabs-row">
          {['Overview', 'Fertilizer', 'Natural Methods', 'Steps'].map(tab => (
            <button
              key={tab}
              className={`rec-tab-pill ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4. SECTION 1: PROBLEM SUMMARY */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row">
            <div className="rec-heading-icon red-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="rec-section-title">1. Problem Summary</h3>
          </div>
          <p className="rec-summary-paragraph">
            {current.summary}
          </p>
        </div>

        {/* 5. SECTION 2: RECOMMENDED FERTILIZER */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row justify-between">
            <div className="flex-align-center">
              <div className="rec-heading-icon green-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <h3 className="rec-section-title">2. Recommended Fertilizer</h3>
            </div>
            <span className="primary-solution-tag">Primary Solution</span>
          </div>

          {/* Fertilizer Card */}
          <div className="rec-card-box animate-fade" key={`chem-${current.key}`}>
            <div className="card-top-row">
              <div className="card-img-container">
                <img
                  key={current.fertilizer.image}
                  src={current.fertilizer.image}
                  alt={current.fertilizer.name}
                  className="fertilizer-bag-image animate-fade"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/assets/urea_fertilizer_bag.svg'
                  }}
                />
              </div>
              <div className="card-top-info">
                <h4 className="product-title">{current.fertilizer.name}</h4>
                <p className="product-desc">{current.fertilizer.desc}</p>
              </div>
            </div>

            {/* Inner Box 1: Application Rate */}
            <div className="inner-green-box">
              <h5 className="inner-box-green-title">Application Rate</h5>
              <div className="rate-row main">
                <span>• {current.fertilizer.rateMain}</span>
                <ChevronRight size={16} color="#15803d" />
              </div>
              {current.fertilizer.rateSub && (
                <div className="rate-row sub">
                  <span>• {current.fertilizer.rateSub}</span>
                </div>
              )}
            </div>

            {/* Inner Box 2: Why this fertilizer? */}
            <div className="inner-amber-box">
              <h5 className="inner-box-amber-title">Why this fertilizer?</h5>
              <ul className="why-check-list">
                {current.fertilizer.reasons.map((reason, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} color="#16a34a" className="check-icon" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. SECTION 3: NATURAL / ORGANIC ALTERNATIVES */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row justify-between">
            <div className="flex-align-center">
              <div className="rec-heading-icon darkgreen-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <h3 className="rec-section-title">3. Natural / Organic Alternatives</h3>
            </div>
            <span className="eco-friendly-tag">Eco-Friendly Option</span>
          </div>

          {/* Organic Card */}
          <div className="rec-card-box animate-fade" key={`org-${current.key}`}>
            <div className="card-top-row organic">
              <div className="compost-img-container">
                <img
                  key={current.organic.image}
                  src={current.organic.image}
                  alt={current.organic.name}
                  className="compost-image animate-fade"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = '/assets/compost_manure.svg'
                  }}
                />
              </div>
              <div className="card-top-info">
                <h4 className="product-title organic">{current.organic.name}</h4>
                <ul className="organic-bullet-list">
                  {current.organic.points.map((pt, idx) => (
                    <li key={idx}>• {pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="other-options-text">
              <strong>Other options:</strong> {current.organic.otherOptions}
            </div>
          </div>
        </div>

        {/* 7. SECTION 4: ADDITIONAL TIPS */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row">
            <div className="rec-heading-icon blue-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <h3 className="rec-section-title">4. Additional Tips</h3>
          </div>

          {/* Blue Tips Box */}
          <div className="additional-tips-box">
            <ol className="tips-ordered-list">
              {current.tips.map((tip, idx) => (
                <li key={idx}>
                  <span className="tip-num">{idx + 1}.</span>
                  <span className="tip-text">{tip}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div style={{ height: 28 }}></div>
      </div>
    </div>
  )
}
