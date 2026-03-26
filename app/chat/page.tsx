'use client'

import { useState, useRef, useEffect } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useTheme } from '@/lib/theme'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { theme } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [chatStarted, setChatStarted] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startChat = () => {
    if (customerInfo.email) {
      setChatStarted(true)
      setMessages([{
        role: 'assistant',
        content: `👋 Hello ${customerInfo.name || 'there'}! I'm your AI Support Assistant. How can I help you today?`,
        timestamp: new Date(),
      }])
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          channel: 'web',
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (res.ok && data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ ${data.error || 'Sorry, I encountered an error. Please try again.'}`,
          timestamp: new Date(),
        }])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered a network error. Please check your connection and try again.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!chatStarted) {
    return (
      <div className={`page-wrapper ${theme}`}>
        <Header />
        <main className="chat-intro">
          <div className="container">
            <div className="intro-card">
              <div className="intro-icon">💬</div>
              <h1 className="intro-title">Live Chat Support</h1>
              <p className="intro-description">Start a conversation with our AI assistant</p>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="form-input"
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="form-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Phone (optional)</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="form-input"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <button
                onClick={startChat}
                disabled={!customerInfo.email}
                className="btn-primary btn-large"
              >
                🚀 Start Chat
              </button>

              <p className="back-link">
                Prefer to submit a ticket? <a href="/support">Click here</a>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={`page-wrapper ${theme}`}>
      <Header showNav={false} />
      <main className="chat-page">
        <div className="chat-header">
          <div className="container">
            <div className="chat-header-content">
              <a href="/" className="back-link">← Back to Home</a>
              <div className="chat-info">
                <span className="chat-status">🟢 Online</span>
                <span className="chat-user">👤 {customerInfo.name || customerInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="chat-container">
            <div className="messages-area">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                  <div className="message-avatar">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    <p className="message-text">{message.content}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message message-assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="chat-input"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="send-button"
              >
                📤
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
