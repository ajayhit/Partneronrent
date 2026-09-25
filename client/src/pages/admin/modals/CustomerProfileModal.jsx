import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Star, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function CustomerProfileModal({
  customer,
  onClose,
  onUpdateStatus,
  onAddNote,
  bookings = [],
  transactions = []
}) {
  if (!customer) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const customerBookings = bookings.filter(b => b.clientId === customer.id || b.clientName === customer.name);
  const customerTransactions = transactions.filter(t => t.customerName === customer.name);

  const handleStatusChange = async (newStatus) => {
    const reason = prompt(`Enter reason for marking customer as ${newStatus}:`, `Operational review`);
    if (!reason) return;
    setLoading(true);
    await onUpdateStatus(customer.id, newStatus, reason);
    setLoading(false);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLoading(true);
    await onAddNote(customer.id, newNote.trim());
    setNewNote('');
    setLoading(false);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-drawer-content" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Customer Intelligence Dossier
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 0' }}>{customer.name}</h2>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', padding: '6px', borderRadius: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <img
            src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
            alt={customer.name}
            style={{ width: '70px', height: '70px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(56, 189, 248, 0.3)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{customer.name}</span>
              <span className={`admin-badge ${
                customer.status === 'active' ? 'admin-badge-emerald' :
                customer.status === 'suspended' ? 'admin-badge-amber' :
                customer.status === 'blocked' ? 'admin-badge-rose' : 'admin-badge-cyan'
              }`}>
                {customer.status ? customer.status.toUpperCase() : 'ACTIVE'}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} color="#38bdf8" /> {customer.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} color="#34d399" /> {customer.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#fbbf24" /> {customer.city || 'Delhi NCR'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
          {customer.status !== 'active' && (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="btn-admin-action btn-admin-success"
            >
              <CheckCircle2 size={14} /> Unblock / Activate
            </button>
          )}
          {customer.status !== 'suspended' && (
            <button
              onClick={() => handleStatusChange('suspended')}
              disabled={loading}
              className="btn-admin-action btn-admin-secondary"
              style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <RotateCcw size={14} /> Suspend (14-Days)
            </button>
          )}
          {customer.status !== 'blocked' && (
            <button
              onClick={() => handleStatusChange('blocked')}
              disabled={loading}
              className="btn-admin-action btn-admin-danger"
            >
              <Ban size={14} /> Block Permanently
            </button>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="admin-filter-tabs" style={{ marginBottom: '20px' }}>
          <button
            className={`admin-filter-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={13} /> Overview & KYC
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={13} /> Bookings ({customerBookings.length})
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={13} /> Wallet & Payments
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={13} /> Admin Notes ({customer.adminNotes?.length || 0})
          </button>
        </div>

        {/* Tab 1: Overview & KYC */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Identity & KYC Verification Panel */}
            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Identity & KYC Status
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>KYC Status:</span>
                  <div style={{ fontWeight: 700, color: customer.kycStatus === 'verified' ? '#34d399' : '#fbbf24' }}>
                    {customer.kycStatus ? customer.kycStatus.toUpperCase() : 'PENDING'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Document Type:</span>
                  <div style={{ fontWeight: 600 }}>{customer.idType || 'Aadhaar Card'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>ID Number (Masked):</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{customer.idNumber || 'XXXX-XXXX-9214'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Emergency Contact:</span>
                  <div style={{ fontWeight: 600 }}>{customer.emergencyContact || '+91 98111 22334'}</div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL BOOKINGS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{customer.totalBookings || customerBookings.length}</div>
              </div>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CANCELLATIONS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: customer.cancellationsCount > 0 ? '#f87171' : '#34d399' }}>
                  {customer.cancellationsCount || 0}
                </div>
              </div>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>COMPLAINTS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: customer.complaintsCount > 0 ? '#f87171' : '#34d399' }}>
                  {customer.complaintsCount || 0}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '10px' }}>Account Metadata</h4>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.8' }}>
                <div>• Customer ID: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{customer.id}</span></div>
                <div>• Platform Member Since: {customer.joinedDate || '2024-01-15'}</div>
                <div>• Registered City: {customer.city || 'Delhi NCR'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {customerBookings.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                No past bookings logged for this customer.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {customerBookings.map(b => (
                  <div key={b.id} style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                        {b.id} • {b.serviceName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        Partner: {b.partnerName} • {b.date} at {b.startTime}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {b.meetingLocation}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(b.totalAmount)}</div>
                      <span className={`admin-badge ${b.status === 'completed' ? 'admin-badge-emerald' : b.status === 'cancelled' ? 'admin-badge-rose' : 'admin-badge-cyan'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wallet & Payments */}
        {activeTab === 'payments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card" style={{ padding: '18px', margin: 0, background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(15, 23, 42, 0.6))' }}>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Customer Wallet Balance
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
                {formatCurrency(customer.walletBalance || 0)}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Usable for 1-click companion bookings & automated refund deposits.
              </div>
            </div>

            <h4 style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Recent Payment Transactions</h4>
            {customerTransactions.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.84rem' }}>No payment records found.</div>
            ) : (
              customerTransactions.map(t => (
                <div key={t.id} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.84rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.id} • {t.paymentMethod}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{formatDateTime(t.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: t.status === 'refunded' ? '#f87171' : '#34d399' }}>
                      {formatCurrency(t.amount)}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t.status.toUpperCase()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Admin Notes */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Log internal note about this customer..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={loading || !newNote.trim()}
                className="btn-admin-action btn-admin-primary"
              >
                Add Note
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(customer.adminNotes || []).map((note, nIdx) => (
                <div key={nIdx} style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid #38bdf8',
                  fontSize: '0.84rem',
                  color: '#e2e8f0'
                }}>
                  {note}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
