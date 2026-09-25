import React, { useState } from 'react';
import {
  MapPin,
  Home,
  Briefcase,
  Coffee,
  Film,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';

const INITIAL_SAVED_LOCATIONS = [
  {
    id: 1,
    tag: 'Home Locality',
    type: 'Home',
    title: 'GK-1 M-Block Market Cafe Lobby',
    address: 'M-Block Market, Greater Kailash 1, New Delhi 110048',
    landmark: 'Near Starbucks outdoor seating',
    city: 'Delhi NCR'
  },
  {
    id: 2,
    tag: 'Office Hub',
    type: 'Office',
    title: 'Cyber Hub Main Entrance',
    address: 'DLF Cyber City, Sector 24, Gurugram, Haryana 122002',
    landmark: 'Under the main Cyber Hub footbridge Gate 3',
    city: 'Delhi NCR'
  },
  {
    id: 3,
    tag: 'Favorite Cafe',
    type: 'Cafe',
    title: 'Blue Tokai Coffee Roasters',
    address: 'Saidulajab, Saket, New Delhi 110030',
    landmark: 'Champa Gali, Lane 3',
    city: 'Delhi NCR'
  },
  {
    id: 4,
    tag: 'Movie Theater',
    type: 'Theater',
    title: 'PVR Director Cut Ambience Mall',
    address: 'Ambience Mall, NH 8, Gurugram 122002',
    landmark: '3rd Floor Box Office Lounge',
    city: 'Delhi NCR'
  }
];

export default function SavedLocationsTab({ showToast }) {
  const [locations, setLocations] = useState(INITIAL_SAVED_LOCATIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [tag, setTag] = useState('Favorite Cafe');
  const [type, setType] = useState('Cafe');
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Delhi NCR');

  const getLocationIcon = (t) => {
    switch (t) {
      case 'Home': return <Home size={18} color="#34d399" />;
      case 'Office': return <Briefcase size={18} color="#38bdf8" />;
      case 'Cafe': return <Coffee size={18} color="#ec4899" />;
      case 'Theater': return <Film size={18} color="#c084fc" />;
      default: return <MapPin size={18} color="#fbbf24" />;
    }
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    const newLoc = {
      id: Date.now(),
      tag,
      type,
      title: title.trim(),
      address: address.trim(),
      landmark: landmark.trim() || 'Public lobby',
      city
    };

    setLocations([...locations, newLoc]);
    setModalOpen(false);
    setTitle('');
    setAddress('');
    setLandmark('');
    showToast('Saved meeting location added!');
  };

  const handleDelete = (id) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    showToast('Saved location removed.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            📍 Saved Meeting Locations
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Store your favorite public cafes, mall lobbies, and cinema lounges for instant 1-click booking checkout.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Add Saved Location
        </button>
      </div>

      {/* Grid of Saved Locations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
        {locations.map(loc => (
          <div
            key={loc.id}
            className="client-panel"
            style={{
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getLocationIcon(loc.type)}
                  </div>
                  <div>
                    <span className="client-badge client-badge-pink">{loc.tag}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(loc.id)}
                  style={{ color: '#f87171', padding: '4px', cursor: 'pointer' }}
                  title="Remove location"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 6px' }}>
                {loc.title}
              </h3>

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '8px' }}>
                {loc.address}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                📍 Landmark: {loc.landmark}
              </div>
            </div>

            <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{loc.city}</span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.76rem', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Maps <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Saved Location Modal */}
      {modalOpen && (
        <div className="client-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="client-modal-header">
              <div style={{ fontWeight: 700, color: '#fff' }}>Add Saved Meeting Location</div>
              <button onClick={() => setModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLocation}>
              <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Category Type
                  </label>
                  <select
                    value={type}
                    onChange={e => {
                      setType(e.target.value);
                      setTag(e.target.value === 'Home' ? 'Home Locality' : e.target.value === 'Office' ? 'Office Hub' : e.target.value === 'Theater' ? 'Movie Theater' : 'Favorite Cafe');
                    }}
                    style={{ width: '100%' }}
                  >
                    <option value="Cafe">Favorite Cafe</option>
                    <option value="Theater">Movie Theater</option>
                    <option value="Home">Home Locality (Public Lobby)</option>
                    <option value="Office">Office Hub (Public Entrance)</option>
                    <option value="Other">Other Public Spot</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Venue Title / Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starbucks Cyber Hub"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Full Address (Public Venue)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Enter complete commercial street address..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Meeting Landmark / Meeting Spot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near main counter, Gate 2"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    City
                  </label>
                  <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%' }}>
                    <option>Delhi NCR</option>
                    <option>Jaipur</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Pune</option>
                  </select>
                </div>
              </div>

              <div className="client-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}>
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
