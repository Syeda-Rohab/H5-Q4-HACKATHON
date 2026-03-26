'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useTheme } from '@/lib/theme'

export default function SupportPage() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    channel: 'web' as 'web' | 'whatsapp' | 'gmail',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{ success: boolean; message: string; ticketId?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: formData.message,
          customerEmail: formData.email,
          customerName: formData.name,
          customerPhone: formData.phone,
          channel: formData.channel,
          priority: formData.priority,
        }),
      })

      const data = await res.json()

      if (res.ok && data.ticket) {
        setResponse({
          success: true,
          message: '✅ Ticket created successfully! Our AI agent will respond shortly.',
          ticketId: data.ticket.id,
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          channel: 'web',
          priority: 'medium',
          message: '',
        })
      } else {
        setResponse({
          success: false,
          message: data.error || 'Failed to create ticket. Please try again.',
        })
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'Network error. Please check your connection.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className={`page-wrapper ${theme}`}>
      <Header />
      <main className="support-page">
        <div className="container">
          <div className="support-header">
            <div className="support-icon">🎧</div>
            <h1 className="support-title">Customer Support</h1>
            <p className="support-description">Fill out the form below and our AI agent will assist you shortly</p>
          </div>

          <div className="support-content">
            <div className="form-section">
              {response && (
                <div className={`alert ${response.success ? 'alert-success' : 'alert-error'}`}>
                  <p className="alert-message">{response.message}</p>
                  {response.ticketId && (
                    <p className="alert-ticket">Ticket ID: <code>{response.ticketId}</code></p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="support-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      <span className="label-icon">👤</span> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      <span className="label-icon">📧</span> Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    <span className="label-icon">📱</span> Phone Number (for WhatsApp)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="channel">
                      <span className="label-icon">🔗</span> Preferred Channel
                    </label>
                    <select
                      id="channel"
                      name="channel"
                      value={formData.channel}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="web">🌐 Web Portal</option>
                      <option value="whatsapp">📱 WhatsApp</option>
                      <option value="gmail">📧 Email</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="priority">
                      <span className="label-icon">⚡</span> Priority Level
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="low">🟢 Low - General inquiry</option>
                      <option value="medium">🟡 Medium - Standard support</option>
                      <option value="high">🟠 High - Urgent issue</option>
                      <option value="urgent">🔴 Urgent - Critical problem</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">
                    <span className="label-icon">💬</span> Your Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="form-textarea"
                    placeholder="Describe your issue in detail..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit"
                >
                  {loading ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      🚀 Submit Ticket
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="contact-section">
              <h3 className="contact-title">📞 Other Ways to Reach Us</h3>
              <div className="contact-grid">
                <ContactCard icon="📱" label="WhatsApp" value="+1 234 567 8900" />
                <ContactCard icon="📧" label="Email" value="support@example.com" />
                <ContactCard icon="🕐" label="Hours" value="24/7 AI Support" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ContactCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="contact-card">
      <div className="contact-icon">{icon}</div>
      <div className="contact-label">{label}</div>
      <div className="contact-value">{value}</div>
    </div>
  )
}
