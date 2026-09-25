import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Sliders
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function ServicesTab({
  services = [],
  onAddService,
  onUpdateService
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    tagline: '',
    basePrice: 1500,
    category: 'Social',
    description: '',
    commissionPct: 15,
    minHours: 2
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setForm({
      id: '',
      name: '',
      tagline: '',
      basePrice: 1500,
      category: 'Social',
      description: '',
      commissionPct: 15,
      minHours: 2
    });
    setShowModal(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setForm({
      id: svc.id,
      name: svc.name,
      tagline: svc.tagline || '',
      basePrice: svc.basePrice || 1500,
      category: svc.category || 'Social',
      description: svc.description || '',
      commissionPct: svc.commissionPct || 15,
      minHours: svc.minHours || 2
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingService) {
      await onUpdateService(editingService.id, form);
    } else {
      await onAddService(form);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#38bdf8" /> Companion Services Catalog
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Configure platonic service categories, base hourly pricing floors, minimum durations & commissions.
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-admin-action btn-admin-primary"
        >
          <Plus size={14} /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {services.map(svc => (
          <div key={svc.id} className="admin-card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {svc.category || 'Social'}
                </span>
                <span className={`admin-badge ${svc.active !== false ? 'admin-badge-emerald' : 'admin-badge-rose'}`}>
                  {svc.active !== false ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                {svc.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '12px' }}>
                {svc.tagline}
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '14px',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Base Hourly Rate:</span>
                  <strong style={{ color: '#34d399' }}>₹{svc.basePrice}/hr</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Platform Commission:</span>
                  <strong style={{ color: '#c084fc' }}>{svc.commissionPct || 15}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Min Booking Duration:</span>
                  <strong style={{ color: '#fff' }}>{svc.minHours || 2} Hours</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
              <button
                onClick={() => handleOpenEdit(svc)}
                className="btn-admin-action btn-admin-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Edit3 size={13} /> Edit Config
              </button>
              <button
                onClick={() => onUpdateService(svc.id, { active: svc.active === false ? true : false })}
                className={`btn-admin-action ${svc.active !== false ? 'btn-admin-danger' : 'btn-admin-success'}`}
              >
                {svc.active !== false ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Editor Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: '520px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingService ? `Edit Service: ${editingService.name}` : 'Create Companion Service'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Cinema Premiere Companion"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tagline / Catchphrase</label>
                <input
                  type="text"
                  placeholder="e.g. Enjoy premieres and post-movie coffee"
                  value={form.tagline}
                  onChange={e => setForm({ ...form, tagline: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Base Price (₹)</label>
                  <input
                    type="number"
                    value={form.basePrice}
                    onChange={e => setForm({ ...form, basePrice: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Commission %</label>
                  <input
                    type="number"
                    value={form.commissionPct}
                    onChange={e => setForm({ ...form, commissionPct: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Min Hours</label>
                  <input
                    type="number"
                    value={form.minHours}
                    onChange={e => setForm({ ...form, minHours: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Social">Social</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Travel">Travel</option>
                  <option value="Care">Care</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description & Scope</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%' }}
                />
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
