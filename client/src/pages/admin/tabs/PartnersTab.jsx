import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  ShieldCheck, 
  Ban, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Star,
  DollarSign,
  Radio
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function PartnersTab({
  partners = [],
  subFilter = 'all',
  setSubFilter,
  onSelectPartner,
  onUpdatePartnerStatus,
  onUpdateKYC
}) {
  const [search, setSearch] = useState('');

  const filteredPartners = partners.filter(p => {
    if (subFilter === 'new' && p.status !== 'new_application' && p.kycStatus !== 'pending') return false;
    if (subFilter === 'verified' && p.kycStatus !== 'verified') return false;
    if (subFilter === 'suspended' && p.status !== 'suspended') return false;
    if (subFilter === 'blocked' && p.status !== 'blocked') return false;
    if (subFilter === 'online' && !p.isOnline) return false;
    if (subFilter === 'offline' && p.isOnline) return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      const matchTag = p.tagline?.toLowerCase().includes(q);
      const matchLang = p.languages?.some(l => l.toLowerCase().includes(q));
      return matchName || matchCity || matchTag || matchLang;
    }
    return true;
  });

  return (
    <div>
      {/* Table Header Controls */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Partners ({partners.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'new' ? 'active' : ''}`}
            onClick={() => setSubFilter('new')}
          >
            New Applications ({partners.filter(p => p.kycStatus === 'pending' || p.status === 'new_application').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'verified' ? 'active' : ''}`}
            onClick={() => setSubFilter('verified')}
          >
            Verified ({partners.filter(p => p.kycStatus === 'verified').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setSubFilter('suspended')}
          >
            Suspended ({partners.filter(p => p.status === 'suspended').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'blocked' ? 'active' : ''}`}
            onClick={() => setSubFilter('blocked')}
          >
            Blocked ({partners.filter(p => p.status === 'blocked').length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search partner by name, city, skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Partner Data Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>City & Locality</th>
              <th>Hourly Rate</th>
              <th>Rating & Hours</th>
              <th>KYC Status</th>
              <th>Availability</th>
              <th>Cancel Rate</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No partner records match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredPartners.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.tagline || 'Verified Companion'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{p.city}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {p.areas?.[0] || 'Central Area'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>₹{p.hourlyRate}/hr</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.services?.length || 1} services</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#fbbf24' }}>
                      <Star size={12} fill="#fbbf24" /> {p.rating || 5.0}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.completedHours || 0} hrs completed</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      p.kycStatus === 'verified' ? 'admin-badge-emerald' :
                      p.kycStatus === 'pending' ? 'admin-badge-amber' :
                      p.kycStatus === 'rejected' ? 'admin-badge-rose' : 'admin-badge-cyan'
                    }`}>
                      {p.kycStatus ? p.kycStatus.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${p.isOnline ? 'admin-badge-emerald' : 'admin-badge-gray'}`}>
                      {p.isOnline ? 'LIVE ONLINE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: p.cancellationRate?.startsWith('0') ? '#34d399' : '#cbd5e1' }}>
                      {p.cancellationRate || '1.8%'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onSelectPartner(p)}
                        className="btn-admin-action btn-admin-primary"
                        title="View Full Partner Dossier"
                      >
                        <ExternalLink size={13} /> Dossier
                      </button>
                      {p.kycStatus === 'pending' && (
                        <button
                          onClick={() => onUpdateKYC(p.id, 'verified', 'Approved via quick verify')}
                          className="btn-admin-action btn-admin-success"
                          title="Quick Approve KYC"
                        >
                          <ShieldCheck size={13} />
                        </button>
                      )}
                    </div>
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
