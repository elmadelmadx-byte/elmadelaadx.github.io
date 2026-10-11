export type RoleId = 'super_admin' | 'admin' | 'bd' | 'shipping_agent' | 'host_agent';

export type RegistrationTrack = 'official' | 'quick';

export interface RoleOption {
  id: RoleId;
  titleAr: string;
  titleEn: string;
  descAr: string;
  badgeCode: string;
  requiredBds?: number;
}

export interface BannerSlide {
  id: string;
  titleAr: string;
  subtitleAr: string;
  kickerEn: string;
  imageUrl: string;
  ctaTextAr: string;
  ctaTarget: string;
  statsHighlight: string;
}

export interface ActivityShowcase {
  id: string;
  numberIndex: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  descriptionAr: string;
  metricsAr: string;
  imageUrl: string;
}

export interface TeamApplication {
  id: string;
  registrationTrack: RegistrationTrack;
  realFullName: string;
  nickname: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  fullPhone: string;
  whatsappPhone?: string;
  businessActivity: string;
  selectedRoles: RoleId[];
  bio: string;
  age?: number;
  gender?: 'male' | 'female';
  nationalIdNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
  residenceAddress?: string;
  streetName?: string;
  houseNumber?: string;
  managedBdCount?: number;
  managedBdNamesOrCodes?: string;
  status: 'pending' | 'approved' | 'rejected' | 'banned' | 'waitlist';
  moderationNotes?: string;
  candidateRating?: number;
  submittedAt: string;
}

export interface TrashedApplication extends TeamApplication {
  trashedAt: string;
  trashedReason?: string;
  originalStatusBeforeTrash?: TeamApplication['status'];
}

export interface UserRatingComment {
  id: string;
  authorName: string;
  authorHandle: string;
  stars: number;
  comment: string;
  createdAt: string;
  isBannedUser?: boolean;
  activityType?: string;
}

export interface LivePlatformStats {
  activeUsers: number;
  hostAgencies: number;
  totalHosts: number;
  superAdmins: number;
  admins: number;
  bds: number;
  shippingAgents: number;
  hostAgents: number;
  officialRegistrations: number;
  quickRegistrations: number;
  dailyActiveLogins?: number;
}

export interface BroadcastNotification {
  id: string;
  senderName: string;
  title: string;
  message: string;
  type: 'welcome' | 'urgent' | 'announcement';
  createdAt: string;
  isActive: boolean;
}

export interface StatCardCustomization {
  id: string;
  topText: string;
  insideTitle: string;
  bottomText: string;
  starsCount?: number;
  iconEmoji?: string;
  iconType: string;
}

export interface SubAdminPermissions {
  canApproveApplicants: boolean;
  canRejectApplicants: boolean;
  canBanUsers: boolean;
  canDeleteReviews: boolean;
  canEditBanners: boolean;
  canViewStatsOnly: boolean;
  canEvaluateCandidates: boolean;
  canToggleRatingsLock?: boolean;
  canManageTrash?: boolean;
}

export interface SubAdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  roleTitle: string;
  permissions: SubAdminPermissions;
  createdAt: string;
}

export interface ActiveAdminSession {
  isGeneralManager: boolean;
  email: string;
  name: string;
  permissions: SubAdminPermissions;
}

export interface ContactChannel {
  id: string;
  type: 'whatsapp' | 'email' | 'phone';
  labelAr: string;
  value: string;
  descriptionAr: string;
  isPrimary?: boolean;
}

export interface SupportTicket {
  id: string;
  trackingCode: string;
  applicantOrUserName: string;
  realFullNameOptional?: string;
  role: string;
  whatsappOrEmail: string;
  problemDescription: string;
  reasonOrDetails: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  adminReply?: string;
}
