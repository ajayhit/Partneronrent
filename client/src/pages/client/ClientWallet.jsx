import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { topupWallet, fetchWallet } from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ClientWallet() {
  const { activeUser, setActiveUser } = useAuth();
  const { showToast } = useApp();
  const [topupAmount, setTopupAmount] = useState(2000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!topupAmount || topupAmount < 100) {
      alert('Minimum top-up is ₹100');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await topupWallet(activeUser?.id || 'client-1', topupAmount);
      setActiveUser(prev => ({ ...prev, walletBalance: res.walletBalance }));
      showToast(`Wallet topped up by ${formatCurrency(topupAmount)} successfully!`);
      setSuccessMsg(`Added ${formatCurrency(topupAmount)} to your wallet!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Topup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '70px', maxWidth: '800px' }}>
      
      <div style={{ padding: '24px 0 10px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '6px' }}>Hirer Wallet</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
          Seamless 1-click booking payments with protected escrow and instant cancellation refunds.
        </p>
      </div>

      {/* Balance Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        color: '#fff',
        boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
        marginBottom: '30px'
      }}>
        <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9, marginBottom: '6px' }}>
          Available Balance
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '14px' }}>
          {formatCurrency(activeUser?.walletBalance || 4500)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', opacity: 0.95 }}>
          <ShieldCheck size={18} /> Escrow Protection: Funds released only when you share OTP with your companion.
        </div>
      </div>

      {/* Topup Form */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Add Funds to Wallet</h3>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            color: '#34d399',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleTopup}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[1000, 2000, 3500, 5000].map(amt => (
              <button
                type="button"
                key={amt}
                onClick={() => setTopupAmount(amt)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: topupAmount === amt ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(15, 23, 42, 0.6)',
                  border: topupAmount === amt ? 'none' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                +{formatCurrency(amt)}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Custom Amount (₹)
            </label>
            <input 
              type="number"
              min="100"
              step="100"
              value={topupAmount}
              onChange={e => setTopupAmount(Number(e.target.value))}
              style={{ width: '100%', fontSize: '1.1rem', fontWeight: 700 }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            {isSubmitting ? 'Processing Payment...' : `Top-up ${formatCurrency(topupAmount)} via Simulated UPI/Card`}
          </button>
        </form>
      </div>

      {/* Recent Wallet Transactions Ledger */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recent Wallet Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(15, 23, 42, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={18} color="#f87171" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Booking Payment - Aanya Sharma</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Movie Companion (3 hrs) • Booking #BK-1001</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#f87171' }}>-₹6,037</div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(15, 23, 42, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowDownLeft size={18} color="#34d399" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Wallet Top-up (UPI)</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GPay via Axis Bank</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#34d399' }}>+₹5,000</div>
          </div>

        </div>
      </div>

    </div>
  );
}
