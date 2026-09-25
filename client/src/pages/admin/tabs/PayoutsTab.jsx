import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function PayoutsTab({
  payouts = [],
  partners = [],
  subFilter = 'pending',
  setSubFilter,
  onApprovePayout
}) {
  const [txnRefs, setTxnRefs] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredPayouts = payouts.filter(p => {
    if (subFilter === 'pending' && p.status !== 'pending') return false;
    if (subFilter === 'completed' && p.status !== 'completed') return false;
    if (subFilter === 'failed' && p.status !== 'failed') return false;
    return true;
  });

  const totalPendingPayouts = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalSettledPayouts = payouts.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  const handleApprove = async (payoutId) => {
    const ref = txnRefs[payoutId] || `CMS${Date.now().toString().slice(-8)}`;
    setLoading(true);
    await onApprovePayout(payoutId, ref);
    setLoading(false);
  };

  return (
    <div>
      {/* Wallet & Payout Pipeline Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '22px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Pending Payout Requests</span>
            <Clock size={14} color="#fbbf24" />
          </div>
          <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
            {formatCurrency(totalPendingPayouts)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            {payouts.filter(p => p.status === 'pending').length} partners awaiting disbarment
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Settled Payouts (Lifetime)</span>
            <CheckCircle2 size={14} color="#34d399" />
          </div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            {formatCurrency(totalSettledPayouts)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            Zero settlement disputes
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Settlement Cycle</span>
            <ArrowUpRight size={14} color="#38bdf8" />
          </div>
          <div className="admin-stat-value" style={{ color: '#38bdf8' }}>
            T+1 Instant
          </div>
          <div className="admin-stat-footer" style={{ color: '#cbd5e1' }}>
            Automated NEFT / IMPS / UPI
          </div>
        </div>
      </div>

      {/* Payout Flow Visual Banner */}
      <div className="admin-card" style={{ padding: '14px 20px', marginBottom: '20px', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
        <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
          Partner Settlement Protocol
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
          <span>Booking Completed</span> →
          <span>Payment Settled</span> →
          <span>Commission Deducted</span> →
          <span>Partner Wallet Balance</span> →
          <span>Withdrawal Requested</span> →
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Admin Approval & UTR Ref</span> →
          <span style={{ color: '#34d399', fontWeight: 700 }}>Direct Bank/UPI Payout</span>
        </div>
      </div>

      {/* Header Tabs */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setSubFilter('pending')}
          >
            Pending Approval ({payouts.filter(p => p.status === 'pending').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setSubFilter('completed')}
          >
            Settled Disbursals ({payouts.filter(p => p.status === 'completed').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Requests ({payouts.length})
          </button>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Payout ID</th>
              <th>Partner</th>
              <th>Amount</th>
              <th>Payout Method</th>
              <th>Bank / UPI Destination</th>
              <th>Requested Date</th>
              <th>UTR / Reference</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayouts.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No payout records matching this view.
                </td>
              </tr>
            ) : (
              filteredPayouts.map(p => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{p.id}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{p.partnerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.partnerId}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#34d399' }}>
                      {formatCurrency(p.amount)}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                      {p.method === 'UPI' ? <Smartphone size={13} color="#38bdf8" /> : <Building size={13} color="#fbbf24" />}
                      {p.method}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      {p.destination}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{formatDateTime(p.requestedAt)}</span>
                  </td>
                  <td>
                    {p.status === 'completed' ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#34d399' }}>
                        {p.transactionRef}
                      </span>
                    ) : (
                      <input
                        type="text"
                        placeholder="CMS UTR Reference..."
                        value={txnRefs[p.id] || ''}
                        onChange={e => setTxnRefs({ ...txnRefs, [p.id]: e.target.value })}
                        style={{ fontSize: '0.76rem', padding: '4px 8px', width: '130px' }}
                      />
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${p.status === 'completed' ? 'admin-badge-emerald' : 'admin-badge-amber'}`}>
                      {p.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {p.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                        className="btn-admin-action btn-admin-success"
                        title="Approve & Disburse Payout"
                      >
                        <CheckCircle2 size={13} /> Settle
                      </button>
                    )}
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
