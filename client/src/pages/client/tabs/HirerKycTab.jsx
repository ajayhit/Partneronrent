import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText, ShieldCheck, User, XCircle } from 'lucide-react';

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
  const [files, setFiles] = useState({});
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

  const handleAadhaarChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    setIdNumber(digits);
    setAadhaarError(digits.length === 12 && !isValidAadhaar(digits)
      ? 'Aadhaar checksum is invalid. Check the number and try again.'
      : '');
  };

  const handlePANChange = (value) => {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(normalized);
    setPanError(normalized.length === 10 && !isValidPAN(normalized)
      ? 'Invalid PAN format. Expected format: ABCDE1234F.'
      : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    if (!holderName.trim()) {
      showToast('Enter your legal name as shown on your government ID.', 'warning');
      return;
    }
    if (!isValidAadhaar(cleanId)) {
      showToast('Enter a valid 12-digit Aadhaar number.', 'warning');
      return;
    }
    if (!isValidPAN(cleanPan)) {
      showToast('Enter a valid PAN number (for example, ABCDE1234F).', 'warning');
      return;
    }
    for (const document of DOCUMENTS.filter(item => item.required)) {
      if (!files[document.key] && !documents[document.key]) {
        showToast(`Upload your ${document.label}.`, 'warning');
        return;
      }
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
          return {
            [document.key]: file ? await fileToDataUrl(file) : documents[document.key] || null,
            [document.nameKey]: file ? file.name : documents[document.nameKey] || null
          };
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
                <input className="hirer-kyc-input" value={city} onChange={event => setCity(event.target.value)} disabled={submitting} autoComplete="address-level2" required />
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Date of birth
                <input className="hirer-kyc-input" type="date" value={dob} onChange={event => setDob(event.target.value)} max={new Date().toISOString().slice(0, 10)} disabled={submitting} />
              </label>
            </div>
          </section>

          <section className="client-panel">
            <div className="client-panel-title" style={{ marginBottom: 8 }}>
              <ShieldCheck size={18} color="#34d399" />
              <span>Step 2: Identity Verification / KYC</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '0 0 18px' }}>
              Aadhaar front, PAN card, and a selfie holding your ID are required. Aadhaar back is optional.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Legal name on ID
                <input className="hirer-kyc-input" value={holderName} onChange={event => setHolderName(event.target.value)} disabled={submitting} autoComplete="name" required />
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Aadhaar number
                <input className="hirer-kyc-input" value={idNumber} onChange={event => handleAadhaarChange(event.target.value)} disabled={submitting} inputMode="numeric" maxLength={12} required aria-invalid={Boolean(aadhaarError)} />
                {aadhaarError && <span className="hirer-kyc-error">{aadhaarError}</span>}
              </label>
              <label style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                PAN number
                <input className="hirer-kyc-input" value={panNumber} onChange={event => handlePANChange(event.target.value)} disabled={submitting} maxLength={10} required aria-invalid={Boolean(panError)} />
                {panError && <span className="hirer-kyc-error">{panError}</span>}
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 18 }}>
              {DOCUMENTS.map(document => (
                <label key={document.key} style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                  {document.label}{document.required ? ' *' : ''}
                  <input
                    type="file"
                    className="hirer-kyc-input hirer-kyc-file"
                    accept="image/*,application/pdf"
                    disabled={submitting}
                    onChange={event => setFiles(previous => ({ ...previous, [document.key]: event.target.files?.[0] || null }))}
                    required={document.required && !documents[document.key]}
                  />
                  {files[document.key] && <span style={{ display: 'block', color: '#94a3b8', marginTop: 5 }}>{files[document.key].name}</span>}
                  {!files[document.key] && documents[document.key] && <span style={{ display: 'block', color: '#34d399', marginTop: 5 }}>Previously submitted document available</span>}
                </label>
              ))}
            </div>

            {!rejected && (
              <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', color: '#cbd5e1', fontSize: '0.84rem', marginTop: 20 }}>
                <input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} disabled={submitting} />
                I confirm these details and documents are accurate and belong to me.
              </label>
            )}

            <button type="submit" disabled={submitting} style={{
              marginTop: 20, padding: '11px 18px', border: 0, borderRadius: 9, color: '#fff',
              background: submitting ? '#64748b' : 'linear-gradient(135deg, #ec4899, #7c3aed)',
              fontWeight: 700, cursor: submitting ? 'wait' : 'pointer'
            }}>
              {submitting ? 'Submitting…' : rejected ? 'Re-submit Profile & KYC' : 'Submit Profile & KYC for Verification'}
            </button>
          </section>
        </form>
      )}
    </div>
  );
}
