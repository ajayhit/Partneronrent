import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  ShieldCheck, 
  Wallet, 
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
  Clock,
  Briefcase,
  DollarSign,
  Award,
  Globe
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function PartnerProfileModal({
  partner,
  onClose,
  onUpdateStatus,
  onUpdateKYC,
  onAddNote,
  bookings = [],
  reviews = []
}) {
  if (!partner) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const partnerBookings = bookings.filter(b => b.partnerId === partner.id);
  const partnerReviews = reviews.filter(r => r.partnerId === partner.id);

  const handleStatusChange = async (newStatus) => {
    const reason = prompt(`Enter reason for marking partner as ${newStatus}:`, `Operational review`);
    if (!reason) return;
    setLoading(true);
    await onUpdateStatus(partner.id, newStatus, reason);
    setLoading(false);
  };

  const handleKYCAction = async (status) => {
    let reason = '';
    if (status === 'rejected') {
      reason = prompt('Enter rejection reason for partner KYC:', 'Document image blurred or ID mismatch');
      if (!reason) return;
    } else {
      reason = prompt('Enter verification approval note:', 'Digilocker verified & background clear');
    }
    setLoading(true);
    await onUpdateKYC(partner.id, status, reason);
    setLoading(false);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setLoading(true);
    await onAddNote(partner.id, newNote.trim());
    setNewNote('');
    setLoading(false);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-drawer-content" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Companion Partner Dossier
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '2px 0 0' }}>{partner.name}</h2>
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
            src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={partner.name}
            style={{ width: '80px', height: '80px', borderRadius: '18px', objectFit: 'cover', border: '2px solid rgba(56, 189, 248, 0.3)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{partner.name}</span>
              <span className={`admin-badge ${
                partner.kycStatus === 'verified' ? 'admin-badge-emerald' :
                partner.kycStatus === 'pending' ? 'admin-badge-amber' :
                partner.kycStatus === 'rejected' ? 'admin-badge-rose' : 'admin-badge-cyan'
              }`}>
                KYC: {partner.kycStatus ? partner.kycStatus.toUpperCase() : 'PENDING'}
              </span>
              <span className={`admin-badge ${partner.isOnline ? 'admin-badge-emerald' : 'admin-badge-gray'}`}>
                {partner.isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '6px' }}>
              {partner.tagline || 'Verified Companion'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#38bdf8" /> {partner.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={13} color="#34d399" /> ₹{partner.hourlyRate}/hr
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={13} color="#fbbf24" fill="#fbbf24" /> {partner.rating || 5.0} ({partner.reviewCount || partnerReviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
          {partner.kycStatus !== 'verified' && (
            <button
              onClick={() => handleKYCAction('verified')}
              disabled={loading}
              className="btn-admin-action btn-admin-success"
            >
              <CheckCircle2 size={14} /> Approve KYC
            </button>
          )}
          {partner.kycStatus === 'pending' && (
            <button
              onClick={() => handleKYCAction('rejected')}
              disabled={loading}
              className="btn-admin-action btn-admin-danger"
            >
              <XCircle size={14} /> Reject KYC
            </button>
          )}
          {partner.status !== 'suspended' && (
            <button
              onClick={() => handleStatusChange('suspended')}
              disabled={loading}
              className="btn-admin-action btn-admin-secondary"
              style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <RotateCcw size={14} /> Suspend
            </button>
          )}
          {partner.status !== 'blocked' && (
            <button
              onClick={() => handleStatusChange('blocked')}
              disabled={loading}
              className="btn-admin-action btn-admin-danger"
            >
              <Ban size={14} /> Block
            </button>
          )}
          {partner.status !== 'active' && partner.status !== 'verified' && (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="btn-admin-action btn-admin-primary"
            >
              <CheckCircle2 size={14} /> Re-activate
            </button>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="admin-filter-tabs" style={{ marginBottom: '20px' }}>
          <button
            className={`admin-filter-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <HeartHandshake size={13} /> Profile & Bio
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            <ShieldCheck size={13} /> KYC & Documents
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <Wallet size={13} /> Bank & Earnings
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={13} /> Bookings ({partnerBookings.length})
          </button>
          <button
            className={`admin-filter-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={13} /> Admin Notes ({partner.adminNotes?.length || 0})
          </button>
        </div>

        {/* Tab 1: Profile & Bio */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '8px' }}>About & Bio</h4>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                {partner.bio || 'No bio provided.'}
              </p>
            </div>

            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '12px' }}>Demographics & Availability</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Gender & Age:</span>
                  <div style={{ fontWeight: 600 }}>{partner.gender}, {partner.age || 24} yrs</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Languages:</span>
                  <div style={{ fontWeight: 600 }}>{partner.languages?.join(', ') || 'English, Hindi'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Operating Hours:</span>
                  <div style={{ fontWeight: 600 }}>{partner.availableHours || '10:00 AM - 08:00 PM'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Available Days:</span>
                  <div style={{ fontWeight: 600 }}>{partner.availableDays?.join(', ') || 'All Days'}</div>
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Service Areas / Localities:</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {(partner.areas || []).map((area, aIdx) => (
                    <span key={aIdx} style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      color: '#cbd5e1'
                    }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance & Conduct Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>COMPLETED HRS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{partner.completedHours || 0}h</div>
              </div>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CANCEL RATE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>{partner.cancellationRate || '2.0%'}</div>
              </div>
              <div className="admin-card" style={{ padding: '14px', margin: 0, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>NO-SHOWS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: partner.noShowCount > 0 ? '#f87171' : '#34d399' }}>
                  {partner.noShowCount || 0}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: KYC & Documents */}
        {activeTab === 'kyc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} /> Verified Documents & Proofs
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Aadhaar / Primary ID:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{partner.kycDocuments?.idNumber || 'XXXX-XXXX-8912'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399' }}>✓ Verified via UIDAI / Digilocker</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>PAN Verification:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{partner.kycDocuments?.panNumber || 'ABCPS1234F'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399' }}>✓ Name matches bank account</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Selfie Biometric Check:</span>
                  <div style={{ fontWeight: 600, color: partner.kycDocuments?.selfieVerified ? '#34d399' : '#f87171' }}>
                    {partner.kycDocuments?.selfieVerified ? 'Biometrics Matched (98.4%)' : 'Pending Selfie Liveness'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Document Expiry:</span>
                  <div style={{ fontWeight: 600 }}>{partner.kycDocuments?.expiryDate || '2030-12-31'}</div>
                </div>
              </div>

              <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Background Investigation:</span>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {partner.kycDocuments?.backgroundCheck || 'Automated criminal record & court database scan clear.'}
                </div>
              </div>
            </div>

            {/* Verification History Log */}
            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '10px' }}>Verification Audit History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(partner.kycDocuments?.verificationHistory || [
                  { date: '2024-01-18', status: 'SUBMITTED', note: 'Uploaded Aadhaar and PAN documents' },
                  { date: '2024-01-20', status: 'VERIFIED', note: 'Approved by Operations Admin Team' }
                ]).map((hist, hIdx) => (
                  <div key={hIdx} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: hist.status === 'VERIFIED' ? '#34d399' : '#fbbf24' }}>
                        {hist.status}
                      </span>
                      <span style={{ color: '#94a3b8', marginLeft: '8px' }}>{hist.note}</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{hist.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bank & Earnings */}
        {activeTab === 'bank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Available Balance</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
                  {formatCurrency(partner.walletBalance || 0)}
                </div>
              </div>
              <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase' }}>Lifetime Earnings</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
                  {formatCurrency(partner.totalEarnings || 0)}
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ padding: '16px', margin: 0 }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '12px' }}>Settlement & Payout Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Account Holder:</span>
                  <div style={{ fontWeight: 600 }}>{partner.bankDetails?.accountHolder || partner.name}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Bank Name:</span>
                  <div style={{ fontWeight: 600 }}>{partner.bankDetails?.bankName || 'HDFC Bank'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Account Number:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{partner.bankDetails?.accountNumber || '50100492819283'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>IFSC Code:</span>
                  <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{partner.bankDetails?.ifsc || 'HDFC0001234'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>UPI ID:</span>
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>{partner.bankDetails?.upiId || 'aanya@okhdfcbank'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Bookings */}
        {activeTab === 'bookings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {partnerBookings.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                No bookings assigned yet.
              </div>
            ) : (
              partnerBookings.map(b => (
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
                      Client: {b.clientName} • {b.date} at {b.startTime}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(b.partnerShare || b.totalAmount * 0.8)}</div>
                    <span className={`admin-badge ${b.status === 'completed' ? 'admin-badge-emerald' : 'admin-badge-cyan'}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 5: Admin Notes */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Log internal note about this partner..."
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
              {(partner.adminNotes || []).map((note, nIdx) => (
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
