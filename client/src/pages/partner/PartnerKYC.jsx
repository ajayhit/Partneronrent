import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { fetchPartnerById, submitPartnerKYC } from '../../utils/api';
import { ShieldCheck, FileText, CheckCircle2, Clock, Upload, AlertCircle } from 'lucide-react';

export default function PartnerKYC() {
  const { activePartner } = useAuth();
  const { showToast } = useApp();
  const [partner, setPartner] = useState(activePartner || null);
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDetails();
  }, [activePartner?.id]);

  const loadDetails = async () => {
    try {
      const data = await fetchPartnerById(activePartner?.id || 'partner-p1');
      if (data) {
        setPartner(data);
        if (data.kycDocuments?.idType) setIdType(data.kycDocuments.idType);
        if (data.kycDocuments?.idNumber) setIdNumber(data.kycDocuments.idNumber);
        if (data.name) setHolderName(data.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idNumber.trim()) {
      alert('Please provide your Govt ID number');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPartnerKYC(partner.id, {
        idType,
        idNumber,
        holderName
      });
      setPartner(res.partner);
      showToast('KYC documents submitted for automated admin background check!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit KYC documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVerified = partner?.kycStatus === 'verified';
  const isPending = partner?.kycStatus === 'pending';

  return (
    <div className="container" style={{ paddingBottom: '70px', maxWidth: '760px' }}>
      
      <div style={{ padding: '24px 0 10px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Partner Verification & KYC</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Mandatory identity check to protect both companions and hirers under our platonic safety guidelines.
        </p>
      </div>

      {/* Verification Status Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isVerified ? (
              <ShieldCheck size={32} color="#10b981" />
            ) : (
              <Clock size={32} color="#f59e0b" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>
                {isVerified ? 'Verification Status: APPROVED' : isPending ? 'Verification Status: PENDING REVIEW' : 'Verification Status: NOT SUBMITTED'}
              </h3>
              <span className={`badge ${isVerified ? 'badge-verified' : 'badge-warning'}`}>
                {isVerified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              {isVerified ? 'Your companion profile is verified and public on the discovery directory.' : 'Our safety compliance team reviews submitted IDs within 12 hours.'}
            </div>
          </div>
        </div>

        {partner?.kycDocuments && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            fontSize: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>ID Document Type:</span>
              <strong style={{ color: '#fff' }}>{partner.kycDocuments.idType}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>ID Number:</span>
              <strong style={{ color: '#fff' }}>{partner.kycDocuments.idNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Police Background Check:</span>
              <strong style={{ color: '#34d399' }}>{partner.kycDocuments.backgroundCheck}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Submission Form (if not verified or want to update) */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          {isVerified ? 'Update Verification Documents' : 'Submit Identity Information'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Full Legal Name (as per Govt ID)
            </label>
            <input 
              type="text" 
              value={holderName}
              onChange={e => setHolderName(e.target.value)}
              placeholder="e.g. Aanya Sharma"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Government ID Type
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Document / ID Number
              </label>
              <input 
                type="text" 
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="e.g. XXXX-XXXX-1234"
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          {/* Photo & Selfie Upload Simulation */}
          <div style={{
            border: '2px dashed var(--border-active)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.4)',
            cursor: 'pointer'
          }}>
            <Upload size={32} color="#c084fc" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
              Simulated Front ID & Selfie Verification
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
              Mock document upload verified by automated facial match.
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
          >
            {isSubmitting ? 'Verifying...' : 'Submit Documents for Verification'}
          </button>

        </form>
      </div>

    </div>
  );
}
