import React, { useState } from 'react';
import {
  HelpCircle,
  Headphones,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  X,
  MessageSquare
} from 'lucide-react';

const HIRER_FAQS = [
  {
    q: 'How does hiring a companion on PartnerOnRent work?',
    a: 'You can search for verified companions by city, service (movies, coffee, shopping, heritage tours), date, and duration. Upon booking, you meet at your selected public venue. You provide a 4-digit OTP to the companion upon arrival to start the session timer.'
  },
  {
    q: 'Is physical intimacy allowed during a companionship session?',
    a: 'Absolutely NOT. PartnerOnRent is strictly a platonic companionship and emotional wellness platform. Any request for physical intimacy, private hotel visits, or inappropriate behavior violates platform policy and will lead to an immediate ban and legal reporting.'
  },
  {
    q: 'Where do companion sessions take place?',
    a: 'Sessions take place exclusively in public spaces: coffee shops, restaurants, cinema multiplexes, shopping malls, museums, and public parks. Companions are strictly forbidden from entering private homes or private hotel rooms.'
  },
  {
    q: 'What is the cancellation and refund policy?',
    a: 'You can cancel free of charge up to 4 hours before the session start time. Cancellations with less than 2 hours notice incur a 50% companion compensation fee. If a companion does not show up, you receive a 100% instant refund.'
  },
  {
    q: 'How are companions verified?',
    a: 'All partners undergo government identity verification (Aadhaar/Passport/PAN), live facial match biometrics, and clear background checks before being approved on the platform.'
  }
];

export default function HelpSupportTab({ showToast }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Booking Question');
  const [ticketMessage, setTicketMessage] = useState('');

  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-4019', category: 'Booking Reschedule', subject: 'Change movie venue for BK-10025', status: 'In Progress', date: '2026-09-27' },
    { id: 'TCK-3810', category: 'Payment Query', subject: 'Invoice download for August sessions', status: 'Resolved', date: '2026-08-30' }
  ]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newTck = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    setSupportTickets([newTck, ...supportTickets]);
    setTicketModalOpen(false);
    setTicketSubject('');
    setTicketMessage('');
    showToast(`Support ticket #${newTck.id} created! Concierge agent assigned.`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            📄 Help, Support & Platform Policies
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Browse answers to common questions, raise concierge support tickets, and read platform safety policies.
          </p>
        </div>

        <button
          onClick={() => setTicketModalOpen(true)}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Raise Support Ticket
        </button>
      </div>

      {/* Support Tickets Ledger */}
      <div className="client-panel" style={{ marginBottom: '26px' }}>
        <div className="client-panel-title" style={{ marginBottom: '14px' }}>
          <Headphones size={18} color="#ec4899" />
          <span>My Support Tickets</span>
        </div>

        <div className="client-table-container">
          <table className="client-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map(tck => (
                <tr key={tck.id}>
                  <td><strong style={{ color: '#38bdf8' }}>#{tck.id}</strong></td>
                  <td>{tck.category}</td>
                  <td><span style={{ color: '#fff', fontWeight: 600 }}>{tck.subject}</span></td>
                  <td><span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{tck.date}</span></td>
                  <td>
                    <span className={`client-badge ${tck.status === 'Resolved' ? 'client-badge-emerald' : 'client-badge-amber'}`}>
                      {tck.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="client-panel" style={{ marginBottom: '26px' }}>
        <div className="client-panel-title" style={{ marginBottom: '16px' }}>
          <HelpCircle size={18} color="#fbbf24" />
          <span>Frequently Asked Questions</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {HIRER_FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  background: 'rgba(15, 22, 38, 0.5)',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#ffffff'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} color="#ec4899" /> : <ChevronDown size={16} color="#94a3b8" />}
                </div>

                {isOpen && (
                  <div style={{
                    padding: '0 18px 14px',
                    fontSize: '0.84rem',
                    color: '#cbd5e1',
                    lineHeight: '1.6',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '10px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Policy Quick Links Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="client-panel" style={{ padding: '16px 20px', marginBottom: 0 }}>
          <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
            📜 Terms & Conditions
          </strong>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Read complete legal definitions, user agreements, and companion booking liabilities.
          </p>
        </div>

        <div className="client-panel" style={{ padding: '16px 20px', marginBottom: 0 }}>
          <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
            🛡️ Safety & Platonic Guidelines
          </strong>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Strict zero-tolerance code for physical harassment and public place venue mandates.
          </p>
        </div>

        <div className="client-panel" style={{ padding: '16px 20px', marginBottom: 0 }}>
          <strong style={{ color: '#fff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
            🔒 Privacy Policy
          </strong>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            Learn how we protect your personal identification, payment cards, and location data.
          </p>
        </div>
      </div>

      {/* Raise Ticket Modal */}
      {ticketModalOpen && (
        <div className="client-modal-backdrop" onClick={() => setTicketModalOpen(false)}>
          <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="client-modal-header">
              <div style={{ fontWeight: 700, color: '#fff' }}>Raise Support Ticket</div>
              <button onClick={() => setTicketModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Ticket Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Booking Question</option>
                    <option>Payment & Wallet Assistance</option>
                    <option>Cancellation & Refund Help</option>
                    <option>Technical Issue / App Bug</option>
                    <option>Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Subject Line
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue..."
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Message Details
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe how we can assist you..."
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="client-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setTicketModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}>
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
