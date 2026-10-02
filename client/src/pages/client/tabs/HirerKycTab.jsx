import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText, ShieldCheck, User, XCircle } from 'lucide-react';

const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow'
];

const VERHOEFF_D = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const VERHOEFF_P = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];

function isValidAadhaar(value) {
  if (!/^[2-9]\d{11}$/.test(value)) return false;
  const reversed = value.split('').reverse().map(Number);
  let checksum = 0;
  for (let index = 0; index < reversed.length; index += 1) {
    checksum = VERHOEFF_D[checksum][VERHOEFF_P[index % 8][reversed[index]]];
  }
  return checksum === 0;
}

function isValidPAN(value) {
  return /^[A-Z]{5}\d{4}[A-Z]$/.test(value);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

const DOCUMENTS = [
  { key: 'idFrontDoc', nameKey: 'idFrontName', label: 'Aadhaar front', required: true },
  { key: 'idBackDoc', nameKey: 'idBackName', label: 'Aadhaar back' },
  { key: 'panDoc', nameKey: 'panFileName', label: 'PAN card', required: true },
  { key: 'selfieDoc', nameKey: 'selfieFileName', label: 'Selfie with ID', required: true }
];

export default function HirerKycTab({ client, onSubmitKYC, showToast }) {
  const documents = client?.kycDocuments || {};
  const status = client?.kycStatus || 'not_submitted';
  const verified = status === 'verified';
  const underReview = status === 'pending' || status === 'under_review';
  const rejected = status === 'rejected';
  const locked = verified || underReview;
  const rejectionReason = client?.kycRejectionReason || documents.rejectionReason || documents.reviewNotes || '';

  const [holderName, setHolderName] = useState(documents.holderName || client?.name || '');
  const [name, setName] = useState(client?.name || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [city, setCity] = useState(client?.city || '');
  const [dob, setDob] = useState(client?.dob || '');
  const [idNumber, setIdNumber] = useState(documents.idNumber || '');
  const [panNumber, setPanNumber] = useState(documents.panNumber || '');
  const [aadhaarError, setAadhaarError] = useState('');
  const [panError, setPanError] = useState('');
  const [dobError, setDobError] = useState('');
  const [aadhaarTouched, setAadhaarTouched] = useState(false);
  const [panTouched, setPanTouched] = useState(false);
  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client?.name && !name) setName(client.name);
    if (client?.phone && !phone) setPhone(client.phone);
    if (client?.email && !email) setEmail(client.email);
    if (client?.city && !city) setCity(client.city);
    if (client?.dob && !dob) setDob(client.dob);
    if (documents.holderName && !holderName) setHolderName(documents.holderName);
    if (documents.idNumber && !idNumber) setIdNumber(documents.idNumber.replace(/\D/g, '').slice(0, 12));
    if (documents.panNumber && !panNumber) setPanNumber(documents.panNumber);
  }, [client?.id, client?.name, client?.phone, client?.email, client?.city, client?.dob, documents.holderName, documents.idNumber, documents.panNumber]);

  const handleDobChange = (value) => {
    setDob(value);
    if (!value) {
      setDobError('');
      return;
    }
    const today = new Date();
    const birth = new Date(value);
    const age = today.getFullYear() - birth.getFullYear() -
      ((today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) ? 1 : 0);
    if (age < 18) {
      setDobError(`You must be at least 18 years old. Current age: ${age} year${age === 1 ? '' : 's'}.`);
    } else {
      setDobError('');
    }
  };

  const handleAadhaarChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    setIdNumber(digits);
    setAadhaarTouched(true);
    if (digits.length === 0) {
      setAadhaarError('Aadhaar number is required (12 digits).');
    } else if (digits.length < 12) {
      setAadhaarError(`Aadhaar number must be 12 digits (${digits.length}/12 entered).`);
    } else if (!isValidAadhaar(digits)) {
      setAadhaarError('Aadhaar checksum is invalid. Please check the number.');
    } else {
      setAadhaarError('');
    }
  };

  const handlePANChange = (value) => {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(normalized);
    setPanTouched(true);
    if (normalized.length === 0) {
      setPanError('PAN number is required (10 characters).');
    } else if (normalized.length < 10) {
      setPanError(`PAN card number must be 10 characters (${normalized.length}/10 entered).`);
    } else if (!isValidPAN(normalized)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F (5 letters · 4 digits · 1 letter).');
    } else {
      setPanError('');
    }
  };

  const handleFileChange = (docKey, file) => {
    if (!file) {
      setFiles(previous => ({ ...previous, [docKey]: null }));
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileErrors(prev => ({ ...prev, [docKey]: 'File size exceeds 5MB limit. Please choose a smaller file.' }));
      showToast('File size must be under 5MB.', 'warning');
      return;
    }
    const validExtensions = /\.(jpg|jpeg|png|webp|pdf)$/i;
    if (!validExtensions.test(file.name)) {
      setFileErrors(prev => ({ ...prev, [docKey]: 'Invalid file format. Please upload JPG, PNG, or PDF.' }));
      showToast('Only JPG, PNG, or PDF files are accepted.', 'warning');
      return;
    }
    setFileErrors(prev => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
    setFiles(previous => ({ ...previous, [docKey]: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setAadhaarTouched(true);
    setPanTouched(true);

    const cleanId = idNumber.replace(/\D/g, '');
    const cleanPan = panNumber.trim().toUpperCase();

    if (!name.trim()) {
      showToast('Enter your full name.', 'warning');
      return;
    }
    if (!phone.trim()) {
      showToast('Enter your contact phone number.', 'warning');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast('Enter a valid contact email address.', 'warning');
      return;
    }
    if (!city.trim()) {
      showToast('Enter your city.', 'warning');
      return;
    }
    if (!dob) {
      showToast('Enter your date of birth.', 'warning');
      return;
    }
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear() - (
      (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0
    );
    if (age < 18) {
      showToast('You must be at least 18 years old to register.', 'warning');
      return;
    }
    if (!holderName.trim()) {
      showToast('Enter your legal name as shown on your government ID.', 'warning');
      return;
    }
    if (cleanId.length === 0) {
      setAadhaarError('Aadhaar number is required (12 digits).');
      showToast('Enter your 12-digit Aadhaar number.', 'warning');
      return;
    }
    if (cleanId.length < 12) {
      setAadhaarError(`Aadhaar number must be 12 digits (${cleanId.length}/12 entered).`);
      showToast('Aadhaar number must be 12 digits.', 'warning');
      return;
    }
    if (!isValidAadhaar(cleanId)) {
      setAadhaarError('Aadhaar checksum is invalid. Please check the number.');
      showToast('Enter a valid 12-digit Aadhaar number.', 'warning');
      return;
    }
    if (cleanPan.length === 0) {
      setPanError('PAN number is required (10 characters).');
      showToast('Enter your 10-character PAN number.', 'warning');
      return;
    }
    if (cleanPan.length < 10) {
      setPanError(`PAN card number must be 10 characters (${cleanPan.length}/10 entered).`);
      showToast('PAN card number must be 10 characters.', 'warning');
      return;
    }
    if (!isValidPAN(cleanPan)) {
      setPanError('Invalid PAN format. Expected: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).');
      showToast('Enter a valid PAN number (for example, ABCDE1234F).', 'warning');
      return;
    }

    const missingDocErrors = {};
    let hasMissingRequiredDoc = false;
    for (const document of DOCUMENTS.filter(item => item.required)) {
      if (!files[document.key] && !documents[document.key]) {
        missingDocErrors[document.key] = `Document not loaded. ${document.label} is required.`;
        hasMissingRequiredDoc = true;
      }
    }
    if (hasMissingRequiredDoc) {
      setFileErrors(prev => ({ ...prev, ...missingDocErrors }));
      showToast('Please upload all required KYC documents.', 'warning');
      return;
    }

    if (!agreed && !rejected) {
      showToast('Confirm that the submitted information is accurate.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const uploadedDocuments = await Promise.all(
        DOCUMENTS.map(async document => {
          const file = files[document.key];
          try {
            return {
              [document.key]: file ? await fileToDataUrl(file) : documents[document.key] || null,
              [document.nameKey]: file ? file.name : documents[document.nameKey] || null
            };
          } catch (readErr) {
            setFileErrors(prev => ({ ...prev, [document.key]: `Failed to load document: ${readErr.message}` }));
            throw readErr;
          }
        })
      );
      await onSubmitKYC({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        dob,
        holderName: holderName.trim(),
        idType: 'Aadhaar Card',
        idNumber: cleanId,
        panNumber: cleanPan,
        ...Object.assign({}, ...uploadedDocuments)
      });
      showToast('Verification documents submitted for admin review.');
    } catch (error) {
      console.error('Failed to submit hirer KYC:', error);
      showToast(error.message || 'Could not submit verification. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const statusMessage = verified
    ? 'Your identity has been verified.'
    : underReview
      ? 'Your documents are being reviewed by our compliance team.'
      : rejected
        ? 'Your verification was rejected. Update the information or documents and submit again.'
        : 'Complete your profile and verify your identity to open all hirer panel features.';
  const steps = [
    { label: 'Not Submitted', active: status === 'not_submitted', done: false },
    { label: 'Under Review', active: underReview, done: verified },
    { label: 'Verified', active: verified, done: verified },
    { label: 'Rejected', active: rejected, done: false, danger: rejected }
  ];

  return (
    <div>
      <header style={{ marginBottom: 22 }}>
        <h2 style={{ color: '#fff', fontSize: '1.55rem', fontWeight: 800, margin: 0 }}>
          Verification / KYC
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '6px 0 0' }}>
          Submit your identity details and documents for secure account verification.
        </p>
      </header>

      <section className="client-panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <ShieldCheck size={20} color={verified ? '#34d399' : rejected ? '#f87171' : '#fbbf24'} />
          <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem' }}>Verification &amp; Approval Status</h3>
          <span className={`client-badge ${verified ? 'client-badge-emerald' : rejected ? 'client-badge-rose' : 'client-badge-amber'}`}>
            {status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="hirer-kyc-steps">
          {steps.map((step, index) => (
            <div key={step.label} className="hirer-kyc-step">
              <span className={`hirer-kyc-step-icon${step.done ? ' done' : ''}${step.active ? ' active' : ''}${step.danger ? ' danger' : ''}`}>
                {step.done ? '✓' : step.danger ? '×' : index + 1}
              </span>
              <span className={`hirer-kyc-step-label${step.done ? ' done' : ''}${step.active ? ' active' : ''}${step.danger ? ' danger' : ''}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && <span className={`hirer-kyc-step-line${step.done ? ' done' : ''}`} />}
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 10,
          background: verified ? 'rgba(16,185,129,.1)' : rejected ? 'rgba(239,68,68,.1)' : underReview ? 'rgba(245,158,11,.1)' : 'rgba(56,189,248,.1)',
          color: '#e2e8f0'
        }}>
          {verified ? <CheckCircle2 color="#34d399" /> : underReview ? <Clock color="#fbbf24" /> : rejected ? <XCircle color="#f87171" /> : <AlertTriangle color="#38bdf8" />}
          <div>
            <strong>{statusMessage}</strong>
            {rejected && rejectionReason && <p style={{ color: '#fca5a5', margin: '8px 0 0' }}>Review note: {rejectionReason}</p>}
          </div>
        </div>
      </section>

      {underReview && (
        <section className="client-panel" style={{ textAlign: 'center', padding: '32px 20px', marginBottom: 20 }}>
          <Clock size={40} color="#fbbf24" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: '#fbbf24', margin: '0 0 8px' }}>Application Locked for Administrative Review</h3>
          <p style={{ color: '#94a3b8', fontSize: '.9rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Your profile and identity documents are being reviewed. Other hirer panel features will unlock after approval.
          </p>
        </section>
      )}

      {(underReview || verified) && (
        <section className="client-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ color: '#fff', margin: '0 0 12px', fontSize: '1.05rem' }}>Submitted profile and documents</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14, color: '#cbd5e1', fontSize: '.84rem' }}>
            <div>Name: {client?.name || '—'}</div>
            <div>Phone: {client?.phone || '—'}</div>
            <div>Email: {client?.email || '—'}</div>
            <div>City: {client?.city || '—'}</div>
            <div>Legal name: {documents.holderName || '—'}</div>
            <div>Aadhaar: {documents.idNumber || '—'}</div>
            <div>PAN: {documents.panNumber || '—'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {DOCUMENTS.filter(document => documents[document.key]).map(document => (
              <a
                key={document.key}
                href={documents[document.key]}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cbd5e1', textDecoration: 'none', padding: 12, borderRadius: 8, background: 'rgba(255,255,255,.04)' }}
              >
                <FileText size={17} color="#38bdf8" />
                <span>{document.label}: {documents[document.nameKey] || 'View document'}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {!locked && (
        <form className="hirer-kyc-form" onSubmit={handleSubmit}>
          <section className="client-panel">
            <div className="client-panel-title" style={{ marginBottom: 18 }}>
              <User size={18} color="#38bdf8" />
              <span>Step 1: Hirer Profile Information</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Full name
                <input className="hirer-kyc-input" value={name} onChange={event => setName(event.target.value)} disabled={submitting} autoComplete="name" required />
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Contact phone
                <input className="hirer-kyc-input" type="tel" value={phone} onChange={event => setPhone(event.target.value)} disabled={submitting} autoComplete="tel" required />
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Email address
                <input className="hirer-kyc-input" type="email" value={email} readOnly disabled={submitting} autoComplete="email" required />
                <span style={{ display: 'block', color: '#64748b', fontSize: '.72rem', marginTop: 5 }}>Registered account email.</span>
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                City
                <select
                  className="hirer-kyc-input"
                  value={city}
                  onChange={event => setCity(event.target.value)}
                  disabled={submitting}
                  required
                  style={{ cursor: submitting ? 'wait' : 'pointer' }}
                >
                  <option value="">— Select city —</option>
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Date of birth *
                <input
                  className="hirer-kyc-input"
                  type="date"
                  value={dob}
                  onChange={event => handleDobChange(event.target.value)}
                  max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); })()}
                  min="1900-01-01"
                  disabled={submitting}
                  required
                  style={{ borderColor: dobError ? '#f87171' : dob && !dobError ? '#34d399' : undefined }}
                />
                {dobError
                  ? <span className="hirer-kyc-error" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>⚠ {dobError}</span>
                  : dob
                    ? <span style={{ display: 'block', color: '#34d399', fontSize: '.72rem', marginTop: 5 }}>✓ Age verified — 18+ confirmed.</span>
                    : <span style={{ display: 'block', color: '#64748b', fontSize: '.72rem', marginTop: 5 }}>Must be at least 18 years old.</span>
                }
              </label>
            </div>
          </section>

          {/* Step 2: Identity Verification / KYC — Redesigned */}
          <section style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(124,58,237,0.08) 100%)',
            border: '1px solid rgba(52,211,153,0.18)',
            borderRadius: 18,
            padding: '28px 24px',
            marginBottom: 0,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 160, height: 160,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.12), transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
              }}>
                <ShieldCheck size={20} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>Step 2: Identity Verification / KYC</span>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)',
                    letterSpacing: '0.04em'
                  }}>GOVT ID REQUIRED</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '2px 0 0' }}>
                  Upload your Aadhaar, PAN, and a selfie with ID for identity verification.
                </p>
              </div>
            </div>

            {/* Info Banner */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
              borderRadius: 10, background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.15)',
              marginTop: 18, marginBottom: 24
            }}>
              <span style={{ fontSize: '1rem', marginTop: 1 }}>🔒</span>
              <span style={{ color: '#7dd3fc', fontSize: '0.8rem', lineHeight: 1.6 }}>
                Your documents are encrypted and stored securely. They are only accessed by verified compliance staff.
                Aadhaar front, PAN card, and selfie with ID are <strong>required</strong>. Aadhaar back is optional.
              </span>
            </div>

            {/* ID Details Grid */}
            <div style={{
              background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)', marginBottom: 22
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                <div style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg,#34d399,#10b981)' }} />
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.03em' }}>Government ID Details</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Legal Name on ID
                  </label>
                  <input
                    className="hirer-kyc-input"
                    placeholder="As printed on Aadhaar / PAN"
                    value={holderName}
                    onChange={event => setHolderName(event.target.value)}
                    disabled={submitting}
                    autoComplete="name"
                    required
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
                {/* ── Aadhaar Number ── */}
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    Aadhaar Number
                  </label>
                  <input
                    className="hirer-kyc-input"
                    placeholder="12-digit Aadhaar"
                    value={idNumber}
                    onChange={event => handleAadhaarChange(event.target.value)}
                    disabled={submitting}
                    inputMode="numeric"
                    maxLength={12}
                    required
                    aria-invalid={Boolean(aadhaarError)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderColor: aadhaarError ? '#f87171' : (idNumber.length === 12 && !aadhaarError) ? '#34d399' : undefined,
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {/* Progress bar while typing */}
                  {aadhaarTouched && idNumber.length > 0 && idNumber.length < 12 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600 }}>⌨ Incomplete Aadhaar</span>
                        <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 700 }}>{idNumber.length} / 12 digits</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, transition: 'width 0.2s', width: `${(idNumber.length / 12) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                      </div>
                    </div>
                  )}
                  {/* Full bar on complete */}
                  {idNumber.length === 12 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '100%', borderRadius: 4, background: aadhaarError ? '#f87171' : 'linear-gradient(90deg, #10b981, #34d399)', transition: 'background 0.3s' }} />
                      </div>
                    </div>
                  )}
                  {/* Error message */}
                  {aadhaarError && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: '#f87171', fontSize: '0.73rem', fontWeight: 700, background: 'rgba(248,113,113,0.08)', padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.2)' }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0 }} /> {aadhaarError}
                    </span>
                  )}
                  {/* Success message */}
                  {idNumber.length === 12 && !aadhaarError && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: '#34d399', fontSize: '0.73rem', fontWeight: 700, background: 'rgba(52,211,153,0.08)', padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(52,211,153,0.2)' }}>
                      ✓ Valid Aadhaar — checksum verified
                    </span>
                  )}
                </div>

                {/* ── PAN Number ── */}
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                    PAN Number
                  </label>
                  <input
                    className="hirer-kyc-input"
                    placeholder="e.g. ABCDE1234F"
                    value={panNumber}
                    onChange={event => handlePANChange(event.target.value)}
                    disabled={submitting}
                    maxLength={10}
                    required
                    aria-invalid={Boolean(panError)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      fontFamily: 'monospace', letterSpacing: '0.12em', fontSize: '1rem',
                      borderColor: panError ? '#f87171' : (panNumber.length === 10 && !panError) ? '#34d399' : undefined,
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {/* Progress bar while typing */}
                  {panTouched && panNumber.length > 0 && panNumber.length < 10 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600 }}>⌨ Incomplete PAN</span>
                        <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 700 }}>{panNumber.length} / 10 characters</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 4, transition: 'width 0.2s', width: `${(panNumber.length / 10) * 100}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                      </div>
                    </div>
                  )}
                  {/* PAN format segment breakdown */}
                  {panNumber.length > 0 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 5 }}>
                        {[0,1,2,3,4].map(i => (
                          <div key={i} style={{
                            width: 18, height: 18, borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)') : 'rgba(255,255,255,0.06)',
                            color: panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? '#34d399' : '#f87171') : '#475569',
                            border: `1px solid ${panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(255,255,255,0.08)'}`
                          }}>{panNumber[i] || 'A'}</div>
                        ))}
                        <span style={{ color: '#475569', fontSize: '0.62rem', margin: '0 2px' }}>·</span>
                        {[5,6,7,8].map(i => (
                          <div key={i} style={{
                            width: 18, height: 18, borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: panNumber[i] ? (/[0-9]/.test(panNumber[i]) ? 'rgba(56,189,248,0.2)' : 'rgba(248,113,113,0.2)') : 'rgba(255,255,255,0.06)',
                            color: panNumber[i] ? (/[0-9]/.test(panNumber[i]) ? '#38bdf8' : '#f87171') : '#475569',
                            border: `1px solid ${panNumber[i] ? (/[0-9]/.test(panNumber[i]) ? 'rgba(56,189,248,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(255,255,255,0.08)'}`
                          }}>{panNumber[i] || '0'}</div>
                        ))}
                        <span style={{ color: '#475569', fontSize: '0.62rem', margin: '0 2px' }}>·</span>
                        {[9].map(i => (
                          <div key={i} style={{
                            width: 18, height: 18, borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)') : 'rgba(255,255,255,0.06)',
                            color: panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? '#34d399' : '#f87171') : '#475569',
                            border: `1px solid ${panNumber[i] ? (/[A-Z]/.test(panNumber[i]) ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(255,255,255,0.08)'}`
                          }}>{panNumber[i] || 'A'}</div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 4, fontSize: '0.62rem', color: '#475569' }}>
                        <span style={{ width: 100 }}>5 letters</span>
                        <span style={{ width: 76 }}>4 digits</span>
                        <span>1 letter</span>
                      </div>
                    </div>
                  )}
                  {/* Error message */}
                  {panError && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: '#f87171', fontSize: '0.73rem', fontWeight: 700, background: 'rgba(248,113,113,0.08)', padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(248,113,113,0.2)' }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0 }} /> {panError}
                    </span>
                  )}
                  {/* Success message */}
                  {panNumber.length === 10 && !panError && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, color: '#34d399', fontSize: '0.73rem', fontWeight: 700, background: 'rgba(52,211,153,0.08)', padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(52,211,153,0.2)' }}>
                      ✓ Valid PAN — format verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Cards */}
            <div style={{
              background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)', marginBottom: 22
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
                <div style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg,#7c3aed,#a855f7)' }} />
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.03em' }}>Document Uploads</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                {DOCUMENTS.map(document => {
                  const hasNew = Boolean(files[document.key]);
                  const hasPrev = !hasNew && Boolean(documents[document.key]);
                  const isLoaded = hasNew || hasPrev;
                  const docError = fileErrors[document.key] || (submitAttempted && document.required && !isLoaded ? `Document not loaded. ${document.label} is required.` : '');
                  const hasError = Boolean(docError);
                  const docIcons = { idFrontDoc: '🪪', idBackDoc: '🔄', panDoc: '💳', selfieDoc: '🤳' };
                  return (
                    <div key={document.key} style={{
                      borderRadius: 12,
                      border: `1.5px dashed ${hasError ? '#f87171' : hasNew ? '#34d399' : hasPrev ? '#38bdf8' : 'rgba(255,255,255,0.12)'}`,
                      background: hasError ? 'rgba(248,113,113,0.06)' : hasNew ? 'rgba(52,211,153,0.05)' : hasPrev ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.02)',
                      padding: '16px 14px',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: '1.3rem' }}>{docIcons[document.key]}</span>
                        <div>
                          <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.82rem' }}>
                            {document.label}
                            {document.required && <span style={{ color: '#f87171', marginLeft: 4 }}>*</span>}
                          </div>
                          <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                            {document.required ? 'Required' : 'Optional'}
                          </div>
                        </div>
                        {hasError ? (
                          <span style={{
                            marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                            borderRadius: 20, background: 'rgba(248,113,113,0.15)',
                            color: '#f87171', border: '1px solid rgba(248,113,113,0.3)'
                          }}>
                            ⚠ NOT LOADED
                          </span>
                        ) : (hasNew || hasPrev) ? (
                          <span style={{
                            marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px',
                            borderRadius: 20, background: hasNew ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)',
                            color: hasNew ? '#34d399' : '#38bdf8', border: `1px solid ${hasNew ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`
                          }}>
                            {hasNew ? '✓ NEW' : '✓ ON FILE'}
                          </span>
                        ) : null}
                      </div>
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '8px 12px', borderRadius: 8,
                          background: hasError ? 'rgba(248,113,113,0.12)' : 'rgba(124,58,237,0.12)',
                          border: `1px solid ${hasError ? 'rgba(248,113,113,0.3)' : 'rgba(124,58,237,0.25)'}`,
                          color: hasError ? '#f87171' : '#a78bfa', fontSize: '0.78rem', fontWeight: 600,
                          transition: 'all 0.15s'
                        }}>
                          📎 {hasNew ? 'Change file' : hasPrev ? 'Replace file' : 'Upload file'}
                        </div>
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          accept="image/*,application/pdf"
                          disabled={submitting}
                          onChange={event => handleFileChange(document.key, event.target.files?.[0] || null)}
                        />
                      </label>
                      {hasNew && (
                        <div style={{ marginTop: 8, color: '#94a3b8', fontSize: '0.72rem', wordBreak: 'break-all' }}>
                          📄 {files[document.key].name}
                        </div>
                      )}
                      {docError && (
                        <div style={{
                          marginTop: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          color: '#f87171',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: 'rgba(248,113,113,0.08)',
                          padding: '5px 8px',
                          borderRadius: 6,
                          border: '1px solid rgba(248,113,113,0.2)'
                        }}>
                          <AlertTriangle size={12} style={{ flexShrink: 0 }} />
                          <span>{docError}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ color: '#475569', fontSize: '0.72rem', margin: '14px 0 0' }}>
                Accepted formats: JPG, PNG, PDF. Max 5MB per file.
              </p>
            </div>

            {/* Consent + Submit */}
            {!rejected && (
              <label style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px',
                borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1', fontSize: '0.84rem', cursor: 'pointer', marginBottom: 20
              }}>
                <input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} disabled={submitting} style={{ marginTop: 2, accentColor: '#34d399' }} />
                <span>I confirm that all submitted details and documents are accurate, genuine, and belong to me. I understand that false information may result in permanent account suspension.</span>
              </label>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', padding: '14px 20px', border: 0, borderRadius: 12, color: '#fff',
                background: submitting ? 'rgba(100,116,139,0.5)' : 'linear-gradient(135deg, #ec4899 0%, #7c3aed 50%, #10b981 100%)',
                backgroundSize: '200% auto',
                fontWeight: 800, fontSize: '0.95rem', cursor: submitting ? 'wait' : 'pointer',
                letterSpacing: '0.03em', boxShadow: submitting ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              {submitting ? (
                <>⏳ Submitting…</>
              ) : rejected ? (
                <>🔄 Re-submit Profile &amp; KYC</>
              ) : (
                <><ShieldCheck size={17} /> Submit for Verification</>
              )}
            </button>
          </section>
        </form>
      )}
    </div>
  );
}
