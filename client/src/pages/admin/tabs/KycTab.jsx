import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  FileText,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

export default function KycTab({
  partners = [],
  subFilter = 'pending',
  setSubFilter,
  onSelectPartner,
  onUpdateKYC
}) {
  const [search, setSearch] = useState('');

  const filteredPartners = partners.filter(p => {
    if (subFilter === 'pending' && p.kycStatus !== 'pending' && p.kycStatus !== 'under_review') return false;
    if (subFilter === 'verified' && p.kycStatus !== 'verified') return false;
    if (subFilter === 'rejected' && p.kycStatus !== 'rejected') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return p.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApprove = (partnerId) => {
    const note = prompt('Enter KYC approval remarks:', 'Digilocker verified & background clear.');
    if (note) onUpdateKYC(partnerId, 'verified', note);
  };

  const handleReject = (partnerId) => {
    const note = prompt('Enter KYC rejection reason:', 'Document image blurred or ID mismatch.');
    if (note) onUpdateKYC(partnerId, 'rejected', note);
  };

  return (
    <div>
      {/* Header Tabs */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setSubFilter('pending')}
          >
            Pending Verification ({partners.filter(p => p.kycStatus === 'pending' || p.kycStatus === 'under_review').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'verified' ? 'active' : ''}`}
            onClick={() => setSubFilter('verified')}
          >
            Approved & Verified ({partners.filter(p => p.kycStatus === 'verified').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setSubFilter('rejected')}
          >
            Rejected ({partners.filter(p => p.kycStatus === 'rejected').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Verification History ({partners.length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* KYC Applications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filteredPartners.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No verification applications currently matching this view.
          </div>
        ) : (
          filteredPartners.map(p => (
            <div key={p.id} className="admin-card" style={{ padding: '18px', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {p.city} • Applied: {p.kycDocuments?.submittedAt ? p.kycDocuments.submittedAt.split('T')[0] : 'Recent'}
                    </div>
                  </div>
                </div>
                <span className={`admin-badge ${
                  p.kycStatus === 'verified' ? 'admin-badge-emerald' :
                  p.kycStatus === 'rejected' ? 'admin-badge-rose' : 'admin-badge-amber'
                }`}>
                  {p.kycStatus ? p.kycStatus.toUpperCase() : 'PENDING'}
                </span>
              </div>

              {/* Document verification checklist */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '14px',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Aadhaar / Primary ID:</span>
                    <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{p.kycDocuments?.idNumber || 'XXXX-XXXX-8912'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>PAN Card:</span>
                    <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>{p.kycDocuments?.panNumber || 'ABCDE1234F'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Selfie Match:</span>
                    <div style={{ fontWeight: 600, color: p.kycDocuments?.selfieVerified ? '#34d399' : '#f87171' }}>
                      {p.kycDocuments?.selfieVerified ? 'Biometrics Matched' : 'Pending Selfie'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Doc Expiry:</span>
                    <div style={{ fontWeight: 600 }}>{p.kycDocuments?.expiryDate || '2030-12-31'}</div>
                  </div>
                </div>

                <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px', color: '#94a3b8', fontSize: '0.76rem' }}>
                  {p.kycDocuments?.backgroundCheck || 'Court record scan in progress.'}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => onSelectPartner(p)}
                  className="btn-admin-action btn-admin-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  <ExternalLink size={12} /> Inspect Documents
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {p.kycStatus !== 'rejected' && (
                    <button
                      onClick={() => handleReject(p.id)}
                      className="btn-admin-action btn-admin-danger"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  )}
                  {p.kycStatus !== 'verified' && (
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="btn-admin-action btn-admin-success"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <CheckCircle2 size={12} /> Approve KYC
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
