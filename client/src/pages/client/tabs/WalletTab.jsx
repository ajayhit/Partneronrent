import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  RotateCcw
} from 'lucide-react';

const INITIAL_WALLET_TRANSACTIONS = [
  { id: 'WLT-10492', type: 'credit', title: 'Top-up via UPI', amount: 2000, date: '2026-09-24 18:30', status: 'completed' },
  { id: 'WLT-10450', type: 'debit', title: 'Booking #BK-10025 Payment', amount: 1500, date: '2026-09-28 14:30', status: 'completed' },
  { id: 'WLT-10388', type: 'credit', title: 'Dispute Refund #CMP-8012', amount: 1800, date: '2026-09-02 16:45', status: 'completed' },
  { id: 'WLT-10310', type: 'credit', title: 'Promotional Welcome Bonus', amount: 250, date: '2026-08-20 10:00', status: 'completed' }
];

export default function WalletTab({ client, onTopupWallet, showToast }) {
  const [walletBalance, setWalletBalance] = useState(client?.walletBalance || 4500);
  const promotionalCredits = 350;
  const refundCredits = 1800;

  const [topupAmount, setTopupAmount] = useState(1000);
  const [submitting, setSubmitting] = useState(false);
  const [transactions, setTransactions] = useState(INITIAL_WALLET_TRANSACTIONS);

  const handleTopup = (e) => {
    e.preventDefault();
    if (!topupAmount || topupAmount < 100) {
      showToast('Minimum top-up is ₹100', 'warning');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newBal = walletBalance + Number(topupAmount);
      setWalletBalance(newBal);
      setTransactions([
        {
          id: `WLT-${Date.now().toString().slice(-5)}`,
          type: 'credit',
          title: 'Top-up via UPI / Card',
          amount: Number(topupAmount),
          date: 'Just now',
          status: 'completed'
        },
        ...transactions
      ]);
      setSubmitting(false);
      showToast(`${formatCurrency(topupAmount)} added to your Hirer Wallet!`);
    }, 500);
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          💰 Hirer Wallet & Credit Reserves
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          One-click booking checkout, zero bank processing delays, and instant dispute refund credits.
        </p>
      </div>

      {/* Balance Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
        borderRadius: '18px',
        padding: '32px',
        color: '#ffffff',
        boxShadow: '0 8px 30px rgba(236, 72, 153, 0.35)',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9, marginBottom: '6px' }}>
              Available Wallet Balance
            </div>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {formatCurrency(walletBalance)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.95 }}>
              <ShieldCheck size={18} /> 100% Escrow Protected by PartnerOnRent
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'right' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, textTransform: 'uppercase' }}>Promotional Credits</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fef08a' }}>{formatCurrency(promotionalCredits)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 16px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.74rem', opacity: 0.85, textTransform: 'uppercase' }}>Refund Credits</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#86efac' }}>{formatCurrency(refundCredits)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* Add Money Form */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-title" style={{ marginBottom: '16px' }}>
            <PlusCircle size={18} color="#ec4899" />
            <span>Add Funds to Wallet</span>
          </div>

          <form onSubmit={handleTopup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                Select Recharge Amount
              </label>

              {/* Quick chips */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      background: topupAmount === amt ? '#ec4899' : 'rgba(255, 255, 255, 0.06)',
                      color: topupAmount === amt ? '#fff' : '#cbd5e1',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="100"
                step="50"
                value={topupAmount}
                onChange={e => setTopupAmount(Number(e.target.value))}
                style={{ width: '100%', fontSize: '1.1rem', fontWeight: 800 }}
                required
              />
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={14} color="#34d399" />
              <span>Supports UPI (GPay, PhonePe, Paytm), Debit & Credit Cards, NetBanking</span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                padding: '12px',
                fontSize: '0.96rem',
                fontWeight: 700
              }}
            >
              {submitting ? 'Processing Payment...' : `Add ${formatCurrency(topupAmount)} Now`}
            </button>
          </form>
        </div>

        {/* Benefits Explainer */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-title" style={{ marginBottom: '14px' }}>
            <Sparkles size={18} color="#fbbf24" />
            <span>Why Use Hirer Wallet?</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#fff' }}>Instant 1-Click Checkout:</strong> Book companions instantly without bank OTP delays or failed gateway redirects.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#fff' }}>Instant Cancellation Refunds:</strong> If a companion cancels or a dispute is resolved in your favor, money credits immediately back to your wallet.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#fff' }}>Exclusive Bonus Credits:</strong> Regular top-ups receive special cinema and coffee companion promotional discount codes.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Wallet Transactions Ledger */}
      <div className="client-panel">
        <div className="client-panel-title" style={{ marginBottom: '16px' }}>
          <RotateCcw size={18} color="#38bdf8" />
          <span>Wallet Transactions Activity</span>
        </div>

        <div className="client-table-container">
          <table className="client-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Activity Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td><strong style={{ color: '#38bdf8' }}>#{t.id}</strong></td>
                  <td><span style={{ fontWeight: 600, color: '#fff' }}>{t.title}</span></td>
                  <td>
                    <span className={`client-badge ${t.type === 'credit' ? 'client-badge-emerald' : 'client-badge-rose'}`}>
                      {t.type === 'credit' ? '+ Credit' : '- Debit'}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: t.type === 'credit' ? '#34d399' : '#f87171' }}>
                      {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                    </strong>
                  </td>
                  <td><span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{t.date}</span></td>
                  <td><span className="client-badge client-badge-emerald">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
