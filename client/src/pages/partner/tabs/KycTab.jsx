import React, { useState, useRef } from 'react';
import {
  ShieldCheck, Clock, AlertTriangle, FileText,
  Upload, CheckCircle2, XCircle, Camera,
  CreditCard, History, Paperclip, Trash2, Lock,
  Eye, X, ExternalLink, Download
} from 'lucide-react';

// ── Aadhaar Verhoeff Validation ───────────────────────────────────────────
const _d = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const _p = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
function validateAadhaar(num) {
  const digits = num.replace(/\s|-/g, '');
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

// ── Document Preview Modal ────────────────────────────────────────────────
function DocumentPreviewModal({ doc, onClose }) {
  if (!doc) return null;
  // Enhanced detection for PDF and Image documents
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

        {/* Document Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {isImage ? (
            /* ── Actual uploaded image ── */
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
            /* ── PDF viewer with embed and fallback ── */
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
            /* ── No image stored — fallback info card ── */
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: '12px', padding: '40px 24px', textAlign: 'center'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 16px',
                background: doc.type === 'pan' ? 'rgba(251,191,36,0.15)' : doc.type === 'selfie' ? 'rgba(192,132,252,0.15)' : 'rgba(56,189,248,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileText size={28} color={doc.type === 'pan' ? '#fbbf24' : doc.type === 'selfie' ? '#c084fc' : '#38bdf8'} />
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{doc.title}</div>
              <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '20px' }}>
                {doc.fileName
                  ? `File: ${doc.fileName} — submitted successfully`
                  : 'Document submitted and stored securely'}
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                padding: '16px', textAlign: 'left'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Legal Name</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>{doc.holderName || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {doc.type === 'pan' ? 'PAN Number' : 'Aadhaar (Masked)'}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>
                    {doc.type === 'pan'
                      ? (doc.panNumber || '—')
                      : (doc.idNumber ? doc.idNumber.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3') : '—')}
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '16px', fontSize: '0.76rem', color: '#475569',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}>
                <ShieldCheck size={13} color="#34d399" />
                Document stored in encrypted KYC vault. Preview not available for legacy records.
              </div>
            </div>
          )}

          {/* Status bar */}
          <div style={{
            marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: '0.75rem', color: '#94a3b8', padding: '9px 14px',
            background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="#34d399" /> PartnerOnRent Secure KYC Vault
            </span>
            <span style={{
              color: doc.status === 'verified' ? '#34d399' : '#fbbf24',
              fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem'
            }}>
              {doc.status === 'verified' ? '✓ Verified' : '⏳ Under Review'}
            </span>
          </div>
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
function FileUploadBox({ label, color, accept, file, onChange, onRemove, onPreview, disabled }) {
  const inputRef = useRef();
  return (
    <div
      style={{
        border: `1px dashed ${file ? color : disabled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)'}`,
        borderRadius: '8px', padding: '12px', textAlign: 'center',
        background: file ? 'rgba(16,185,129,0.07)' : 'rgba(15,23,42,0.4)',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
          <Upload size={18} color={disabled ? '#475569' : color} style={{ margin: '0 auto 4px' }} />
          <div style={{ fontSize: '0.8rem', color: disabled ? '#475569' : '#fff', fontWeight: 600 }}>{label}</div>
          {!disabled && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Click to browse (JPG, PNG, PDF)</div>}
        </>
      )}
    </div>
  );
}

// ── Submitted KYC Report ──────────────────────────────────────────────────
function SubmittedReport({ data, status }) {
  const [previewDoc, setPreviewDoc] = useState(null);

  const badge = status === 'verified'
    ? { label: 'Verified', color: '#10b981', bg: 'rgba(16,185,129,0.1)' }
    : status === 'rejected'
    ? { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' }
    : { label: 'Under Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };

  const Row = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 700 }}>{value || '—'}</span>
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
                  holderName: data.holderName,
                  idNumber: data.idNumber,
                  panNumber: data.panNumber,
                  status
                });
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 11px', borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'; }}
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
    <div className="partner-panel">
      {/* Document Preview Lightbox Modal */}
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div className="partner-panel-title" style={{ margin: 0 }}>
          <FileText size={18} color="#38bdf8" />
          <span>Submitted KYC Details</span>
        </div>
        <span style={{
          fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px',
          borderRadius: '20px', background: badge.bg, color: badge.color,
          border: `1px solid ${badge.color}`
        }}>
          {badge.label}
        </span>
      </div>
      <Row label="Legal Name" value={data.holderName} />
      <Row label="Document Type" value="Aadhaar Card" />
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
        docTitle="Selfie with Aadhaar"
      />
      {status === 'rejected' && (
        <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', fontSize: '0.83rem', color: '#fca5a5' }}>
          ⚠️ Your KYC was rejected. Scroll down to update and re-submit your details.
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function KycTab({ partner, onSubmitKYC, showToast }) {
  const currentStatus  = partner?.kycStatus || 'not_submitted';
  const isVerified     = currentStatus === 'verified';
  const isUnderReview  = currentStatus === 'under_review' || currentStatus === 'pending';
  const isRejected     = currentStatus === 'rejected';
  const isLocked       = isVerified || isUnderReview;

  const kd = partner?.kycDocuments || {};

  const [holderName, setHolderName] = useState(isRejected ? (kd.holderName || partner?.name || '') : '');
  const [idNumber,   setIdNumber]   = useState(isRejected ? (kd.idNumber?.replace(/\D/g, '').slice(0, 12) || '') : '');
  const [panNumber,  setPanNumber]  = useState(isRejected ? (kd.panNumber  || '') : '');
  const [aadhaarError, setAadhaarError] = useState('');
  const [panError,     setPanError]     = useState('');
  const [idFrontFile,  setIdFrontFile]  = useState(null);
  const [idBackFile,   setIdBackFile]   = useState(null);
  const [panFile,      setPanFile]      = useState(null);
  const [selfieFile,   setSelfieFile]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formPreviewDoc, setFormPreviewDoc] = useState(null);

  const handlePreviewFile = async (file, title, docType) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setFormPreviewDoc({
      title,
      type: docType,
      url,
      fileName: file.name,
      holderName,
      idNumber,
      panNumber,
      status: 'pending'
    });
  };

  const handleAadhaarChange = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    setIdNumber(digits);
    if (digits.length === 12) {
      setAadhaarError(!validateAadhaar(digits) ? 'Invalid Aadhaar number. Please check and re-enter.' : '');
    } else {
      setAadhaarError('');
    }
  };

  const handlePANChange = (val) => {
    const upper = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanNumber(upper);
    if (upper.length === 10) {
      setPanError(!validatePAN(upper) ? 'Invalid PAN format. Expected: ABCDE1234F' : '');
    } else {
      setPanError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!holderName.trim())           { showToast('Please enter your legal name as per Aadhaar', 'warning'); return; }
    if (idNumber.length !== 12)        { showToast('Please enter a valid 12-digit Aadhaar number', 'warning'); return; }
    if (!validateAadhaar(idNumber))    { showToast('Aadhaar number is invalid. Please re-check.', 'warning'); return; }
    if (panNumber.length !== 10)       { showToast('Please enter a valid 10-character PAN number', 'warning'); return; }
    if (!validatePAN(panNumber))       { showToast('PAN format is invalid. Expected: ABCDE1234F', 'warning'); return; }
    if (!idFrontFile)                  { showToast('Please upload front of your Aadhaar card', 'warning'); return; }
    if (!panFile)                      { showToast('Please upload your PAN card photo', 'warning'); return; }
    if (!selfieFile)                   { showToast('Please upload a selfie with your Aadhaar', 'warning'); return; }

    setIsSubmitting(true);
    try {
      const [idFrontDoc, idBackDoc, panDoc, selfieDoc] = await Promise.all([
        fileToDataUrl(idFrontFile),
        fileToDataUrl(idBackFile),
        fileToDataUrl(panFile),
        fileToDataUrl(selfieFile),
      ]);

      await onSubmitKYC({
        idType: 'Aadhaar Card',
        idNumber,
        holderName,
        panNumber,
        idFrontDoc,
        idBackDoc,
        panDoc,
        selfieDoc,
        idFrontName:   idFrontFile?.name,
        idBackName:    idBackFile?.name,
        panFileName:   panFile?.name,
        selfieFileName: selfieFile?.name,
      });
      showToast('KYC documents submitted for admin verification!');
    } catch (err) {
      showToast('Failed to submit KYC. Please try again.', 'danger');
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🪪 Identity Verification &amp; KYC
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Complete your KYC to activate your profile and start accepting booking requests.
        </p>
      </div>

      {/* Status Tracker Panel */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '20px' }}>
          <ShieldCheck size={20} color={isVerified ? '#34d399' : '#fbbf24'} />
          <span>Verification Status</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '10px 0', marginBottom: '20px' }}>
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

        {/* Status Callout */}
        <div style={{
          background: isVerified ? 'rgba(16,185,129,0.1)' : isUnderReview ? 'rgba(245,158,11,0.1)' : isRejected ? 'rgba(239,68,68,0.1)' : 'rgba(56,189,248,0.1)',
          border: `1px solid ${isVerified ? '#10b981' : isUnderReview ? '#f59e0b' : isRejected ? '#ef4444' : '#38bdf8'}`,
          borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          {isVerified
            ? <CheckCircle2 size={32} color="#10b981" />
            : isUnderReview
            ? <Clock size={32} color="#f59e0b" />
            : isRejected
            ? <XCircle size={32} color="#ef4444" />
            : <AlertTriangle size={32} color="#38bdf8" />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
              {isVerified
                ? 'Account Verified & Background Cleared'
                : isUnderReview
                ? 'Documents Under Review — You will be notified on approval'
                : isRejected
                ? 'Verification Rejected — Update your details and re-submit'
                : 'KYC Submission Required to Activate Your Profile'}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '3px' }}>
              {isVerified
                ? 'Your profile carries the green Verified Badge. You can now accept booking requests.'
                : isUnderReview
                ? 'Verification typically takes 6–12 hours. Details are locked during review.'
                : isRejected
                ? 'Your previous submission was rejected. Please correct and re-submit your documents.'
                : 'Submit valid Aadhaar, PAN card, and a selfie to enable bookings.'}
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Report — shown when pending, rejected, or verified */}
      {(isUnderReview || isVerified || isRejected) && (kd.holderName || kd.idNumber || partner?.name) && (
        <SubmittedReport data={{ ...kd, holderName: kd.holderName || partner?.name || '' }} status={currentStatus} />
      )}

      {/* Locked notice for pending review */}
      {isUnderReview && (
        <div className="partner-panel" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <Lock size={40} color="#f59e0b" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ color: '#fbbf24', fontWeight: 700, margin: '0 0 8px' }}>Documents Locked for Review</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
            Your KYC documents are currently under review. You cannot modify your details during this time.
            We will notify you once the review is complete.
          </p>
        </div>
      )}

      {/* KYC Form — shown only when not submitted or rejected */}
      {!isVerified && !isUnderReview && (
        <form onSubmit={handleSubmit}>
          {isRejected && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 18px', marginBottom: '20px',
              fontSize: '0.85rem', color: '#fca5a5'
            }}>
              ⚠️ Your previous KYC was rejected. Please correct your details and re-submit below.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>

            {/* 1. Aadhaar Card */}
            <div className="partner-panel" style={{ marginBottom: 0 }}>
              <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
                <FileText size={18} color="#38bdf8" />
                <span>1. Aadhaar Card</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Legal Name as per Aadhaar *
                  </label>
                  <input type="text" value={holderName} onChange={e => setHolderName(e.target.value)}
                    placeholder="Enter your full legal name" style={{ width: '100%' }} required disabled={isLocked} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Aadhaar Number * <span style={{ color: '#64748b', fontWeight: 400 }}>(12 digits)</span>
                  </label>
                  <input
                    type="text" value={idNumber} onChange={e => handleAadhaarChange(e.target.value)}
                    placeholder="XXXXXXXXXXXX" maxLength={12}
                    style={{
                      width: '100%', letterSpacing: '0.15em', fontWeight: 700,
                      borderColor: aadhaarError ? '#ef4444' : idNumber.length === 12 && !aadhaarError ? '#10b981' : ''
                    }}
                    required disabled={isLocked}
                  />
                  {aadhaarError ? (
                    <div style={{ fontSize: '0.76rem', color: '#f87171', marginTop: '4px' }}>⚠ {aadhaarError}</div>
                  ) : idNumber.length === 12 ? (
                    <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>✓ Valid Aadhaar number</div>
                  ) : null}
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                    Validated using the Verhoeff checksum algorithm
                  </div>
                </div>
                <FileUploadBox
                  label="Upload Front of Aadhaar *" color="#38bdf8"
                  file={idFrontFile} onChange={setIdFrontFile} onRemove={() => setIdFrontFile(null)}
                  onPreview={() => handlePreviewFile(idFrontFile, 'Aadhaar Card Front', 'aadhaar')}
                  disabled={isLocked}
                />
                <FileUploadBox
                  label="Upload Back of Aadhaar" color="#38bdf8"
                  file={idBackFile} onChange={setIdBackFile} onRemove={() => setIdBackFile(null)}
                  onPreview={() => handlePreviewFile(idBackFile, 'Aadhaar Card Back', 'aadhaar')}
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* 2. PAN Card */}
            <div className="partner-panel" style={{ marginBottom: 0 }}>
              <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
                <CreditCard size={18} color="#fbbf24" />
                <span>2. PAN Card</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    PAN Number * <span style={{ color: '#64748b', fontWeight: 400 }}>(e.g. ABCDE1234F)</span>
                  </label>
                  <input
                    type="text" maxLength={10} value={panNumber} onChange={e => handlePANChange(e.target.value)}
                    placeholder="ABCDE1234F"
                    style={{
                      width: '100%', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700,
                      borderColor: panError ? '#ef4444' : panNumber.length === 10 && !panError ? '#10b981' : ''
                    }}
                    required disabled={isLocked}
                  />
                  {panError ? (
                    <div style={{ fontSize: '0.76rem', color: '#f87171', marginTop: '4px' }}>⚠ {panError}</div>
                  ) : panNumber.length === 10 ? (
                    <div style={{ fontSize: '0.76rem', color: '#34d399', marginTop: '4px' }}>✓ Valid PAN format</div>
                  ) : null}
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                    Format: 5 letters · 4 digits · 1 letter — Required for TDS &amp; earnings payout.
                  </div>
                </div>
                <FileUploadBox
                  label="Upload Photo of PAN Card *" color="#fbbf24"
                  file={panFile} onChange={setPanFile} onRemove={() => setPanFile(null)}
                  onPreview={() => handlePreviewFile(panFile, 'PAN Card Photo', 'pan')}
                  disabled={isLocked}
                />
                <div style={{
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: '#cbd5e1'
                }}>
                  ℹ️ The name on your PAN must match the name on your Aadhaar.
                </div>
              </div>
            </div>

            {/* 3. Selfie with Aadhaar */}
            <div className="partner-panel" style={{ marginBottom: 0 }}>
              <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
                <Camera size={18} color="#c084fc" />
                <span>3. Selfie with Aadhaar</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  Upload a clear photo of yourself holding your Aadhaar card.
                  Both your face and the Aadhaar number must be clearly visible.
                </p>
                <FileUploadBox
                  label="Upload Selfie with Aadhaar *" color="#c084fc" accept="image/*"
                  file={selfieFile} onChange={setSelfieFile} onRemove={() => setSelfieFile(null)}
                  onPreview={() => handlePreviewFile(selfieFile, 'Selfie with Aadhaar', 'selfie')}
                  disabled={isLocked}
                />
                <div style={{
                  background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.2)',
                  borderRadius: '8px', padding: '10px 14px', fontSize: '0.78rem', color: '#cbd5e1'
                }}>
                  📸 No sunglasses, masks, or filters. Ensure good lighting.
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ textAlign: 'right', marginBottom: '30px' }}>
            <button
              type="submit" className="btn-primary"
              disabled={isSubmitting || isLocked || !!aadhaarError || !!panError}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '14px 32px', fontSize: '1rem', fontWeight: 700
              }}
            >
              {isSubmitting ? 'Submitting...' : isRejected ? 'Re-submit KYC Documents' : 'Submit KYC Documents'}
            </button>
          </div>
        </form>
      )}

      {/* Verification History — only shown if verified and history exists */}
      {isVerified && partner?.kycDocuments?.verificationHistory?.length > 0 && (
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <History size={18} color="#c084fc" />
            <span>Verification Audit History</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {partner.kycDocuments.verificationHistory.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '12px 16px', background: 'rgba(15,23,42,0.4)',
                borderRadius: '10px', borderLeft: '3px solid #10b981'
              }}>
                <div style={{ minWidth: '130px', fontSize: '0.78rem', color: '#94a3b8' }}>{item.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', marginBottom: '2px' }}>{item.status}</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Document Preview Modal */}
      <DocumentPreviewModal doc={formPreviewDoc} onClose={() => setFormPreviewDoc(null)} />
    </div>
  );
}
