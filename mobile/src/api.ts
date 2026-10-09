import { Platform } from 'react-native';
import type {
  Booking,
  CreateBookingPayload,
  HirerKycPayload,
  Partner,
  Service,
  SubscriptionStatus,
  User,
} from './types';

const defaultApiBase =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web' ? 'http://localhost:5000/api' : 'http://172.20.10.4:5000/api');
export const API_BASE = defaultApiBase.replace(/\/+$/, '');

async function handleResponse<T>(response: Response, defaultErrorMsg: string): Promise<T> {
  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    throw new Error('Failed to read response from server.');
  }

  let data: any = null;
  try {
    data = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    // Non-json response
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `${defaultErrorMsg} (HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// ── Services ───────────────────────────────────────────────────
export async function fetchServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/services`);
    return await handleResponse<Service[]>(res, 'Failed to load experiences');
  } catch (err: any) {
    throw new Error(err.message || 'Unable to reach backend server.');
  }
}

// ── Partners Directory ────────────────────────────────────────
export async function fetchPartners(params: {
  city?: string;
  service?: string;
  gender?: string;
  search?: string;
  maxRate?: number;
  includeOffline?: boolean;
} = {}): Promise<Partner[]> {
  try {
    const query = new URLSearchParams();
    if (params.city && params.city !== 'All Cities') query.append('city', params.city);
    if (params.service && params.service !== 'all') query.append('service', params.service);
    if (params.gender && params.gender !== 'all') query.append('gender', params.gender);
    if (params.search) query.append('search', params.search);
    if (params.maxRate) query.append('maxRate', String(params.maxRate));
    if (params.includeOffline) query.append('includeOffline', 'true');

    const qs = query.toString();
    const url = `${API_BASE}/partners${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    return await handleResponse<Partner[]>(res, 'Failed to fetch companion partners');
  } catch (err: any) {
    throw new Error(err.message || 'Unable to load companions.');
  }
}

export async function fetchPartnerById(id: string): Promise<Partner> {
  const res = await fetch(`${API_BASE}/partners/${id}`);
  return await handleResponse<Partner>(res, 'Failed to load companion details');
}

// ── Hirer / Client Profile ────────────────────────────────────
export async function fetchClientProfile(id: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/clients/${id}`);
    if (res.status === 404) return null;
    return await handleResponse<User | null>(res, 'Failed to load hirer profile');
  } catch (err: any) {
    throw new Error(err.message || 'Unable to load profile.');
  }
}

export async function updateClientProfile(id: string, profileData: Partial<User>): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/clients/${id}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  return await handleResponse<{ user: User }>(res, 'Failed to update hirer profile');
}

export async function submitClientKYC(id: string, kycData: HirerKycPayload): Promise<{ message: string; user?: User }> {
  const res = await fetch(`${API_BASE}/clients/${id}/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kycData),
  });
  return await handleResponse<{ message: string; user?: User }>(res, 'Failed to submit hirer verification');
}

// ── Subscription Pass (₹249 / 1 Year) ─────────────────────────
export async function fetchSubscriptionStatus(userId: string, role: string = 'client'): Promise<SubscriptionStatus> {
  const res = await fetch(`${API_BASE}/subscription/status/${userId}?role=${role}`);
  return await handleResponse<SubscriptionStatus>(res, 'Failed to check subscription status');
}

export async function subscribeUser(
  userId: string,
  role: string = 'client',
  paymentMethod: string = 'instant'
): Promise<{
  success: boolean;
  message: string;
  subscription: {
    subscriptionPlan: string;
    subscriptionFee: number;
    subscribedAt: string;
    subscriptionExpiresAt: string;
  };
  invoiceNumber: string;
  user?: User;
}> {
  const res = await fetch(`${API_BASE}/subscription/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role, paymentMethod }),
  });
  return await handleResponse<any>(res, 'Failed to process subscription pass');
}

// ── Bookings ──────────────────────────────────────────────────
export async function fetchBookings(clientId?: string): Promise<Booking[]> {
  try {
    const qs = clientId ? `?clientId=${clientId}` : '';
    const res = await fetch(`${API_BASE}/bookings${qs}`);
    return await handleResponse<Booking[]>(res, 'Failed to load bookings');
  } catch (err: any) {
    throw new Error(err.message || 'Unable to load bookings.');
  }
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await handleResponse<Booking>(res, 'Failed to submit booking');
}

// ── Authentication ───────────────────────────────────────────
export async function loginUser(
  email: string,
  password: string,
  role?: string
): Promise<{ success: boolean; user: User; message?: string }> {
  const payload: any = { email, password };
  if (role) payload.role = role;
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await handleResponse<{ success: boolean; user: User; message?: string }>(
    res,
    'Invalid email or password'
  );
}

export async function registerUser(payload: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: string;
  city?: string;
}): Promise<{ success: boolean; user: User; message?: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await handleResponse<{ success: boolean; user: User; message?: string }>(
    res,
    'Failed to register account'
  );
}
