import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  DollarSign,
  Calculator,
  Percent,
  Sliders,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function PricingTab({ partner, onTabChange, showToast }) {
  // Calculator state
  const [calcServiceRate, setCalcServiceRate] = useState(500);
  const [calcHours, setCalcHours] = useState(2);
  const [weekendSurcharge, setWeekendSurcharge] = useState(15); // %
  const [peakHourMultiplier, setPeakHourMultiplier] = useState(false);

  // Computations
  const effectiveRate = peakHourMultiplier ? Math.round(calcServiceRate * 1.2) : calcServiceRate;
  const baseTotal = effectiveRate * calcHours;
  const partnerShare = Math.round(baseTotal * 0.80);
  const platformFee = Math.round(baseTotal * 0.10);
  const gst = Math.round((baseTotal + platformFee) * 0.05);
  const clientPays = baseTotal + platformFee + gst;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          💰 Companion Pricing & Earnings Structure
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Overview of platform commission limits, service rate matrix, and real-time net take-home earnings calculator.
        </p>
      </div>

      {/* Admin Floor & Ceiling Notice */}
      <div style={{
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '14px',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertCircle size={28} color="#38bdf8" />
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.96rem' }}>
              Platform Price Limits Set by Admin
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '2px' }}>
              To ensure fairness and quality, companions can set rates between <strong>₹300 / hr</strong> (floor) and <strong>₹3,500 / hr</strong> (ceiling).
            </div>
          </div>
        </div>

        <button
          className="btn-secondary btn-sm"
          onClick={() => onTabChange('services')}
          style={{ whiteSpace: 'nowrap' }}
        >
          Adjust Service Rates
        </button>
      </div>

      {/* Pricing Matrix Table & Examples */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <DollarSign size={18} color="#34d399" />
          <span>Standard Service Pricing Benchmark</span>
        </div>

        <div className="partner-table-container">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Standard Rate</th>
                <th>Min Booking Duration</th>
                <th>Your Take-Home (80%)</th>
                <th>Platform Retains (20%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>🎬 Movie Companion</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹500 / Hour</span></td>
                <td>2 Hours</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹400 / Hour</span> (₹800 min)</td>
                <td>₹100 / Hour</td>
              </tr>
              <tr>
                <td><strong>☕ Cafe / Coffee Companion</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹400 / Hour</span></td>
                <td>1 Hour</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹320 / Hour</span> (₹320 min)</td>
                <td>₹80 / Hour</td>
              </tr>
              <tr>
                <td><strong>🚶 City Exploration & Heritage</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹700 / Hour</span></td>
                <td>2 Hours</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹560 / Hour</span> (₹1,120 min)</td>
                <td>₹140 / Hour</td>
              </tr>
              <tr>
                <td><strong>🍽️ Restaurant Companion</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹600 / Hour</span></td>
                <td>2 Hours</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹480 / Hour</span> (₹960 min)</td>
                <td>₹120 / Hour</td>
              </tr>
              <tr>
                <td><strong>🛍️ Shopping Buddy</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹450 / Hour</span></td>
                <td>2 Hours</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹360 / Hour</span> (₹720 min)</td>
                <td>₹90 / Hour</td>
              </tr>
              <tr>
                <td><strong>🎭 Event Companion</strong></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>₹800 / Hour</span></td>
                <td>3 Hours</td>
                <td><span style={{ color: '#34d399', fontWeight: 700 }}>₹640 / Hour</span> (₹1,920 min)</td>
                <td>₹160 / Hour</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Net Earnings Calculator */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '18px' }}>
          <Calculator size={18} color="#c084fc" />
          <span>Interactive Session Earnings Calculator</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Service Hourly Rate: {formatCurrency(calcServiceRate)}/hr
              </label>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={calcServiceRate}
                onChange={e => setCalcServiceRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
                <span>₹300/hr</span>
                <span>₹1,500/hr</span>
                <span>₹3,000/hr</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Booking Duration: {calcHours} Hours
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={calcHours}
                onChange={e => setCalcHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
                <span>1 Hr</span>
                <span>4 Hrs</span>
                <span>8 Hrs</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id="peakCheckbox"
                checked={peakHourMultiplier}
                onChange={e => setPeakHourMultiplier(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }}
              />
              <label htmlFor="peakCheckbox" style={{ fontSize: '0.86rem', color: '#cbd5e1', cursor: 'pointer' }}>
                Apply Peak Hours / Late Evening Surcharge (+20%)
              </label>
            </div>
          </div>

          {/* Breakdown Result Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '4px' }}>
              Your Net Take-Home (80%)
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              {formatCurrency(partnerShare)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Base Session Fee:</span>
                <span>{formatCurrency(baseTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Platform 20% Retention (Safety & Tech):</span>
                <span>{formatCurrency(Math.round(baseTotal * 0.20))}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Client Total (incl. 10% booking fee + 5% GST):</span>
                <span>{formatCurrency(clientPays)}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#34d399' }}>
              <CheckCircle2 size={15} /> Released to your wallet immediately upon OTP session completion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
