import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  ArrowUpRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Wallet, 
  X,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import { fetchAdminCustomers, fetchAdminPartners, fetchAdminTransactions } from '../../../utils/api';

export default function PaymentsTab({
  transactions = [],
  subFilter = 'all',
  setSubFilter,
  customers = [],
  partners = [],
  adminEmail = '',
  onCreditWallet,
  onRefresh
}) {
  const [search, setSearch] = useState('');
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [recipientType, setRecipientType] = useState('customer');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fallback states if parent props are empty
  const [localCustomers, setLocalCustomers] = useState([]);
  const [localPartners, setLocalPartners] = useState([]);
  const [localTransactions, setLocalTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [custs, pts, txns] = await Promise.all([
        fetchAdminCustomers().catch(() => []),
        fetchAdminPartners().catch(() => []),
        fetchAdminTransactions().catch(() => [])
      ]);
      if (Array.isArray(custs)) setLocalCustomers(custs);
      if (Array.isArray(pts)) setLocalPartners(pts);
      if (Array.isArray(txns)) setLocalTransactions(txns);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to load payments data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (customers.length === 0 || partners.length === 0 || transactions.length === 0) {
      loadData();
    }
  }, [customers.length, partners.length, transactions.length]);

  const effectiveCustomers = customers.length > 0 ? customers : localCustomers;
  const effectivePartners = partners.length > 0 ? partners : localPartners;
  const effectiveTransactions = transactions.length > 0 ? transactions : localTransactions;
  const recipients = recipientType === 'partner' ? effectivePartners : effectiveCustomers;

  // Auto-sync recipientId whenever recipients change or modal opens
  useEffect(() => {
    if (recipients.length > 0) {
      if (!recipientId || !recipients.some(r => r.id === recipientId)) {
        setRecipientId(recipients[0].id);
      }
    } else {
      setRecipientId('');
    }
  }, [recipientType, recipients, recipientId]);

  const openCreditModal = () => {
    setRecipientType('customer');
    const firstId = effectiveCustomers[0]?.id || '';
    setRecipientId(firstId);
    setAmount('');
    setReason('');
    setAdminPassword('');
    setSubmitError('');
    setShowCreditModal(true);
  };

  const handleRecipientTypeChange = (type) => {
    setRecipientType(type);
    const list = type === 'partner' ? effectivePartners : effectiveCustomers;
    setRecipientId(list[0]?.id || '');
  };

  const handleCreditSubmit = async (event) => {
    event.preventDefault();
    if (!recipientId) {
      setSubmitError('Please select a valid recipient.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await onCreditWallet({
        recipientType,
        recipientId,
        amount,
        reason,
        adminEmail,
        adminPassword
      });
      setSearch('');
      setSubFilter('wallet-credits');
      setShowCreditModal(false);
      // Reload local data to ensure instant update
      loadData();
    } catch (error) {
      setSubmitError(error.message || 'Wallet credit failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransactions = effectiveTransactions.filter(t => {
    if (subFilter === 'refunds' && t.status !== 'refunded' && t.status !== 'partial_refund') return false;
    if (subFilter === 'gateway' && !t.paymentMethod?.toLowerCase().includes('razorpay')) return false;
    if (subFilter === 'wallet-credits' && t.type !== 'wallet_credit') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        t.id?.toLowerCase().includes(q) ||
        t.bookingId?.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q) ||
        t.partnerName?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.userName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const walletCredits = effectiveTransactions.filter(transaction => transaction.type === 'wallet_credit');
  const totalWalletCredits = walletCredits.reduce(
    (total, transaction) => total + (Number(transaction.amount) || 0),
    0
  );

  return (
    <div>
      {/* Header Controls */}
      <div className="admin-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="admin-filter-tabs">
            <button
              className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSubFilter('all')}
            >
              All Transactions ({effectiveTransactions.length})
            </button>
            <button
              className={`admin-filter-btn ${subFilter === 'refunds' ? 'active' : ''}`}
              onClick={() => setSubFilter('refunds')}
            >
              Refunds & Reversals ({effectiveTransactions.filter(t => t.status === 'refunded' || t.status === 'partial_refund').length})
            </button>
            <button
              className={`admin-filter-btn ${subFilter === 'gateway' ? 'active' : ''}`}
              onClick={() => setSubFilter('gateway')}
            >
              Gateway Settlement Logs
            </button>
            <button
              className={`admin-filter-btn ${subFilter === 'wallet-credits' ? 'active' : ''}`}
              onClick={() => setSubFilter('wallet-credits')}
            >
              Wallet Credits ({walletCredits.length})
            </button>
          </div>
          <button
            type="button"
            className="btn-admin-action btn-admin-primary"
            onClick={openCreditModal}
          >
            <Plus size={14} /> Credit Wallet
          </button>
          <button
            type="button"
            className="btn-admin-action btn-admin-secondary"
            onClick={loadData}
            disabled={isRefreshing}
            title="Refresh transactions and accounts"
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} /> Refresh
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

      <div className="admin-stat-card" style={{ marginBottom: '16px' }}>
        <div className="admin-stat-label">Admin Wallet Credits</div>
        <div className="admin-stat-value" style={{ color: '#34d399' }}>
          {formatCurrency(totalWalletCredits)}
        </div>
        <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
          {walletCredits.length} successful wallet credit{walletCredits.length === 1 ? '' : 's'} recorded
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Booking / Type</th>
              <th>Customer</th>
              <th>Partner</th>
              <th>Details</th>
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
                <td colSpan="11" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No payment transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{t.id}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{formatDateTime(t.date || t.createdAt)}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                      {t.type === 'wallet_credit' ? 'Wallet credit' : t.bookingId || '—'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.customerName || (t.userRole !== 'partner' ? t.userName : '—')}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.paymentMethod}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.partnerName || (t.userRole === 'partner' ? t.userName : '—')}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{t.description || '—'}</div>
                    {t.type === 'wallet_credit' && (
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>By {t.adminName || 'Admin'}</div>
                    )}
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

      {showCreditModal && (
        <div className="admin-modal-backdrop" onClick={() => !submitting && setShowCreditModal(false)}>
          <div
            className="admin-modal-content"
            style={{ maxWidth: '480px', padding: '24px' }}
            onClick={event => event.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={19} color="#38bdf8" /> Credit Wallet
              </h2>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                disabled={submitting}
                aria-label="Close wallet credit form"
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px' }}>
              Add funds to a customer's or partner's in-app wallet. This does not send money to a bank.
            </p>
            <form onSubmit={handleCreditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Recipient type
                <select
                  value={recipientType}
                  onChange={event => handleRecipientTypeChange(event.target.value)}
                  disabled={submitting}
                  required
                  style={{ display: 'block', width: '100%', marginTop: '5px' }}
                >
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                </select>
              </label>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Recipient
                <select
                  value={recipientId}
                  onChange={event => setRecipientId(event.target.value)}
                  disabled={submitting || recipients.length === 0}
                  required
                  style={{ display: 'block', width: '100%', marginTop: '5px' }}
                >
                  {recipients.length === 0 ? (
                    <option value="">No {recipientType} accounts available</option>
                  ) : (
                    recipients.map(recipient => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name || 'Account'} — {recipient.email || recipient.phone || recipient.id}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Amount (₹)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={event => setAmount(event.target.value)}
                  disabled={submitting}
                  required
                  style={{ display: 'block', width: '100%', marginTop: '5px' }}
                />
              </label>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Reason
                <input
                  type="text"
                  maxLength="500"
                  value={reason}
                  onChange={event => setReason(event.target.value)}
                  disabled={submitting}
                  required
                  placeholder="e.g. Promotional wallet credit"
                  style={{ display: 'block', width: '100%', marginTop: '5px' }}
                />
              </label>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Confirm with admin password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={event => setAdminPassword(event.target.value)}
                  disabled={submitting}
                  required
                  style={{ display: 'block', width: '100%', marginTop: '5px' }}
                />
              </label>
              {submitError && (
                <div role="alert" style={{ color: '#f87171', fontSize: '0.82rem' }}>{submitError}</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="btn-admin-action btn-admin-secondary"
                  onClick={() => setShowCreditModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-admin-action btn-admin-primary"
                  disabled={submitting || recipients.length === 0}
                >
                  {submitting ? 'Processing…' : 'Confirm Wallet Credit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
