import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { fetchMessages, sendMessage } from '../utils/api';
import { X, Send, User, MessageCircle, MapPin, Shield } from 'lucide-react';

export default function ChatDrawer() {
  const { chatDrawer, closeChat } = useApp();
  const { currentRole, activeUser, activePartner } = useAuth();
  const booking = chatDrawer?.booking;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (booking?.id) {
      loadChat();
      const timer = setInterval(loadChat, 4000);
      return () => clearInterval(timer);
    }
  }, [booking?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async () => {
    if (!booking?.id) return;
    try {
      const data = await fetchMessages(booking.id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderRole = currentRole;
    const senderId = currentRole === 'client' ? (activeUser?.id || 'client-1') : (activePartner?.id || 'partner-p1');
    const senderName = currentRole === 'client' ? (activeUser?.name || 'Rahul Verma') : (activePartner?.name || 'Aanya Sharma');

    try {
      const newMsg = await sendMessage(booking.id, {
        senderId,
        senderName,
        senderRole,
        text: inputText
      });
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!chatDrawer.isOpen || !booking) return null;

  const otherPersonName = currentRole === 'client' ? booking.partnerName : booking.clientName;

  return (
    <div className="modal-overlay" onClick={closeChat} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          maxHeight: '100vh',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-active)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#fff'
            }}>
              {otherPersonName.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
                {otherPersonName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span className="badge-online"></span> {booking.serviceName} • Booking #{booking.id}
              </div>
            </div>
          </div>

          <button 
            onClick={closeChat}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Meetup summary pill */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#cbd5e1'
        }}>
          <MapPin size={14} color="#ec4899" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {booking.meetingLocation}
          </span>
        </div>

        {/* Message feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Platonic Safety reminder inside chat */}
          <div style={{
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#c084fc',
            textAlign: 'center'
          }}>
            🔒 Safety reminder: Keep all discussions respectful, professional, and platonic. Never arrange meetups in non-public spaces.
          </div>

          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px', fontSize: '0.88rem' }}>
              No messages yet. Say hello to coordinate your meetup!
            </div>
          ) : (
            messages.map(msg => {
              const isMe = msg.senderRole === currentRole;
              return (
                <div 
                  key={msg.id}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    marginBottom: '2px',
                    padding: '0 4px'
                  }}>
                    {isMe ? 'You' : msg.senderName}
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '16px',
                    borderTopRightRadius: isMe ? '4px' : '16px',
                    borderTopLeftRadius: isMe ? '16px' : '4px',
                    background: isMe ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : '#334155',
                    color: '#fff',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <input 
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Message ${otherPersonName}...`}
            style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
          />
          <button 
            type="submit"
            className="btn-primary"
            style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}
