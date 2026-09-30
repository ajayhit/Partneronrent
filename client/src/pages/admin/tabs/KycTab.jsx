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
  AlertTriangle,
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Languages,
  CreditCard,
  Camera,
  X,
  Download,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

// ── Document Preview Modal ────────────────────────────────────────────────
function DocumentPreviewModal({ doc, onClose }) {
  if (!doc) return null;
  const isPDF = Boolean(
    doc.url && (
      doc.url.startsWith('data:application/pdf') ||
      doc.url.includes('application/pdf') ||
      (doc.fileName && doc.fileName.toLowerCase().endsWith('.pdf'))
    )
  );

  const isImage = Boolean(
    doc.url && !isPDF && (
      doc.url.startsWith('data:image/') ||
      doc.url.startsWith('blob:') ||
      /^https?:\/\//.test(doc.url) ||
      (doc.fileName && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.fileName))
    )
  );

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0b1329', border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px', maxWidth: '750px', width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95)',
          overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)', flexShrink: 0
        }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{doc.title}</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Partner: {doc.partnerName} • {doc.fileName || (isPDF ? 'PDF Document' : 'Image Document')}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '8px', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {isImage ? (
            <div style={{
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#020617', display: 'flex',
              justifyContent: 'center', alignItems: 'center',
              padding: '16px', minHeight: '280px'
            }}>
              <img
                src={doc.url}
                alt={doc.title}
                style={{
                  maxWidth: '100%', maxHeight: '62vh',
                  objectFit: 'contain', display: 'block',
                  borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              />
            </div>
          ) : isPDF ? (
            <div style={{
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#0f172a', display: 'flex', flexDirection: 'column'
            }}>
              <object
                data={doc.url}
                type="application/pdf"
                style={{ width: '100%', height: '58vh', border: 'none', background: '#fff', borderRadius: '8px' }}
              >
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <FileText size={48} color="#38bdf8" style={{ margin: '0 auto 12px' }} />
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>
                    {doc.fileName || 'PDF Document'}
                  </div>
                  <a
                    href={doc.url}
                    download={doc.fileName || 'document.pdf'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '10px 22px', borderRadius: '8px',
                      background: '#38bdf8', color: '#0f172a', fontWeight: 700,
                      textDecoration: 'none', fontSize: '0.86rem'
                    }}
                  >
                    <Download size={16} /> Download &amp; View PDF
                  </a>
                </div>
              </object>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: '12px', padding: '40px 24px', textAlign: 'center'
            }}>
              <FileText size={40} color="#38bdf8" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{doc.title}</div>
              <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                {doc.fileName ? `File: ${doc.fileName}` : 'Document proof on record'}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          background: 'rgba(255,255,255,0.02)', flexShrink: 0
        }}>
          {doc.url && (
            <a
              href={doc.url}
              download={doc.fileName || 'document.jpg'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none'
              }}
            >
              <Download size={14} /> Download File
            </a>
          )}
          <button
            type="button" onClick={onClose}
            style={{
              padding: '8px 22px', borderRadius: '8px',
              background: '#38bdf8', border: 'none', color: '#0f172a',
              fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reject Action Modal ───────────────────────────────────────────────────
function RejectModal({ partner, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const presets = [
    'Aadhaar Card photo is blurred or unreadable. Please upload high-resolution scan.',
    'PAN card number format mismatch with registered legal name.',
    'Selfie does not clearly show partner holding Aadhaar card.',
    'Applicant age indicates under 18 years old. Companions must be 18+.',
    'Companion bio contains inappropriate solicitation or private contact handles.'
  ];

  const handlePreset = (p) => {
    setReason(prev => (prev ? `${prev} Also: ${p}` : p));
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0f172a', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px', maxWidth: '560px', width: '100%',
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
              <XCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Reject Verification</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Partner: {partner?.name} (ID: {partner?.id})</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '12px' }}>
            Select quick reasons or type customized feedback. <strong>This reason will be directly shown on the partner's panel</strong> so they can correct their submission.
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePreset(p)}
                style={{
                  fontSize: '0.74rem', padding: '5px 10px', borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1', cursor: 'pointer', textAlign: 'left'
                }}
              >
                + {p.split('.')[0]}
              </button>
            ))}
          </div>

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#f87171', marginBottom: '6px' }}>
            Detailed Rejection Reason (Mandatory) *
          </label>
          <textarea
            rows="4"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Explain specifically what needs to be corrected by the partner (e.g., Aadhaar photo blurred, re-upload clear photo)..."
            style={{ width: '100%', resize: 'vertical' }}
            required
          />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-admin-action btn-admin-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!reason.trim()) { alert('Please provide a rejection reason for the partner.'); return; }
              onConfirm(reason.trim());
            }}
            className="btn-admin-action btn-admin-danger"
            style={{ padding: '8px 20px', fontWeight: 700 }}
          >
            <XCircle size={15} /> Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Approve Action Modal ──────────────────────────────────────────────────
