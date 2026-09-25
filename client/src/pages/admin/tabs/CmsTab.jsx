import React, { useState } from 'react';
import { 
  FileText, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  Globe, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

export default function CmsTab({
  cms = { pages: [], banners: [] },
  onUpdatePage
}) {
  const [editingPage, setEditingPage] = useState(null);
  const [contentVal, setContentVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenEdit = (page) => {
    setEditingPage(page);
    setContentVal(page.content || page.headline || JSON.stringify(page.items || {}, null, 2));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingPage) return;
    setLoading(true);
    await onUpdatePage(editingPage.slug, {
      ...editingPage,
      content: contentVal
    });
    setLoading(false);
    setEditingPage(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#38bdf8" /> Content Management System (CMS)
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Live content editing for landing pages, FAQs, banners, guidelines & safety disclosures.
          </div>
        </div>
      </div>

      {/* Pages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {(cms.pages || []).map(p => (
          <div key={p.slug} className="admin-card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>
                  /{p.slug}
                </span>
                <span className={`admin-badge ${p.published ? 'admin-badge-emerald' : 'admin-badge-gray'}`}>
                  {p.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px', maxHeight: '72px', overflow: 'hidden' }}>
                {p.headline || p.content || 'Structured FAQ / terms content.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Updated: {p.updatedAt}</span>
              <button
                onClick={() => handleOpenEdit(p)}
                className="btn-admin-action btn-admin-primary"
                style={{ fontSize: '0.76rem' }}
              >
                <Edit3 size={12} /> Edit Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banners & Announcement Highlights */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
          Active Web & Mobile App Banners
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(cms.banners || []).map(b => (
            <div key={b.id} style={{
              background: b.bgColor || '#0284c7',
              borderRadius: '12px',
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff'
            }}>
              <div>
                <strong style={{ fontSize: '0.95rem' }}>{b.title}</strong>
                <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>{b.message}</div>
              </div>
              <span className="admin-badge admin-badge-emerald" style={{ background: 'rgba(0,0,0,0.3)', border: 'none' }}>
                LIVE ON WEB
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Page Modal */}
      {editingPage && (
        <div className="admin-modal-backdrop" onClick={() => setEditingPage(null)}>
          <div className="admin-modal-content" style={{ maxWidth: '600px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px' }}>
              Edit Content: {editingPage.title}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Markdown / Copy Text
                </label>
                <textarea
                  rows={8}
                  value={contentVal}
                  onChange={e => setContentVal(e.target.value)}
                  style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="btn-admin-action btn-admin-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-admin-action btn-admin-primary"
                >
                  Save & Publish to Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
