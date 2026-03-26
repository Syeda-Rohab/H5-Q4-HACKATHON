'use client'

export default function Footer() {
  return (
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
  )
}
