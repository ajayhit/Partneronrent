import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function CouponsTab({
  coupons = [],
  onCreateCoupon,
  onToggleStatus
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'flat',
    discountValue: 100,
    minBookingAmount: 500,
    targetCity: 'All',
    maxUses: 500,
    validUntil: '2026-12-31',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim()) return;
    await onCreateCoupon(form);
    setShowAddModal(false);
    setForm({
      code: '',
      discountType: 'flat',
      discountValue: 100,
      minBookingAmount: 500,
      targetCity: 'All',
      maxUses: 500,
      validUntil: '2026-12-31',
      description: ''
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="#38bdf8" /> Promotions, Vouchers & Referral Codes
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Manage discount vouchers, first-booking welcome incentives & city campaigns.
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-admin-action btn-admin-primary"
        >
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Benefit / Discount</th>
              <th>Target Region</th>
              <th>Min Booking</th>
              <th>Usage Velocity</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id}>
                <td>
                  <span style={{
                    fontWeight: 800,
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}>
                    {c.code}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{c.description}</div>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                    {c.discountType === 'flat' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{c.targetCity || 'All Cities'}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{formatCurrency(c.minBookingAmount || 500)}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                    {c.usedCount || 0} / {c.maxUses || 500}
                  </div>
                  <div style={{
                    width: '100px',
                    height: '5px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    marginTop: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, Math.round(((c.usedCount || 0) / (c.maxUses || 500)) * 100))}%`,
                      height: '100%',
                      background: '#38bdf8'
                    }} />
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{c.validUntil}</span>
                </td>
                <td>
                  <span className={`admin-badge ${c.status === 'active' ? 'admin-badge-emerald' : 'admin-badge-rose'}`}>
                    {c.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => onToggleStatus(c.id)}
                    className="btn-admin-action btn-admin-secondary"
                  >
                    {c.status === 'active' ? 'Expire' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: '500px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Create Promotional Coupon</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME100, JAIPUR20"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                  style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={e => setForm({ ...form, discountType: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="flat">Flat ₹ Amount</option>
                    <option value="percentage">Percentage %</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Discount Value</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Min Booking (₹)</label>
                  <input
                    type="number"
                    value={form.minBookingAmount}
                    onChange={e => setForm({ ...form, minBookingAmount: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Region</label>
                  <input
                    type="text"
                    value={form.targetCity}
                    onChange={e => setForm({ ...form, targetCity: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description / Terms</label>
                <input
                  type="text"
                  placeholder="e.g. ₹100 off on first companion booking"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-admin-action btn-admin-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-action btn-admin-primary"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
