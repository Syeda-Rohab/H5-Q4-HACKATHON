'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/theme'
import Link from 'next/link'

export default function Header({ showNav = true }: { showNav?: boolean }) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">NexSupport AI</span>
          </Link>

          {showNav && (
            <>
              <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                <Link href="/chat" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">💬</span>
                  <span className="nav-text">Chat</span>
                </Link>
                <Link href="/support" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">Support</span>
                </Link>
                <Link href="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Admin</span>
                </Link>
              </nav>

              <button 
                className="mobile-menu-btn" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </>
          )}

          {mounted && (
            <button onClick={toggleTheme} className="theme-toggle">
              <span className="theme-toggle-icon">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
              <span className="theme-toggle-text">
                {theme === 'light' ? 'Dark' : 'Light'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
