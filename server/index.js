const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

// Helper functions for reading and writing data
function readData() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return null;
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// 1. Settings & Metadata
app.get('/api/settings', (req, res) => {
  const db = readData();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = readData();
  db.settings = { ...db.settings, ...req.body };
  writeData(db);
  res.json(db.settings);
});

// 2. Services
app.get('/api/services', (req, res) => {
  const db = readData();
  res.json(db.services);
});

// 3. Partners
app.get('/api/partners', (req, res) => {
  const db = readData();
  let partners = db.partners;

  const { city, service, gender, search, maxRate, onlyOnline } = req.query;

  if (city && city !== 'All Cities') {
    partners = partners.filter(p => p.city.toLowerCase() === city.toLowerCase());
  }

  if (service && service !== 'all') {
    partners = partners.filter(p => p.services.some(s => s.serviceId === service));
  }

  if (gender && gender !== 'all') {
    partners = partners.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
  }

  if (maxRate) {
    partners = partners.filter(p => p.hourlyRate <= Number(maxRate));
  }

  if (onlyOnline === 'true') {
    partners = partners.filter(p => p.isOnline);
  }

  if (search) {
    const q = search.toLowerCase();
    partners = partners.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.bio.toLowerCase().includes(q) ||
      p.areas.some(a => a.toLowerCase().includes(q))
    );
  }

  res.json(partners);
});

app.get('/api/partners/:id', (req, res) => {
  const db = readData();
  const partner = db.partners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });
  
  // Attach recent reviews
  const reviews = db.reviews.filter(r => r.partnerId === partner.id);
  res.json({ ...partner, reviews });
});

app.put('/api/partners/:id', (req, res) => {
  const db = readData();
  const index = db.partners.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Partner not found' });

  db.partners[index] = { ...db.partners[index], ...req.body };
  writeData(db);
  res.json(db.partners[index]);
});

// Toggle Online Status
app.post('/api/partners/:id/toggle-online', (req, res) => {
  const db = readData();
  const index = db.partners.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Partner not found' });

  db.partners[index].isOnline = !db.partners[index].isOnline;
  writeData(db);
  res.json({ isOnline: db.partners[index].isOnline });
});

// Partner KYC submission
app.post('/api/partners/:id/kyc', (req, res) => {
  const db = readData();
  const index = db.partners.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Partner not found' });

  const { idType, idNumber, holderName } = req.body;
  db.partners[index].kycStatus = 'pending';
  db.partners[index].kycDocuments = {
    idType,
    idNumber,
    holderName,
    submittedAt: new Date().toISOString(),
    backgroundCheck: 'Under automated Aadhaar/Govt ID verification review'
  };

  writeData(db);
  res.json({ message: 'KYC submitted successfully', partner: db.partners[index] });
});

