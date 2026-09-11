import React, { useState } from 'react'
import {
  ArrowLeft, Share2, ChevronRight, CheckCircle2
} from 'lucide-react'

export default function RecommendScreen({ onBack, onNavigateToChat }) {
  const [activeTab, setActiveTab] = useState('Overview')

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AgriSense Recommendation - Nitrogen Deficiency',
        text: 'AgriSense Agronomic Recommendation for Tomato:\n• Nitrogen Deficiency (Moderate)\n• Recommended: Urea (46% N)\n• Organic: Compost / Farmyard Manure (FYM)'
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(
        'AgriSense Recommendation - Nitrogen Deficiency\n• Recommended: Urea (46% N) at 50-60 kg/acre\n• Natural Method: Compost / Farmyard Manure (FYM)'
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
        
        {/* 2. TOP HERO / DEFICIENCY BANNER */}
        <div className="deficiency-banner-card">
          <div className="deficiency-icon-box">
            {/* Custom Sprout SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 20h10" />
              <path d="M10 20c0-5 2-7 2-12" />
              <path d="M12 8c2-3 6-4 8-4-1 4-3 7-8 7" />
              <path d="M12 11c-2-3-6-4-8-4 1 4 3 7 8 7" />
            </svg>
          </div>
          <div className="deficiency-meta">
            <h2 className="deficiency-title">Nitrogen Deficiency</h2>
            <p className="deficiency-sub">Fertilizer &amp; Natural Solutions</p>
          </div>
          <div className="deficiency-status-badge">
            <span className="bar-icon">
              <span className="b1"></span>
              <span className="b2"></span>
              <span className="b3"></span>
            </span>
            <span>Moderate</span>
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
              {/* Target / Bullseye icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="rec-section-title">1. Problem Summary</h3>
          </div>
          <p className="rec-summary-paragraph">
            Your soil nitrogen level is <strong>low (32 ppm)</strong>, which can cause yellowing leaves, slow growth, and reduced fruit yield in tomato.
          </p>
        </div>

        {/* 5. SECTION 2: RECOMMENDED FERTILIZER */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row justify-between">
            <div className="flex-align-center">
              <div className="rec-heading-icon green-circle">
                {/* Lightbulb Icon */}
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
          <div className="rec-card-box">
            {/* Top row with image and text */}
            <div className="card-top-row">
              <div className="card-img-container">
                <img
                  src="/assets/urea_fertilizer_bag.svg"
                  alt="Urea (46% N)"
                  className="fertilizer-bag-image"
                />
              </div>
              <div className="card-top-info">
                <h4 className="product-title">Urea (46% N)</h4>
                <p className="product-desc">A fast-acting nitrogen fertilizer suitable for tomato crops.</p>
              </div>
            </div>

            {/* Inner Box 1: Application Rate */}
            <div className="inner-green-box">
              <h5 className="inner-box-green-title">Application Rate</h5>
              <div className="rate-row main">
                <span>• 50 – 60 kg per acre</span>
                <ChevronRight size={16} color="#15803d" />
              </div>
              <div className="rate-row sub">
                <span>• Apply in split doses (2–3 times during the season)</span>
              </div>
            </div>

            {/* Inner Box 2: Why this fertilizer? */}
            <div className="inner-amber-box">
              <h5 className="inner-box-amber-title">Why this fertilizer?</h5>
              <ul className="why-check-list">
                <li>
                  <CheckCircle2 size={15} color="#16a34a" className="check-icon" />
                  <span>High nitrogen content (46% N)</span>
                </li>
                <li>
                  <CheckCircle2 size={15} color="#16a34a" className="check-icon" />
                  <span>Quickly accessible to plants</span>
                </li>
                <li>
                  <CheckCircle2 size={15} color="#16a34a" className="check-icon" />
                  <span>Supports healthy leaf and stem growth</span>
                </li>
                <li>
                  <CheckCircle2 size={15} color="#16a34a" className="check-icon" />
                  <span>Widely available and cost-effective</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. SECTION 3: NATURAL / ORGANIC ALTERNATIVES */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row justify-between">
            <div className="flex-align-center">
              <div className="rec-heading-icon darkgreen-circle">
                {/* Leaf Icon */}
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
          <div className="rec-card-box">
            <div className="card-top-row organic">
              <div className="compost-img-container">
                <img
                  src="/assets/compost_manure.svg"
                  alt="Compost / Farmyard Manure"
                  className="compost-image"
                />
              </div>
              <div className="card-top-info">
                <h4 className="product-title organic">Compost / Farmyard Manure (FYM)</h4>
                <ul className="organic-bullet-list">
                  <li>• Improves soil organic matter</li>
                  <li>• Slow and steady nutrient release</li>
                  <li>• Use 2–5 tons per acre before planting</li>
                </ul>
              </div>
            </div>

            <div className="other-options-text">
              <strong>Other options:</strong> Vermicompost, Green manure (e.g., dhaincha), Neem cake
            </div>
          </div>
        </div>

        {/* 7. SECTION 4: ADDITIONAL TIPS */}
        <div className="rec-section-item">
          <div className="rec-section-heading-row">
            <div className="rec-heading-icon blue-circle">
              {/* Book Icon */}
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
              <li>
                <span className="tip-num">1.</span>
                <span className="tip-text">Maintain soil moisture after application.</span>
              </li>
              <li>
                <span className="tip-num">2.</span>
                <span className="tip-text">Avoid over-application (can cause excessive vegetative growth).</span>
              </li>
              <li>
                <span className="tip-num">3.</span>
                <span className="tip-text">Combine with phosphorus and potassium as per crop stage.</span>
              </li>
              <li>
                <span className="tip-num">4.</span>
                <span className="tip-text">Recheck soil NPK levels after 3–4 weeks.</span>
              </li>
              <li>
                <span className="tip-num">5.</span>
                <span className="tip-text">Monitor leaf color and growth for improvement.</span>
              </li>
            </ol>
          </div>
        </div>

        <div style={{ height: 24 }}></div>
      </div>
    </div>
  )
}
