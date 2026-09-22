const API_BASE = '/api';

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  return res.json();
}

export async function fetchPartners(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/partners${query ? `?${query}` : ''}`);
  return res.json();
}

export async function fetchPartnerById(id) {
  const res = await fetch(`${API_BASE}/partners/${id}`);
  return res.json();
}

export async function updatePartnerProfile(id, data) {
  const res = await fetch(`${API_BASE}/partners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function togglePartnerOnline(id) {
  const res = await fetch(`${API_BASE}/partners/${id}/toggle-online`, {
    method: 'POST'
  });
  return res.json();
}

export async function submitPartnerKYC(id, kycData) {
  const res = await fetch(`${API_BASE}/partners/${id}/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kycData)
  });
  return res.json();
}

export async function fetchBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/bookings${query ? `?${query}` : ''}`);
  return res.json();
}

export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create booking');
  }
  return res.json();
}

export async function updateBookingStatus(id, status) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function startSessionWithOTP(id, otp) {
  const res = await fetch(`${API_BASE}/bookings/${id}/start-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Invalid OTP');
  }
  return res.json();
}

export async function endSession(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}/end-session`, {
    method: 'POST'
  });
  return res.json();
}

export async function submitReview(id, reviewData) {
  const res = await fetch(`${API_BASE}/bookings/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  return res.json();
}

export async function fetchMessages(bookingId) {
  const res = await fetch(`${API_BASE}/messages/${bookingId}`);
  return res.json();
}

export async function sendMessage(bookingId, messageData) {
  const res = await fetch(`${API_BASE}/messages/${bookingId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
  return res.json();
}

export async function fetchWallet(userId) {
  const res = await fetch(`${API_BASE}/wallet/${userId}`);
  return res.json();
}

export async function topupWallet(userId, amount) {
  const res = await fetch(`${API_BASE}/wallet/topup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount })
  });
  return res.json();
}

export async function fetchPayouts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/payouts${query ? `?${query}` : ''}`);
  return res.json();
}

export async function requestPayout(payoutData) {
  const res = await fetch(`${API_BASE}/payouts/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payoutData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to request payout');
  }
  return res.json();
}

export async function updatePayoutStatus(id, status, transactionRef) {
  const res = await fetch(`${API_BASE}/payouts/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, transactionRef })
  });
  return res.json();
}

export async function triggerSOSAlert(alertData) {
  const res = await fetch(`${API_BASE}/sos-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertData)
  });
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  return res.json();
}

export async function fetchAdminSOSAlerts() {
  const res = await fetch(`${API_BASE}/admin/sos-alerts`);
  return res.json();
}

export async function resolveAdminSOSAlert(id, notes) {
  const res = await fetch(`${API_BASE}/admin/sos-alerts/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  return res.json();
}

export async function updatePartnerKYCAdmin(partnerId, status, notes) {
  const res = await fetch(`${API_BASE}/admin/partners/${partnerId}/kyc`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes })
  });
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}
