import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  FileText 
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function AuditLogsTab({
  auditLogs = []
}) {
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        log.adminName?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q) ||
        log.entity?.toLowerCase().includes(q) ||
        log.entityId?.toLowerCase().includes(q) ||
        log.reason?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} color="#38bdf8" /> Immutable Governance Audit Logs
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Forensic trace for KYC approvals, payment refunds, payout settlements, suspensions and safety actions.
          </div>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search operator, action, reason, target ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Admin Operator</th>
              <th>Action Taken</th>
              <th>Target Entity</th>
              <th>State Delta (Old → New)</th>
              <th>Operational Reason</th>
              <th>IP Address</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No audit trail records found.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{log.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{log.adminName}</div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-cyan">
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{log.entity}</span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{log.entityId}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      <span style={{ color: '#f87171' }}>{log.oldValue}</span> → <span style={{ color: '#34d399', fontWeight: 700 }}>{log.newValue}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                      {log.reason}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#64748b' }}>
                      {log.ipAddress || '127.0.0.1'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {formatDateTime(log.timestamp)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
