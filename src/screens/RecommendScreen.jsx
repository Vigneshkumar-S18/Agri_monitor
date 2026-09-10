import React from 'react'
import { Lightbulb, Droplets, Leaf, Beaker, Flower2 } from 'lucide-react'

const fertilizers = [
  {
    name: 'Urea',
    detail: '(46-0-0)',
    amount: '50 kg/acre',
    iconClass: 'urea',
    icon: Droplets,
  },
  {
    name: 'DAP',
    detail: '(18-46-0)',
    amount: '25 kg/acre',
    iconClass: 'dap',
    icon: Leaf,
  },
  {
    name: 'MOP',
    detail: '(0-0-60)',
    amount: '15 kg/acre',
    iconClass: 'mop',
    icon: Beaker,
  },
  {
    name: 'NOP',
    detail: '(13-0-46)',
    amount: '20 kg/acre',
    iconClass: 'nop',
    icon: Flower2,
  },
]

export default function RecommendScreen() {
  return (
    <div>
      <div className="screen-header">
        <h1 style={{ flex: 1, textAlign: 'center' }}>Fertilizer Recommendation</h1>
      </div>

      <div className="recommend-screen">
        {/* Current Field Condition */}
        <div className="soil-condition animate-in">
          <h4>Current Field Condition</h4>
          <div className="npk-display">
            <div className="npk-pill n">
              <div className="npk-label">N</div>
              <div className="npk-val">56</div>
              <div className="npk-status sensor-status moderate">Low</div>
            </div>
            <div className="npk-pill p">
              <div className="npk-label">P</div>
              <div className="npk-val">32</div>
              <div className="npk-status sensor-status moderate">Low</div>
            </div>
            <div className="npk-pill k">
              <div className="npk-label">K</div>
              <div className="npk-val">41</div>
              <div className="npk-status sensor-status moderate">Moderate</div>
            </div>
          </div>
        </div>

        {/* Recommended Fertilizer */}
        <div className="recommend-section animate-in" style={{ animationDelay: '0.1s' }}>
          <h4>Recommended Fertilizer (for Tomato)</h4>
          {fertilizers.map((fert, i) => {
            const Icon = fert.icon
            return (
              <div className="fertilizer-card" key={i}>
                <div className={`fert-icon ${fert.iconClass}`}>
                  <Icon />
                </div>
                <div className="fert-info">
                  <h5>{fert.name}</h5>
                  <p>{fert.detail}</p>
                </div>
                <span className="fert-amount">{fert.amount}</span>
              </div>
            )
          })}
        </div>

        {/* Application Tips */}
        <div className="tips-card animate-in" style={{ animationDelay: '0.2s' }}>
          <h4>
            <Lightbulb />
            Application Tips
          </h4>
          <ul>
            <li>Apply fertilizer during morning or evening</li>
            <li>Water the field after application</li>
            <li>Combine with organic manure if possible</li>
            <li>Recheck soil NPK after 3 weeks</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
