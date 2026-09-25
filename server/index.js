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
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    adminName: req.body.adminName || 'Safety Admin',
    action: 'SOS Alert Resolved',
    entity: 'SOS Alert',
    entityId: alert.id,
    oldValue: 'Active',
    newValue: 'Resolved',
    reason: req.body.notes || 'Resolved and confirmed safe with user.',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  });
  writeData(db);
  res.json(alert);
});

// Helper for audit logs
function logAudit(db, adminName, action, entity, entityId, oldValue, newValue, reason) {
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-5)}`,
    adminName: adminName || 'Super Administrator',
    action,
    entity,
    entityId,
    oldValue: String(oldValue || 'N/A'),
    newValue: String(newValue || 'N/A'),
    reason: reason || 'Operation executed via Admin Console',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  });
}

// 8. Admin KPI stats (Expanded with all requested metrics)
app.get('/api/admin/stats', (req, res) => {
  const db = readData();
  const bookings = db.bookings || [];
  const partners = db.partners || [];
  const users = db.users || [];
  const clients = users.filter(u => u.role === 'client');
  const complaints = db.complaints || [];
  const safetyIncidents = db.safetyIncidents || [];
  const transactions = db.transactions || [];

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const activeBookings = bookings.filter(b => b.status === 'in-progress' || b.status === 'confirmed');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');

  const gmv = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformRevenue = bookings.reduce((sum, b) => sum + (b.platformRevenue || 0), 0);
  const partnerEarnings = bookings
    .filter(b => b.status === 'completed' || b.status === 'in-progress')
    .reduce((sum, b) => sum + (b.partnerShare || 0), 0);
  
  const partnerPayoutsDisbursed = (db.payouts || [])
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.status === 'refunded' || t.status === 'partial_refund')
    .reduce((sum, t) => sum + (t.refundAmount || 0), 0);

  const pendingKYC = partners.filter(p => p.kycStatus === 'pending' || p.kycStatus === 'under_review').length;
  const verifiedPartners = partners.filter(p => p.kycStatus === 'verified').length;
  const activePartners = partners.filter(p => p.isOnline || p.status === 'active' || p.status === 'verified').length;
  const pendingPayouts = (db.payouts || []).filter(p => p.status === 'pending').length;
  const activeSOS = (db.sosAlerts || []).filter(a => a.status === 'active').length;
  const openDisputes = complaints.filter(c => c.status !== 'resolved' && c.status !== 'rejected').length;
  const safetyAlertsCount = activeSOS + safetyIncidents.filter(s => s.status === 'active' || s.status === 'investigating').length;

  // City-wise statistics
  const cityStats = {};
  bookings.forEach(b => {
    const loc = b.meetingLocation || '';
    let cityName = 'Delhi NCR';
    if (loc.toLowerCase().includes('mumbai')) cityName = 'Mumbai';
    else if (loc.toLowerCase().includes('bangalore') || loc.toLowerCase().includes('bengaluru')) cityName = 'Bangalore';
    else if (loc.toLowerCase().includes('jaipur')) cityName = 'Jaipur';
    else if (loc.toLowerCase().includes('pune')) cityName = 'Pune';
    else if (loc.toLowerCase().includes('hyderabad')) cityName = 'Hyderabad';
    
    if (!cityStats[cityName]) {
      cityStats[cityName] = { city: cityName, bookings: 0, revenue: 0 };
    }
    cityStats[cityName].bookings += 1;
    cityStats[cityName].revenue += (b.totalAmount || 0);
  });

  res.json({
    gmv,
    todayRevenue: Math.round(gmv * 0.18),
    platformRevenue,
    partnerEarnings,
    partnerPayoutsDisbursed,
    totalRefunds,
    totalBookings,
    todayBookings: Math.min(totalBookings, 3),
    upcomingBookingsCount: upcomingBookings.length,
    completedBookingsCount: completedBookings.length,
    cancelledBookingsCount: cancelledBookings.length,
    activeBookingsCount: activeBookings.length,
    totalPartners: partners.length,
    activePartners,
    pendingKYC,
    verifiedPartners,
    totalCustomers: clients.length,
    pendingPayouts,
    activeSOS,
    openDisputes,
    safetyAlertsCount,
    cityStats: Object.values(cityStats),
    charts: {
      dailyRevenue: [
        { day: 'Mon', revenue: 14500, bookings: 4 },
        { day: 'Tue', revenue: 18200, bookings: 6 },
        { day: 'Wed', revenue: 22400, bookings: 7 },
        { day: 'Thu', revenue: 19800, bookings: 5 },
        { day: 'Fri', revenue: 34500, bookings: 11 },
        { day: 'Sat', revenue: 48900, bookings: 16 },
        { day: 'Sun', revenue: 52100, bookings: 18 }
      ],
      monthlyRevenue: [
        { month: 'Apr', revenue: 180000 },
        { month: 'May', revenue: 240000 },
        { month: 'Jun', revenue: 310000 },
        { month: 'Jul', revenue: 395000 },
        { month: 'Aug', revenue: 470000 },
        { month: 'Sep', revenue: 585000 }
      ]
    }
  });
});

// Customer Management Endpoints
app.get('/api/admin/customers', (req, res) => {
  const db = readData();
  const clients = (db.users || []).filter(u => u.role === 'client');
  res.json(clients);
});

app.put('/api/admin/customers/:id/status', (req, res) => {
  const db = readData();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Customer not found' });

  const oldStatus = user.status || 'active';
  const newStatus = req.body.status;
  const reason = req.body.reason || 'Status changed by Admin';
  user.status = newStatus;
  if (!user.adminNotes) user.adminNotes = [];
  user.adminNotes.unshift(`Status changed from ${oldStatus} to ${newStatus}: ${reason}`);

  logAudit(db, req.body.adminName, 'Customer Status Update', 'Customer', user.id, oldStatus, newStatus, reason);
  writeData(db);
  res.json({ message: 'Customer status updated', user });
});

app.post('/api/admin/customers/:id/notes', (req, res) => {
  const db = readData();
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Customer not found' });

  if (!user.adminNotes) user.adminNotes = [];
  user.adminNotes.unshift(req.body.note);
  writeData(db);
  res.json({ notes: user.adminNotes });
});

// Partner Management Endpoints
app.get('/api/admin/partners', (req, res) => {
  const db = readData();
  res.json(db.partners || []);
});

app.put('/api/admin/partners/:id/status', (req, res) => {
  const db = readData();
  const partner = db.partners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const oldStatus = partner.status || 'active';
  const newStatus = req.body.status;
  const reason = req.body.reason || 'Partner status updated';
  partner.status = newStatus;
  if (newStatus === 'verified') partner.kycStatus = 'verified';
  if (newStatus === 'suspended' || newStatus === 'blocked') partner.isOnline = false;

  if (!partner.adminNotes) partner.adminNotes = [];
  partner.adminNotes.unshift(`Status changed from ${oldStatus} to ${newStatus}: ${reason}`);

  logAudit(db, req.body.adminName, 'Partner Status Update', 'Partner', partner.id, oldStatus, newStatus, reason);
  writeData(db);
  res.json({ message: 'Partner status updated', partner });
});

app.put('/api/admin/partners/:id/kyc', (req, res) => {
  const db = readData();
  const partner = db.partners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  const { status, notes, adminName } = req.body; // 'verified', 'rejected', 'under_review', 'suspended'
  const oldKyc = partner.kycStatus;
  partner.kycStatus = status;
  if (status === 'verified') {
    partner.status = 'verified';
    partner.badge = 'Verified Partner';
  } else if (status === 'rejected') {
    partner.status = 'rejected';
  }

  if (!partner.kycDocuments) partner.kycDocuments = {};
  partner.kycDocuments.reviewedAt = new Date().toISOString();
  partner.kycDocuments.reviewNotes = notes || '';
  if (!partner.kycDocuments.verificationHistory) partner.kycDocuments.verificationHistory = [];
  partner.kycDocuments.verificationHistory.unshift({
    date: new Date().toISOString().split('T')[0],
    status: status.toUpperCase(),
    note: notes || 'Reviewed by KYC verification desk'
  });

  logAudit(db, adminName, 'KYC Verification', 'Partner', partner.id, oldKyc, status, notes);
  writeData(db);
  res.json({ message: `Partner KYC ${status}`, partner });
});

app.post('/api/admin/partners/:id/notes', (req, res) => {
  const db = readData();
  const partner = db.partners.find(p => p.id === req.params.id);
  if (!partner) return res.status(404).json({ error: 'Partner not found' });

  if (!partner.adminNotes) partner.adminNotes = [];
  partner.adminNotes.unshift(req.body.note);
  writeData(db);
  res.json({ notes: partner.adminNotes });
});

// Booking Management Endpoints
app.get('/api/admin/bookings', (req, res) => {
  const db = readData();
  res.json(db.bookings || []);
});

app.put('/api/admin/bookings/:id/status', (req, res) => {
  const db = readData();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const oldStatus = booking.status;
  const newStatus = req.body.status;
  const reason = req.body.reason || 'Admin status override';
  booking.status = newStatus;

  logAudit(db, req.body.adminName, 'Booking Status Override', 'Booking', booking.id, oldStatus, newStatus, reason);
  writeData(db);
  res.json({ message: 'Booking status updated', booking });
});

app.post('/api/admin/bookings/:id/refund', (req, res) => {
  const db = readData();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const refundAmount = Number(req.body.amount) || booking.totalAmount;
  booking.status = 'cancelled';
  booking.refundAmount = refundAmount;
  booking.refundStatus = 'processed';

  // Refund client wallet if exists
  const client = db.users.find(u => u.id === booking.clientId);
  if (client) {
    client.walletBalance = (client.walletBalance || 0) + refundAmount;
  }

  // Record transaction
  if (!db.transactions) db.transactions = [];
  db.transactions.unshift({
    id: `TXN-${Date.now().toString().slice(-4)}`,
    bookingId: booking.id,
    customerName: booking.clientName,
    partnerName: booking.partnerName,
    amount: booking.totalAmount,
    gatewayFee: 0,
    platformCommission: 0,
    partnerAmount: 0,
    refundAmount: refundAmount,
    netPlatformEarnings: -refundAmount,
    paymentMethod: 'Refund Credit to Wallet',
    status: 'refunded',
    date: new Date().toISOString()
  });

  logAudit(db, req.body.adminName, 'Booking Refund Processed', 'Booking', booking.id, 'Paid', `Refunded ₹${refundAmount}`, req.body.reason);
  writeData(db);
  res.json({ message: `Refund of ₹${refundAmount} processed successfully`, booking });
});

// Locations & Cities Endpoints
app.get('/api/admin/locations', (req, res) => {
  const db = readData();
  res.json(db.locations || []);
});

app.post('/api/admin/locations/city', (req, res) => {
  const db = readData();
  const { stateName, cityName, areas } = req.body;
  if (!db.locations) db.locations = [];

  let stateObj = db.locations.find(s => s.state.toLowerCase() === stateName.toLowerCase());
  if (!stateObj) {
    stateObj = { state: stateName, cities: [] };
    db.locations.push(stateObj);
  }

  stateObj.cities.push({
    name: cityName,
    areas: areas || [],
    partnerCount: 0,
    customerCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
    isActive: true,
    popular: false
  });

  logAudit(db, req.body.adminName, 'City Added', 'Location', cityName, 'None', cityName, `Added under ${stateName}`);
  writeData(db);
  res.json({ message: 'City added successfully', locations: db.locations });
});

app.put('/api/admin/locations/city/toggle', (req, res) => {
  const db = readData();
  const { cityName } = req.body;
  let targetCity = null;

  (db.locations || []).forEach(st => {
    st.cities.forEach(c => {
      if (c.name.toLowerCase() === cityName.toLowerCase()) {
        c.isActive = !c.isActive;
        targetCity = c;
      }
    });
  });

  if (!targetCity) return res.status(404).json({ error: 'City not found' });
  writeData(db);
  res.json({ message: `City ${cityName} active state toggled`, city: targetCity });
});

// Services Endpoints
app.get('/api/admin/services', (req, res) => {
  const db = readData();
  res.json(db.services || []);
});

app.post('/api/admin/services', (req, res) => {
  const db = readData();
  const { id, name, tagline, basePrice, category, description, commissionPct, minHours } = req.body;
  if (!db.services) db.services = [];

  const newService = {
    id: id || name.toLowerCase().replace(/\s+/g, '-'),
    name,
    tagline,
    basePrice: Number(basePrice),
    icon: 'Sparkles',
    category: category || 'Social',
    description,
    commissionPct: Number(commissionPct) || 15,
    minHours: Number(minHours) || 2,
    active: true
  };

  db.services.push(newService);
  logAudit(db, req.body.adminName, 'Service Created', 'Service', newService.id, 'None', newService.name, 'New companion service catalog item');
  writeData(db);
  res.json({ message: 'Service added successfully', service: newService });
});

app.put('/api/admin/services/:id', (req, res) => {
  const db = readData();
  const service = db.services.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  Object.assign(service, req.body);
  logAudit(db, req.body.adminName, 'Service Updated', 'Service', service.id, 'Previous Values', 'Updated', 'Service pricing or details edited');
  writeData(db);
  res.json({ message: 'Service updated', service });
});

// Commission & Cancellation Policy Endpoints
app.get('/api/admin/commissions', (req, res) => {
  const db = readData();
  res.json(db.commissionRules || {});
});

app.put('/api/admin/commissions', (req, res) => {
  const db = readData();
  db.commissionRules = { ...db.commissionRules, ...req.body };
  logAudit(db, req.body.adminName, 'Commission Rules Updated', 'Commission', 'Global', 'Old Rates', 'New Rates', req.body.reason || 'Commission adjustment');
  writeData(db);
  res.json(db.commissionRules);
});

app.get('/api/admin/cancellation-policy', (req, res) => {
  const db = readData();
  res.json(db.cancellationPolicy || {});
});

app.put('/api/admin/cancellation-policy', (req, res) => {
  const db = readData();
  db.cancellationPolicy = { ...db.cancellationPolicy, ...req.body };
  logAudit(db, req.body.adminName, 'Cancellation Policy Updated', 'Cancellation', 'Global', 'Old Policy', 'New Policy', 'Policy window or penalties changed');
  writeData(db);
  res.json(db.cancellationPolicy);
});

// Payments & Payouts Endpoints
app.get('/api/admin/transactions', (req, res) => {
  const db = readData();
  res.json(db.transactions || []);
});

app.put('/api/admin/payouts/:id', (req, res) => {
  const db = readData();
  const payout = (db.payouts || []).find(p => p.id === req.params.id);
  if (!payout) return res.status(404).json({ error: 'Payout not found' });

  const oldStatus = payout.status;
  payout.status = req.body.status || 'completed';
  payout.transactionRef = req.body.transactionRef || `CMS${Date.now().toString().slice(-8)}`;
  payout.processedAt = new Date().toISOString();

  // Deduct from partner wallet balance if completed
  if (payout.status === 'completed') {
    const partner = db.partners.find(p => p.id === payout.partnerId);
    if (partner) {
      partner.walletBalance = Math.max(0, (partner.walletBalance || 0) - payout.amount);
    }
  }

  logAudit(db, req.body.adminName, 'Payout Status Updated', 'Payout', payout.id, oldStatus, payout.status, `UTR Ref: ${payout.transactionRef}`);
  writeData(db);
  res.json({ message: 'Payout updated successfully', payout });
});

// Reviews Management Endpoints
app.get('/api/admin/reviews', (req, res) => {
  const db = readData();
  res.json(db.reviews || []);
});

app.put('/api/admin/reviews/:id', (req, res) => {
  const db = readData();
  const review = (db.reviews || []).find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  const { status, action } = req.body;
  review.status = status || action;
  logAudit(db, req.body.adminName, 'Review Moderated', 'Review', review.id, 'Active', review.status, req.body.reason || 'Content moderation action');
  writeData(db);
  res.json({ message: 'Review updated', review });
});

// Complaints & Disputes Endpoints
app.get('/api/admin/complaints', (req, res) => {
  const db = readData();
  res.json(db.complaints || []);
});

app.put('/api/admin/complaints/:id', (req, res) => {
  const db = readData();
  const complaint = (db.complaints || []).find(c => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  complaint.status = req.body.status || complaint.status;
  complaint.resolution = req.body.resolution || complaint.resolution;
  complaint.assignedAdmin = req.body.assignedAdmin || complaint.assignedAdmin;
  complaint.adminNotes = req.body.adminNotes || complaint.adminNotes;

  logAudit(db, req.body.adminName, 'Dispute Resolution', 'Complaint', complaint.id, complaint.status, req.body.status, complaint.resolution);
  writeData(db);
  res.json({ message: 'Dispute status updated', complaint });
});

// Safety Center Incidents Endpoints
app.get('/api/admin/safety-incidents', (req, res) => {
  const db = readData();
  res.json(db.safetyIncidents || []);
});

app.put('/api/admin/safety-incidents/:id', (req, res) => {
  const db = readData();
  const incident = (db.safetyIncidents || []).find(s => s.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  incident.status = req.body.status || incident.status;
  incident.resolution = req.body.resolution || incident.resolution;
  incident.assignedAdmin = req.body.assignedAdmin || incident.assignedAdmin;

  logAudit(db, req.body.adminName, 'Safety Incident Updated', 'Safety', incident.id, incident.status, req.body.status, incident.resolution);
  writeData(db);
  res.json({ message: 'Safety incident updated', incident });
});

// Coupons Endpoints
app.get('/api/admin/coupons', (req, res) => {
  const db = readData();
  res.json(db.coupons || []);
});

app.post('/api/admin/coupons', (req, res) => {
  const db = readData();
  if (!db.coupons) db.coupons = [];

  const newCoupon = {
    id: `CPN-${Date.now().toString().slice(-4)}`,
    code: req.body.code.toUpperCase(),
    discountType: req.body.discountType || 'flat',
    discountValue: Number(req.body.discountValue) || 100,
    maxDiscount: Number(req.body.maxDiscount) || null,
    minBookingAmount: Number(req.body.minBookingAmount) || 500,
    targetCity: req.body.targetCity || 'All',
    maxUses: Number(req.body.maxUses) || 500,
    usedCount: 0,
    validUntil: req.body.validUntil || '2026-12-31',
    status: 'active',
    description: req.body.description || ''
  };

  db.coupons.unshift(newCoupon);
  logAudit(db, req.body.adminName, 'Coupon Created', 'Coupon', newCoupon.code, 'None', `${newCoupon.discountValue}`, 'Promo campaign generated');
  writeData(db);
  res.status(201).json({ message: 'Coupon created', coupon: newCoupon });
});

app.put('/api/admin/coupons/:id/toggle', (req, res) => {
  const db = readData();
  const coupon = (db.coupons || []).find(c => c.id === req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

  coupon.status = coupon.status === 'active' ? 'expired' : 'active';
  writeData(db);
  res.json({ message: `Coupon is now ${coupon.status}`, coupon });
});

// Notifications Endpoints
app.get('/api/admin/notifications', (req, res) => {
  const db = readData();
  res.json(db.notifications || { broadcasts: [], templates: [] });
});

app.post('/api/admin/notifications/broadcast', (req, res) => {
  const db = readData();
  if (!db.notifications) db.notifications = { broadcasts: [], templates: [] };
  if (!db.notifications.broadcasts) db.notifications.broadcasts = [];

  const newBroadcast = {
    id: `NOTIF-${Date.now().toString().slice(-4)}`,
    title: req.body.title,
    target: req.body.target || 'All Users',
    channel: req.body.channel || 'Push & Email',
    message: req.body.message,
    sentAt: new Date().toISOString(),
    deliveredCount: req.body.target === 'All Partners' ? 42 : 350
  };

  db.notifications.broadcasts.unshift(newBroadcast);
  logAudit(db, req.body.adminName, 'Broadcast Dispatched', 'Notification', newBroadcast.id, 'Draft', 'Sent', newBroadcast.title);
  writeData(db);
  res.status(201).json({ message: 'Notification broadcast dispatched successfully', broadcast: newBroadcast });
});

// CMS Content Endpoints
app.get('/api/admin/cms', (req, res) => {
  const db = readData();
  res.json(db.cms || { pages: [], banners: [] });
});

app.put('/api/admin/cms/pages/:slug', (req, res) => {
  const db = readData();
  if (!db.cms || !db.cms.pages) return res.status(404).json({ error: 'CMS pages not initialized' });

  const page = db.cms.pages.find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });

  Object.assign(page, req.body, { updatedAt: new Date().toISOString().split('T')[0] });
  logAudit(db, req.body.adminName, 'CMS Page Updated', 'CMS', page.slug, 'Draft', 'Published', `Updated ${page.title}`);
  writeData(db);
  res.json({ message: 'Page updated successfully', page });
});

// Admin Users & Team Roles Endpoints
app.get('/api/admin/admin-users', (req, res) => {
  const db = readData();
  res.json(db.adminUsers || []);
});

app.post('/api/admin/admin-users', (req, res) => {
  const db = readData();
  if (!db.adminUsers) db.adminUsers = [];

  const newUser = {
    id: `ADM-${Date.now().toString().slice(-4)}`,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'Operations Admin',
    department: req.body.department || 'Operations',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    permissions: req.body.permissions || ['partners', 'bookings'],
    lastLogin: 'Never'
  };

  db.adminUsers.push(newUser);
  logAudit(db, req.body.adminName, 'Admin Staff Created', 'AdminUser', newUser.email, 'None', newUser.role, 'New operator account invited');
  writeData(db);
  res.status(201).json({ message: 'Admin user added', adminUser: newUser });
});

// Audit Logs Endpoints
app.get('/api/admin/audit-logs', (req, res) => {
  const db = readData();
  res.json(db.auditLogs || []);
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