// 4. Bookings
app.get('/api/bookings', (req, res) => {
  const db = readData();
  const { clientId, partnerId } = req.query;

  let bookings = db.bookings;
  if (clientId) {
    bookings = bookings.filter(b => b.clientId === clientId);
  }
  if (partnerId) {
    bookings = bookings.filter(b => b.partnerId === partnerId);
  }

  // Sort by createdAt descending
  bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const db = readData();
  const {
    clientId,
    clientName,
    clientPhone,
    partnerId,
    serviceId,
    date,
    startTime,
    durationHours,
    meetingLocation,
    clientNotes,
    emergencyContact,
    payViaWallet
  } = req.body;

  const partner = db.partners.find(p => p.id === partnerId);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const service = db.services.find(s => s.id === serviceId);
  const serviceRate = partner.services.find(s => s.serviceId === serviceId)?.ratePerHour || partner.hourlyRate;

  const hours = Number(durationHours) || 2;
  const baseAmount = serviceRate * hours;
  const platformFee = Math.round(baseAmount * 0.10); // 10% platform service fee for clients
  const gstAmount = Math.round((baseAmount + platformFee) * 0.05); // 5% GST
  const totalAmount = baseAmount + platformFee + gstAmount;

  // Partner earns 80% of base rate
  const partnerShare = Math.round(baseAmount * 0.80);
  const platformRevenue = totalAmount - partnerShare;

  // Check wallet balance if paying via wallet
  const clientUser = db.users.find(u => u.id === clientId);
  if (payViaWallet && clientUser) {
    if (clientUser.walletBalance < totalAmount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
    clientUser.walletBalance -= totalAmount;
  }

  // Generate 4-digit session OTP
  const startOtp = Math.floor(1000 + Math.random() * 9000).toString();

  const newBooking = {
    id: `BK-${Date.now().toString().slice(-4)}`,
    clientId: clientId || 'client-1',
    clientName: clientName || clientUser?.name || 'Guest Hirer',
    clientPhone: clientPhone || clientUser?.phone || '+91 98765 00000',
    partnerId,
    partnerName: partner.name,
    partnerAvatar: partner.avatar,
    serviceId,
    serviceName: service?.name || 'Companion Session',
    date,
    startTime,
    durationHours: hours,
    hourlyRate: serviceRate,
    baseAmount,
    platformFee,
    gstAmount,
    totalAmount,
    partnerShare,
    platformRevenue,
    meetingLocation,
    clientNotes: clientNotes || '',
    emergencyContact: emergencyContact || '+91 99999 11111',
    status: 'pending', // Pending partner acceptance
    startOtp,
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  writeData(db);

  res.status(201).json(newBooking);
});

// Partner accepts/declines booking
app.put('/api/bookings/:id/status', (req, res) => {
  const db = readData();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });

  const { status } = req.body; // 'confirmed', 'declined', 'cancelled'
  db.bookings[index].status = status;
  writeData(db);
  res.json(db.bookings[index]);
});

// Start session via OTP verification
app.post('/api/bookings/:id/start-session', (req, res) => {
  const db = readData();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });

  const { otp } = req.body;
  if (db.bookings[index].startOtp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification OTP code. Please check with the client.' });
  }

  db.bookings[index].status = 'in-progress';
  db.bookings[index].startedAt = new Date().toISOString();
  writeData(db);
  res.json({ message: 'Session started successfully', booking: db.bookings[index] });
});

// End session and release partner payout to partner wallet
app.post('/api/bookings/:id/end-session', (req, res) => {
  const db = readData();
  const index = db.bookings.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Booking not found' });

  const booking = db.bookings[index];
  booking.status = 'completed';
  booking.completedAt = new Date().toISOString();

  // Credit partner wallet with partner share (80%)
  const partner = db.partners.find(p => p.id === booking.partnerId);
  if (partner) {
    partner.walletBalance = (partner.walletBalance || 0) + booking.partnerShare;
    partner.totalEarnings = (partner.totalEarnings || 0) + booking.partnerShare;
    partner.completedHours = (partner.completedHours || 0) + booking.durationHours;
  }

  writeData(db);
  res.json({ message: 'Session completed. Funds credited to partner balance.', booking });
});

// Submit review after session
app.post('/api/bookings/:id/review', (req, res) => {
  const db = readData();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const { rating, reviewText } = req.body;
  booking.rating = Number(rating);
  booking.reviewText = reviewText;

  // Add to reviews list
  const newReview = {
    id: `REV-${Date.now().toString().slice(-4)}`,
    partnerId: booking.partnerId,
    clientName: booking.clientName,
    rating: Number(rating),
    service: booking.serviceName,
    comment: reviewText,
    date: new Date().toISOString().split('T')[0]
  };
  db.reviews.unshift(newReview);

  // Recalculate partner rating
  const partner = db.partners.find(p => p.id === booking.partnerId);
  if (partner) {
    const partnerReviews = db.reviews.filter(r => r.partnerId === partner.id);
    const avgRating = partnerReviews.reduce((sum, r) => sum + r.rating, 0) / partnerReviews.length;
    partner.rating = Number(avgRating.toFixed(2));
    partner.reviewCount = partnerReviews.length;
  }

  writeData(db);
  res.json({ message: 'Review recorded successfully', review: newReview, booking });
});

