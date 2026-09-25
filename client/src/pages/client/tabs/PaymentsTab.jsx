import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import {
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  Search,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-90214',
    bookingId: 'BK-10025',
    paymentId: 'PAY-UPI-884102',
    partnerName: 'Rahul Sharma',
    serviceName: 'Movie Companion',
    amount: 1500,
    discount: 100,
    platformFee: 150,
    totalPaid: 1550,
    paymentMethod: 'UPI (GPay)',
    paymentStatus: 'successful',
    date: '2026-09-28 14:30',
    receiptUrl: '#'
  },
  {
    id: 'TXN-90188',
    bookingId: 'BK-10018',
    paymentId: 'PAY-WLT-771923',
    partnerName: 'Aanya Sharma',
    serviceName: 'Cafe & Conversation',
    amount: 1200,
    discount: 0,
    platformFee: 120,
    totalPaid: 1320,
    paymentMethod: 'Hirer Wallet',
    paymentStatus: 'successful',
    date: '2026-09-18 11:20',
    receiptUrl: '#'
  },
  {
    id: 'TXN-89942',
    bookingId: 'BK-09941',
    paymentId: 'PAY-RFD-551029',
    partnerName: 'Kabir Mathur',
    serviceName: 'Shopping Companion',
    amount: 1800,
    discount: 0,
    platformFee: 0,
    totalPaid: 1800,
    paymentMethod: 'Refund to Wallet',
    paymentStatus: 'refunded',
    date: '2026-09-02 16:45',
    receiptUrl: '#'
  },
  {
    id: 'TXN-89712',
    bookingId: 'BK-09855',
    paymentId: 'PAY-FL-110294',
    partnerName: 'Priya Patel',
    serviceName: 'City Exploration',
    amount: 2100,
    discount: 0,
    platformFee: 210,
    totalPaid: 2310,
    paymentMethod: 'Credit Card (HDFC)',
    paymentStatus: 'failed',
    date: '2026-08-25 18:10',
    receiptUrl: '#'
  }
];

const PAYMENT_TABS = [
  { id: 'all', label: 'Payment History' },
  { id: 'pending', label: 'Pending Payments' },
  { id: 'successful', label: 'Successful Payments' },
  { id: 'failed', label: 'Failed Payments' },
  { id: 'refunded', label: 'Refunds' }
];

export default function PaymentsTab({ client, showToast }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  const filtered = transactions.filter(t => {
    if (activeTab === 'pending' && t.paymentStatus !== 'pending') return false;
    if (activeTab === 'successful' && t.paymentStatus !== 'successful') return false;
    if (activeTab === 'failed' && t.paymentStatus !== 'failed') return false;
    if (activeTab === 'refunded' && t.paymentStatus !== 'refunded') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTxn = t.id.toLowerCase().includes(q);
      const matchPay = t.paymentId.toLowerCase().includes(q);
      const matchPartner = t.partnerName.toLowerCase().includes(q);
      const matchBooking = t.bookingId.toLowerCase().includes(q);
      if (!matchTxn && !matchPay && !matchPartner && !matchBooking) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'successful':
        return <span className="client-badge client-badge-emerald">Successful</span>;
      case 'pending':
        return <span className="client-badge client-badge-amber">Pending</span>;
      case 'failed':
        return <span className="client-badge client-badge-rose">Failed</span>;
      case 'refunded':
        return <span className="client-badge client-badge-purple">Refunded</span>;
      default:
        return <span className="client-badge client-badge-gray">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            💳 Payment History & Financial Invoices
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Protected escrow transactions, GST receipts, cancellation refunds, and payment audit records.
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Payment ID, partner..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px', fontSize: '0.86rem' }}
          />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="client-tabs-row">
        {PAYMENT_TABS.map(tab => (
          <button
            key={tab.id}
            className={`client-subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="client-panel">
        <div className="client-table-container">
          <table className="client-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Payment ID</th>
                <th>Partner & Service</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    No payment records found under this filter.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id}>
                    <td><strong style={{ color: '#38bdf8' }}>#{t.bookingId}</strong></td>
                    <td><span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{t.paymentId}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{t.partnerName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{t.serviceName}</div>
                    </td>
                    <td>{t.paymentMethod}</td>
                    <td>{formatCurrency(t.amount)}</td>
                    <td><strong style={{ color: '#34d399' }}>{formatCurrency(t.totalPaid)}</strong></td>
                    <td>{getStatusBadge(t.paymentStatus)}</td>
                    <td><span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{t.date}</span></td>
                    <td>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => showToast(`Invoice #${t.paymentId}.pdf downloaded!`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                      >
                        <Download size={12} /> PDF
                      </button>
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
