export type UserRole = 'client' | 'partner' | 'admin' | 'both';

export type KycStatus = 'not_submitted' | 'pending' | 'under_review' | 'verified' | 'rejected';

export type KycVerificationHistory = {
  date: string;
  status: string;
  note?: string;
};

export type KycDocuments = {
  idType?: string;
  idNumber?: string;
  panNumber?: string;
  holderName?: string;
  idFrontDoc?: string;
  idBackDoc?: string;
  panDoc?: string;
  selfieDoc?: string;
  idFrontName?: string;
  idBackName?: string;
  panFileName?: string;
  selfieFileName?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string | null;
  verificationHistory?: KycVerificationHistory[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  city?: string;
  avatar?: string;
  dob?: string;
  age?: number;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  preferredLanguages?: string[];
  walletBalance: number;
  isSubscribed?: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string | null;
  subscribedAt?: string | null;
  kycStatus?: KycStatus;
  kycRejectionReason?: string | null;
  kycDocuments?: KycDocuments;
};

export type SubscriptionStatus = {
  isSubscribed: boolean;
  status: 'active' | 'expired' | 'inactive';
  plan: string;
  fee: number;
  subscribedAt: string | null;
  expiresAt: string | null;
  remainingDays: number;
  autoRenew: boolean;
};

export type Service = {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  category: string;
  description?: string;
  icon?: string;
};

export type PartnerService = {
  serviceId: string;
  name?: string;
  customRate?: number;
};

export type Partner = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city: string;
  areas?: string[];
  gender?: string;
  age?: number;
  dob?: string;
  bio?: string;
  tagline?: string;
  avatar?: string;
  hourlyRate: number;
  rating?: number;
  reviewsCount?: number;
  isOnline: boolean;
  kycStatus: KycStatus;
  badges?: string[];
  languages?: string[];
  services?: PartnerService[];
  interests?: string[];
};

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'declined'
  | 'cancelled';

export type Booking = {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  serviceId?: string;
  serviceName?: string;
  date: string;
  startTime: string;
  durationHours: number;
  hourlyRate: number;
  baseAmount: number;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  partnerShare?: number;
  platformRevenue?: number;
  meetingLocation: string;
  clientNotes?: string;
  emergencyContact?: string;
  status: BookingStatus;
  startOtp?: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
};

export type CreateBookingPayload = {
  clientId: string;
  clientName: string;
  clientPhone: string;
  partnerId: string;
  serviceId?: string;
  date: string;
  startTime: string;
  durationHours: number;
  meetingLocation: string;
  clientNotes?: string;
  emergencyContact?: string;
};

export type HirerKycPayload = {
  name: string;
  phone: string;
  email: string;
  city: string;
  dob: string;
  holderName: string;
  idType: string;
  idNumber: string;
  panNumber?: string;
  idFrontDoc: string;
  idBackDoc?: string;
  panDoc?: string;
  selfieDoc: string;
  idFrontName?: string;
  idBackName?: string;
  panFileName?: string;
  selfieFileName?: string;
};