// 5. In-App Messaging
app.get('/api/messages/:bookingId', (req, res) => {
  const db = readData();
  const messages = db.messages.filter(m => m.bookingId === req.params.bookingId);
  res.json(messages);
});

app.post('/api/messages/:bookingId', (req, res) => {
  const db = readData();
  const { senderId, senderName, senderRole, text } = req.body;

  const newMsg = {
    id: `msg-${Date.now()}`,
    bookingId: req.params.bookingId,
    senderId,
    senderName,
    senderRole,
    text,
    timestamp: new Date().toISOString()
  };

  db.messages.push(newMsg);
  writeData(db);
  res.status(201).json(newMsg);
});

// 6. Wallets & Payouts
app.get('/api/wallet/:userId', (req, res) => {
  const db = readData();
  const user = db.users.find(u => u.id === req.params.userId);
  if (user) {
    return res.json({ balance: user.walletBalance || 0, user });
  }

  const partner = db.partners.find(p => p.id === req.params.userId || p.userId === req.params.userId);
  if (partner) {
    return res.json({ balance: partner.walletBalance || 0, partner });
  }

  res.status(404).json({ error: 'User not found' });
});

app.post('/api/wallet/topup', (req, res) => {
  const db = readData();
  const { userId, amount } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.walletBalance = (user.walletBalance || 0) + Number(amount);
  writeData(db);
  res.json({ message: 'Wallet topped up successfully', walletBalance: user.walletBalance });
});

app.get('/api/payouts', (req, res) => {
  const db = readData();
  const { partnerId } = req.query;
  let payouts = db.payouts;
  if (partnerId) {
    payouts = payouts.filter(p => p.partnerId === partnerId);
  }
  payouts.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  res.json(payouts);
});

app.post('/api/payouts/request', (req, res) => {
  const db = readData();
  const { partnerId, amount, method, destination } = req.body;

  const partner = db.partners.find(p => p.id === partnerId);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const withdrawAmount = Number(amount);
  if (partner.walletBalance < withdrawAmount) {
    return res.status(400).json({ error: 'Requested amount exceeds current wallet balance.' });
  }

  partner.walletBalance -= withdrawAmount;

  const newPayout = {
    id: `PAY-${Date.now().toString().slice(-4)}`,
    partnerId,
    partnerName: partner.name,
    amount: withdrawAmount,
    method: method || 'UPI',
    destination: destination || partner.bankDetails?.upiId || 'Direct UPI',
    status: 'pending',
    requestedAt: new Date().toISOString(),
    processedAt: null,
    transactionRef: null
  };

  db.payouts.unshift(newPayout);
  writeData(db);
  res.status(201).json(newPayout);
});

app.put('/api/payouts/:id/status', (req, res) => {
  const db = readData();
  const index = db.payouts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Payout not found' });

  const { status, transactionRef } = req.body;
  db.payouts[index].status = status; // 'completed' or 'rejected'
  db.payouts[index].processedAt = new Date().toISOString();
  db.payouts[index].transactionRef = transactionRef || `TXN${Date.now()}`;

  // If rejected, refund to partner balance
  if (status === 'rejected') {
    const partner = db.partners.find(p => p.id === db.payouts[index].partnerId);
    if (partner) {
      partner.walletBalance += db.payouts[index].amount;
    }
  }

  writeData(db);
  res.json(db.payouts[index]);
});

// 7. Safety SOS Alerts
app.get('/api/admin/sos-alerts', (req, res) => {
  const db = readData();
  res.json(db.sosAlerts || []);
});

app.post('/api/sos-alert', (req, res) => {
  const db = readData();
  const { bookingId, triggeredBy, userName, userRole, location, reason } = req.body;

  const newAlert = {
    id: `SOS-${Date.now().toString().slice(-4)}`,
    bookingId,
    triggeredBy,
    userName,
    userRole,
    location,
    reason: reason || 'Urgent emergency assistance requested during meetup.',
    timestamp: new Date().toISOString(),
    status: 'active',
    resolutionNotes: null
  };

  db.sosAlerts.unshift(newAlert);
  writeData(db);
  res.status(201).json({ message: 'Emergency dispatch alerted. Safety team notified.', alert: newAlert });
});

