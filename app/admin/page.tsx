'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useTheme } from '@/lib/theme'

type Ticket = {
  id: string
  customer_id: string
  channel: string
  priority: string
  status: string
  created_at: string
  customers: {
    name: string | null
    email: string | null
    phone: string | null
  } | null
}

type FilterStatus = 'all' | 'open' | 'in_progress' | 'resolved' | 'closed'

export default function AdminDashboard() {
  const { theme } = useTheme()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [filter])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const url = filter === 'all'
        ? '/api/tickets'
        : `/api/tickets?status=${filter}`

      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        setTickets(data.tickets || [])
      } else {
        setTickets([])
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_ticket',
          ticketId,
          status: newStatus,
        }),
      })

      if (res.ok) {
        fetchTickets()
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div className={`page-wrapper ${theme}`}>
      <Header />
      <main className="admin-page">
        <div className="container">
          <div className="admin-header">
            <div className="header-left">
              <div className="page-icon">📊</div>
              <div>
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Manage and track all support tickets</p>
              </div>
            </div>
            <button onClick={fetchTickets} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          <div className="stats-grid">
            <StatCard 
              label="Total Tickets" 
              value={stats.total} 
              icon="📋" 
              color="linear-gradient(135deg, #3b82f6, #2563eb)"
            />
            <StatCard 
              label="Open" 
              value={stats.open} 
              icon="🔵" 
              color="linear-gradient(135deg, #6366f1, #4f46e5)"
            />
            <StatCard 
              label="In Progress" 
              value={stats.inProgress} 
              icon="🟡" 
              color="linear-gradient(135deg, #f59e0b, #d97706)"
            />
            <StatCard 
              label="Resolved" 
              value={stats.resolved} 
              icon="✅" 
              color="linear-gradient(135deg, #10b981, #059669)"
            />
          </div>

          <div className="filters-section">
            <div className="filters-title">Filter by Status:</div>
            <div className="filters-grid">
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`filter-btn ${filter === status ? 'active' : ''}`}
                >
                  {status === 'all' ? '📋 All' : `📁 ${status.replace('_', ' ')}`}
                </button>
              ))}
            </div>
          </div>

          <div className="tickets-section">
            <div className="tickets-header">
              <h2 className="section-title">📝 Tickets List</h2>
              <span className="tickets-count">{tickets.length} tickets found</span>
            </div>

            <div className="tickets-table-wrapper">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Customer</th>
                    <th>Channel</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="loading-cell">
                        <div className="loading-spinner">
                          <svg className="spinner" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Loading tickets...
                        </div>
                      </td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-cell">
                        📭 No tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="ticket-row"
                        onClick={() => {
                          setSelectedTicket(ticket)
                          setShowModal(true)
                        }}
                      >
                        <td>
                          <code className="ticket-id">{ticket.id.slice(0, 8)}...</code>
                        </td>
                        <td>
                          <div className="customer-info">
                            <span className="customer-name">{ticket.customers?.name || 'Anonymous'}</span>
                            <span className="customer-email">{ticket.customers?.email || 'No email'}</span>
                          </div>
                        </td>
                        <td>
                          <span className="channel-badge">{getChannelIcon(ticket.channel)} {ticket.channel}</span>
                        </td>
                        <td>
                          <span className={`priority-badge priority-${ticket.priority}`}>
                            {getPriorityIcon(ticket.priority)} {ticket.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${ticket.status}`}>
                            {getStatusIcon(ticket.status)} {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <span className="created-date">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <select
                            value={ticket.status}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleStatusChange(ticket.id, e.target.value)
                            }}
                            className="action-select"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🎫 Ticket Details</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Ticket ID</label>
                  <code className="detail-code">{selectedTicket.id}</code>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge status-${selectedTicket.status}`}>
                    {getStatusIcon(selectedTicket.status)} {selectedTicket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <label>Customer Information</label>
                <div className="customer-detail">
                  <div className="customer-detail-row">
                    <span className="detail-icon">👤</span>
                    <span>{selectedTicket.customers?.name || 'Anonymous'}</span>
                  </div>
                  <div className="customer-detail-row">
                    <span className="detail-icon">📧</span>
                    <span>{selectedTicket.customers?.email || 'No email'}</span>
                  </div>
                  {selectedTicket.customers?.phone && (
                    <div className="customer-detail-row">
                      <span className="detail-icon">📱</span>
                      <span>{selectedTicket.customers.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <label>Channel</label>
                  <div className="channel-detail">
                    {getChannelIcon(selectedTicket.channel)} {selectedTicket.channel}
                  </div>
                </div>
                <div className="detail-item">
                  <label>Priority</label>
                  <span className={`priority-badge priority-${selectedTicket.priority}`}>
                    {getPriorityIcon(selectedTicket.priority)} {selectedTicket.priority}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <label>Created At</label>
                <div className="date-detail">
                  📅 {new Date(selectedTicket.created_at).toLocaleString()}
                </div>
              </div>

              <div className="detail-item">
                <label>Update Status</label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="status-update-select"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="modal-btn modal-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="stat-card" style={{ background: color }}>
      <div className="stat-content">
        <span className="stat-icon">{icon}</span>
        <div className="stat-info">
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
        </div>
      </div>
    </div>
  )
}

function getChannelIcon(channel: string) {
  const icons: Record<string, string> = {
    web: '🌐',
    whatsapp: '📱',
    gmail: '📧',
  }
  return icons[channel] || '🌐'
}

function getPriorityIcon(priority: string) {
  const icons: Record<string, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    urgent: '🔴',
  }
  return icons[priority] || '🟡'
}

function getStatusIcon(status: string) {
  const icons: Record<string, string> = {
    open: '🔵',
    in_progress: '🟡',
    resolved: '✅',
    closed: '🟢',
  }
  return icons[status] || '🔵'
}
