import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { fetchPayouts, requestPayout, fetchPartnerById } from '../../utils/api';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { 
  Wallet, 
  ArrowDownToLine, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Building2, 
  CreditCard,
  ShieldCheck,
  Percent
} from 'lucide-react';

export default function PartnerEarnings() {
  const { activePartner } = useAuth();
  const { showToast } = useApp();
  const [partner, setPartner] = useState(activePartner || null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payout request form
  const [withdrawAmount, setWithdrawAmount] = useState(5000);
  const [payoutMethod, setPayoutMethod] = useState('UPI'); // 'UPI' or 'Bank'
  const [destination, setDestination] = useState(partner?.bankDetails?.upiId || 'aanya@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [activePartner?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [partnerData, payoutData] = await Promise.all([
        fetchPartnerById(activePartner?.id || 'partner-p1'),
        fetchPayouts({ partnerId: activePartner?.id || 'partner-p1' })
      ]);
      if (partnerData) setPartner(partnerData);
      if (payoutData) setPayouts(payoutData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount < 500) {
      alert('Minimum payout withdrawal is ₹500.');
      return;
    }
    if (withdrawAmount > (partner?.walletBalance || 0)) {
      alert('Withdrawal amount exceeds available wallet balance.');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestPayout({
        partnerId: partner.id,
        amount: withdrawAmount,
        method: payoutMethod === 'UPI' ? 'UPI' : 'Bank Transfer',
        destination
      });
      showToast(`Payout request for ${formatCurrency(withdrawAmount)} submitted! Admin processing.`);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to submit payout request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '70px', maxWidth: '900px' }}>
      
      {/* Title */}
      <div style={{ padding: '24px 0 10px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Partner Earnings & Payouts</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Transparent 80/20 earnings split. Withdraw your money anytime directly to your UPI ID or Bank account.
        </p>
      </div>

      {/* Balance & Split Card */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        color: '#fff',
        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.35)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9, marginBottom: '6px' }}>
              Withdrawable Wallet Balance
            </div>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {formatCurrency(partner?.walletBalance || 0)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.95 }}>
              <CheckCircle2 size={18} /> Processed within 24 hours of admin review
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', opacity: 0.9 }}>Lifetime Earned</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formatCurrency(partner?.totalEarnings || 0)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>80% Net Share</div>
          </div>
        </div>
      </div>

      {/* 80/20 Breakdown explainer banner */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Percent size={24} color="#34d399" />
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
              How You Get Paid (80% Partner Take-Home)
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Example: 3-hour session at ₹1,500/hr = ₹4,500 base. You receive ₹3,600 (80%). Platform retains 20% for insurance, verification, and safety.
            </div>
          </div>
        </div>
      </div>

      {/* Request Payout Form */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowDownToLine size={20} color="#34d399" /> Request Funds Withdrawal
        </h3>

        <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick amount pills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Select Amount to Withdraw
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {[2000, 5000, 10000, partner?.walletBalance || 0].map(amt => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setWithdrawAmount(amt)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: withdrawAmount === amt ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(15, 23, 42, 0.6)',
                    border: withdrawAmount === amt ? 'none' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {amt === partner?.walletBalance ? 'Withdraw All (' + formatCurrency(amt) + ')' : formatCurrency(amt)}
                </button>
              ))}
            </div>

            <input 
              type="number"
              min="500"
              max={partner?.walletBalance || 0}
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(Number(e.target.value))}
              style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
              required
            />
          </div>

          {/* Withdrawal Destination (UPI vs Bank) */}
          <div className="grid-2">
            <div
              onClick={() => {
                setPayoutMethod('UPI');
                setDestination(partner?.bankDetails?.upiId || 'aanya@okhdfcbank');
              }}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: payoutMethod === 'UPI' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                background: payoutMethod === 'UPI' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <CreditCard size={20} color="#34d399" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>Direct UPI Transfer</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Instant settlement to VPA</div>
              </div>
            </div>

            <div
              onClick={() => {
                setPayoutMethod('Bank');
                setDestination(`${partner?.bankDetails?.bankName || 'HDFC Bank'} - A/C ${partner?.bankDetails?.accountNumber || '50100492819283'}`);
              }}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                border: payoutMethod === 'Bank' ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                background: payoutMethod === 'Bank' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Building2 size={20} color="#38bdf8" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>NEFT / IMPS Bank Transfer</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Direct to Bank Account</div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Payout Destination ({payoutMethod})
            </label>
            <input 
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. mobile@upi or Bank Account number"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || !partner?.walletBalance || partner.walletBalance < 500}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '14px',
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? 'Submitting Request...' : `Submit Payout Request for ${formatCurrency(withdrawAmount)}`}
          </button>

        </form>
      </div>

      {/* Payout History Ledger */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Payout Requests History</h3>

        {payouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
            No past withdrawal requests found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {payouts.map(p => (
              <div 
                key={p.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{formatCurrency(p.amount)}</strong>
                    <span className={`badge ${p.status === 'completed' ? 'badge-verified' : 'badge-warning'}`}>
                      {p.status === 'completed' ? 'Paid / Settled' : 'Pending Admin Dispatch'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Method: {p.method} • Destination: {p.destination}
                  </div>
                  {p.transactionRef && (
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                      Bank UTR / Ref: {p.transactionRef}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748b' }}>
                  <div>Requested: {formatDateTime(p.requestedAt)}</div>
                  {p.processedAt && <div style={{ color: '#34d399' }}>Processed: {formatDateTime(p.processedAt)}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
