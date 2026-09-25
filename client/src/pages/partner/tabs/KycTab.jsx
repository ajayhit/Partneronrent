import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  Camera,
  Home,
  CreditCard,
  History,
  FileCheck
} from 'lucide-react';

export default function KycTab({ partner, onSubmitKYC, showToast }) {
  const currentStatus = partner?.kycStatus || 'pending'; // 'pending', 'under_review', 'verified', 'rejected'
  const isVerified = currentStatus === 'verified';
  const isUnderReview = currentStatus === 'under_review';
  const isRejected = currentStatus === 'rejected';

  const [idType, setIdType] = useState(partner?.kycDocuments?.idType || 'Aadhaar Card');
  const [idNumber, setIdNumber] = useState(partner?.kycDocuments?.idNumber || 'XXXX-XXXX-8912');
  const [holderName, setHolderName] = useState(partner?.kycDocuments?.holderName || partner?.name || 'Aanya Sharma');
  const [panNumber, setPanNumber] = useState(partner?.kycDocuments?.panNumber || 'ABCDE5500K');
  const [addressDocType, setAddressDocType] = useState('Utility Bill (Electricity/Water)');
  const [addressLine, setAddressLine] = useState('Flat 402, Green Glen Apartments, Saket, New Delhi 110017');
  const [selfieTaken, setSelfieTaken] = useState(true);
  const [idFrontUploaded, setIdFrontUploaded] = useState(true);
  const [idBackUploaded, setIdBackUploaded] = useState(true);
  const [addressUploaded, setAddressUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verificationHistory = partner?.kycDocuments?.verificationHistory || [
    { date: '2024-01-10 14:30', status: 'Submitted', note: 'Initial Govt ID proofs & selfie submitted for verification.' },
    { date: '2024-01-11 10:15', status: 'Under Review', note: 'Compliance officer assigned for background police verification.' },
    { date: '2024-01-12 16:45', status: 'Verified', note: 'Aadhaar OCR, PAN validity, and face match authenticated. Approved.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idNumber.trim()) {
      showToast('Please enter document ID number', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitKYC({
        idType,
        idNumber,
        holderName,
        panNumber,
        addressDocType,
        addressLine
      });
      showToast('KYC Documents submitted for admin compliance verification!');
    } catch (err) {
      showToast('Failed to submit KYC documents', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { label: 'Pending', active: true, done: true },
    { label: 'Under Review', active: isUnderReview || isVerified, done: isVerified },
    { label: 'Verified', active: isVerified, done: isVerified },
    { label: 'Rejected / Re-verification', active: isRejected, done: false, danger: isRejected }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🪪 Identity Verification & KYC Compliance
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Mandatory background check to maintain a safe, platonic, and trusted community for companions and hirers.
        </p>
      </div>

      {/* Verification Status Progression Tracker */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '20px' }}>
          <ShieldCheck size={20} color={isVerified ? '#34d399' : '#fbbf24'} />
          <span>Verification Status Tracker</span>
        </div>

        {/* Visual Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '10px 14px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {steps.map((st, idx) => (
            <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: st.done ? '#10b981' : st.danger ? '#ef4444' : st.active ? '#f59e0b' : 'rgba(100, 116, 139, 0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {st.done ? '✓' : st.danger ? '✕' : idx + 1}
              </div>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: st.done ? '#34d399' : st.danger ? '#f87171' : st.active ? '#fbbf24' : '#64748b'
              }}>
                {st.label}
              </span>
              {idx < steps.length - 1 && (
                <div style={{ width: '30px', height: '2px', background: st.done ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Status Callout Box */}
        <div style={{
          background: isVerified
            ? 'rgba(16, 185, 129, 0.1)'
            : isUnderReview
            ? 'rgba(245, 158, 11, 0.1)'
            : isRejected
            ? 'rgba(239, 68, 68, 0.1)'
            : 'rgba(56, 189, 248, 0.1)',
          border: `1px solid ${isVerified ? '#10b981' : isUnderReview ? '#f59e0b' : isRejected ? '#ef4444' : '#38bdf8'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {isVerified ? (
            <CheckCircle2 size={32} color="#10b981" />
          ) : isUnderReview ? (
            <Clock size={32} color="#f59e0b" />
          ) : isRejected ? (
            <XCircle size={32} color="#ef4444" />
          ) : (
            <AlertTriangle size={32} color="#38bdf8" />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
              {isVerified
                ? 'Account Verified & Background Cleared'
                : isUnderReview
                ? 'Documents Under Review by Compliance Team'
                : isRejected
                ? 'Verification Rejected - Please Re-submit Clear Proofs'
                : 'KYC Submission Required to Accept Bookings'}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '3px' }}>
              {isVerified
                ? 'Your companion profile carries the public green Verified Badge. Police checks & ID verification clear through 2029.'
                : isUnderReview
                ? 'Verification takes typically 6 to 12 hours. We will notify you via SMS/Email once approved.'
                : isRejected
                ? 'Reason: Address proof blurred. Please upload a clear photo of utility bill or Aadhaar.'
                : 'Submit valid Govt ID, PAN card, and live selfie to enable payments and booking requests.'}
            </div>
          </div>
        </div>
      </div>

      {/* KYC Form: ID, PAN, Selfie, Address */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          
          {/* 1. Identity Document */}
          <div className="partner-panel" style={{ marginBottom: 0 }}>
            <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
              <FileText size={18} color="#38bdf8" />
              <span>1. Identity Document</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Document Type
                </label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option>Aadhaar Card</option>
                  <option>Passport</option>
                  <option>Driving License</option>
                  <option>Voter ID</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Legal Name as per ID
                </label>
                <input
                  type="text"
                  value={holderName}
                  onChange={e => setHolderName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Document Number
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="e.g. XXXX-XXXX-8912"
                  required
                />
              </div>

              {/* Upload simulation */}
              <div style={{
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer'
              }}>
                <Upload size={18} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Front & Back of {idType}</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ 2 files uploaded (aadhaar_front.jpg, aadhaar_back.jpg)</div>
              </div>
            </div>
          </div>

          {/* 2. PAN Card Verification */}
          <div className="partner-panel" style={{ marginBottom: 0 }}>
            <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
              <CreditCard size={18} color="#fbbf24" />
              <span>2. PAN Verification</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  maxLength="10"
                  value={panNumber}
                  onChange={e => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  style={{ width: '100%', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Required for 80/20 platform earnings payout & TDS compliance.</span>
              </div>

              <div style={{
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer'
              }}>
                <Upload size={18} color="#fbbf24" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Upload Photo of PAN Card</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ pan_card_verified.jpg (Validated)</div>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.78rem',
                color: '#cbd5e1'
              }}>
                ℹ️ Instant NSDL tax registry check verifies the name matches your Aadhaar ID.
              </div>
            </div>
          </div>

          {/* 3. Selfie Facial Verification */}
          <div className="partner-panel" style={{ marginBottom: 0 }}>
            <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
              <Camera size={18} color="#c084fc" />
              <span>3. Live Selfie Verification</span>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 12px',
                overflow: 'hidden',
                border: '3px solid #c084fc',
                position: 'relative'
              }}>
                <img
                  src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Selfie Check"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Live Facial Match: 98.4% Similarity
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 12px' }}>
                Automated biometrics verify your face matches the photo in your Govt ID document.
              </p>

              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => showToast('Selfie re-captured successfully')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Camera size={14} /> Retake Verification Selfie
              </button>
            </div>
          </div>

          {/* 4. Address Verification */}
          <div className="partner-panel" style={{ marginBottom: 0 }}>
            <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
              <Home size={18} color="#10b981" />
              <span>4. Address Verification</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Address Proof Type
                </label>
                <select
                  value={addressDocType}
                  onChange={e => setAddressDocType(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option>Utility Bill (Electricity/Water)</option>
                  <option>Registered Rent Agreement</option>
                  <option>Bank Account Statement</option>
                  <option>Aadhaar Address (Same as ID)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Residential Address
                </label>
                <textarea
                  rows="2"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer'
              }}>
                <Upload size={18} color="#10b981" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Proof Upload</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981' }}>✓ electricity_bill_verified.pdf</div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'right', marginBottom: '30px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            {isSubmitting ? 'Submitting Documents...' : 'Submit / Update KYC Documents'}
          </button>
        </div>
      </form>

      {/* Submitted Documents Ledger */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <FileCheck size={18} color="#38bdf8" />
          <span>Submitted Documents on File</span>
        </div>

        <div className="partner-table-container">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Identifier / Number</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{idType}</strong></td>
                <td>{idNumber}</td>
                <td>2024-01-10</td>
                <td><span className="partner-badge partner-badge-emerald">Verified</span></td>
                <td>
                  <button className="btn-secondary btn-sm" onClick={() => showToast('Opening secure document preview...')}>
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>PAN Card</strong></td>
                <td>{panNumber}</td>
                <td>2024-01-10</td>
                <td><span className="partner-badge partner-badge-emerald">Verified</span></td>
                <td>
                  <button className="btn-secondary btn-sm" onClick={() => showToast('Opening secure document preview...')}>
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>Live Facial Selfie</strong></td>
                <td>Face Vector Match</td>
                <td>2024-01-10</td>
                <td><span className="partner-badge partner-badge-emerald">Matched</span></td>
                <td>
                  <button className="btn-secondary btn-sm" onClick={() => showToast('Opening secure document preview...')}>
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong>Address Proof ({addressDocType.split(' ')[0]})</strong></td>
                <td>Utility Record #9021</td>
                <td>2024-01-10</td>
                <td><span className="partner-badge partner-badge-emerald">Verified</span></td>
                <td>
                  <button className="btn-secondary btn-sm" onClick={() => showToast('Opening secure document preview...')}>
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification History Timeline */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <History size={18} color="#c084fc" />
          <span>Verification Audit History</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {verificationHistory.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '10px',
                borderLeft: '3px solid #10b981'
              }}
            >
              <div style={{ minWidth: '130px', fontSize: '0.78rem', color: '#94a3b8' }}>
                {item.date}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', marginBottom: '2px' }}>
                  {item.status}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
