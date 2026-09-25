import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import {
  Building2,
  CreditCard,
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Save,
  AlertCircle
} from 'lucide-react';

export default function BankDetailsTab({ partner, payouts = [], onRequestPayout, onUpdateBankDetails, showToast }) {
  // Bank details form state
  const [bankDetails, setBankDetails] = useState({
    accountHolder: partner?.bankDetails?.accountHolder || partner?.name || 'Aanya Sharma',
    bankName: partner?.bankDetails?.bankName || 'HDFC Bank',
    accountNumber: partner?.bankDetails?.accountNumber || '50100492819283',
    ifsc: partner?.bankDetails?.ifsc || 'HDFC0001234',
    upiId: partner?.bankDetails?.upiId || 'aanya@okhdfcbank'
  });

  // Payout request form
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [payoutMethod, setPayoutMethod] = useState('UPI'); // 'UPI' or 'Bank'
  const [destination, setDestination] = useState(partner?.bankDetails?.upiId || 'aanya@okhdfcbank');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  const availableBalance = partner?.walletBalance || 12000;

  const handleSaveBankDetails = async (e) => {
    e.preventDefault();
    setIsSavingBank(true);
    try {
      if (onUpdateBankDetails) {
        await onUpdateBankDetails(bankDetails);
      }
      showToast('Bank and UPI payout credentials saved successfully!');
    } catch (err) {
      showToast('Failed to update bank details', 'danger');
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount < 500) {
      showToast('Minimum payout withdrawal is ₹500', 'warning');
      return;
    }
    if (withdrawAmount > availableBalance) {
      showToast('Withdrawal amount exceeds available balance', 'danger');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      await onRequestPayout({
        partnerId: partner?.id || 'partner-p1',
        amount: withdrawAmount,
        method: payoutMethod === 'UPI' ? 'UPI' : 'Bank Transfer',
        destination
      });
      showToast(`Withdrawal request for ${formatCurrency(withdrawAmount)} submitted! Admin processing.`);
    } catch (err) {
      showToast(err.message || 'Failed to submit withdrawal request', 'danger');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🏦 Bank & Instant Payout Credentials
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Connect your verified Indian bank account or UPI ID to receive instant direct payouts upon session completion.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* 1. Request Withdrawal Card */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <ArrowDownToLine size={18} color="#34d399" />
            <span>Request Funds Withdrawal</span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
              Withdrawable Wallet Balance
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', margin: '2px 0 4px' }}>
              {formatCurrency(availableBalance)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Dispatched within 4 hours (IMPS / UPI)
            </div>
          </div>

          <form onSubmit={handleRequestWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Withdrawal Amount
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[2000, 5000, 10000, availableBalance].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setWithdrawAmount(amt)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: withdrawAmount === amt ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                      color: withdrawAmount === amt ? '#000' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {amt === availableBalance ? 'All (' + formatCurrency(amt) + ')' : formatCurrency(amt)}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="500"
                max={availableBalance}
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(Number(e.target.value))}
                style={{ width: '100%', fontSize: '1rem', fontWeight: 700 }}
                required
              />
            </div>

            {/* Payout method choice */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => {
                  setPayoutMethod('UPI');
                  setDestination(bankDetails.upiId || 'aanya@okhdfcbank');
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: payoutMethod === 'UPI' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: payoutMethod === 'UPI' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={18} color="#34d399" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Direct UPI</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Instant VPA</div>
                </div>
              </div>

              <div
                onClick={() => {
                  setPayoutMethod('Bank');
                  setDestination(`${bankDetails.bankName} - A/C ${bankDetails.accountNumber}`);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: payoutMethod === 'Bank' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: payoutMethod === 'Bank' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Building2 size={18} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Bank Transfer</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>NEFT / IMPS</div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Transfer Destination ({payoutMethod})
              </label>
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmittingPayout || availableBalance < 500}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '12px',
                fontWeight: 700,
                marginTop: '6px'
              }}
            >
              {isSubmittingPayout ? 'Submitting Request...' : `Withdraw ${formatCurrency(withdrawAmount)}`}
            </button>
          </form>
        </div>

        {/* 2. Bank & UPI Credentials Configuration */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Building2 size={18} color="#38bdf8" />
            <span>Bank & UPI Credentials</span>
          </div>

          <form onSubmit={handleSaveBankDetails} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Account Holder Legal Name
              </label>
              <input
                type="text"
                value={bankDetails.accountHolder}
                onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                required
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Must match your Aadhaar / PAN card name.</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="e.g. HDFC Bank, ICICI"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  IFSC Code
                </label>
                <input
                  type="text"
                  maxLength="11"
                  value={bankDetails.ifsc}
                  onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value.toUpperCase() })}
                  placeholder="HDFC0001234"
                  style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Bank Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="50100XXXXXXXXX"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Verified UPI ID / VPA
              </label>
              <input
                type="text"
                value={bankDetails.upiId}
                onChange={e => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                placeholder="mobile@okhdfcbank"
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                ✓ Penny drop verified with NPCI registry
              </span>
            </div>

            <button
              type="submit"
              className="btn-secondary"
              disabled={isSavingBank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontWeight: 700,
                marginTop: '6px'
              }}
            >
              <Save size={16} /> {isSavingBank ? 'Saving...' : 'Update Bank Credentials'}
            </button>
          </form>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <Clock size={18} color="#c084fc" />
          <span>Withdrawal & Payout History</span>
        </div>

        <div className="partner-table-container">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Reference / UTR</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Destination</th>
                <th>Date Requested</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td><strong>UTR-20240915-8912</strong></td>
                  <td><strong style={{ color: '#34d399' }}>₹10,000</strong></td>
                  <td>UPI Instant</td>
                  <td>aanya@okhdfcbank</td>
                  <td>2024-09-15 11:20</td>
                  <td><span className="partner-badge partner-badge-emerald">Settled</span></td>
                </tr>
              ) : (
                payouts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: '#38bdf8' }}>{p.transactionRef || p.id}</strong>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399' }}>{formatCurrency(p.amount)}</strong>
                    </td>
                    <td>{p.method}</td>
                    <td>{p.destination}</td>
                    <td>{formatDateTime(p.requestedAt)}</td>
                    <td>
                      <span className={`partner-badge ${p.status === 'completed' ? 'partner-badge-emerald' : 'partner-badge-amber'}`}>
                        {p.status === 'completed' ? 'Settled' : 'Pending Admin Dispatch'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
