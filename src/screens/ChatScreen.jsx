import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Droplets, CloudRain, Thermometer, ShieldAlert, RotateCcw, Loader2 } from 'lucide-react'
import { sendChatMessage } from '../services/chatService'

const SUGGESTED_QUESTIONS = [
  "Should I water my tomato field now?",
  "Why is my crop at high disease risk?",
  "What fertilizer should I apply during flowering?",
  "How do I prevent Early Blight from spreading?"
]

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hello! I am your **AgriSense Agronomic Assistant**.\n\nI monitor your live field telemetry (soil moisture, temperature), weather forecasts, and disease scans to give you actionable farming guidance.\n\nHow can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      telemetry: null
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await sendChatMessage(query)
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        telemetry: res.telemetry_used,
        intent: res.intent,
        sourcesUsed: res.sources_used,
        routingReason: res.routing_reason,
        citedTopics: res.cited_topics
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "⚠️ Sorry, I could not reach the backend server. Please make sure the AgriSense API is running.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', background: '#f8fafc' }}>
      {/* Header */}
      <div className="screen-header" style={{ borderBottom: '1px solid #e2e8f0', background: '#fff', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <Bot size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: '700', color: '#0f172a' }}>AgriSense Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#16a34a', fontWeight: '500' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }}></span>
              Query-Aware Agronomic Reasoning
            </div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Pill Bar */}
      <div style={{ background: '#fff', padding: '8px 16px', display: 'flex', gap: 12, overflowX: 'auto', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#166534', flexShrink: 0 }}>
          <Droplets size={14} color="#16a34a" />
          <span>Moisture: <strong>28%</strong> (Low)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eff6ff', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#1e40af', flexShrink: 0 }}>
          <CloudRain size={14} color="#3b82f6" />
          <span>Rain (6h): <strong>82%</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff7ed', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#9a3412', flexShrink: 0 }}>
          <Thermometer size={14} color="#ea580c" />
          <span>Temp: <strong>31°C</strong></span>
        </div>
      </div>

      {/* Chat Messages List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="animate-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '100%'
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '14px 16px',
                borderRadius: 18,
                borderTopRightRadius: msg.sender === 'user' ? 4 : 18,
                borderTopLeftRadius: msg.sender === 'bot' ? 4 : 18,
                background: msg.sender === 'user' ? '#16a34a' : '#fff',
                color: msg.sender === 'user' ? '#fff' : '#1e293b',
                boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(22, 163, 74, 0.2)' : '0 2px 10px rgba(0,0,0,0.05)',
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none'
              }}
            >
              {/* Intent & Data Sources Routing Badges */}
              {msg.intent && msg.intent !== 'GREETING' && (
                <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: '700', padding: '2px 8px', borderRadius: 12, background: '#e0f2fe', color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    🎯 {msg.intent.replace(/_/g, ' ')}
                  </span>
                  {msg.sourcesUsed && msg.sourcesUsed.map((src, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 8, background: '#f1f5f9', color: '#475569', fontWeight: '600' }}>
                      ✓ {src}
                    </span>
                  ))}
                </div>
              )}

              {msg.text}

              {/* Telemetry Used Badge */}
              {msg.telemetry && Object.keys(msg.telemetry).length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #e2e8f0', fontSize: 11, color: '#64748b' }}>
                  <div style={{ fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', color: '#475569' }}>
                    Telemetry Cited:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {msg.telemetry.soil_moisture && (
                      <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>Soil: {msg.telemetry.soil_moisture}</span>
                    )}
                    {msg.telemetry.rain_prob_6h && (
                      <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>Rain 6h: {msg.telemetry.rain_prob_6h}</span>
                    )}
                    {msg.telemetry.humidity && (
                      <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>Humidity: {msg.telemetry.humidity}</span>
                    )}
                    {msg.telemetry.temp && (
                      <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>Temp: {msg.telemetry.temp}</span>
                    )}
                    {msg.telemetry.disease_alert && (
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: 6 }}>Alert: {msg.telemetry.disease_alert}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, padding: '0 4px' }}>
              {msg.time}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '12px 16px', borderRadius: 16, border: '1px solid #e2e8f0', width: 'fit-content' }}>
            <Loader2 className="spin" size={18} color="#16a34a" />
            <span style={{ fontSize: 13, color: '#64748b' }}>Analyzing telemetry & agronomic knowledge...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                padding: '8px 12px',
                borderRadius: 20,
                fontSize: 12,
                color: '#334155',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: 10, alignItems: 'center' }}
        >
          <input
            type="text"
            placeholder="Ask about watering, diseases, or fertilizer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 24,
              border: '1px solid #cbd5e1',
              fontSize: 14,
              outline: 'none',
              background: '#f8fafc'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: input.trim() && !loading ? '#16a34a' : '#cbd5e1',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              boxShadow: input.trim() && !loading ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
