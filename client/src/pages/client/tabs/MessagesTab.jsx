import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  ShieldCheck,
  Headphones,
  User,
  Calendar,
  Lock,
  Clock,
  AlertTriangle
} from 'lucide-react';

const INITIAL_HIRER_CHATS = [
  {
    bookingId: 'BK-10025',
    partnerName: 'Rahul Sharma',
    service: 'Movie Companion',
    date: '28 Sep 2026',
    time: '06:00 PM',
    status: 'active',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    messages: [
      { id: 1, sender: 'client', text: 'Hi Rahul! Looking forward to the movie at PVR Director Cut this evening.', time: '02:15 PM' },
      { id: 2, sender: 'partner', text: 'Hi! Yes, I will reach the cinema main lobby by 5:50 PM. See you soon.', time: '02:20 PM' },
      { id: 3, sender: 'client', text: 'Great! I will share the starting OTP as soon as we meet.', time: '02:22 PM' }
    ]
  },
  {
    bookingId: 'BK-10018',
    partnerName: 'Aanya Sharma',
    service: 'Cafe & Conversation',
    date: '18 Sep 2026',
    time: '04:00 PM',
    status: 'previous',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    messages: [
      { id: 1, sender: 'client', text: 'Hi Aanya, are you at Blue Tokai?', time: '03:55 PM' },
      { id: 2, sender: 'partner', text: 'Yes, seated near the outdoor reading corner!', time: '03:57 PM' },
      { id: 3, sender: 'client', text: 'Thank you for the wonderful session today!', time: '07:10 PM' }
    ]
  }
];

export default function MessagesTab({ client, showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('active'); // 'active', 'previous', 'support'
  const [chats, setChats] = useState(INITIAL_HIRER_CHATS);
  const [selectedBookingId, setSelectedBookingId] = useState(INITIAL_HIRER_CHATS[0].bookingId);
  const [newMessage, setNewMessage] = useState('');

  // Support messages
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'support', text: 'Hello! You have reached PartnerOnRent Hirer Concierge & Safety Support. How can we help you?', time: '10:00 AM' }
  ]);
  const [newSupportMsg, setNewSupportMsg] = useState('');

  const currentChat = chats.find(c => c.bookingId === selectedBookingId) || chats[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'client',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev =>
      prev.map(c => c.bookingId === selectedBookingId ? { ...c, messages: [...c.messages, msg] } : c)
    );
    setNewMessage('');
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!newSupportMsg.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'client',
      text: newSupportMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSupportMessages(prev => [...prev, msg]);
    setNewSupportMsg('');

    setTimeout(() => {
      setSupportMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'support',
          text: 'Thank you for contacting customer care. A support representative will respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          💬 Companion Messages & Support
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          All conversations are linked directly to your bookings to ensure dispute transparency and member safety.
        </p>
      </div>

      {/* Sub-Tabs */}
      <div className="client-tabs-row" style={{ marginBottom: '20px' }}>
        <button
          className={`client-subtab-btn ${activeSubTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('active')}
        >
          <MessageCircle size={15} /> Active Chats ({chats.filter(c => c.status === 'active').length})
        </button>
        <button
          className={`client-subtab-btn ${activeSubTab === 'previous' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('previous')}
        >
          <Clock size={15} /> Previous Chats ({chats.filter(c => c.status === 'previous').length})
        </button>
        <button
          className={`client-subtab-btn ${activeSubTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('support')}
        >
          <Headphones size={15} /> 24/7 Platform Support
        </button>
      </div>

      {/* Booking Chats */}
      {(activeSubTab === 'active' || activeSubTab === 'previous') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px', minHeight: '520px' }}>
          
          {/* Chat List */}
          <div className="client-panel" style={{ padding: '16px', marginBottom: 0 }}>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
              Booking Connected Chats
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chats
                .filter(c => activeSubTab === 'all' || c.status === activeSubTab)
                .map(c => (
                  <div
                    key={c.bookingId}
                    onClick={() => setSelectedBookingId(c.bookingId)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: selectedBookingId === c.bookingId ? 'rgba(236, 72, 153, 0.15)' : 'rgba(15, 22, 38, 0.5)',
                      border: selectedBookingId === c.bookingId ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{c.partnerName}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>#{c.bookingId}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#f472b6' }}>{c.service}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>📅 {c.date} at {c.time}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="client-panel" style={{ padding: 0, display: 'flex', flexDirection: 'column', marginBottom: 0, overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={currentChat?.partnerAvatar}
                  alt={currentChat?.partnerName}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                    {currentChat?.partnerName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8' }}>
                    Booking #{currentChat?.bookingId} • {currentChat?.service}
                  </div>
                </div>
              </div>

              <span className="client-badge client-badge-pink">
                Protected Channel
              </span>
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(236, 72, 153, 0.08)',
              borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
              padding: '8px 16px',
              fontSize: '0.76rem',
              color: '#f472b6',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} style={{ flexShrink: 0 }} />
              <span>
                Safety Rule: Keep all discussions within PartnerOnRent. Platonic companion sessions take place only in public places.
              </span>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentChat?.messages.map(m => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.sender === 'client' ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    background: m.sender === 'client' ? 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' : 'rgba(30, 41, 59, 0.8)',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: m.sender === 'client' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'
                  }}
                >
                  <div style={{ fontSize: '0.88rem' }}>{m.text}</div>
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
                placeholder="Message your companion regarding meeting venue..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1, fontSize: '0.88rem' }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={15} /> Send
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Support Chat */}
      {activeSubTab === 'support' && (
        <div className="client-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Headphones size={18} color="#ec4899" />
              <span>Hirer Support & Dispute Assistance</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Available 24/7 for booking help, payment questions, and safety reporting.
            </div>
          </div>

          <div style={{ minHeight: '340px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {supportMessages.map(m => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'client' ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: m.sender === 'client' ? 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' : 'rgba(30, 41, 59, 0.8)',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: m.sender === 'client' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'
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
              placeholder="Ask support about a booking, refund, or companion report..."
              value={newSupportMsg}
              onChange={e => setNewSupportMsg(e.target.value)}
              style={{ flex: 1, fontSize: '0.88rem' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={15} /> Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
