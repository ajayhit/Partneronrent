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

export async function apiLogin(email, password, role) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/auth/admin/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update password');
  }
  return data;
}

export async function fetchAdminInfo() {
  const res = await fetch(`${API_BASE}/auth/admin/info`);
  return res.json();
}

export async function updatePlatformSettings(data) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ── Admin 22 Modules API Integrations ──────────────────────────────────────────

// 1. Customers
export async function fetchAdminCustomers() {
  const res = await fetch(`${API_BASE}/admin/customers`);
  return res.json();
}

export async function updateCustomerStatusAdmin(id, status, reason, adminName) {
  const res = await fetch(`${API_BASE}/admin/customers/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reason, adminName })
  });
  return res.json();
}

export async function addCustomerNoteAdmin(id, note) {
  const res = await fetch(`${API_BASE}/admin/customers/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  return res.json();
}

// 2. Partners
export async function fetchAdminPartners() {
  const res = await fetch(`${API_BASE}/admin/partners`);
  return res.json();
}

export async function updatePartnerStatusAdmin(id, status, reason, adminName) {
  const res = await fetch(`${API_BASE}/admin/partners/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reason, adminName })
  });
  return res.json();
}

export async function addPartnerNoteAdmin(id, note) {
  const res = await fetch(`${API_BASE}/admin/partners/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
  return res.json();
}

// 3. Bookings
export async function fetchAdminBookings() {
  const res = await fetch(`${API_BASE}/admin/bookings`);
  return res.json();
}

export async function updateBookingStatusAdmin(id, status, reason, adminName) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reason, adminName })
  });
  return res.json();
}

export async function refundBookingAdmin(id, amount, reason, adminName) {
  const res = await fetch(`${API_BASE}/admin/bookings/${id}/refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, reason, adminName })
  });
  return res.json();
}

// 4. Locations & Cities
export async function fetchAdminLocations() {
  const res = await fetch(`${API_BASE}/admin/locations`);
  return res.json();
}

export async function addCityAdmin(stateName, cityName, areas, adminName) {
  const res = await fetch(`${API_BASE}/admin/locations/city`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stateName, cityName, areas, adminName })
  });
  return res.json();
}

export async function toggleCityActiveAdmin(cityName) {
  const res = await fetch(`${API_BASE}/admin/locations/city/toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cityName })
  });
  return res.json();
}

// 5. Services
export async function fetchAdminServices() {
  const res = await fetch(`${API_BASE}/admin/services`);
  return res.json();
}

export async function createServiceAdmin(serviceData, adminName) {
  const res = await fetch(`${API_BASE}/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...serviceData, adminName })
  });
  return res.json();
}

export async function updateServiceAdmin(id, serviceData, adminName) {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...serviceData, adminName })
  });
  return res.json();
}

// 6. Commission & Cancellation
export async function fetchAdminCommissions() {
  const res = await fetch(`${API_BASE}/admin/commissions`);
  return res.json();
}

export async function updateCommissionsAdmin(data, adminName, reason) {
  const res = await fetch(`${API_BASE}/admin/commissions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, adminName, reason })
  });
  return res.json();
}

export async function fetchAdminCancellationPolicy() {
  const res = await fetch(`${API_BASE}/admin/cancellation-policy`);
  return res.json();
}

export async function updateCancellationPolicyAdmin(data, adminName) {
  const res = await fetch(`${API_BASE}/admin/cancellation-policy`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, adminName })
  });
  return res.json();
}

// 7. Transactions
export async function fetchAdminTransactions() {
  const res = await fetch(`${API_BASE}/admin/transactions`);
  return res.json();
}

// 8. Reviews
export async function fetchAdminReviews() {
  const res = await fetch(`${API_BASE}/admin/reviews`);
  return res.json();
}

export async function moderateReviewAdmin(id, status, reason, adminName) {
  const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reason, adminName })
  });
  return res.json();
}

// 9. Complaints & Disputes
export async function fetchAdminComplaints() {
  const res = await fetch(`${API_BASE}/admin/complaints`);
  return res.json();
}

export async function resolveComplaintAdmin(id, data, adminName) {
  const res = await fetch(`${API_BASE}/admin/complaints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, adminName })
  });
  return res.json();
}

// 10. Safety Center Incidents
export async function fetchAdminSafetyIncidents() {
  const res = await fetch(`${API_BASE}/admin/safety-incidents`);
  return res.json();
}

export async function updateSafetyIncidentAdmin(id, data, adminName) {
  const res = await fetch(`${API_BASE}/admin/safety-incidents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, adminName })
  });
  return res.json();
}

// 11. Coupons & Promotions
export async function fetchAdminCoupons() {
  const res = await fetch(`${API_BASE}/admin/coupons`);
  return res.json();
}

export async function createCouponAdmin(couponData, adminName) {
  const res = await fetch(`${API_BASE}/admin/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...couponData, adminName })
  });
  return res.json();
}

export async function toggleCouponStatusAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/coupons/${id}/toggle`, {
    method: 'PUT'
  });
  return res.json();
}

// 12. Notifications
export async function fetchAdminNotifications() {
  const res = await fetch(`${API_BASE}/admin/notifications`);
  return res.json();
}

export async function sendBroadcastAdmin(broadcastData, adminName) {
  const res = await fetch(`${API_BASE}/admin/notifications/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...broadcastData, adminName })
  });
  return res.json();
}

// 13. CMS
export async function fetchAdminCMS() {
  const res = await fetch(`${API_BASE}/admin/cms`);
  return res.json();
}

export async function updateCMSPageAdmin(slug, pageData, adminName) {
  const res = await fetch(`${API_BASE}/admin/cms/pages/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...pageData, adminName })
  });
  return res.json();
}

// 14. Admin Users
export async function fetchAdminStaffUsers() {
  const res = await fetch(`${API_BASE}/admin/admin-users`);
  return res.json();
}

export async function createAdminStaffUser(userData, adminName) {
  const res = await fetch(`${API_BASE}/admin/admin-users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...userData, adminName })
  });
  return res.json();
}

// 15. Audit Logs
export async function fetchAdminAuditLogs() {
  const res = await fetch(`${API_BASE}/admin/audit-logs`);
  return res.json();
}