function ApproveModal({ partner, onClose, onConfirm }) {
  const [remarks, setRemarks] = useState('All government documents verified & background check cleared.');

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0f172a', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px', maxWidth: '500px', width: '100%',
          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Approve Verification</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Partner: {partner?.name} (ID: {partner?.id})</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '14px', lineHeight: '1.5' }}>
            Approving will award this companion the <strong>Green Verified Badge</strong>, allow them to toggle <strong>ONLINE</strong> status, and activate them in client search.
          </div>

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>
            Approval Remarks / Audit Note
          </label>
          <input
            type="text"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} className="btn-admin-action btn-admin-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(remarks.trim() || 'Verified by compliance desk')}
            className="btn-admin-action btn-admin-success"
            style={{ padding: '8px 20px', fontWeight: 700 }}
          >
            <CheckCircle2 size={15} /> Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin KycTab Component ───────────────────────────────────────────
export default function KycTab({
  partners = [],
  subFilter = 'pending',
  setSubFilter,
  onSelectPartner,
  onUpdateKYC
}) {
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingPartner, setRejectingPartner] = useState(null);
  const [approvingPartner, setApprovingPartner] = useState(null);

  const filteredPartners = partners.filter(p => {
    if (subFilter === 'pending' && p.kycStatus !== 'pending' && p.kycStatus !== 'under_review') return false;
    if (subFilter === 'verified' && p.kycStatus !== 'verified') return false;
    if (subFilter === 'rejected' && p.kycStatus !== 'rejected') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.kycDocuments?.idNumber?.toLowerCase().includes(q) ||
        p.kycDocuments?.panNumber?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleConfirmReject = (reason) => {
    if (rejectingPartner) {
      onUpdateKYC(rejectingPartner.id, 'rejected', reason);
      setRejectingPartner(null);
    }
  };

  const handleConfirmApprove = (remarks) => {
    if (approvingPartner) {
      onUpdateKYC(approvingPartner.id, 'verified', remarks);
      setApprovingPartner(null);
    }
  };

  return (
    <div>
      {/* Document Lightbox Modal */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Reject Modal */}
      {rejectingPartner && (
        <RejectModal
          partner={rejectingPartner}
          onClose={() => setRejectingPartner(null)}
          onConfirm={handleConfirmReject}
        />
      )}

      {/* Approve Modal */}
      {approvingPartner && (
        <ApproveModal
          partner={approvingPartner}
          onClose={() => setApprovingPartner(null)}
          onConfirm={handleConfirmApprove}
        />
      )}

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
            Approved &amp; Verified ({partners.filter(p => p.kycStatus === 'verified').length})
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
            placeholder="Search by name, city, phone, Aadhaar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* KYC Applications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '20px' }}>
        {filteredPartners.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <FileText size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div>No companion applications currently matching this filter view.</div>
          </div>
        ) : (
          filteredPartners.map(p => {
            const kd = p.kycDocuments || {};
            const rejectionText = p.kycRejectionReason || kd.rejectionReason || kd.reviewNotes || '';

            return (
              <div key={p.id} className="admin-card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column' }}>
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={p.avatar || '/default-avatar.jpg'}
                      alt={p.name}
                      style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(56,189,248,0.3)' }}
                      onError={e => { e.target.src = '/default-avatar.jpg'; }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{p.name}</span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>ID: {p.id}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#c084fc', marginTop: '2px' }}>
                        {p.tagline || 'Companion Applicant'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', gap: '12px', marginTop: '3px' }}>
                        <span>📍 {p.city || 'India'}</span>
                        <span>🎂 {p.age ? `${p.age} yrs` : '18+'} • {p.gender || 'Female'}</span>
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

                {/* Profile Details Snapshot */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '12px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={13} /> Companion Profile Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Contact Phone:</span>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.phone || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Contact Email:</span>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.email || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Spoken Languages:</span>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.languages?.join(', ') || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Service Areas:</span>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.areas?.join(', ') || '—'}</div>
                    </div>
                  </div>
                  {p.bio && (
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px', color: '#cbd5e1', fontSize: '0.78rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                      "{p.bio.slice(0, 140)}{p.bio.length > 140 ? '...' : ''}"
                    </div>
                  )}
                </div>

                {/* Identity & KYC Checklist & Document Previews */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '14px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={13} /> Government Identity &amp; Documents
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Legal Name on ID:</span>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{kd.holderName || p.name || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Aadhaar Number:</span>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>{kd.idNumber || '—'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>PAN Number:</span>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#fbbf24' }}>{kd.panNumber || '—'}</div>
                    </div>
                  </div>

                  {/* Document click-to-preview chips */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { label: 'Aadhaar Front', url: kd.idFrontDoc, name: kd.idFrontName || 'aadhaar_front.jpg', type: 'aadhaar' },
                      { label: 'Aadhaar Back',  url: kd.idBackDoc,  name: kd.idBackName  || 'aadhaar_back.jpg',  type: 'aadhaar' },
                      { label: 'PAN Card',      url: kd.panDoc,      name: kd.panFileName || 'pan_card.jpg',      type: 'pan' },
                      { label: 'Selfie with ID', url: kd.selfieDoc,  name: kd.selfieFileName || 'selfie.jpg',    type: 'selfie' },
                    ].map((doc, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => doc.url && setPreviewDoc({ ...doc, title: `${doc.label} Proof`, partnerName: p.name })}
                        disabled={!doc.url}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '6px',
                          background: doc.url ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                          border: doc.url ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                          color: doc.url ? '#38bdf8' : '#64748b',
                          fontSize: '0.74rem', fontWeight: 600,
                          cursor: doc.url ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Eye size={12} /> {doc.label} {doc.url ? '✓' : '(missing)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* If previously rejected, show the rejection reason */}
                {p.kycStatus === 'rejected' && rejectionText && (
                  <div style={{
                    marginBottom: '14px',
                    padding: '10px 14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#fca5a5'
                  }}>
                    <strong style={{ color: '#ef4444' }}>Rejection Reason Logged:</strong> "{rejectionText}"
                  </div>
                )}

                {/* Action Toolbar */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onSelectPartner(p)}
                    className="btn-admin-action btn-admin-secondary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <ExternalLink size={13} /> Full Dossier
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {p.kycStatus !== 'rejected' && (
                      <button
                        onClick={() => setRejectingPartner(p)}
                        className="btn-admin-action btn-admin-danger"
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    )}
                    {p.kycStatus !== 'verified' && (
                      <button
                        onClick={() => setApprovingPartner(p)}
                        className="btn-admin-action btn-admin-success"
                        style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                      >
                        <CheckCircle2 size={13} /> Approve KYC
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
