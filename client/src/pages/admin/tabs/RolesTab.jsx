import React from 'react';
import { Key, ShieldCheck, Check, X } from 'lucide-react';

export default function RolesTab() {
  const roles = [
    { role: 'Super Admin', desc: 'Full root access to all governance, security & financial modules' },
    { role: 'Operations Admin', desc: 'Manage partner activations, booking conflicts & city hubs' },
    { role: 'KYC Admin', desc: 'Aadhaar, PAN & background investigation clearance' },
    { role: 'Finance Admin', desc: 'Handle bank payouts, gateway reconciliation & refund overrides' },
    { role: 'Safety Admin', desc: 'Emergency SOS dispatch, user blocking & incident reports' },
    { role: 'Support Admin', desc: 'Customer complaints, dispute arbitration & review moderation' },
    { role: 'Content Admin', desc: 'Manage CMS landing pages, FAQs, campaigns & banners' }
  ];

  const modules = [
    { name: 'Dashboard & Metrics', super: true, ops: true, kyc: false, fin: true, safe: true, supp: true, cnt: false },
    { name: 'Customer Block/Unblock', super: true, ops: true, kyc: false, fin: false, safe: true, supp: true, cnt: false },
    { name: 'Partner KYC Approval', super: true, ops: false, kyc: true, fin: false, safe: false, supp: false, cnt: false },
    { name: 'Booking Overrides & Refunds', super: true, ops: true, kyc: false, fin: true, safe: false, supp: true, cnt: false },
    { name: 'Payout Settlement & UTR', super: true, ops: false, kyc: false, fin: true, safe: false, supp: false, cnt: false },
    { name: 'Commission Rules Edit', super: true, ops: false, kyc: false, fin: true, safe: false, supp: false, cnt: false },
    { name: 'Emergency SOS Resolution', super: true, ops: false, kyc: false, fin: false, safe: true, supp: false, cnt: false },
    { name: 'CMS & Announcement Edit', super: true, ops: false, kyc: false, fin: false, safe: false, supp: false, cnt: true },
    { name: 'Admin Staff & Audit Logs', super: true, ops: false, kyc: false, fin: false, safe: false, supp: false, cnt: false }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={20} color="#38bdf8" /> Role-Based Access Control (RBAC) Matrix
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Granular privilege segregation preventing operational overreach across business departments.
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Governance Module</th>
                <th>Super Admin</th>
                <th>Operations</th>
                <th>KYC Desk</th>
                <th>Finance</th>
                <th>Safety</th>
                <th>Support</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m, mIdx) => (
                <tr key={mIdx}>
                  <td><strong style={{ color: '#fff' }}>{m.name}</strong></td>
                  <td><Check size={16} color="#34d399" /></td>
                  <td>{m.ops ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                  <td>{m.kyc ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                  <td>{m.fin ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                  <td>{m.safe ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                  <td>{m.supp ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                  <td>{m.cnt ? <Check size={16} color="#34d399" /> : <X size={16} color="#64748b" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
