import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Ticket,
  Percent,
  Check,
  Clock,
  Sparkles,
  Copy,
  CheckCircle2,
  Tag
} from 'lucide-react';

const INITIAL_COUPONS = [
  {
    id: 'c1',
    code: 'WELCOME100',
    title: 'Welcome Companion Discount',
    discountAmount: '₹100 OFF',
    minBooking: 500,
    validTill: '31 Dec 2026',
    status: 'available', // 'available', 'applied', 'used', 'expired'
    description: 'Flat ₹100 discount on your first companion booking above ₹500.'
  },
  {
    id: 'c2',
    code: 'FESTIVE20',
    title: 'Festive Season Offer',
    discountAmount: '20% OFF',
    minBooking: 1000,
    validTill: '15 Nov 2026',
    status: 'available',
    description: 'Get 20% discount (up to ₹300) on weekend companionship sessions.'
  },
  {
    id: 'c3',
    code: 'CINEMA50',
    title: 'Movie Companion Special',
    discountAmount: '₹50 OFF',
    minBooking: 800,
    validTill: '20 Oct 2026',
    status: 'available',
    description: 'Exclusive discount applicable on all Movie Companion multiplex bookings.'
  },
  {
    id: 'c4',
    code: 'FIRSTCOMPANION',
    title: 'New Member Credit',
    discountAmount: '₹150 OFF',
    minBooking: 600,
    validTill: '01 Sep 2026',
    status: 'used',
    description: 'Successfully redeemed on booking #BK-09855.'
  },
  {
    id: 'c5',
    code: 'SUMMERVIBE',
    title: 'Summer Explorer Discount',
    discountAmount: '15% OFF',
    minBooking: 1200,
    validTill: '30 Jun 2026',
    status: 'expired',
    description: 'Expired promotional campaign.'
  }
];

export default function CouponsTab({ onTabChange, showToast }) {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'applied', 'used', 'expired'
  const [appliedCouponCode, setAppliedCouponCode] = useState('WELCOME100');
  const [customInput, setCustomInput] = useState('');

  const filtered = coupons.filter(c => {
    if (activeTab === 'available') return c.status === 'available' || c.code === appliedCouponCode;
    if (activeTab === 'applied') return c.code === appliedCouponCode;
    if (activeTab === 'used') return c.status === 'used';
    if (activeTab === 'expired') return c.status === 'expired';
    return true;
  });

  const handleApply = (coupon) => {
    setAppliedCouponCode(coupon.code);
    showToast(`Coupon "${coupon.code}" successfully applied! Discount will apply at checkout.`);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const found = coupons.find(c => c.code.toLowerCase() === customInput.trim().toLowerCase());
    if (found && found.status === 'available') {
      setAppliedCouponCode(found.code);
      showToast(`Coupon "${found.code}" applied!`);
    } else {
      showToast('Invalid or expired coupon code', 'warning');
    }
    setCustomInput('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            🎟️ Coupons & Promotional Offers
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Apply promotional promo codes to save on cinema, dining, and city exploration sessions.
          </p>
        </div>

        {/* Promo code entry */}
        <form onSubmit={handleApplyCustom} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Enter coupon code..."
            value={customInput}
            onChange={e => setCustomInput(e.target.value.toUpperCase())}
            style={{ textTransform: 'uppercase', fontWeight: 700, width: '180px', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn-secondary btn-sm" style={{ color: '#f472b6' }}>
            Apply
          </button>
        </form>
      </div>

      {/* Sub-Tabs */}
      <div className="client-tabs-row">
        {[
          { id: 'available', label: 'Available Coupons' },
          { id: 'applied', label: 'Applied Coupon' },
          { id: 'used', label: 'Used Coupons' },
          { id: 'expired', label: 'Expired Coupons' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`client-subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coupons Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
        {filtered.map(coupon => {
          const isApplied = appliedCouponCode === coupon.code;

          return (
            <div
              key={coupon.id}
              className="client-panel"
              style={{
                marginBottom: 0,
                border: isApplied ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isApplied ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(20, 28, 46, 0.95) 100%)' : 'rgba(20, 28, 46, 0.75)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Coupon Code Pill & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    border: '1px dashed #ec4899',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#f472b6',
                    letterSpacing: '0.08em'
                  }}>
                    {coupon.code}
                  </div>

                  {isApplied ? (
                    <span className="client-badge client-badge-pink">Applied</span>
                  ) : coupon.status === 'used' ? (
                    <span className="client-badge client-badge-gray">Used</span>
                  ) : coupon.status === 'expired' ? (
                    <span className="client-badge client-badge-rose">Expired</span>
                  ) : (
                    <span className="client-badge client-badge-emerald">Active</span>
                  )}
                </div>

                {/* Discount Value (Exact example from user prompt: WELCOME100, ₹100 OFF, Min booking ₹500) */}
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
                  {coupon.discountAmount}
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  {coupon.title}
                </div>

                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4', margin: '0 0 12px' }}>
                  {coupon.description}
                </p>

                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Minimum booking: <strong style={{ color: '#fff' }}>{formatCurrency(coupon.minBooking)}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  Valid till: {coupon.validTill}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                {coupon.status === 'available' ? (
                  isApplied ? (
                    <button
                      type="button"
                      disabled
                      className="btn-secondary btn-sm"
                      style={{ width: '100%', color: '#34d399', borderColor: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <CheckCircle2 size={14} /> Applied to Next Booking
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => handleApply(coupon)}
                      style={{ width: '100%', background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
                    >
                      Apply Coupon
                    </button>
                  )
                ) : (
                  <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', textAlign: 'center' }}>
                    Coupon no longer redeemable
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
