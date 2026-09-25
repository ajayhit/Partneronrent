import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Ban, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function CustomersTab({
  customers = [],
  subFilter = 'all',
  setSubFilter,
  onSelectCustomer,
  onUpdateCustomerStatus
}) {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(c => {
    // Filter by subFilter
    if (subFilter === 'active' && c.status !== 'active') return false;
    if (subFilter === 'suspended' && c.status !== 'suspended') return false;
    if (subFilter === 'blocked' && c.status !== 'blocked') return false;
    if (subFilter === 'pending' && c.status !== 'pending_verification') return false;

    // Search query
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      const matchCity = c.city?.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchCity;
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
            All Customers ({customers.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSubFilter('active')}
          >
            Active ({customers.filter(c => c.status === 'active').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setSubFilter('suspended')}
          >
            Suspended ({customers.filter(c => c.status === 'suspended').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'blocked' ? 'active' : ''}`}
            onClick={() => setSubFilter('blocked')}
          >
            Blocked ({customers.filter(c => c.status === 'blocked').length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>City</th>
              <th>KYC Status</th>
              <th>Account Status</th>
              <th>Bookings</th>
              <th>Wallet</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No customer records match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredCustomers.map(cust => (
                <tr key={cust.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                        alt={cust.name}
                        style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{cust.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>{cust.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.84rem' }}>{cust.phone}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{cust.email}</div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.84rem' }}>
                      <MapPin size={12} color="#38bdf8" /> {cust.city || 'Delhi NCR'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${cust.kycStatus === 'verified' ? 'admin-badge-emerald' : 'admin-badge-amber'}`}>
                      {cust.kycStatus ? cust.kycStatus.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      cust.status === 'active' ? 'admin-badge-emerald' :
                      cust.status === 'suspended' ? 'admin-badge-amber' :
                      cust.status === 'blocked' ? 'admin-badge-rose' : 'admin-badge-cyan'
                    }`}>
                      {cust.status ? cust.status.toUpperCase() : 'ACTIVE'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{cust.totalBookings || 0}</div>
                    <div style={{ fontSize: '0.72rem', color: cust.cancellationsCount > 0 ? '#f87171' : '#64748b' }}>
                      {cust.cancellationsCount || 0} cancels
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#34d399' }}>
                      {formatCurrency(cust.walletBalance || 0)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onSelectCustomer(cust)}
                        className="btn-admin-action btn-admin-primary"
                        title="View Full Customer Dossier"
                      >
                        <ExternalLink size={13} /> Dossier
                      </button>
                      {cust.status === 'active' ? (
                        <button
                          onClick={() => onUpdateCustomerStatus(cust.id, 'blocked', 'Blocked via customer directory')}
                          className="btn-admin-action btn-admin-danger"
                          title="Block Customer"
                        >
                          <Ban size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateCustomerStatus(cust.id, 'active', 'Re-activated via customer directory')}
                          className="btn-admin-action btn-admin-success"
                          title="Activate Customer"
                        >
                          <CheckCircle2 size={13} />
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
