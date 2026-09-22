import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { triggerSOSAlert } from '../utils/api';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle2 } from 'lucide-react';

export default function SOSModal() {
  const { sosModal, closeSOS, showToast } = useApp();
  const { currentRole, activeUser, activePartner } = useAuth();
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggeredAlert, setTriggeredAlert] = useState(null);
  const [reason, setReason] = useState('Feeling unsafe / need immediate safety dispatch assistance.');

  if (!sosModal.isOpen) return null;

  const handleTriggerSOS = async () => {
    setIsTriggering(true);
    try {
      const payload = {
        bookingId: sosModal?.booking?.id || 'GENERAL',
        triggeredBy: currentRole === 'client' ? (activeUser?.id || 'client-1') : (activePartner?.id || 'partner-p1'),
        userName: currentRole === 'client' ? (activeUser?.name || 'Rahul Verma') : (activePartner?.name || 'Aanya Sharma'),
        userRole: currentRole,
        location: sosModal?.booking?.meetingLocation || 'Active Meetup / GPS Broadcast',
        reason
      };

      const result = await triggerSOSAlert(payload);
      setTriggeredAlert(result.alert);
      showToast('🚨 SOS DISPATCH ALERT TRANSMITTED TO SAFETY DESK', 'danger');
    } catch (err) {
      console.error(err);
      alert('Failed to transmit SOS. Please dial 112 directly!');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeSOS}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{
          border: '2px solid #ef4444',
          maxWidth: '520px',
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.4)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(239, 68, 68, 0.15)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '2px' }}>
                Emergency Safety Dispatch (SOS)
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>
                24x7 Safety Response & Emergency Escalation Desk
              </div>
            </div>
          </div>
          <button 
            onClick={closeSOS}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {triggeredAlert ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <ShieldAlert size={34} color="#ef4444" />
              </div>
              <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                SOS Dispatch Transmitted!
              </h4>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                Alert Reference: <strong>{triggeredAlert.id}</strong>. Our safety response team and your registered emergency contact have been notified with your current location coordinates.
              </p>

              {/* Direct Help Lines */}
              <div style={{
                background: '#0f172a',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '10px' }}>
                  DIRECT EMERGENCY CALL SHORTCUTS (INDIA)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700 }}>
                    <PhoneCall size={16} /> 112 - All-in-One National Emergency Helpline
                  </a>
                  <a href="tel:1091" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700 }}>
                    <PhoneCall size={16} /> 1091 - Women Safety Hotline
                  </a>
                  <a href="tel:+919810535398" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
                    <PhoneCall size={16} /> +91-98105-35398 - PartnerOnRent Safety Desk
                  </a>
                </div>
              </div>

              <button className="btn-secondary" onClick={closeSOS} style={{ width: '100%' }}>
                Close Window
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                If you feel uncomfortable, experience boundary violation, or need immediate assistance, pressing this button will instantly alert our 24/7 Operations Safety Desk and flag your session.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                  Emergency Description / Reason:
                </label>
                <textarea 
                  rows={3} 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '0.8rem',
                color: '#fca5a5',
                marginBottom: '20px'
              }}>
                ⚠️ In case of immediate physical danger, always call national emergency services <strong>(112)</strong> directly.
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={closeSOS}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-danger"
                  onClick={handleTriggerSOS}
                  disabled={isTriggering}
                  style={{ flex: 2, padding: '12px', fontSize: '0.95rem' }}
                >
                  {isTriggering ? 'Transmitting SOS...' : '🚨 Broadcast Immediate SOS'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
