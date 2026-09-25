import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Radio,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function SafetyTab({
  sosAlerts = [],
  safetyIncidents = [],
  subFilter = 'all',
  setSubFilter,
  onResolveSOS,
  onSelectIncident
}) {
  const [search, setSearch] = useState('');

  const activeAlerts = sosAlerts.filter(a => a.status === 'active');

  return (
    <div>
      {/* Critical Emergency Alert Banner if Active Alerts */}
      {activeAlerts.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.4))',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          borderRadius: '16px',
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.8)'
            }}>
              <ShieldAlert size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                🚨 {activeAlerts.length} Active Emergency SOS Broadcast(s) in Progress
              </div>
              <div style={{ fontSize: '0.84rem', color: '#fca5a5' }}>
                Immediate safety dispatch response required. Real-time GPS lock active.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeAlerts.map(alert => (
              <button
                key={alert.id}
                onClick={() => onResolveSOS(alert.id)}
                className="btn-admin-action btn-admin-primary"
                style={{ background: '#ef4444', borderColor: '#fca5a5' }}
              >
                Resolve Alert #{alert.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Safety Sub-Tabs */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Incidents ({safetyIncidents.length + sosAlerts.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'sos' ? 'active' : ''}`}
            onClick={() => setSubFilter('sos')}
          >
            Emergency SOS ({sosAlerts.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'suspicious' ? 'active' : ''}`}
            onClick={() => setSubFilter('suspicious')}
          >
            Suspicious Account Flags ({safetyIncidents.filter(s => s.category?.includes('Suspicious')).length})
          </button>
        </div>
      </div>

      {/* SOS Alerts Log Table */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="#f87171" /> Real-time SOS Dispatches & Triggers
        </h3>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Triggered By</th>
                <th>Linked Booking</th>
                <th>Location / Venue</th>
                <th>Timestamp</th>
                <th>Reason / Threat</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sosAlerts.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No SOS emergency alerts logged.
                  </td>
                </tr>
              ) : (
                sosAlerts.map(a => (
                  <tr key={a.id}>
                    <td>
                      <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#f87171' }}>{a.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{a.userName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Role: {a.userRole}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{a.bookingId}</span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <MapPin size={12} color="#38bdf8" /> {a.location}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{formatDateTime(a.timestamp)}</span>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{a.reason}</div>
                    </td>
                    <td>
                      <span className={`admin-badge ${a.status === 'active' ? 'admin-badge-rose' : 'admin-badge-emerald'}`}>
                        {a.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {a.status === 'active' ? (
                        <button
                          onClick={() => onResolveSOS(a.id)}
                          className="btn-admin-action btn-admin-danger"
                        >
                          Resolve SOS
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#34d399', fontWeight: 600 }}>
                          ✓ Resolved Safe
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Incidents Card Grid */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={18} color="#38bdf8" /> Trust & Compliance Incidents
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {safetyIncidents.map(inc => (
          <div key={inc.id} className="admin-card" style={{ padding: '18px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{inc.id}</span>
                <span style={{ marginLeft: '8px', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{inc.category}</span>
              </div>
              <span className={`admin-badge ${inc.threatLevel === 'Critical' ? 'admin-badge-rose' : 'admin-badge-amber'}`}>
                {inc.threatLevel} Threat
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', margin: '8px 0 12px' }}>
              {inc.description}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.78rem',
              color: '#94a3b8',
              marginBottom: '12px'
            }}>
              <div>Assigned Admin: <strong style={{ color: '#fff' }}>{inc.assignedAdmin}</strong></div>
              <div>Evidence: <span style={{ color: '#38bdf8' }}>{inc.evidence}</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`admin-badge ${inc.status === 'resolved' ? 'admin-badge-emerald' : 'admin-badge-amber'}`}>
                {inc.status?.toUpperCase()}
              </span>
              <button
                onClick={() => onSelectIncident(inc)}
                className="btn-admin-action btn-admin-secondary"
              >
                <ExternalLink size={12} /> Incident Dossier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
