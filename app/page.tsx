'use client'

import { useTheme } from '@/lib/theme'
import Link from 'next/link'
import Header from './components/Header'

export default function Home() {
  const { theme, mounted } = useTheme()

  return (
    <div className={`page-wrapper ${theme}`}>
      <Header showNav={true} />

      {/* Animations for dark mode - only render when mounted */}
      {mounted && (
        <>
          <div className="sparkle-container" aria-hidden="true">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>
          <div className="lightning-container" aria-hidden="true">
            <div className="lightning-bolt"></div>
            <div className="lightning-bolt"></div>
            <div className="lightning-bolt"></div>
            <div className="lightning-bolt"></div>
            <div className="lightning-bolt"></div>
          </div>
          <div aria-hidden="true">
            <div className="electric-spark spark-1"></div>
            <div className="electric-spark spark-2"></div>
            <div className="electric-spark spark-3"></div>
            <div className="electric-spark spark-4"></div>
            <div className="electric-spark spark-5"></div>
            <div className="electric-spark spark-6"></div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge">🚀 AI-Powered Support Platform</div>
            <h2 className="hero-title">
              Intelligent Customer<br />
              <span className="gradient-text">Support Revolution</span>
            </h2>
            <p className="hero-description">
              Experience the future of customer support with AI-driven responses, 
              instant ticket creation, and seamless multi-channel communication.
            </p>
            <div className="hero-buttons">
              <Link href="/support" className="btn btn-primary btn-large">
                🎫 Create Ticket
              </Link>
              <Link href="/chat" className="btn btn-secondary btn-large">
                💬 Start Chat
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Availability</span>
              </div>
              <div className="stat">
                <span className="stat-number">&lt;1min</span>
                <span className="stat-label">Response Time</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">Why Choose NexSupport?</h3>
            <p className="section-description">Powerful features built for modern customer support</p>
          </div>
          <div className="features-grid">
            <FeatureCard
              icon="🤖"
              title="AI Agent"
              description="Intelligent responses powered by advanced language models"
              color="#6366f1"
            />
            <FeatureCard
              icon="🎫"
              title="Ticket Management"
              description="Organize and track all customer issues efficiently"
              color="#10b981"
            />
            <FeatureCard
              icon="💬"
              title="Live Chat"
              description="Real-time conversations with instant AI assistance"
              color="#f59e0b"
            />
            <FeatureCard
              icon="📱"
              title="Multi-Channel"
              description="Support via Web, WhatsApp, and Email"
              color="#8b5cf6"
            />
            <FeatureCard
              icon="📊"
              title="Analytics"
              description="Track performance and customer satisfaction"
              color="#06b6d4"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-stack">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">Powered By</h3>
            <p className="section-description">Built with cutting-edge free & open-source technologies</p>
          </div>
          <div className="tech-grid">
            <TechCard name="Supabase" icon="🗄️" description="Free PostgreSQL Database" />
            <TechCard name="OpenRouter" icon="🤖" description="Free AI Models" />
            <TechCard name="Twilio" icon="📱" description="Free WhatsApp API Trial" />
            <TechCard name="Vercel" icon="🌐" description="Free Cloud Hosting" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Transform Your Support?</h3>
            <p className="cta-description">100% Free Forever - No Credit Card Required - Start Today!</p>
            <Link href="/support" className="btn btn-primary btn-large">
              Get Started - It's Free! 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-icon">✨</span>
              <span className="footer-text">NexSupport AI</span>
            </div>
            <p className="footer-description">
              AI-Powered Customer Support Platform
            </p>
            <div className="footer-links">
              <a href="/support">Support</a>
              <a href="/admin">Admin</a>
            </div>
            <p className="footer-copyright">
              © 2024 NexSupport AI. Built for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: string; title: string; description: string; color: string }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h4 className="feature-title">{title}</h4>
      <p className="feature-description">{description}</p>
    </div>
  )
}

function TechCard({ name, icon, description }: { name: string; icon: string; description: string }) {
  return (
    <div className="tech-card">
      <div className="tech-icon">{icon}</div>
      <div className="tech-name">{name}</div>
      <div className="tech-description">{description}</div>
    </div>
  )
}
