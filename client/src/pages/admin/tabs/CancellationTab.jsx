import React, { useState } from 'react';
import { 
  ClipboardList, 
  Save, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function CancellationTab({
  cancellationPolicy = {},
  onSavePolicy
}) {
  const [form, setForm] = useState(cancellationPolicy);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (cancellationPolicy && Object.keys(cancellationPolicy).length > 0) {
      setForm(cancellationPolicy);
    }
  }, [cancellationPolicy]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSavePolicy(form);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTierChange = (index, field, val) => {
    const newTiers = [...(form.tiers || [])];
    newTiers[index][field] = Number(val);
    setForm({ ...form, tiers: newTiers });
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} color="#38bdf8" /> Cancellation & Refund Policy Rules
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Configure refund tiers, partner compensation credits & no-show penalties.
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-admin-action btn-admin-primary"
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saved ? 'Policy Saved!' : 'Save Cancellation Rules'}
        </button>
      </div>

      {/* Global Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '18px', margin: 0 }}>
          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Free Cancellation Grace Window (Hours)
          </label>
          <input
            type="number"
            value={form.freeCancellationHours || 24}
            onChange={e => setForm({ ...form, freeCancellationHours: Number(e.target.value) })}
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Cancellations before this cutoff receive 100% refund.
          </span>
        </div>

        <div className="admin-card" style={{ padding: '18px', margin: 0 }}>
          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            No-Show Violation Penalty (₹)
          </label>
          <input
            type="number"
            value={form.noShowPenaltyAmount || 500}
            onChange={e => setForm({ ...form, noShowPenaltyAmount: Number(e.target.value) })}
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Automatic deduction charged to confirmed offender.
          </span>
        </div>
      </div>

      {/* Refund & Compensation Tiers Table */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
          Configurable Time-Window Refund Tiers
        </h3>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cancellation Cutoff Window</th>
                <th>Customer Refund %</th>
                <th>Partner Compensation %</th>
                <th>Rule Description</th>
              </tr>
            </thead>
            <tbody>
              {(form.tiers || [
                { window: "> 24 hours before start", customerRefundPct: 100, partnerCompensationPct: 0, description: "Full refund to customer." },
                { window: "12 – 24 hours before start", customerRefundPct: 75, partnerCompensationPct: 20, description: "75% refund; 20% platform credit to partner." },
                { window: "2 – 12 hours before start", customerRefundPct: 50, partnerCompensationPct: 35, description: "50% refund; 35% paid to partner." },
                { window: "< 2 hours / No-Show", customerRefundPct: 0, partnerCompensationPct: 75, description: "Non-refundable. 75% disbursed to partner." }
              ]).map((tier, idx) => (
                <tr key={idx}>
                  <td>
                    <strong style={{ color: '#fff' }}>{tier.window}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        value={tier.customerRefundPct}
                        onChange={e => handleTierChange(idx, 'customerRefundPct', e.target.value)}
                        style={{ width: '70px', padding: '4px 8px' }}
                      />
                      <span style={{ color: '#34d399', fontWeight: 700 }}>%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        value={tier.partnerCompensationPct}
                        onChange={e => handleTierChange(idx, 'partnerCompensationPct', e.target.value)}
                        style={{ width: '70px', padding: '4px 8px' }}
                      />
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1', fontSize: '0.84rem' }}>{tier.description}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
