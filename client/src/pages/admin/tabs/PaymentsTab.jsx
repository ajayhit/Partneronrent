import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function PaymentsTab({
  transactions = [],
  subFilter = 'all',
  setSubFilter
}) {
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(t => {
    if (subFilter === 'refunds' && t.status !== 'refunded' && t.status !== 'partial_refund') return false;
    if (subFilter === 'gateway' && !t.paymentMethod?.toLowerCase().includes('razorpay')) return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        t.id?.toLowerCase().includes(q) ||
        t.bookingId?.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q) ||
        t.partnerName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header Controls */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Transactions ({transactions.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'refunds' ? 'active' : ''}`}
            onClick={() => setSubFilter('refunds')}
          >
            Refunds & Reversals ({transactions.filter(t => t.status === 'refunded' || t.status === 'partial_refund').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'gateway' ? 'active' : ''}`}
            onClick={() => setSubFilter('gateway')}
          >
            Gateway Settlement Logs
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search Txn ID, Booking ID, Customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Partner</th>
              <th>Gross Amount</th>
              <th>Gateway Fee</th>
              <th>Platform Commission</th>
              <th>Partner Amount</th>
              <th>Refund</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No payment transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{t.id}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{formatDateTime(t.date)}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{t.bookingId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.paymentMethod}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.partnerName}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{formatCurrency(t.amount)}</div>
                  </td>
                  <td>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>₹{t.gatewayFee || 0}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#c084fc' }}>{formatCurrency(t.platformCommission || 0)}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#34d399' }}>{formatCurrency(t.partnerAmount || 0)}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: t.refundAmount > 0 ? '#f87171' : '#64748b' }}>
                      {t.refundAmount > 0 ? `-${formatCurrency(t.refundAmount)}` : '₹0'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      t.status === 'successful' ? 'admin-badge-emerald' :
                      t.status === 'refunded' ? 'admin-badge-rose' :
                      t.status === 'partial_refund' ? 'admin-badge-amber' : 'admin-badge-gray'
                    }`}>
                      {t.status?.toUpperCase()}
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
