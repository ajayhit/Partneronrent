import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Key, 
  ShieldCheck, 
  Mail, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function AdminUsersTab({
  adminUsers = [],
  onCreateAdminUser
}) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Operations Admin',
    department: 'Operations'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await onCreateAdminUser(form);
    setShowModal(false);
    setForm({ name: '', email: '', role: 'Operations Admin', department: 'Operations' });
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="#38bdf8" /> Administrative Team & Operators
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Multi-tier role delegation across Super Admin, KYC Vetting, Safety Command & Finance.
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-admin-action btn-admin-primary"
        >
          <Plus size={14} /> Invite Admin Staff
        </button>
      </div>

      {/* Admin Users Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Admin Staff</th>
              <th>Designated Role</th>
              <th>Department</th>
              <th>Assigned Permissions</th>
              <th>Last Active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'}
                      alt={u.name}
                      style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`admin-badge ${
                    u.role === 'Super Admin' ? 'admin-badge-purple' :
                    u.role === 'Safety Admin' ? 'admin-badge-rose' :
                    u.role === 'Finance Admin' ? 'admin-badge-emerald' : 'admin-badge-cyan'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{u.department}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {(u.permissions || ['all']).map((perm, pIdx) => (
                      <span key={pIdx} style={{
                        fontSize: '0.68rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#94a3b8'
                      }}>
                        {perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {u.lastLogin === 'Never' ? 'Invited' : formatDateTime(u.lastLogin)}
                  </span>
                </td>
                <td>
                  <span className="admin-badge admin-badge-emerald">ACTIVE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: '460px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Invite Admin Staff</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pooja Malhotra"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Work Email</label>
                <input
                  type="email"
                  placeholder="e.g. ops.pooja@partneronrent.in"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Administrative Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value, department: e.target.value.replace(' Admin', '') })}
                  style={{ width: '100%' }}
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Operations Admin">Operations Admin</option>
                  <option value="KYC Admin">KYC Admin</option>
                  <option value="Finance Admin">Finance Admin</option>
                  <option value="Support Admin">Support Admin</option>
                  <option value="Safety Admin">Safety Admin</option>
                  <option value="Content Admin">Content Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-admin-action btn-admin-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-action btn-admin-primary"
                >
                  Issue Operator Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
