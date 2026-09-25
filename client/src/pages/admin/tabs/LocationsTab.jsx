import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  TrendingUp, 
  Users, 
  HeartHandshake,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function LocationsTab({
  locations = [],
  onAddCity,
  onToggleCity
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCityForm, setNewCityForm] = useState({
    stateName: 'Delhi NCR',
    cityName: '',
    areas: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCityForm.cityName.trim()) return;
    setLoading(true);
    const areasList = newCityForm.areas.split(',').map(s => s.trim()).filter(Boolean);
    await onAddCity(newCityForm.stateName, newCityForm.cityName.trim(), areasList);
    setNewCityForm({ stateName: 'Delhi NCR', cityName: '', areas: '' });
    setShowAddModal(false);
    setLoading(false);
  };

  return (
    <div>
      {/* Top Header & Action */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#38bdf8" /> City & Geographic Footprint
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Expansion matrix across 20+ Indian metropolitan regions and culture hubs.
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-admin-action btn-admin-primary"
        >
          <Plus size={14} /> Add New City / Cluster
        </button>
      </div>

      {/* State & City Hierarchical Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {locations.map((st, sIdx) => (
          <div key={sIdx} className="admin-card" style={{ padding: '20px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#38bdf8' }}>
                📍 {st.state}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {st.cities.length} Active City Hubs
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {st.cities.map((city, cIdx) => (
                <div key={cIdx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{city.name}</span>
                      <button
                        onClick={() => onToggleCity(city.name)}
                        className={`admin-badge ${city.isActive ? 'admin-badge-emerald' : 'admin-badge-rose'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Click to toggle availability"
                      >
                        {city.isActive ? 'ACTIVE' : 'PAUSED'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '10px' }}>
                      <div>Partners: <strong style={{ color: '#38bdf8' }}>{city.partnerCount || 4}</strong></div>
                      <div>Customers: <strong style={{ color: '#34d399' }}>{city.customerCount || 35}</strong></div>
                      <div>Bookings: <strong>{city.bookingCount || 18}</strong></div>
                      <div>Revenue: <strong style={{ color: '#fbbf24' }}>{formatCurrency(city.totalRevenue || 45000)}</strong></div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '4px' }}>Popular Localities:</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(city.areas || ['Central', 'Market Area']).slice(0, 3).map((a, aIdx) => (
                        <span key={aIdx} style={{
                          fontSize: '0.68rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          color: '#94a3b8'
                        }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: '480px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>Add City / Territory</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>State / Region</label>
                <input
                  type="text"
                  value={newCityForm.stateName}
                  onChange={e => setNewCityForm({ ...newCityForm, stateName: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>City Name</label>
                <input
                  type="text"
                  placeholder="e.g. Udaipur, Chandigarh, Lucknow"
                  value={newCityForm.cityName}
                  onChange={e => setNewCityForm({ ...newCityForm, cityName: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Key Localities (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Sector 17, Lake Club, Elante Mall"
                  value={newCityForm.areas}
                  onChange={e => setNewCityForm({ ...newCityForm, areas: e.target.value })}
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
                  disabled={loading}
                  className="btn-admin-action btn-admin-primary"
                >
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