app.put('/api/admin/sos-alerts/:id/resolve', (req, res) => {
  const db = readData();
  const alert = db.sosAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  alert.status = 'resolved';
  alert.resolutionNotes = req.body.notes || 'Resolved and confirmed safe with user.';
  writeData(db);
  res.json(alert);
});

// 8. Admin KPI stats & Partner KYC approval
app.get('/api/admin/stats', (req, res) => {
  const db = readData();
  const totalBookings = db.bookings.length;
  const completedBookings = db.bookings.filter(b => b.status === 'completed');
  const activeBookings = db.bookings.filter(b => b.status === 'in-progress' || b.status === 'confirmed');

  const gmv = db.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformRevenue = db.bookings.reduce((sum, b) => sum + (b.platformRevenue || 0), 0);
  const partnerPayoutsDisbursed = db.payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingKYC = db.partners.filter(p => p.kycStatus === 'pending').length;
  const verifiedPartners = db.partners.filter(p => p.kycStatus === 'verified').length;
  const pendingPayouts = db.payouts.filter(p => p.status === 'pending').length;
  const activeSOS = db.sosAlerts.filter(a => a.status === 'active').length;

  res.json({
    gmv,
    platformRevenue,
    partnerPayoutsDisbursed,
    totalBookings,
    completedBookingsCount: completedBookings.length,
    activeBookingsCount: activeBookings.length,
    pendingKYC,
    verifiedPartners,
    pendingPayouts,
    activeSOS,
    totalPartners: db.partners.length,
    totalClients: db.users.filter(u => u.role === 'client').length
  });
});

app.put('/api/admin/partners/:id/kyc', (req, res) => {
  const db = readData();
  const partner = db.partners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const { status, notes } = req.body; // 'verified' or 'rejected'
  partner.kycStatus = status;
  if (!partner.kycDocuments) partner.kycDocuments = {};
  partner.kycDocuments.reviewedAt = new Date().toISOString();
  partner.kycDocuments.reviewNotes = notes || '';
  if (status === 'verified') {
    partner.badge = 'Verified Partner';
  }

  writeData(db);
  res.json({ message: `Partner KYC ${status}`, partner });
});

// 9. Current User & Switch Role
app.get('/api/users', (req, res) => {
  const db = readData();
  res.json(db.users);
});

// 10. Authentication & Admin Credentials
app.post('/api/auth/login', (req, res) => {
  const db = readData();
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email and role (with admin alias tolerance for .in / .com)
  const user = db.users.find(u => {
    const userEmail = (u.email || '').toLowerCase();
    const roleMatches = !role || u.role === role;
    const emailMatches =
      userEmail === normalizedEmail ||
      (u.role === 'admin' && (normalizedEmail === 'admin@partneronrent.in' || normalizedEmail === 'admin@partneronrent.com'));

    return roleMatches && emailMatches;
  });

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your email and password.'
    });
  }

  const { password: _pw, ...safeUser } = user;
  res.json({
    success: true,
    message: 'Authentication successful.',
    user: safeUser
  });
});

app.post('/api/auth/admin/change-password', (req, res) => {
  const db = readData();
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
  }

  const adminIndex = db.users.findIndex(u => u.role === 'admin');
  if (adminIndex === -1) {
    return res.status(404).json({ success: false, message: 'Admin account not found.' });
  }

  if (db.users[adminIndex].password !== currentPassword) {
    return res.status(401).json({ success: false, message: 'Incorrect current password.' });
  }

  db.users[adminIndex].password = newPassword;
  writeData(db);

  res.json({
    success: true,
    message: 'Admin password updated successfully. Please use your new password on subsequent logins.'
  });
});

app.get('/api/auth/admin/info', (req, res) => {
  const db = readData();
  const admin = db.users.find(u => u.role === 'admin');
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found.' });
  }

  res.json({
    success: true,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      avatar: admin.avatar
    }
  });
});

app.listen(PORT, () => {
  console.log(`PartnerOnRent backend running on http://localhost:${PORT}`);
});

