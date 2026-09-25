import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Plus 
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function NotificationsTab({
  notifications = { broadcasts: [], templates: [] },
  onSendBroadcast
}) {
  const [form, setForm] = useState({
    title: '',
    target: 'All Users',
    channel: 'Push & Email',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    setLoading(true);
    await onSendBroadcast(form);
    setLoading(false);
    setSentSuccess(true);
    setForm({ title: '', target: 'All Users', channel: 'Push & Email', message: '' });
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#38bdf8" /> Notifications & Automated Alerts
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Multi-channel broadcast messaging (Push, Email, WhatsApp) & triggered transaction templates.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Dispatch Broadcast Card */}
        <div className="admin-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={16} color="#38bdf8" /> Dispatch Instant Notification
          </h3>

          <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Broadcast Title / Header</label>
              <input
                type="text"
                placeholder="e.g. Weekend City Surge in Delhi NCR & Mumbai"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Audience</label>
                <select
                  value={form.target}
                  onChange={e => setForm({ ...form, target: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="All Users">All Users (Hirers & Partners)</option>
                  <option value="All Partners">Partners Only</option>
                  <option value="All Customers">Hirers / Customers Only</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Delivery Channel</label>
                <select
                  value={form.channel}
                  onChange={e => setForm({ ...form, channel: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Push & Email">In-App Push & Email</option>
                  <option value="SMS & WhatsApp">SMS & WhatsApp Alerts</option>
                  <option value="All Channels">Omni-Channel Blast</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Message Body</label>
              <textarea
                rows={4}
                placeholder="Write message content with safety reminders, surge notices or holiday greetings..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-action btn-admin-primary"
              style={{ justifyContent: 'center', padding: '10px' }}
            >
              {sentSuccess ? <CheckCircle2 size={16} /> : <Send size={16} />}
              {sentSuccess ? 'Broadcast Dispatched!' : 'Send Multi-Channel Broadcast'}
            </button>
          </form>
        </div>

        {/* Right: Broadcast History */}
        <div className="admin-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="#fbbf24" /> Recent Broadcast Logs
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(notifications.broadcasts || []).map(b => (
              <div key={b.id} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{b.title}</strong>
                  <span className="admin-badge admin-badge-cyan">{b.deliveredCount || 42} Sent</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>{b.message}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Audience: {b.target} • {b.channel}</span>
                  <span>{formatDateTime(b.sentAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactional Notification Templates */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
          System Transactional Templates
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {(notifications.templates || []).map(t => (
            <div key={t.id} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>{t.name}</span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{t.channel}</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginBottom: '6px' }}>Trigger: {t.trigger}</div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(0, 0, 0, 0.2)', padding: '8px 10px', borderRadius: '6px', fontFamily: 'monospace' }}>
                {t.templateText}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
