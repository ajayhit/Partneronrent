import React, { useState } from 'react';
import { 
  TrendingUp, 
  Save, 
  DollarSign, 
  Sliders, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function CommissionsTab({
  commissionRules = {},
  onSaveCommissions
}) {
  const [form, setForm] = useState(commissionRules);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync if props update
  React.useEffect(() => {
    if (commissionRules && Object.keys(commissionRules).length > 0) {
      setForm(commissionRules);
    }
  }, [commissionRules]);

  const handleServiceCommissionChange = (idx, value) => {
    const updatedServices = [...(form.services || [])];
    updatedServices[idx].commissionPct = Number(value);
    setForm({ ...form, services: updatedServices });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSaveCommissions(form, 'Commission rules updated via admin console');
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="#38bdf8" /> Platform Commission & Fee Architecture
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Configure base platform fees, service-specific rates, minimum charges & promotional margins.
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-admin-action btn-admin-primary"
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saved ? 'Saved Successfully!' : 'Save Commission Rules'}
        </button>
      </div>

      {/* Global Rates Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '18px', margin: 0 }}>
          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Default Base Platform Commission (%)
          </label>
          <input
            type="number"
            value={form.platformBaseCommission || 20}
            onChange={e => setForm({ ...form, platformBaseCommission: Number(e.target.value) })}
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Partner retains {100 - (form.platformBaseCommission || 20)}% of gross booking fee.
          </span>
        </div>

        <div className="admin-card" style={{ padding: '18px', margin: 0 }}>
          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Minimum Platform Convenience Fee (₹)
          </label>
          <input
            type="number"
            value={form.minPlatformFee || 150}
            onChange={e => setForm({ ...form, minPlatformFee: Number(e.target.value) })}
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Minimum charge per verified session regardless of duration.
          </span>
        </div>

        <div className="admin-card" style={{ padding: '18px', margin: 0 }}>
          <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Promotional Voucher Platform Share (%)
          </label>
          <input
            type="number"
            value={form.promoDiscountSharePct || 50}
            onChange={e => setForm({ ...form, promoDiscountSharePct: Number(e.target.value) })}
            style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Platform absorbs 50% of WELCOME / campaign discounts.
          </span>
        </div>
      </div>

      {/* Service-Specific Commission Rates */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
          Service-Specific Commission Matrix
        </h3>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Commission %</th>
                <th>Partner Payout Rate</th>
                <th>Min Booking Hours</th>
              </tr>
            </thead>
            <tbody>
              {(form.services || []).map((svc, idx) => (
                <tr key={svc.serviceId || idx}>
                  <td>
                    <strong style={{ color: '#fff' }}>{svc.name}</strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Platonic Companion</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        value={svc.commissionPct}
                        onChange={e => handleServiceCommissionChange(idx, e.target.value)}
                        style={{ width: '80px', padding: '4px 8px', fontSize: '0.85rem' }}
                      />
                      <span style={{ color: '#c084fc', fontWeight: 700 }}>%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{100 - svc.commissionPct}%</span>
                  </td>
                  <td>
                    <span style={{ color: '#cbd5e1' }}>{svc.minBookingHours || 2} Hours</span>
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
