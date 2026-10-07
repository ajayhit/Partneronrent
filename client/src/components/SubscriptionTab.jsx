import React, { useState } from 'react';
import {
  Crown, ShieldCheck, CheckCircle2, Clock, AlertTriangle,
  Zap, CreditCard, Wallet, QrCode, FileText, Download,
  Check, ArrowRight, X, Sparkles, Lock, RefreshCw, Star
} from 'lucide-react';
import { subscribeUser } from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function SubscriptionTab({ user, role = 'client', onSubscribed, showToast }) {
  const isPartner = role === 'partner';
  const expiresAt = user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
  const now = new Date();
  const isActive = Boolean(user?.isSubscribed && expiresAt && expiresAt > now);
  const isExpired = Boolean(user?.isSubscribed && expiresAt && expiresAt <= now);
  const daysRemaining = isActive && expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))) : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(
    (user?.walletBalance || 0) >= 249 ? 'wallet' : 'upi'
  );
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  const walletBalance = user?.walletBalance || 0;
  const planFee = 249;
  const basePrice = 211.02;
  const gstAmount = 37.98;

  const handleOpenSubscribe = () => {
    setIsModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === 'wallet' && walletBalance < planFee) {
      if (showToast) showToast('Insufficient wallet balance. Please select UPI or card.', 'warning');
      return;
    }
    if (paymentMethod === 'upi' && !upiId.trim() && upiId.length > 0 && !upiId.includes('@')) {
      if (showToast) showToast('Please enter a valid UPI ID (e.g. name@okhdfcbank)', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await subscribeUser(user?.id, role, paymentMethod);
      if (res.success) {
        setSuccessData(res);
        setInvoiceData({
          invoiceNumber: res.invoiceNumber || `INV-POR-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          userName: user?.name || (isPartner ? 'Companion Partner' : 'Hirer Member'),
          userId: user?.id,
          role: isPartner ? 'Companion Partner' : 'Hirer Member',
          paymentMethod: paymentMethod === 'wallet' ? 'PartnerOnRent Wallet' : 'Instant Online UPI / Card',
          amount: planFee,
          basePrice,
          gstAmount,
          expiresAt: res.subscription?.subscriptionExpiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (onSubscribed) {
          onSubscribed({
            ...user,
            isSubscribed: true,
            subscriptionPlan: 'annual_249',
            subscriptionExpiresAt: res.subscription?.subscriptionExpiresAt,
            subscribedAt: res.subscription?.subscribedAt,
            walletBalance: res.user?.walletBalance ?? (paymentMethod === 'wallet' ? walletBalance - planFee : walletBalance)
          });
        }
        if (showToast) showToast('Annual subscription activated successfully!', 'success');
      } else {
        throw new Error(res.error || 'Payment failed');
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to process subscription', 'danger');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', color: '#f8fafc' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.35)', color: '#facc15', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
          <Crown size={15} /> PartnerOnRent Prime • Annual Pass
        </div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isPartner ? 'Partner Companion Annual Subscription' : 'Hirer Annual Membership Subscription'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', margin: 0, lineHeight: '1.6', maxWidth: '780px' }}>
          Unlock complete platform privileges, verified booking services, and 24x7 safety protocol for just <strong>₹249 for 1 Full Year</strong> (₹0.68/day).
          The same transparent, affordable plan applies to both Hirers and Partners.
        </p>
      </div>

      {/* ── Membership Status Overview Card ── */}
      <div style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 78, 59, 0.22) 100%)'
          : isExpired
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(127, 29, 29, 0.22) 100%)'
          : 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(120, 53, 15, 0.2) 100%)',
        border: `1.5px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : isExpired ? 'rgba(239, 68, 68, 0.4)' : 'rgba(234, 179, 8, 0.4)'}`,
        borderRadius: '18px',
        padding: '24px 28px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '14px',
              background: isActive ? '#10b981' : isExpired ? '#ef4444' : '#f59e0b',
              color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px ${isActive ? 'rgba(16, 185, 129, 0.35)' : isExpired ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
              flexShrink: 0
            }}>
              <Crown size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {isActive ? 'Prime Membership Active' : isExpired ? 'Subscription Expired' : 'Subscription Required'}
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                  background: isActive ? 'rgba(16, 185, 129, 0.25)' : isExpired ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 179, 8, 0.25)',
                  color: isActive ? '#34d399' : isExpired ? '#f87171' : '#fbbf24',
                  border: `1px solid ${isActive ? '#10b981' : isExpired ? '#ef4444' : '#f59e0b'}`
                }}>
                  {isActive ? 'Active Plan' : isExpired ? 'Expired' : 'Not Subscribed'}
                </span>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '6px 0 0', lineHeight: '1.5' }}>
                {isActive
                  ? `Your 1-year Prime membership is currently active. You have full access to ${isPartner ? 'go online, offer services, and accept booking requests.' : 'browse companion profiles, send messages, and book services.'}`
                  : isExpired
                  ? `Your membership expired on ${expiresAt?.toLocaleDateString('en-IN')}. Please renew for ₹249 to resume companion services.`
                  : `You must have an active annual subscription of ₹249 for 1 year before ${isPartner ? 'going online and offering companion services.' : 'booking companions and accessing platform services.'}`}
              </p>

              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '14px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.82rem', color: '#94a3b8' }}>
                    🗓️ <strong style={{ color: '#fff' }}>{daysRemaining} Days</strong> remaining
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.82rem', color: '#94a3b8' }}>
                    📅 Valid through: <strong style={{ color: '#fff' }}>{expiresAt?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {isActive ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceData({
                      invoiceNumber: `INV-POR-${user?.id?.slice(-6) || 'ACTIVE'}`,
                      date: new Date(user?.subscribedAt || Date.now()).toLocaleDateString('en-IN'),
                      userName: user?.name,
                      userId: user?.id,
                      role: isPartner ? 'Companion Partner' : 'Hirer Member',
                      paymentMethod: 'Prepaid Digital / Wallet',
                      amount: planFee,
                      basePrice,
                      gstAmount,
                      expiresAt: user?.subscriptionExpiresAt
                    });
                    setShowInvoice(true);
                  }}
                  style={{
                    padding: '10px 18px', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 700,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <FileText size={15} /> View Tax Invoice
                </button>
                <button
                  type="button"
                  onClick={handleOpenSubscribe}
                  style={{
                    padding: '10px 22px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <RefreshCw size={15} /> Extend Membership (+1 Year)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenSubscribe}
                style={{
                  padding: '12px 28px', borderRadius: '12px', fontSize: '0.94rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)'
                }}
              >
                <Zap size={18} /> {isExpired ? 'Renew Pass Now • ₹249' : 'Subscribe Now • ₹249 / Year'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Plan & Value Comparison Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Card 1: Official Pricing Card */}
        <div style={{
          background: 'rgba(17, 26, 44, 0.85)',
          border: '1.5px solid rgba(234, 179, 8, 0.35)',
          borderRadius: '18px',
          padding: '28px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', background: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🌟 Flat Fair Platform Pass
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>365 Days Access</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
              1-Year Prime Membership
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: '0 0 20px', lineHeight: '1.5' }}>
              Full access to book or provide companionship services safely, with identity vetting and support.
            </p>

            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#facc15', letterSpacing: '-0.02em' }}>₹249</span>
                <span style={{ fontSize: '1.1rem', color: '#64748b', textDecoration: 'line-through' }}>₹999</span>
                <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)' }}>
                  Save 75%
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                Effective cost: <strong>Just ₹0.68 per day</strong> • Includes all GST taxes
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Base Annual Membership</span>
                <span>₹211.02</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                <span>GST (18% Digital SAC 998399)</span>
                <span>₹37.98</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 700, color: '#fff', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                <span>Total Annual Amount</span>
                <span style={{ color: '#facc15' }}>₹249.00</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSubscribe}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none', color: '#0f172a', fontWeight: 800, fontSize: '0.96rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)', transition: 'transform 0.2s'
            }}
          >
            <Crown size={18} /> {isActive ? 'Extend for ₹249 (1 Year)' : 'Subscribe Now for ₹249'}
          </button>
        </div>

        {/* Card 2: What You Get (Tailored for Hirer / Partner) */}
        <div style={{
          background: 'rgba(17, 26, 44, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800, marginBottom: '14px' }}>
              <Sparkles size={17} /> {isPartner ? 'Partner Membership Advantages' : 'Hirer Membership Advantages'}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
              Services unlocked with your Pass:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(isPartner ? [
                { icon: ShieldCheck, title: 'Verified Directory Placement', desc: 'Appear in public verified companion directory across all Indian cities.' },
                { icon: Zap, title: 'Live Shift Control & Instant Hire', desc: 'Go Online anytime and accept direct hangout, cinema, or coffee bookings.' },
                { icon: Wallet, title: '80% Payout Retention', desc: 'Keep 80% of all hourly booking fees paid directly to your verified bank account.' },
                { icon: Lock, title: 'Guardian Safety Protocol', desc: 'Active 24x7 SOS tracking, OTP verification, and emergency response during meetups.' },
                { icon: Star, title: 'Reviews & Reputation Badge', desc: 'Build your client rating, collect reviews, and gain repeat companions.' }
              ] : [
                { icon: ShieldCheck, title: '100% Background-Verified Companions', desc: 'Book companions whose government ID, Aadhaar, and selfie have passed admin verification.' },
                { icon: Zap, title: 'Instant Booking & Scheduling', desc: 'Select any companion, book cafes, shopping, movies, and city explorations.' },
                { icon: Lock, title: '24x7 Safety & SOS Escort Protocol', desc: 'Emergency contact notifications, session start/end OTPs, and compliance oversight.' },
                { icon: CreditCard, title: 'Zero Convenience Surcharges', desc: 'Pay transparent hourly fees with zero markup or hidden platform charges.' },
                { icon: Sparkles, title: 'Direct Messaging & Chat Access', desc: 'Chat directly in-app to coordinate public meeting spots before bookings.' }
              ]).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <item.icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '22px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>Covers 365 full days of unlimited booking interactions across India.</span>
          </div>
        </div>
      </div>

      {/* ── Payment Checkout Modal ── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => !isProcessing && setIsModalOpen(false)}>
          <div style={{
            background: '#0b1329', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '18px', maxWidth: '540px', width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.95)', overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Subscribe to Annual Pass</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>₹249 for 1 Full Year (365 Days)</div>
                </div>
              </div>
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Summary Pill */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '14px 18px', marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.86rem', color: '#cbd5e1', fontWeight: 600 }}>PartnerOnRent Prime (1 Year)</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#facc15' }}>₹249.00</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base: ₹211.02 • GST 18%: ₹37.98</span>
                  <span style={{ color: '#34d399' }}>Instant Digital Activation</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '10px' }}>
                  Select Payment Option:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Option 1: Wallet Balance */}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: paymentMethod === 'wallet' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${paymentMethod === 'wallet' ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio" name="paymethod" value="wallet"
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                      />
                      <Wallet size={18} color="#38bdf8" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>PartnerOnRent Wallet</div>
                        <div style={{ fontSize: '0.74rem', color: walletBalance >= planFee ? '#34d399' : '#f87171' }}>
                          Available: {formatCurrency(walletBalance)} {walletBalance < planFee ? '(Insufficient balance)' : ''}
                        </div>
                      </div>
                    </div>
                    {walletBalance >= planFee && (
                      <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>1-Click Pay</span>
                    )}
                  </label>

                  {/* Option 2: UPI */}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: paymentMethod === 'upi' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${paymentMethod === 'upi' ? '#10b981' : 'rgba(255,255,255,0.08)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio" name="paymethod" value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      <QrCode size={18} color="#10b981" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>UPI / QR Code</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>GPay, PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Instant</span>
                  </label>

                  {/* Option 3: Cards */}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: paymentMethod === 'card' ? 'rgba(192, 132, 252, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${paymentMethod === 'card' ? '#c084fc' : 'rgba(255,255,255,0.08)'}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio" name="paymethod" value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <CreditCard size={18} color="#c084fc" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>Debit / Credit Card</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Visa, MasterCard, RuPay</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* UPI extra input if selected */}
              {paymentMethod === 'upi' && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                    UPI ID (Optional - or scan on next screen)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.88rem'
                    }}
                  />
                </div>
              )}

              {/* Security info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b', marginBottom: '20px' }}>
                <Lock size={13} color="#10b981" />
                <span>256-Bit SSL Encrypted Payment • Instant Tax Invoice Delivery</span>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing || (paymentMethod === 'wallet' && walletBalance < planFee)}
                style={{
                  width: '100%', padding: '14px 20px', borderRadius: '12px',
                  background: isProcessing ? 'rgba(100,116,139,0.5)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none', color: '#fff', fontWeight: 800, fontSize: '1rem',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {isProcessing ? 'Activating Subscription...' : 'Pay ₹249 & Activate 1-Year Pass'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Celebration Modal ── */}
      {successData && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#0b1329', border: '1px solid #10b981',
            borderRadius: '20px', maxWidth: '480px', width: '100%',
            padding: '36px 28px', textAlign: 'center', boxShadow: '0 25px 60px rgba(16,185,129,0.3)'
          }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
              border: '2px solid #10b981'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              🎉 Welcome to Prime Membership!
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 24px' }}>
              Your ₹249 Annual Subscription is active for <strong>365 Days</strong>.
              All companion services, {isPartner ? 'online shift toggles, and bookings' : 'bookings and chat'} are now unlocked!
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
              padding: '12px 18px', border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '24px', fontSize: '0.82rem', color: '#94a3b8', textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Invoice Number:</span>
                <strong style={{ color: '#fff' }}>{invoiceData?.invoiceNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Valid Until:</span>
                <strong style={{ color: '#34d399' }}>{new Date(invoiceData?.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setIsModalOpen(false);
                  setShowInvoice(true);
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                View Invoice
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setIsModalOpen(false);
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none', color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tax Invoice Lightbox Modal ── */}
      {showInvoice && invoiceData && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setShowInvoice(false)}>
          <div style={{
            background: '#ffffff', color: '#0f172a',
            borderRadius: '16px', maxWidth: '600px', width: '100%',
            padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            {/* Invoice Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '18px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>PARTNER ON RENT</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Tax Invoice &amp; Payment Receipt</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GSTIN: 07AAACP1234F1Z8 • SAC: 998399</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', background: '#dcfce7',
                  color: '#15803d', fontWeight: 800, fontSize: '0.78rem', border: '1px solid #86efac'
                }}>
                  PAID
                </span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginTop: '8px' }}>{invoiceData.invoiceNumber}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Date: {invoiceData.date}</div>
              </div>
            </div>

            {/* Billed To */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '4px' }}>Billed To:</div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>{invoiceData.userName || 'Account Holder'}</div>
              <div style={{ color: '#64748b' }}>Member ID: {invoiceData.userId} • Role: {invoiceData.role}</div>
              <div style={{ color: '#64748b' }}>Payment Mode: {invoiceData.paymentMethod}</div>
            </div>

            {/* Line Items */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Description</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Duration</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 700 }}>PartnerOnRent Prime Annual Membership Pass</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Full platform access for companionship services</div>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>365 Days</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>₹{invoiceData.basePrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Subtotal (Base Fee)</span>
                <span>₹{invoiceData.basePrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Integrated GST (18%)</span>
                <span>₹{invoiceData.gstAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: '#0f172a', borderTop: '2px solid #0f172a', paddingTop: '8px' }}>
                <span>Total Amount Paid</span>
                <span style={{ color: '#16a34a' }}>₹{invoiceData.amount}.00</span>
              </div>
            </div>

            {/* Invoice Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '9px 18px', borderRadius: '8px', border: '1px solid #cbd5e1',
                  background: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '0.84rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Download size={14} /> Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setShowInvoice(false)}
                style={{
                  padding: '9px 20px', borderRadius: '8px', border: 'none',
                  background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
