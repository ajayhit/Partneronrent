import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck, Clock, AlertTriangle, FileText,
  Upload, CheckCircle2, XCircle, Camera,
  CreditCard, History, Paperclip, Trash2, Lock,
  Eye, X, Download, User, Phone, Mail,
  AlertOctagon, Check
} from 'lucide-react';

// ── Aadhaar Verhoeff Validation ───────────────────────────────────────────
const _d = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const _p = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];

function validateAadhaar(num) {
  const digits = String(num || '').replace(/\s|-/g, '');
  if (!/^\d{12}$/.test(digits)) return false;
  if (digits[0] === '0' || digits[0] === '1') return false;
  let c = 0;
  const rev = digits.split('').reverse().map(Number);
  for (let i = 0; i < rev.length; i++) c = _d[c][_p[i % 8][rev[i]]];
  return c === 0;
}

// ── PAN Format Validation ─────────────────────────────────────────────────
function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
}

// ── Helper to convert File to Data URL ────────────────────────────────────
function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) { resolve(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Chandigarh'
];

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
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: doc.type === 'pan' ? 'rgba(251,191,36,0.15)' : doc.type === 'selfie' ? 'rgba(192,132,252,0.15)' : 'rgba(56,189,248,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: doc.type === 'pan' ? '#fbbf24' : doc.type === 'selfie' ? '#c084fc' : '#38bdf8'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>{doc.title}</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {doc.fileName || (isPDF ? 'Uploaded PDF Document' : 'Uploaded Image Document')}
              </div>
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

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {isImage ? (
            <div style={{
              borderRadius: '12px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#020617', display: 'flex',
              justifyContent: 'center', alignItems: 'center',
              padding: '16px', minHeight: '260px'
            }}>
              <img
                src={doc.url}
                alt={doc.title}
                style={{
                  maxWidth: '100%', maxHeight: '62vh',
                  objectFit: 'contain', display: 'block',
                  borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
                onError={e => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#64748b', padding: '40px' }}>
                <FileText size={40} />
                <span style={{ fontSize: '0.85rem' }}>Unable to render image preview</span>
              </div>
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
                    {doc.fileName || 'Uploaded PDF Document'}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '16px' }}>
                    Inline PDF rendering is limited by the browser. You can download and open the original PDF below.
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
                {doc.fileName ? `File: ${doc.fileName} — submitted successfully` : 'Document submitted securely'}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px',
          background: 'rgba(255,255,255,0.02)', flexShrink: 0
        }}>
          {(isImage || isPDF) && (
            <a
              href={doc.url}
              download={doc.fileName || (isPDF ? `${doc.type || 'document'}.pdf` : `${doc.type || 'document'}.jpg`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none'
              }}
            >
              <Download size={14} /> Download Document
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

// ── File Upload Box Component ─────────────────────────────────────────────
function FileUploadBox({ label, color, accept, file, onChange, onRemove, onPreview, disabled, error }) {
  const inputRef = useRef();
  return (
    <div>
      <div
        style={{
          border: `1.5px dashed ${error ? '#ef4444' : file ? color : disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '8px', padding: '12px', textAlign: 'center',
          background: error ? 'rgba(239,68,68,0.06)' : file ? 'rgba(16,185,129,0.07)' : 'rgba(15,23,42,0.4)',
          cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          opacity: disabled ? 0.6 : 1
        }}
        onClick={() => !file && !disabled && inputRef.current.click()}
      >
        <input
          ref={inputRef} type="file" accept={accept || 'image/*,.pdf'}
          style={{ display: 'none' }} disabled={disabled}
          onChange={e => { if (e.target.files[0]) onChange(e.target.files[0]); e.target.value = ''; }}
        />
        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Paperclip size={15} color={color} />
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, wordBreak: 'break-all' }}>{file.name}</span>
            {onPreview && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onPreview(); }}
                title="Preview document"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#38bdf8' }}
              >
                <Eye size={15} />
              </button>
            )}
            {!disabled && (
              <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#f87171' }}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ) : (
          <>
            <Upload size={18} color={error ? '#f87171' : disabled ? '#475569' : color} style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.8rem', color: error ? '#f87171' : disabled ? '#475569' : '#fff', fontWeight: 600 }}>{label}</div>
            {!disabled && <div style={{ fontSize: '0.72rem', color: error ? '#fca5a5' : '#94a3b8', marginTop: '2px' }}>Click to browse (JPG, PNG, PDF)</div>}
          </>
        )}
      </div>
      {error && (
        <div style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <AlertTriangle size={13} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// ── Submitted Summary Report (Joined Profile & KYC) ────────────────────────
function SubmittedReport({ client, data, status }) {
  const [previewDoc, setPreviewDoc] = useState(null);

  const badge = status === 'verified'
    ? { label: 'Verified', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
    : status === 'rejected'
    ? { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' }
    : { label: 'Under Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.86rem', color: '#e2e8f0', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
    </div>
  );

  const DocRow = ({ label, fileName, docUrl, docType, docTitle }) => {
    const hasDoc = Boolean(fileName || docUrl || data.idNumber);
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.84rem', color: hasDoc ? '#34d399' : '#64748b', fontWeight: 600 }}>
            {fileName ? `✓ ${fileName}` : hasDoc ? '✓ Uploaded' : '— Not provided'}
          </span>
          {hasDoc && (
            <button
              type="button"
              onClick={() => {
                const isPdfUrl = docUrl && (docUrl.startsWith('data:application/pdf') || docUrl.includes('application/pdf'));
                setPreviewDoc({
                  title: docTitle || label,
                  type: docType,
                  url: docUrl,
                  fileName: fileName || `${label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${isPdfUrl ? 'pdf' : 'jpg'}`,
                  status
                });
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 11px', borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Eye size={13} /> View
            </button>
          )}
        </div>
      </div>
    );
  };

  const maskedAadhaar = data.idNumber
    ? data.idNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3')
    : '—';

  return (
    <div className="client-panel" style={{ marginBottom: '24px' }}>
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="client-panel-title" style={{ margin: 0 }}>
          <FileText size={18} color="#38bdf8" />
          <span>Submitted Hirer Profile &amp; KYC Application Dossier</span>
        </div>
        <span style={{
          fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px',
          borderRadius: '20px', background: badge.bg, color: badge.color,
          border: `1px solid ${badge.color}`
        }}>
          {badge.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Profile Summary Column */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} /> Hirer Profile Details
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <img
              src={client?.avatar || '/default-avatar.jpg'}
              alt={client?.name || 'Avatar'}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
              onError={e => { e.target.src = '/default-avatar.jpg'; }}
            />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{client?.name || '—'}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hirer Account • {client?.city || 'India'}</div>
            </div>
          </div>
          <Row label="Date of Birth" value={client?.dob || '—'} />
          <Row label="Primary City" value={client?.city} />
          <Row label="Phone" value={client?.phone} />
          <Row label="Email" value={client?.email} />
          <Row label="Legal Name on ID" value={data.holderName || client?.name} />
        </div>

        {/* KYC Docs Column */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} /> Government ID &amp; Proofs
          </div>
          <Row label="Legal Name on ID" value={data.holderName || client?.name} />
          <Row label="Aadhaar Number" value={maskedAadhaar} />
          <Row label="PAN Number" value={data.panNumber} />
          <DocRow
            label="Aadhaar Front"
            fileName={data.idFrontName}
            docUrl={data.idFrontDoc}
            docType="aadhaar"
            docTitle="Aadhaar Card (Front)"
          />
          {(data.idBackName || data.idBackDoc) && (
            <DocRow
              label="Aadhaar Back"
              fileName={data.idBackName}
              docUrl={data.idBackDoc}
              docType="aadhaar"
              docTitle="Aadhaar Card (Back)"
            />
          )}
          <DocRow
            label="PAN Card Photo"
            fileName={data.panFileName}
            docUrl={data.panDoc}
            docType="pan"
            docTitle="PAN Card Photo"
          />
          <DocRow
            label="Selfie with ID"
            fileName={data.selfieFileName}
            docUrl={data.selfieDoc}
            docType="selfie"
            docTitle="Selfie with ID / Aadhaar"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main HirerKycTab Component ─────────────────────────────────────────────
export default function HirerKycTab({ client, onSubmitKYC, showToast }) {
  const currentStatus  = client?.kycStatus || 'not_submitted';
  const isVerified     = currentStatus === 'verified';
  const isUnderReview  = currentStatus === 'under_review' || currentStatus === 'pending';
  const isRejected     = currentStatus === 'rejected';
  const isLocked       = isVerified || isUnderReview;

  const kd = client?.kycDocuments || {};

  // Rejection Reason from admin (stored on client object or inside kycDocuments)
  const rejectionReason = client?.kycRejectionReason || kd?.rejectionReason || kd?.reviewNotes || '';

  // ── Profile Fields State ─────────────────────────────────────────────────
  const [name, setName]               = useState(client?.name || '');
  const [dob, setDob]                 = useState(client?.dob || '');
  const [age, setAge]                 = useState('');
  const [gender, setGender]           = useState(client?.gender || 'Prefer not to say');
  const [city, setCity]               = useState(client?.city || 'Delhi NCR');
  const [phone, setPhone]             = useState(client?.phone || '');
  const [email, setEmail]             = useState(client?.email || '');
  const [avatar, setAvatar]           = useState(client?.avatar || '/default-avatar.jpg');
  const [avatarFile, setAvatarFile]   = useState(null);

  // ── KYC Document Fields State ────────────────────────────────────────────
  const [holderName, setHolderName]   = useState(kd.holderName || client?.name || '');
  const [idNumber, setIdNumber]       = useState(kd.idNumber?.replace(/\D/g, '').slice(0, 12) || '');
  const [panNumber, setPanNumber]     = useState(kd.panNumber || '');
  const [aadhaarError, setAadhaarError] = useState('');
  const [panError, setPanError]       = useState('');
  const [dobError, setDobError]       = useState('');
  const [docErrors, setDocErrors]     = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile]   = useState(null);
  const [panFile, setPanFile]         = useState(null);
  const [selfieFile, setSelfieFile]   = useState(null);
  const [agreed, setAgreed]           = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formPreviewDoc, setFormPreviewDoc] = useState(null);

  // Calculate age helper
  const calculateAgeFromDob = (dobVal) => {
    if (!dobVal) return '';
    const birth = new Date(dobVal);
    const today = new Date();
    let calculated = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) calculated--;
    return calculated >= 0 ? String(calculated) : '';
  };

  // Keep state in sync if client data updates from parent
  useEffect(() => {
    if (client) {
      if (client.name && !name) setName(client.name);
      if (client.phone && !phone) setPhone(client.phone);
      if (client.email && !email) setEmail(client.email);
      if (client.city && !city) setCity(client.city);
      if (client.dob) {
        if (!dob) setDob(client.dob);
        const calculated = calculateAgeFromDob(client.dob);
        setAge(calculated);
      }
      if (client.avatar && (!avatar || avatar === '/default-avatar.jpg')) setAvatar(client.avatar);
      if (kd.holderName && !holderName) setHolderName(kd.holderName);
      if (kd.idNumber && !idNumber) setIdNumber(kd.idNumber.replace(/\D/g, '').slice(0, 12));
      if (kd.panNumber && !panNumber) setPanNumber(kd.panNumber);
    }
  }, [client?.id]);

  const handleDobChange = (newDob) => {
    setDob(newDob);
    if (!newDob) {
      setAge('');
      setDobError('');
      return;
    }
    const calculated = calculateAgeFromDob(newDob);
    setAge(calculated);
    if (Number(calculated) < 18) {
      setDobError(`You must be at least 18 years old. Current age: ${calculated || 0} years.`);
    } else {
      setDobError('');
    }
  };

  const handleAadhaarChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setIdNumber(digits);
    if (digits.length === 0) {
      setAadhaarError('Aadhaar number is required (12 digits).');
    } else if (digits.length < 12) {
      setAadhaarError(`Aadhaar number must be 12 digits (${digits.length}/12 entered).`);
    } else if (!validateAadhaar(digits)) {
      setAadhaarError('Aadhaar checksum is invalid. Please check digits.');
    } else {
      setAadhaarError('');
    }
  };

  const handlePANChange = (val) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(upper);
    if (upper.length === 0) {
      setPanError('PAN number is required (10 characters).');
    } else if (upper.length < 10) {
      setPanError(`PAN card number must be 10 characters (${upper.length}/10 entered).`);
    } else if (!validatePAN(upper)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F (5 letters · 4 digits · 1 letter).');
    } else {
      setPanError('');
    }
  };

  const handleAvatarFileChange = async (file) => {
    setAvatarFile(file);
    const dataUrl = await fileToDataUrl(file);
    if (dataUrl) setAvatar(dataUrl);
  };

  const handlePreviewFile = async (file, title, docType) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setFormPreviewDoc({
      title,
      type: docType,
      url,
      fileName: file.name,
      status: 'pending'
    });
  };

  const handleFrontDocChange = (file) => {
    setIdFrontFile(file);
    if (file) setDocErrors(prev => ({ ...prev, front: '' }));
  };

  const handlePanDocChange = (file) => {
    setPanFile(file);
    if (file) setDocErrors(prev => ({ ...prev, pan: '' }));
  };

  const handleSelfieDocChange = (file) => {
    setSelfieFile(file);
    if (file) setDocErrors(prev => ({ ...prev, selfie: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // 1. Profile Validation
    if (!name.trim())                  { showToast('Please enter your full profile name', 'warning'); return; }
    if (!dob)                          { showToast('Please enter your date of birth', 'warning'); return; }
    if (!age || Number(age) < 18)      { showToast('Hirer age must be at least 18 years', 'warning'); return; }
    if (!phone.trim())                 { showToast('Please provide your contact phone number', 'warning'); return; }
    if (!city.trim())                  { showToast('Please select your city', 'warning'); return; }

    // 2. KYC Validation
    if (!holderName.trim())            { showToast('Please enter your legal name as per government ID', 'warning'); return; }
    if (idNumber.length === 0) {
      setAadhaarError('Aadhaar number is required (12 digits).');
      showToast('Please enter your 12-digit Aadhaar number', 'warning');
      return;
    }
    if (idNumber.length < 12) {
      setAadhaarError(`Aadhaar number must be 12 digits (${idNumber.length}/12 entered).`);
      showToast('Aadhaar number must be 12 digits', 'warning');
      return;
    }
    if (!validateAadhaar(idNumber)) {
      setAadhaarError('Aadhaar checksum is invalid. Please check the digits.');
      showToast('Aadhaar checksum is invalid. Please check the digits.', 'warning');
      return;
    }
    if (panNumber.length === 0) {
      setPanError('PAN number is required (10 characters).');
      showToast('Please enter your 10-character PAN number', 'warning');
      return;
    }
    if (panNumber.length < 10) {
      setPanError(`PAN card number must be 10 characters (${panNumber.length}/10 entered).`);
      showToast('PAN card number must be 10 characters', 'warning');
      return;
    }
    if (!validatePAN(panNumber)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F (5 letters · 4 digits · 1 letter).');
      showToast('PAN format is invalid. Expected: ABCDE1234F', 'warning');
      return;
    }

    // For documents: if re-submitting after rejection, existing docs are preserved unless replaced
    const hasFront = idFrontFile || kd.idFrontDoc;
    const hasPan = panFile || kd.panDoc;
    const hasSelfie = selfieFile || kd.selfieDoc;

    const newDocErrors = {};
    if (!hasFront) newDocErrors.front = 'Document not loaded. Front of Aadhaar card is required.';
    if (!hasPan) newDocErrors.pan = 'Document not loaded. PAN card photo is required.';
    if (!hasSelfie) newDocErrors.selfie = 'Document not loaded. Selfie with ID is required.';

    if (Object.keys(newDocErrors).length > 0) {
      setDocErrors(newDocErrors);
      showToast('Please upload all required KYC documents.', 'warning');
      return;
    }

    if (!agreed && !isRejected) {
      showToast('Please confirm the accuracy declaration before submitting', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const [idFrontDoc, idBackDoc, panDoc, selfieDoc, uploadedAvatar] = await Promise.all([
        idFrontFile ? fileToDataUrl(idFrontFile) : Promise.resolve(kd.idFrontDoc),
        idBackFile  ? fileToDataUrl(idBackFile)  : Promise.resolve(kd.idBackDoc),
        panFile     ? fileToDataUrl(panFile)     : Promise.resolve(kd.panDoc),
        selfieFile  ? fileToDataUrl(selfieFile)  : Promise.resolve(kd.selfieDoc),
        avatarFile  ? fileToDataUrl(avatarFile)  : Promise.resolve(avatar),
      ]);

      const payload = {
        // Profile fields
        name: name.trim(),
        dob,
        age: Number(age),
        gender,
        city: city.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatar: uploadedAvatar || avatar || '/default-avatar.jpg',

        // KYC fields
        idType: 'Aadhaar Card',
        idNumber,
        holderName: holderName.trim(),
        panNumber,
        idFrontDoc,
        idBackDoc,
        panDoc,
        selfieDoc,
        idFrontName:   idFrontFile?.name || kd.idFrontName || 'aadhaar_front.jpg',
        idBackName:    idBackFile?.name  || kd.idBackName || null,
        panFileName:   panFile?.name     || kd.panFileName || 'pan_card.jpg',
        selfieFileName: selfieFile?.name || kd.selfieFileName || 'selfie.jpg',
      };

      await onSubmitKYC(payload);
      showToast('Hirer profile & KYC submitted successfully! Under admin review.');
    } catch (err) {
      showToast(err.message || 'Failed to submit verification. Please check network and try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { label: 'Not Submitted', active: currentStatus === 'not_submitted', done: false },
    { label: 'Under Review',  active: isUnderReview, done: isVerified },
    { label: 'Verified',      active: isVerified,    done: isVerified },
    { label: 'Rejected',      active: isRejected,    done: false, danger: isRejected },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          👤 Hirer Profile &amp; KYC Verification
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Complete your personal profile details and submit identity proof documents together.
          Our compliance administration team inspects all details before unlocking full booking access.
        </p>
      </div>

      {/* Status Tracker Panel */}
      <div className="client-panel">
        <div className="client-panel-title" style={{ marginBottom: '18px' }}>
          <ShieldCheck size={20} color={isVerified ? '#34d399' : isRejected ? '#ef4444' : '#fbbf24'} />
          <span>Verification &amp; Approval Status</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '6px 0', marginBottom: '18px' }}>
          {steps.map((st, idx) => (
            <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: st.done ? '#10b981' : st.danger ? '#ef4444' : st.active ? '#f59e0b' : 'rgba(100,116,139,0.3)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem'
              }}>
                {st.done ? '✓' : st.danger ? '✕' : idx + 1}
              </div>
              <span style={{
                fontSize: '0.86rem', fontWeight: 600,
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

        {/* ── Prominent Status Callout ── */}
        <div style={{
          background: isVerified ? 'rgba(16,185,129,0.1)' : isUnderReview ? 'rgba(245,158,11,0.1)' : isRejected ? 'rgba(239,68,68,0.12)' : 'rgba(56,189,248,0.1)',
          border: `1px solid ${isVerified ? '#10b981' : isUnderReview ? '#f59e0b' : isRejected ? '#ef4444' : '#38bdf8'}`,
          borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px'
        }}>
          {isVerified
            ? <CheckCircle2 size={32} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            : isUnderReview
            ? <Clock size={32} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            : isRejected
            ? <XCircle size={32} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            : <AlertTriangle size={32} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1.02rem', color: '#fff' }}>
              {isVerified
                ? 'Account Verified & Background Cleared'
                : isUnderReview
                ? 'Application & Documents Under Admin Review'
                : isRejected
                ? 'Verification Application Rejected by Admin'
                : 'Complete Your Profile & KYC Submission'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', lineHeight: '1.5' }}>
              {isVerified
                ? 'Congratulations! Your identity has been verified and approved by administration. You can now book companions freely across all cities.'
                : isUnderReview
                ? 'Your hirer profile details and KYC documents have been submitted to the admin compliance team for inspection. Verification typically takes 6–12 hours.'
                : isRejected
                ? 'The administration team reviewed your application and rejected it. Please review the specific rejection reason below, correct your information or document uploads, and re-submit.'
                : 'Please complete your personal details and upload valid government-issued ID proofs (Aadhaar, PAN, and selfie with ID) below to activate your account.'}
            </div>

            {/* ── PROMINENT REJECTION REASON BOX ── */}
            {isRejected && (
              <div style={{
                marginTop: '14px',
                padding: '14px 18px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <AlertOctagon size={16} color="#ef4444" />
                  Admin Rejection Reason &amp; Feedback:
                </div>
                <div style={{
                  color: '#ffffff',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  marginTop: '8px',
                  lineHeight: '1.5',
                  padding: '8px 12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: '6px',
                  borderLeft: '3px solid #ef4444'
                }}>
                  "{rejectionReason || 'Document photos were unclear or details mismatched. Please check and re-submit.'}"
                </div>
                <div style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '8px' }}>
                  ℹ️ Scroll down to the form below to update the indicated details or re-upload clear photos, then click <strong>"Re-Submit Corrected Profile &amp; KYC Application"</strong>.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submitted Report Summary — shown when under review, rejected, or verified */}
      {(isUnderReview || isVerified || isRejected) && (kd.holderName || kd.idNumber || client?.name) && (
        <SubmittedReport client={client} data={{ ...kd, holderName: kd.holderName || client?.name || '' }} status={currentStatus} />
      )}

      {/* Locked message during review */}
      {isUnderReview && (
        <div className="client-panel" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <Lock size={42} color="#f59e0b" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ color: '#fbbf24', fontWeight: 700, margin: '0 0 8px' }}>Application Locked for Administrative Inspection</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto', lineHeight: '1.6' }}>
            Your profile details and identification proofs are currently in the administrator review queue.
            You will be notified immediately once approved or if any corrections are needed.
          </p>
        </div>
      )}

      {/* ── Unified Profile & KYC Form (Active when not_submitted OR rejected) ── */}
      {!isVerified && !isUnderReview && (
        <form onSubmit={handleSubmit}>
          {/* SECTION 1: HIRER PROFILE INFORMATION */}
          <div className="client-panel">
            <div className="client-panel-title" style={{ marginBottom: '18px' }}>
              <User size={18} color="#38bdf8" />
              <span>Step 1: Hirer Profile Information</span>
            </div>

            {/* Avatar & Photo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={avatar || '/default-avatar.jpg'}
                  alt="Avatar Preview"
                  style={{
                    width: '84px', height: '84px', borderRadius: '50%',
                    objectFit: 'cover', border: '3px solid #38bdf8', flexShrink: 0
                  }}
                  onError={e => { e.target.src = '/default-avatar.jpg'; }}
                />
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Profile Photo / Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files[0] && handleAvatarFileChange(e.target.files[0])}
                    style={{ fontSize: '0.82rem', width: '100%' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                    Upload a clear profile photo (JPG or PNG).
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Full Display Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  📅 Date of Birth *
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => handleDobChange(e.target.value)}
                  max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split('T')[0]; })()}
                  min="1920-01-01"
                  disabled={isLocked}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${dobError ? '#ef4444' : dob && !dobError ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                    color: '#fff', fontSize: '0.9rem'
                  }}
                />
                {dobError ? (
                  <div style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '4px' }}>⚠ {dobError}</div>
                ) : dob ? (
                  <div style={{ fontSize: '0.74rem', color: '#34d399', marginTop: '4px' }}>✓ Age verified — 18+ confirmed</div>
                ) : null}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Age <span style={{ color: '#38bdf8', fontWeight: 400 }}>(Auto-calculated from DOB)</span>
                </label>
                <input
                  type="text"
                  value={age ? `${age} years` : ''}
                  readOnly
                  placeholder="Calculated automatically"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8', fontSize: '0.9rem', cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: '#0b1329', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Primary City *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: '#0b1329', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Contact Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#94a3b8', fontSize: '0.9rem', cursor: 'not-allowed'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Registered account email — contact support to change.</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: GOVERNMENT ID & KYC DOCUMENTS */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Step 2: Government Identity Documents (KYC)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

              {/* 1. Aadhaar Card */}
              <div className="client-panel" style={{ marginBottom: 0 }}>
                <div className="client-panel-title" style={{ marginBottom: '14px' }}>
                  <FileText size={18} color="#38bdf8" />
                  <span>1. Aadhaar Card</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Legal Name as per Aadhaar *
                    </label>
                    <input
                      type="text"
                      value={holderName}
                      onChange={e => setHolderName(e.target.value)}
                      placeholder="Enter legal name printed on ID"
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                        color: '#fff', fontSize: '0.9rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Aadhaar Number * <span style={{ color: '#64748b', fontWeight: 400 }}>(12 digits)</span>
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={e => handleAadhaarChange(e.target.value)}
                      placeholder="XXXXXXXXXXXX"
                      maxLength={12}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${aadhaarError ? '#ef4444' : idNumber.length === 12 && !aadhaarError ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                        color: '#fff', fontSize: '0.9rem',
                        letterSpacing: '0.15em', fontWeight: 700
                      }}
                      required
                    />
                    {aadhaarError ? (
                      <div style={{ fontSize: '0.76rem', color: '#f87171', marginTop: '4px' }}>⚠ {aadhaarError}</div>
                    ) : idNumber.length === 12 ? (
                      <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>✓ Valid Aadhaar number</div>
                    ) : null}
                  </div>
                  <FileUploadBox
                    label="Upload Front of Aadhaar *" color="#38bdf8"
                    file={idFrontFile} onChange={handleFrontDocChange} onRemove={() => setIdFrontFile(null)}
                    onPreview={() => handlePreviewFile(idFrontFile, 'Aadhaar Card Front', 'aadhaar')}
                    error={docErrors.front || (submitAttempted && !idFrontFile && !kd.idFrontDoc ? 'Document not loaded. Aadhaar card front is required.' : '')}
                  />
                  <FileUploadBox
                    label="Upload Back of Aadhaar" color="#38bdf8"
                    file={idBackFile} onChange={setIdBackFile} onRemove={() => setIdBackFile(null)}
                    onPreview={() => handlePreviewFile(idBackFile, 'Aadhaar Card Back', 'aadhaar')}
                  />
                </div>
              </div>

              {/* 2. PAN Card */}
              <div className="client-panel" style={{ marginBottom: 0 }}>
                <div className="client-panel-title" style={{ marginBottom: '14px' }}>
                  <CreditCard size={18} color="#fbbf24" />
                  <span>2. PAN Card</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      PAN Number * <span style={{ color: '#64748b', fontWeight: 400 }}>(e.g. ABCDE1234F)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={panNumber}
                      onChange={e => handlePANChange(e.target.value)}
                      placeholder="ABCDE1234F"
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${panError ? '#ef4444' : panNumber.length === 10 && !panError ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                        color: '#fff', fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700
                      }}
                      required
                    />
                    {panError ? (
                      <div style={{ fontSize: '0.76rem', color: '#f87171', marginTop: '4px' }}>⚠ {panError}</div>
                    ) : panNumber.length === 10 ? (
                      <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>✓ Valid PAN format</div>
                    ) : null}
                  </div>
                  <FileUploadBox
                    label="Upload Photo of PAN Card *" color="#fbbf24"
                    file={panFile} onChange={handlePanDocChange} onRemove={() => setPanFile(null)}
                    onPreview={() => handlePreviewFile(panFile, 'PAN Card Photo', 'pan')}
                    error={docErrors.pan || (submitAttempted && !panFile && !kd.panDoc ? 'Document not loaded. PAN card photo is required.' : '')}
                  />
                  <div style={{
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: '#cbd5e1'
                  }}>
                    ℹ️ Legal name on PAN must match Aadhaar card.
                  </div>
                </div>
              </div>

              {/* 3. Selfie with ID */}
              <div className="client-panel" style={{ marginBottom: 0 }}>
                <div className="client-panel-title" style={{ marginBottom: '14px' }}>
                  <Camera size={18} color="#c084fc" />
                  <span>3. Selfie with ID / Aadhaar</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                    Upload a clear photo of yourself holding your government ID card.
                    Both your face and the document details must be visible.
                  </p>
                  <FileUploadBox
                    label="Upload Selfie with ID *" color="#c084fc" accept="image/*"
                    file={selfieFile} onChange={handleSelfieDocChange} onRemove={() => setSelfieFile(null)}
                    onPreview={() => handlePreviewFile(selfieFile, 'Selfie with ID', 'selfie')}
                    error={docErrors.selfie || (submitAttempted && !selfieFile && !kd.selfieDoc ? 'Document not loaded. Selfie with ID is required.' : '')}
                  />
                  <div style={{
                    background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.2)',
                    borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: '#cbd5e1'
                  }}>
                    📸 Ensure ample lighting, neutral expression, and avoid sunglasses or masks.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="client-panel" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '3px' }}
                required={!isRejected}
              />
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                I confirm that all profile information and government identity documents uploaded above are accurate, valid, and belong to me.
                I understand that PartnerOnRent compliance administration conducts verification checks, and false submissions will result in immediate account suspension.
              </span>
            </label>
          </div>

          {/* Submit Action Bar */}
          <div style={{ textAlign: 'right', marginBottom: '40px' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !!aadhaarError || !!panError}
              style={{
                background: isRejected ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '14px 36px', fontSize: '1rem', fontWeight: 700, borderRadius: '12px',
                border: 'none', color: '#fff', cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: isRejected ? '0 4px 18px rgba(56, 189, 248, 0.3)' : '0 4px 18px rgba(16, 185, 129, 0.3)'
              }}
            >
              {isSubmitting
                ? 'Submitting Application...'
                : isRejected
                ? 'Re-Submit Corrected Profile & KYC Application'
                : 'Submit Complete Profile & KYC for Verification'}
            </button>
          </div>
        </form>
      )}

      {/* Verification Audit History */}
      {client?.kycDocuments?.verificationHistory?.length > 0 && (
        <div className="client-panel">
          <div className="client-panel-title" style={{ marginBottom: '16px' }}>
            <History size={18} color="#c084fc" />
            <span>Verification Audit History</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {client.kycDocuments.verificationHistory.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '12px 16px', background: 'rgba(15,23,42,0.4)',
                borderRadius: '10px',
                borderLeft: `3px solid ${item.status === 'VERIFIED' ? '#10b981' : item.status === 'REJECTED' ? '#ef4444' : '#38bdf8'}`
              }}>
                <div style={{ minWidth: '130px', fontSize: '0.78rem', color: '#94a3b8' }}>{item.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700, fontSize: '0.88rem',
                    color: item.status === 'VERIFIED' ? '#34d399' : item.status === 'REJECTED' ? '#f87171' : '#38bdf8',
                    marginBottom: '2px'
                  }}>
                    {item.status}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Document Lightbox Preview Modal */}
      <DocumentPreviewModal doc={formPreviewDoc} onClose={() => setFormPreviewDoc(null)} />
    </div>
  );
}
