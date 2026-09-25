import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  ShieldAlert,
  Info,
  User,
  Headphones,
  Bell,
  CheckCheck,
  Calendar,
  Lock
} from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    bookingId: 'BK-1084',
    clientName: 'Rahul Verma',
    service: 'Cafe & Conversation',
    date: '2024-09-18',
    unread: false,
    messages: [
      { id: 1, sender: 'client', text: 'Hi Aanya! Looking forward to our coffee session at Blue Tokai tomorrow.', time: '04:15 PM' },
      { id: 2, sender: 'partner', text: 'Hi Rahul! Yes, see you there at 5 PM at the main seating area.', time: '04:20 PM' },
      { id: 3, sender: 'client', text: 'Sounds perfect, will share the 4-digit OTP as soon as I arrive.', time: '04:22 PM' }
    ]
  },
  {
    bookingId: 'BK-1065',
    clientName: 'Sneha Roy',
    service: 'Shopping Companion',
    date: '2024-09-20',
    unread: true,
    messages: [
      { id: 1, sender: 'client', text: 'Hey Aanya! I was thinking we could start at Zara in Select Citywalk.', time: '11:00 AM' },
      { id: 2, sender: 'partner', text: 'Hi Sneha! That works great for me. See you at the entrance.', time: '11:15 AM' }
    ]
  }
];

const SYSTEM_MESSAGES = [
  { id: 1, title: 'Payout Dispatched', text: 'Your withdrawal request for ₹10,000 via UPI (UTR: 202409158912) was successfully settled.', time: '2024-09-15 11:22 AM' },
  { id: 2, title: 'Booking Confirmed', text: 'Booking BK-1084 with Rahul Verma has been confirmed for 2024-09-18.', time: '2024-09-17 06:30 PM' },
  { id: 3, title: 'KYC Document Verified', text: 'Your Aadhaar and Police background check has been verified through 2029.', time: '2024-01-12 04:45 PM' }
];

export default function MessagesTab({ partner, showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('bookings'); // 'bookings', 'system', 'support'
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedBookingId, setSelectedBookingId] = useState(INITIAL_CONVERSATIONS[0].bookingId);
  const [newMessage, setNewMessage] = useState('');

  // Support chat state
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'support', text: 'Hello Aanya! Welcome to Partner Priority Support. How can our safety and operations team assist you today?', time: '10:00 AM' }
  ]);
  const [newSupportMsg, setNewSupportMsg] = useState('');

  const currentConv = conversations.find(c => c.bookingId === selectedBookingId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgObj = {
      id: Date.now(),
      sender: 'partner',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev =>
      prev.map(c => c.bookingId === selectedBookingId ? { ...c, messages: [...c.messages, msgObj] } : c)
    );
    setNewMessage('');
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!newSupportMsg.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'partner',
      text: newSupportMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, userMsg]);
    setNewSupportMsg('');

    setTimeout(() => {
      setSupportMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'support',
          text: 'Thank you for reaching out. A partner support officer is reviewing your query.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          💬 Messages & Communications Center
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          All companion communication is strictly tied to confirmed bookings to preserve privacy and safety.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="partner-tabs-row" style={{ marginBottom: '20px' }}>
        <button
          className={`partner-subtab-btn ${activeSubTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('bookings')}
        >
          <MessageCircle size={15} /> Booking Chats ({conversations.length})
        </button>
        <button
          className={`partner-subtab-btn ${activeSubTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('system')}
        >
          <Bell size={15} /> System Alerts ({SYSTEM_MESSAGES.length})
        </button>
        <button
          className={`partner-subtab-btn ${activeSubTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('support')}
        >
          <Headphones size={15} /> 24/7 Partner Support Desk
        </button>
      </div>

      {/* 1. BOOKING CHATS */}
      {activeSubTab === 'bookings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px', minHeight: '520px' }}>
          
          {/* Conversation List */}
          <div className="partner-panel" style={{ padding: '16px', marginBottom: 0 }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
              Active Booking Conversations
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {conversations.map(conv => (
                <div
                  key={conv.bookingId}
                  onClick={() => setSelectedBookingId(conv.bookingId)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: selectedBookingId === conv.bookingId ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    border: selectedBookingId === conv.bookingId ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{conv.clientName}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>#{conv.bookingId}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{conv.service}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>📅 {conv.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="partner-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', marginBottom: 0, overflow: 'hidden' }}>
            
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                  {currentConv?.clientName}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#34d399' }}>
                  Booking #{currentConv?.bookingId} • Strictly Platonic In-App Channel
                </div>
              </div>
              <span className="partner-badge partner-badge-emerald">
                Encrypted Session
              </span>
            </div>

            {/* Safety Warning in Chat */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '8px 16px',
              fontSize: '0.76rem',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldAlert size={14} style={{ flexShrink: 0 }} />
              <span>
                Safety Rule: Keep all chat inside PartnerOnRent. Never share bank OTP, private address, or off-platform contact.
              </span>
            </div>

            {/* Messages Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentConv?.messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'partner' ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    background: m.sender === 'partner' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(30, 41, 59, 0.8)',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: m.sender === 'partner' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div style={{ fontSize: '0.88rem', lineHeight: '1.4' }}>{m.text}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.8, textAlign: 'right', marginTop: '4px' }}>
                    {m.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '14px 18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type your message to the hirer..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1, fontSize: '0.88rem' }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 2. SYSTEM ALERTS */}
      {activeSubTab === 'system' && (
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Bell size={18} color="#38bdf8" />
            <span>Platform Broadcasts & Automatic Receipts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SYSTEM_MESSAGES.map(sm => (
              <div
                key={sm.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.96rem', marginBottom: '4px' }}>
                    {sm.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                    {sm.text}
                  </div>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {sm.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUPPORT CHAT */}
      {activeSubTab === 'support' && (
        <div className="partner-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Headphones size={18} color="#34d399" />
              <span>Partner Priority Support Desk</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Average response time: &lt; 5 minutes • Dedicated safety & payouts team
            </div>
          </div>

          <div style={{ minHeight: '340px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {supportMessages.map(m => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'partner' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: m.sender === 'partner' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(30, 41, 59, 0.8)',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: m.sender === 'partner' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'
                }}
              >
                <div style={{ fontSize: '0.88rem' }}>{m.text}</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8, textAlign: 'right', marginTop: '4px' }}>
                  {m.time}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendSupport} style={{ padding: '14px 18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask support about a payout, dispute, or safety concern..."
              value={newSupportMsg}
              onChange={e => setNewSupportMsg(e.target.value)}
              style={{ flex: 1, fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={15} /> Send to Support
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
