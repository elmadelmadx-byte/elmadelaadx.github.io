import React, { useState, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  MessageSquareWarning,
  Users,
  Unlock,
  Check,
  XCircle,
  Trash2,
  Ban,
  Plus,
  Upload,
  LogOut,
  ShieldCheck,
  Search,
  Settings,
  Star,
  Clock,
  Eye,
  FileBadge,
  UserCheck,
  RotateCcw,
  Sliders,
  Sparkles,
  UserPlus,
  Lock,
  Mail,
  ShieldAlert,
  Coins,
  Mic2,
  Briefcase,
  Activity,
  Edit3,
  Bell,
  Radio,
  ImagePlus,
  Send,
  Phone,
  MessageCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import {
  BannerSlide,
  TeamApplication,
  UserRatingComment,
  StatCardCustomization,
  SubAdminAccount,
  ActiveAdminSession,
  SubAdminPermissions,
  RoleId,
  ActivityShowcase,
  BroadcastNotification,
  ContactChannel,
  SupportTicket,
  TrashedApplication
} from '../types';
import { ROLES_LIST } from '../data/initialData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  session: ActiveAdminSession;
  banners: BannerSlide[];
  onAddBanner: (banner: Omit<BannerSlide, 'id'>) => void;
  onDeleteBanner: (id: string) => void;
  onUpdateBanner: (id: string, updatedFields: Partial<BannerSlide>) => void;
  activities: ActivityShowcase[];
  onUpdateActivities: (activities: ActivityShowcase[]) => void;
  notifications: BroadcastNotification[];
  onSendBroadcast: (notif: Omit<BroadcastNotification, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteNotification: (id: string) => void;
  applications: TeamApplication[];
  onUpdateApplicationStatus: (
    id: string,
    status: TeamApplication['status'],
    notes?: string,
    rating?: number
  ) => void;
  onDeleteApplication: (id: string) => void;
  comments: UserRatingComment[];
  bannedHandles: string[];
  onDeleteComment: (id: string) => void;
  onBanUserByComment: (commentId: string, authorHandle: string) => void;
  onUnbanHandle: (handle: string) => void;
  customCards: StatCardCustomization[];
  onUpdateCardCustomization: (updatedCards: StatCardCustomization[]) => void;
  subAdmins: SubAdminAccount[];
  onCreateSubAdmin: (sub: Omit<SubAdminAccount, 'id' | 'createdAt'>) => void;
  onDeleteSubAdmin: (id: string) => void;
  dailyActiveLogins?: number;
  contactChannels: ContactChannel[];
  onUpdateContactChannels: (channels: ContactChannel[]) => void;
  tickets: SupportTicket[];
  onUpdateTicketStatus: (id: string, status: SupportTicket['status'], adminReply?: string) => void;
  onDeleteTicket: (id: string) => void;
  isRatingsLocked: boolean;
  onToggleRatingsLock: (locked: boolean) => void;
  trashedApplications: TrashedApplication[];
  onTrashApplication: (id: string, reason?: string) => void;
  onTrashInactiveApplications: () => void;
  onRestoreTrashedApplication: (id: string) => void;
  onRestoreAllTrashed?: () => void;
  onDeleteTrashedPermanently: (id: string) => void;
  onEmptyTrash: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  session,
  banners,
  onAddBanner,
  onDeleteBanner,
  onUpdateBanner,
  activities,
  onUpdateActivities,
  notifications,
  onSendBroadcast,
  onDeleteNotification,
  applications,
  onUpdateApplicationStatus,
  onDeleteApplication,
  comments,
  bannedHandles,
  onDeleteComment,
  onBanUserByComment,
  onUnbanHandle,
  customCards,
  onUpdateCardCustomization,
  subAdmins,
  onCreateSubAdmin,
  onDeleteSubAdmin,
  dailyActiveLogins = 3420,
  contactChannels,
  onUpdateContactChannels,
  tickets,
  onUpdateTicketStatus,
  onDeleteTicket,
  isRatingsLocked,
  onToggleRatingsLock,
  trashedApplications,
  onTrashApplication,
  onTrashInactiveApplications,
  onRestoreTrashedApplication,
  onRestoreAllTrashed,
  onDeleteTrashedPermanently,
  onEmptyTrash
}) => {
  const [activeTab, setActiveTab] = useState<
    'applications' | 'comments' | 'sub_admins' | 'banners' | 'activities' | 'notifications' | 'card_customizer' | 'contact_channels' | 'support_tickets' | 'trash'
  >('applications');

  const [editableChannels, setEditableChannels] = useState<ContactChannel[]>(contactChannels);
  const [channelFeedback, setChannelFeedback] = useState<string | null>(null);
  const [newChannelType, setNewChannelType] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  const [newChannelLabel, setNewChannelLabel] = useState('');
  const [newChannelValue, setNewChannelValue] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  const [ticketReplyText, setTicketReplyText] = useState<Record<string, string>>({});

  const [editableActivities, setEditableActivities] = useState<ActivityShowcase[]>(activities);
  const [activityFeedback, setActivityFeedback] = useState<string | null>(null);

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'welcome' | 'urgent' | 'announcement'>('welcome');
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedApplicant, setSelectedApplicant] = useState<TeamApplication | null>(null);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [candidateRating, setCandidateRating] = useState<number>(7);

  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editBannerTitle, setEditBannerTitle] = useState('');
  const [editBannerSubtitle, setEditBannerSubtitle] = useState('');
  const [editBannerKicker, setEditBannerKicker] = useState('');
  const [editBannerStats, setEditBannerStats] = useState('');
  const [editBannerImageUrl, setEditBannerImageUrl] = useState('');

  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerKicker, setNewBannerKicker] = useState('VIBERS V GLOBAL');
  const [newBannerStats, setNewBannerStats] = useState('+1.5M مستخدم نشط');
  const [newBannerImageUrl, setNewBannerImageUrl] = useState('');
  const [bannerFeedback, setBannerFeedback] = useState<string | null>(null);

  const [editableCards, setEditableCards] = useState<StatCardCustomization[]>(customCards);
  const [customizerFeedback, setCustomizerFeedback] = useState<string | null>(null);

  const [newSubName, setNewSubName] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPassword, setNewSubPassword] = useState('');
  const [newSubRoleTitle, setNewSubRoleTitle] = useState('مشرف مراجعة الطلبات والتقييمات');
  const [newSubPermissions, setNewSubPermissions] = useState<SubAdminPermissions>({
    canApproveApplicants: true,
    canRejectApplicants: true,
    canBanUsers: false,
    canDeleteReviews: false,
    canEditBanners: false,
    canViewStatsOnly: false,
    canEvaluateCandidates: true,
    canToggleRatingsLock: false,
    canManageTrash: true
  });
  const [subAdminFeedback, setSubAdminFeedback] = useState<string | null>(null);
  const [trashFeedback, setTrashFeedback] = useState<string | null>(null);
  const [trashSearchQuery, setTrashSearchQuery] = useState('');

  const handleTrashCandidate = (id: string, reason?: string, name?: string) => {
    onTrashApplication(id, reason);
    setTrashFeedback(
      `تم نقل بيانات ${name ? `المتقدم (${name})` : 'المستخدم'} إلى سلة المهملات في الأعلى بنجاح. يمكنك استرجاعه في أي وقت.`
    );
    setTimeout(() => setTrashFeedback(null), 5000);
  };

  const handleRestoreCandidate = (id: string, name?: string) => {
    onRestoreTrashedApplication(id);
    setTrashFeedback(
      `تم استرجاع بيانات ${name ? `المتقدم (${name})` : 'المستخدم'} بنجاح ليظهر الآن فوراً وسط المتقدمين النشطين!`
    );
    setTimeout(() => setTrashFeedback(null), 5000);
  };

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const permissions = session.permissions;

  const getRoleLabel = (roleId: string) => {
    const found = ROLES_LIST.find((r) => r.id === roleId);
    return found ? found.titleAr : roleId;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetBannerId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (targetBannerId) {
          onUpdateBanner(targetBannerId, { imageUrl: reader.result });
          setBannerFeedback('تم تحديث صورة البنر بنجاح وبشكل دائم!');
        } else {
          setNewBannerImageUrl(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActivityImageUpload = (e: React.ChangeEvent<HTMLInputElement>, activityId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const res = reader.result;
        setEditableActivities((prev) =>
          prev.map((act) => (act.id === activityId ? { ...act, imageUrl: res } : act))
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveActivities = () => {
    onUpdateActivities(editableActivities);
    setActivityFeedback('تم حفظ وتحديث صور وبيانات أنشطة الشركة بنجاح!');
    setTimeout(() => setActivityFeedback(null), 3500);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    onSendBroadcast({
      title: broadcastTitle.trim() || 'إشعار ترحيبي رسمي',
      message: broadcastMessage.trim(),
      senderName: session.name,
      type: broadcastType
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setBroadcastFeedback('تم بث رسالة الترحيب لكافة الزوار والمستخدمين بنجاح!');
    setTimeout(() => setBroadcastFeedback(null), 4000);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImageUrl.trim()) {
      setBannerFeedback('يرجى إدخال عنوان البنر ورفع صورة أو وضع رابط الصورة.');
      return;
    }
    onAddBanner({
      titleAr: newBannerTitle.trim(),
      subtitleAr:
        newBannerSubtitle.trim() ||
        'بقيادة المدير العام عيون Prince — منظومة متكاملة لتطوير التطبيقات ودعم الدردشة الصوتية.',
      kickerEn: newBannerKicker.trim() || 'VIBERS V GLOBAL · PROMOTIONAL BANNER',
      imageUrl: newBannerImageUrl.trim(),
      ctaTextAr: 'انضم إلى فريقنا الآن',
      ctaTarget: '#join-team',
      statsHighlight: newBannerStats.trim() || 'Vibers V Global'
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImageUrl('');
    setBannerFeedback('تمت إضافة الشريحة الترويجية الجديدة وثبتت بنجاح!');
  };

  const startEditBanner = (b: BannerSlide) => {
    setEditingBannerId(b.id);
    setEditBannerTitle(b.titleAr);
    setEditBannerSubtitle(b.subtitleAr);
    setEditBannerKicker(b.kickerEn);
    setEditBannerStats(b.statsHighlight);
    setEditBannerImageUrl(b.imageUrl);
  };

  const saveEditedBanner = (id: string) => {
    onUpdateBanner(id, {
      titleAr: editBannerTitle.trim(),
      subtitleAr: editBannerSubtitle.trim(),
      kickerEn: editBannerKicker.trim(),
      statsHighlight: editBannerStats.trim(),
      imageUrl: editBannerImageUrl.trim()
    });
    setEditingBannerId(null);
    setBannerFeedback('تم حفظ وتثبيت كافة نصوص وصور البنر بنجاح!');
  };

  const handleSaveCardCustomization = () => {
    onUpdateCardCustomization(editableCards);
    setCustomizerFeedback('تم حفظ وتطبيق التعديلات على عناوين ونصوص ونجوم الأيقونات بنجاح!');
    setTimeout(() => setCustomizerFeedback(null), 4000);
  };

  const handleCardFieldChange = (
    id: string,
    field: keyof StatCardCustomization,
    value: string | number
  ) => {
    setEditableCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const openApplicantDetail = (app: TeamApplication) => {
    setSelectedApplicant(app);
    setCandidateNotes(app.moderationNotes || '');
    setCandidateRating(app.candidateRating || 7);
  };

  const saveCandidateEvaluation = (status: 'approved' | 'rejected' | 'waitlist' | 'banned') => {
    if (!selectedApplicant) return;
    onUpdateApplicationStatus(selectedApplicant.id, status, candidateNotes, candidateRating);
    setSelectedApplicant((prev) => (prev ? { ...prev, status, moderationNotes: candidateNotes, candidateRating } : null));
  };

  const handleCreateSubAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubEmail.trim() || !newSubPassword.trim()) {
      setSubAdminFeedback('يرجى كتابة الاسم والبريد وكلمة المرور الخاصة بالموظف/المشرف.');
      return;
    }

    onCreateSubAdmin({
      name: newSubName.trim(),
      email: newSubEmail.trim().toLowerCase(),
      password: newSubPassword.trim(),
      roleTitle: newSubRoleTitle.trim(),
      permissions: newSubPermissions
    });

    setNewSubName('');
    setNewSubEmail('');
    setNewSubPassword('');
    setSubAdminFeedback('تم إنشاء حساب المشرف الفرعي وتحديد صلاحياته بنجاح! يمكنه تسجيل الدخول الآن.');
  };

  const countSuperAdmins = applications.filter((a) => a.selectedRoles.includes('super_admin')).length;
  const countAdmins = applications.filter((a) => a.selectedRoles.includes('admin')).length;
  const countBDs = applications.filter((a) => a.selectedRoles.includes('bd')).length;
  const countShipping = applications.filter((a) => a.selectedRoles.includes('shipping_agent')).length;
  const countHost = applications.filter((a) => a.selectedRoles.includes('host_agent')).length;

  const filteredApplications = applications.filter((app) => {
    let matchesStatus = true;
    if (statusFilter === 'official') {
      matchesStatus = app.registrationTrack === 'official';
    } else if (statusFilter === 'quick') {
      matchesStatus = app.registrationTrack === 'quick';
    } else if (statusFilter !== 'all') {
      matchesStatus = app.status === statusFilter;
    }

    let matchesRole = true;
    if (selectedRoleFilter !== 'all') {
      matchesRole = app.selectedRoles.includes(selectedRoleFilter as RoleId);
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.realFullName.toLowerCase().includes(q) ||
      app.nickname.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.fullPhone.includes(q) ||
      (app.nationalIdNumber && app.nationalIdNumber.toLowerCase().includes(q)) ||
      (app.residenceAddress && app.residenceAddress.toLowerCase().includes(q));

    return matchesStatus && matchesRole && matchesSearch;
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col overflow-hidden select-text text-right"
      role="dialog"
      aria-modal="true"
      aria-label="لوحة تحكم المسؤول الشاملة"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="w-full h-full dashboard-shell flex flex-col overflow-hidden">
        <div className="px-6 py-3.5 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(10,16,28,0.98))] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-lg shadow-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{session.name}</span>
                {session.isGeneralManager ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40">
                    المدير العام والمدير التنفيذي (صلاحية كاملة)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/40">
                    مشرف فرعي مخصص
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono-num" dir="ltr">
                {session.email} · Executive Governance Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('trash')}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                activeTab === 'trash'
                  ? 'bg-rose-600 border-rose-400 text-white shadow-rose-950/50 ring-2 ring-rose-400/50'
                  : trashedApplications.length > 0
                  ? 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/50 text-rose-200 hover:text-white ring-1 ring-rose-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="سلة المهملات والمحذوفات واسترجاع البيانات"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>سلة المهملات</span>
              {trashedApplications.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono-num text-[11px] font-extrabold animate-pulse shadow-md">
                  {trashedApplications.length}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono-num text-[10px]">
                  0
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق لوحة التحكم"
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {trashFeedback && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 px-6 py-2.5 text-xs text-white font-bold flex items-center justify-between gap-4 animate-in slide-in-from-top duration-200 shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-200" />
              <span>{trashFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setTrashFeedback(null)}
              className="text-white hover:text-slate-200 text-xs cursor-pointer px-2 py-0.5 rounded bg-black/20"
              title="إغلاق التنبيه"
            >
              ✕
            </button>
          </div>
        )}

        <div className="px-6 py-3 bg-[#0B0F1C] border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="p-3 rounded-xl bg-[#070913] border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold block">نشطون اليوم</span>
                <span className="text-base font-bold text-white font-mono-num">{dailyActiveLogins.toLocaleString('en-US')}</span>
              </div>
              <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <button
              type="button"
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'super_admin' ? 'all' : 'super_admin')}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                selectedRoleFilter === 'super_admin'
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-[#070913] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-amber-400 font-bold block">سوبر أدمن</span>
                <span className="text-base font-bold text-white font-mono-num">{countSuperAdmins} متقدم</span>
              </div>
              <span className="text-xl">👑</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'admin' ? 'all' : 'admin')}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                selectedRoleFilter === 'admin'
                  ? 'bg-purple-500/20 border-purple-400 text-white'
                  : 'bg-[#070913] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-purple-400 font-bold block">أدمن</span>
                <span className="text-base font-bold text-white font-mono-num">{countAdmins} متقدم</span>
              </div>
              <span className="text-xl">🛡️</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'bd' ? 'all' : 'bd')}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                selectedRoleFilter === 'bd'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white'
                  : 'bg-[#070913] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-emerald-400 font-bold block">مطور أعمال BD</span>
                <span className="text-base font-bold text-white font-mono-num">{countBDs} متقدم</span>
              </div>
              <span className="text-xl">💼</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'shipping_agent' ? 'all' : 'shipping_agent')}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                selectedRoleFilter === 'shipping_agent'
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-[#070913] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-amber-400 font-bold block">وكيل شحن</span>
                <span className="text-base font-bold text-white font-mono-num">{countShipping} متقدم</span>
              </div>
              <span className="text-xl">📦</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoleFilter(selectedRoleFilter === 'host_agent' ? 'all' : 'host_agent')}
              className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                selectedRoleFilter === 'host_agent'
                  ? 'bg-blue-500/20 border-blue-400 text-white'
                  : 'bg-[#070913] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] text-blue-400 font-bold block">وكيل مضيفين</span>
                <span className="text-base font-bold text-white font-mono-num">{countHost} متقدم</span>
              </div>
              <span className="text-xl">🎤</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-b border-slate-800/80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),rgba(8,11,20,0.9)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث فوري في المتقدمين: الاسم، اللقب، الهاتف، الواتساب، رقم الهوية..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            {selectedRoleFilter !== 'all' && (
              <span className="text-amber-400 font-semibold">
                مفلتر برتبة: {getRoleLabel(selectedRoleFilter)} ({filteredApplications.length})
              </span>
            )}
            <span>
              إجمالي المتقدمين: <strong className="text-white font-mono-num">{applications.length}</strong>
            </span>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/30'
                : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>طلبات التوظيف والتعاون ({applications.length})</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-mono-num text-xs font-extrabold">
                {pendingCount} جديد
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'comments'
                ? 'bg-amber-600 text-white'
                : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>لوحة التقييمات ومن قيّم ({comments.length})</span>
          </button>

          {session.isGeneralManager && (
            <button
              type="button"
              onClick={() => setActiveTab('sub_admins')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'sub_admins'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>إدارة نظام المشرفين وتحديد الصلاحيات ({subAdmins.length})</span>
            </button>
          )}

          {(session.isGeneralManager || permissions.canEditBanners) && (
            <button
              type="button"
              onClick={() => setActiveTab('banners')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>إدارة وتعديل نصوص وصور البنر ({banners.length})</span>
            </button>
          )}

          {session.isGeneralManager && (
            <button
              type="button"
              onClick={() => setActiveTab('card_customizer')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'card_customizer'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>تخصيص عناوين ونجوم الأيقونات</span>
            </button>
          )}

          {(session.isGeneralManager || permissions.canEditBanners) && (
            <button
              type="button"
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <ImagePlus className="w-4 h-4" />
              <span>التحكم في أنشطة وصور الموقع ({activities.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-cyan-600 text-white'
                : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>مركز الإشعارات وبث الترحيب ({notifications.length})</span>
          </button>

          {(session.isGeneralManager || permissions.canEditBanners) && (
            <button
              type="button"
              onClick={() => setActiveTab('contact_channels')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'contact_channels'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>إدارة أرقام الواتساب والتواصل ({contactChannels.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('support_tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'support_tickets'
                ? 'bg-amber-600 text-white'
                : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>شكاوى واستفسارات المستخدمين ({tickets.length})</span>
            {tickets.filter((t) => t.status === 'new').length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono-num text-xs font-bold animate-pulse">
                {tickets.filter((t) => t.status === 'new').length} جديدة
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trash')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'bg-[#0F1424] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>سلة المهملات والمحذوفات</span>
            {trashedApplications.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono-num text-xs font-bold animate-pulse">
                {trashedApplications.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 bg-[#0F1424] p-1.5 rounded-xl border border-slate-800 flex-1">
                  {[
                    { key: 'all', label: 'الكل' },
                    { key: 'official', label: 'التسجيل الرسمي (100%)' },
                    { key: 'quick', label: 'التسجيل الفرعي (50%)' },
                    { key: 'pending', label: 'قيد المراجعة' },
                    { key: 'approved', label: 'المعتمدون (Approved)' },
                    { key: 'waitlist', label: 'قائمة الانتظار (Waitlist)' },
                    { key: 'rejected', label: 'المرفوضون (Rejected)' },
                    { key: 'banned', label: 'المحظورون (Banned)' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setStatusFilter(item.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === item.key
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {applications.some((a) => a.status === 'rejected' || a.status === 'waitlist' || a.status === 'banned') && (
                  <button
                    type="button"
                    onClick={onTrashInactiveApplications}
                    className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 whitespace-nowrap active:scale-95"
                    title="نقل كافة المرفوضين وقائمة الانتظار والمحظورين إلى سلة المهملات مع إمكانية استرجاعهم"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>
                      نقل المرفوضين وغير النشطين إلى سلة المهملات (
                      {applications.filter((a) => a.status === 'rejected' || a.status === 'waitlist' || a.status === 'banned').length}
                      )
                    </span>
                  </button>
                )}
              </div>

              {filteredApplications.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1424] border border-slate-800 text-slate-400 text-sm">
                  لا توجد طلبات مطابقة لفلتر البحث أو الرتبة المختارة.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => {
                    const isSuper = app.selectedRoles.includes('super_admin');
                    const isAdmin = app.selectedRoles.includes('admin');

                    return (
                      <div
                        key={app.id}
                        className={`p-6 rounded-2xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all ${
                          app.status === 'banned'
                            ? 'bg-rose-950/20 border-rose-500/40 opacity-70'
                            : app.status === 'approved'
                            ? 'bg-[#0E1726] border-emerald-500/40'
                            : app.status === 'waitlist'
                            ? 'bg-[#101524] border-cyan-500/40'
                            : 'bg-[#0F1424] border-slate-800'
                        }`}
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              <span>{app.realFullName}</span>
                              <button
                                type="button"
                                onClick={() => openApplicantDetail(app)}
                                className="p-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white cursor-pointer transition-colors"
                                title="رؤية ومعاينة تفاصيل ووثائق المتقدم"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs text-amber-400 font-normal">
                                (اللقب: {app.nickname})
                              </span>
                            </h3>

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                                app.registrationTrack === 'official'
                                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                                  : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                              }`}
                            >
                              {app.registrationTrack === 'official' ? 'توثيق رسمي 100%' : 'نموذج مختصر 50%'}
                            </span>

                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                app.status === 'approved'
                                  ? 'text-emerald-400 bg-emerald-950/40'
                                  : app.status === 'rejected'
                                  ? 'text-rose-400 bg-rose-950/40'
                                  : app.status === 'waitlist'
                                  ? 'text-cyan-400 bg-cyan-950/40'
                                  : app.status === 'banned'
                                  ? 'text-red-300 bg-red-950/60'
                                  : 'text-amber-400 bg-amber-950/40'
                              }`}
                            >
                              {app.status === 'approved' && 'معتمد ومقبول ✓'}
                              {app.status === 'rejected' && 'مرفوض ✕'}
                              {app.status === 'waitlist' && 'قيد الانتظار ⏳'}
                              {app.status === 'banned' && 'محظور من المنظومة 🚫'}
                              {app.status === 'pending' && 'قيد المراجعة والتدقيق'}
                            </span>

                            <span className="text-xs font-mono-num text-slate-500">
                              {app.submittedAt}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#070913] p-3.5 rounded-xl border border-slate-800">
                            <div>
                              <span className="text-slate-500 block mb-0.5">الهاتف والواتساب:</span>
                              <span className="font-mono-num text-emerald-400 font-semibold" dir="ltr">
                                {app.whatsappPhone || app.fullPhone}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">البريد الإلكتروني:</span>
                              <span className="font-mono-num text-white" dir="ltr">
                                {app.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">الوظائف المطلوبة:</span>
                              <span className="text-blue-400 font-semibold">
                                {app.selectedRoles.map(getRoleLabel).join(' + ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5">العمر والجنس:</span>
                              <span className="text-slate-200">
                                {app.age ? `${app.age} سنة` : 'غير محدد'} ·{' '}
                                {app.gender === 'male' ? 'ذكر' : app.gender === 'female' ? 'أنثى' : '-'}
                              </span>
                            </div>
                          </div>

                          {app.registrationTrack === 'official' && (
                            <div className="text-xs text-slate-300 bg-emerald-950/15 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                              <div>
                                <span className="text-emerald-400 font-semibold">رقم الهوية/الجواز: </span>
                                <span className="font-mono-num text-white">{app.nationalIdNumber || 'مرفق'}</span>
                              </div>
                              <div>
                                <span className="text-emerald-400 font-semibold">العنوان والشارع والمنزل: </span>
                                <span>{app.residenceAddress} · شارع {app.streetName || '-'} · منزل {app.houseNumber || '-'}</span>
                              </div>
                            </div>
                          )}

                          {(isSuper || isAdmin) && (
                            <div className="text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/30">
                              <strong>فريق الـ BD التابع: </strong>
                              <span>{app.managedBdCount || (isSuper ? 15 : 7)} مطور أعمال BD مُدارين</span>
                              {app.managedBdNamesOrCodes && (
                                <span className="text-slate-300 block mt-0.5">التفاصيل: {app.managedBdNamesOrCodes}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 w-full lg:w-auto">
                          <button
                            type="button"
                            onClick={() => openApplicantDetail(app)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 hover:from-cyan-800/60 hover:to-blue-800/60 border border-cyan-500/40 text-cyan-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                            title="رؤية ومعاينة وتدقيق كافة بيانات وهوية المتقدم"
                          >
                            <Eye className="w-4 h-4 text-cyan-400" />
                            <span>رؤية ومعاينة الملف الكامل</span>
                          </button>

                          {(session.isGeneralManager || permissions.canApproveApplicants) && (
                            <button
                              type="button"
                              onClick={() => onUpdateApplicationStatus(app.id, 'approved')}
                              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                app.status === 'approved'
                                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              <span>موافقة واعتماد (Approve)</span>
                            </button>
                          )}

                          {(session.isGeneralManager || permissions.canRejectApplicants) && (
                            <button
                              type="button"
                              onClick={() => onUpdateApplicationStatus(app.id, 'rejected')}
                              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                                app.status === 'rejected'
                                  ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                                  : 'bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رفض الطلب (Reject)</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              onTrashApplication(
                                app.id,
                                app.status === 'rejected'
                                  ? 'مرفوض بقرار الإدارة'
                                  : app.status === 'banned'
                                  ? 'محظور من المنظومة'
                                  : app.status === 'waitlist'
                                  ? 'قائمة الانتظار (غير نشط)'
                                  : 'نقل إلى سلة المهملات'
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                            title="إزالة بيانات هذا المستخدم ونقلها إلى سلة المهملات مع إمكانية استرجاعها"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>نقل لسلة المهملات</span>
                          </button>

                          {(session.isGeneralManager || permissions.canBanUsers) && (
                            app.status === 'banned' ? (
                              <button
                                type="button"
                                onClick={() => onUpdateApplicationStatus(app.id, 'pending')}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>فك حظر المستخدم</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onUpdateApplicationStatus(app.id, 'banned')}
                                className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>حظر من المنظومة</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#0F1424] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>لوحة التقييمات التنفيذية وحصر المقيمين</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    في الموقع العام يظهر اسم المقيم والنجوم فقط، وهنا يظهر لك نص التعليق الكامل، هوية المستخدم ومعرفه، وبريده/صفته، ولا يتم حذف أي شيء أو حظر إلا بإذنك.
                  </p>
                </div>
                <div className="text-xs font-mono-num bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-amber-400 font-bold shrink-0">
                  إجمالي التقييمات: {comments.length} تقييم
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isRatingsLocked
                    ? 'bg-gradient-to-r from-amber-950/30 via-[#0F1424] to-red-950/20 border-amber-500/50 shadow-xl shadow-amber-950/20'
                    : 'bg-gradient-to-r from-emerald-950/20 via-[#0F1424] to-blue-950/20 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isRatingsLocked
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isRatingsLocked ? (
                          <Lock className="w-5 h-5 animate-pulse" />
                        ) : (
                          <Unlock className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">
                            التحكم في قفل وفتح عرض التقييمات للمنصة
                          </h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isRatingsLocked
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {isRatingsLocked ? '🔒 مقفلة حالياً' : '🟢 مفتوحة للعامة'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          خاصية إدارية خاصة تسمح لك بالتحكم فيما يراه الزوار في واجهة الموقع العامة.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {isRatingsLocked ? (
                        <div className="space-y-1">
                          <div className="text-amber-400 font-bold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>الوضع المطبق الآن: التقييمات مقفلة ومحمية</span>
                          </div>
                          <p className="text-slate-300">
                            يظهر لزوار المنصة حالياً <strong className="text-white">إجمالي عدد التقييمات ({comments.length})</strong> و<strong className="text-blue-300">عدد المقيمين فقط</strong> والمتوسط العام، بينما <strong className="text-amber-300">تُحجب تماماً هويات وأسماء وتفاصيل من قام بالتقييم</strong> لمنع المنافسة ولحماية خصوصية الأعضاء.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>الوضع المطبق الآن: التقييمات مفتوحة للعامة</span>
                          </div>
                          <p className="text-slate-300">
                            يظهر لجميع الزوار أسماء المقيمين والنجوم وبطاقات الآراء كاملة في الموقع العام.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 w-full lg:w-auto flex flex-col items-stretch lg:items-end gap-2">
                    {session.isGeneralManager || permissions.canToggleRatingsLock ? (
                      <button
                        type="button"
                        onClick={() => onToggleRatingsLock(!isRatingsLocked)}
                        className={`w-full lg:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                          isRatingsLocked
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 border border-emerald-400/30'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/40 border border-amber-400/40'
                        }`}
                      >
                        {isRatingsLocked ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>فتح عرض التقييمات للعامة (إظهار الأسماء)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>قفل عرض التقييمات (إظهار الأعداد فقط)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-xs text-slate-400 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 text-center">
                        🔒 مطلوب إذن قفل/فتح التقييمات من المدير العام عيون Prince
                      </div>
                    )}
                    <span className="text-[11px] text-slate-500 text-center lg:text-right">
                      {isRatingsLocked
                        ? 'الضغط هنا سيعيد إظهار أسماء المقيمين للعامة فوراً'
                        : 'الضغط هنا سيحجب الأسماء فوراً ويُبقي الأعداد فقط'}
                    </span>
                  </div>
                </div>
              </div>

              {bannedHandles.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-rose-300">
                    قائمة الحسابات المحظورة من التعليق والتقييم ({bannedHandles.length}):
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {bannedHandles.map((handle) => (
                      <div
                        key={handle}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono-num"
                      >
                        <span dir="ltr">{handle}</span>
                        {(session.isGeneralManager || permissions.canBanUsers) && (
                          <button
                            type="button"
                            onClick={() => onUnbanHandle(handle)}
                            className="text-emerald-400 hover:underline text-[11px] cursor-pointer"
                          >
                            فك الحظر
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="p-10 text-center rounded-2xl bg-[#0F1424] border border-slate-800 text-slate-400 text-sm">
                    لا توجد تقييمات حالياً.
                  </div>
                ) : (
                  comments.map((c) => {
                    const isBanned =
                      c.isBannedUser || bannedHandles.includes(c.authorHandle.toLowerCase());

                    return (
                      <div
                        key={c.id}
                        className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-start justify-between gap-5 ${
                          isBanned
                            ? 'bg-rose-950/10 border-rose-500/30 opacity-70'
                            : 'bg-[#0F1424] border-slate-800'
                        }`}
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-base font-bold text-white">{c.authorName}</h4>
                            <span className="text-xs font-mono-num text-amber-400 font-bold" dir="ltr">
                              {c.authorHandle}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-xs text-slate-400">{c.activityType || 'عضو المنظومة'}</span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span className="text-xs font-mono-num text-slate-500">{c.createdAt}</span>
                            {isBanned && (
                              <span className="text-xs text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded">
                                [مستخدم محظور]
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 bg-[#070913] px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
                            <span className="text-xs font-mono-num font-bold text-amber-400 ml-1">
                              {c.stars}/7 نجوم
                            </span>
                            {Array.from({ length: 7 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < c.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="bg-[#070913] p-4 rounded-xl border border-slate-800">
                            <span className="text-[11px] text-slate-500 block mb-1">نص التعليق الخاص:</span>
                            <p className="text-sm text-slate-200 leading-relaxed">{c.comment}</p>
                          </div>
                        </div>

                        <div className="flex sm:flex-row md:flex-col items-stretch gap-2 shrink-0">
                          {(session.isGeneralManager || permissions.canBanUsers) && !isBanned && (
                            <button
                              type="button"
                              onClick={() => onBanUserByComment(c.id, c.authorHandle)}
                              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>حظر معرف المستخدم</span>
                            </button>
                          )}

                          {(session.isGeneralManager || permissions.canDeleteReviews) && (
                            <button
                              type="button"
                              onClick={() => onDeleteComment(c.id)}
                              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف التقييم نهائياً</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'sub_admins' && session.isGeneralManager && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleCreateSubAdminSubmit}
                className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4 h-fit"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-purple-400" />
                    <span>إنشاء موظف / مشرف فرعي وتحديد صلاحياته</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    أنشئ بريداً وكلمة مرور خاصة لكل موظف يعمل معك وحدد له الصلاحيات بدقة.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    اسم الموظف / المشرف <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="مثال: يوسف الخالدي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    البريد الإلكتروني المخصص للدخول <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    required
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    placeholder="yousef.admin@vibersv.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white font-mono-num text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    كلمة المرور الخاصة به <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={newSubPassword}
                    onChange={(e) => setNewSubPassword(e.target.value)}
                    placeholder="كلمة مرور قوية (مثال: Staff2026@)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white font-mono-num text-left"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    value={newSubRoleTitle}
                    onChange={(e) => setNewSubRoleTitle(e.target.value)}
                    placeholder="مثال: مشرف مراجعة وتدقيق الطلبات"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="block text-xs font-bold text-purple-400">
                    حدد الصلاحيات المسموح بها لهذا الموظف:
                  </span>

                  <div className="space-y-2 bg-[#070913] p-3.5 rounded-xl border border-slate-800 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canApproveApplicants}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canApproveApplicants: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>صلاحية قبول واعتماد المتقدمين (Approve)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canRejectApplicants}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canRejectApplicants: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>صلاحية رفض الطلبات غير المناسبة (Reject)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canEvaluateCandidates}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canEvaluateCandidates: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>تقييم درجات المتقدمين وكتابة الملاحظات</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canBanUsers}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canBanUsers: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>صلاحية حظر المستخدمين المخالفين</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canDeleteReviews}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canDeleteReviews: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>صلاحية حذف التقييمات السلبية</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canEditBanners}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canEditBanners: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                      />
                      <span>صلاحية تعديل وإدارة صور ونصوص البنر</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newSubPermissions.canToggleRatingsLock || false}
                        onChange={(e) =>
                          setNewSubPermissions((p) => ({ ...p, canToggleRatingsLock: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-purple-600 cursor-pointer"
                      />
                      <span className="text-purple-300 font-semibold">صلاحية قفل/فتح التقييمات للمنصة</span>
                    </label>
                  </div>
                </div>

                {subAdminFeedback && (
                  <p className="text-xs text-emerald-400 font-medium">{subAdminFeedback}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  حفظ وإنشاء حساب الموظف
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-white">
                  المشرفون والموظفون المعتمدون حالياً ({subAdmins.length})
                </h3>

                {subAdmins.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#0F1424] border border-slate-800 text-slate-400 text-xs">
                    لم تقم بإنشاء أي مشرفين فرعيين بعد.
                  </div>
                ) : (
                  subAdmins.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{sub.name}</span>
                            <span className="text-xs text-purple-400">({sub.roleTitle})</span>
                          </h4>
                          <span className="text-xs font-mono-num text-slate-400 block mt-0.5" dir="ltr">
                            {sub.email} · كلمة المرور: {sub.password}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteSubAdmin(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          حذف الحساب
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canApproveApplicants ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          الموافقة
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canRejectApplicants ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          الرفض
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canEvaluateCandidates ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          التقييم
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canBanUsers ? 'bg-amber-950 text-amber-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          الحظر
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canDeleteReviews ? 'bg-amber-950 text-amber-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          حذف التقييمات
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canEditBanners ? 'bg-blue-950 text-blue-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          تعديل البنر
                        </span>
                        <span className={`px-2 py-0.5 rounded ${sub.permissions.canToggleRatingsLock ? 'bg-purple-950 text-purple-400' : 'bg-slate-900 text-slate-500 line-through'}`}>
                          قفل/فتح التقييمات
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleCreateBanner}
                className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4 h-fit"
              >
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-400" />
                  <span>إضافة شريحة بنر جديدة وتثبيتها دائماً</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    العنوان الرئيسي <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="عنوان الشريحة في البنر..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    الوصف التفصيلي
                  </label>
                  <textarea
                    rows={2}
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="نص الوصف المعروض تحت العنوان..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">نص الترويسة</label>
                    <input
                      type="text"
                      value={newBannerKicker}
                      onChange={(e) => setNewBannerKicker(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">إحصائية بارزة</label>
                    <input
                      type="text"
                      value={newBannerStats}
                      onChange={(e) => setNewBannerStats(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    رفع صورة من الجهاز أو رابط مباشر <span className="text-amber-400">*</span>
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 text-blue-300 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>اختر ملف صورة من الجهاز</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newBannerImageUrl}
                    onChange={(e) => setNewBannerImageUrl(e.target.value)}
                    placeholder="أو الصق رابط الصورة المباشر..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white font-mono-num"
                  />
                </div>

                {bannerFeedback && (
                  <p className="text-xs text-emerald-400 font-medium">{bannerFeedback}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  تثبيت الشريحة في الصفحة الرئيسية
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base font-bold text-white">
                  الشرائح الحالية المثبتة في البنر الرئيسي ({banners.length})
                </h3>

                {banners.map((b, index) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4"
                  >
                    {editingBannerId === b.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                          <span>تعديل الشريحة #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => setEditingBannerId(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            إلغاء
                          </button>
                        </div>

                        <input
                          type="text"
                          value={editBannerTitle}
                          onChange={(e) => setEditBannerTitle(e.target.value)}
                          placeholder="العنوان الرئيسي..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white"
                        />

                        <textarea
                          rows={2}
                          value={editBannerSubtitle}
                          onChange={(e) => setEditBannerSubtitle(e.target.value)}
                          placeholder="الوصف..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editBannerKicker}
                            onChange={(e) => setEditBannerKicker(e.target.value)}
                            placeholder="نص الترويسة..."
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={editBannerStats}
                            onChange={(e) => setEditBannerStats(e.target.value)}
                            placeholder="الإحصائية..."
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white"
                          />
                        </div>

                        <input
                          type="text"
                          dir="ltr"
                          value={editBannerImageUrl}
                          onChange={(e) => setEditBannerImageUrl(e.target.value)}
                          placeholder="رابط الصورة..."
                          className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white font-mono-num"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => saveEditedBanner(b.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                          >
                            حفظ وتثبيت التعديل
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={b.imageUrl}
                            alt={b.titleAr}
                            referrerPolicy="no-referrer"
                            className="w-28 h-18 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono-num text-amber-400">
                              الشريحة #{index + 1} · {b.kickerEn}
                            </span>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{b.titleAr}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">{b.subtitleAr}</p>
                            <span className="text-[11px] text-blue-400 font-mono-num">{b.statsHighlight}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => startEditBanner(b)}
                            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل النصوص</span>
                          </button>

                          <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            <span>الصورة</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, b.id)}
                              className="hidden"
                            />
                          </label>

                          {banners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteBanner(b.id)}
                              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'card_customizer' && session.isGeneralManager && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-400" />
                    <span>التحكم الشامل في أسماء وعناوين ونصوص ونجوم الأيقونات</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    تعديل دائم محفوظ على السيرفر لكل نص أعلى الأيقونة، داخل الأيقونة، أو أسفلها مع رمز الإيموجي والنجوم.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCardCustomization}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  حفظ وتطبيق التعديلات فوراً
                </button>
              </div>

              {customizerFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  {customizerFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editableCards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-slate-800 pb-2">
                      <span>أيقونة #{idx + 1}: {card.id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">رمز الأيقونة:</span>
                        <input
                          type="text"
                          maxLength={3}
                          value={card.iconEmoji || ''}
                          onChange={(e) => handleCardFieldChange(card.id, 'iconEmoji', e.target.value)}
                          placeholder="👑"
                          className="w-12 px-2 py-0.5 rounded bg-[#070913] border border-slate-700 text-center text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        النص في أعلى الأيقونة (Top Text)
                      </label>
                      <input
                        type="text"
                        value={card.topText}
                        onChange={(e) => handleCardFieldChange(card.id, 'topText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        الاسم والعنوان الرئيسي داخل الأيقونة (Inside Title)
                      </label>
                      <input
                        type="text"
                        value={card.insideTitle}
                        onChange={(e) => handleCardFieldChange(card.id, 'insideTitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        النص التوضيحي في أسفل الأيقونة (Bottom Description)
                      </label>
                      <input
                        type="text"
                        value={card.bottomText}
                        onChange={(e) => handleCardFieldChange(card.id, 'bottomText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">
                          عدد النجوم المعروضة (من 1 إلى 7 نجوم)
                        </label>
                        <span className="text-xs font-mono-num text-amber-400 font-bold">
                          {card.starsCount || 0}★
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={7}
                        value={card.starsCount || 0}
                        onChange={(e) => handleCardFieldChange(card.id, 'starsCount', parseInt(e.target.value, 10))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#0F1424] border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImagePlus className="w-5 h-5 text-amber-400" />
                    <span>التحكم الشامل في أنشطة الشركة وصور العرض الحالية</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    يمكنك تغيير أي صورة موجودة حالياً، رفع صورة بديلة من جهازك، تعديل النصوص أو الإحصائيات، أو الإبقاء عليها كما هي.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveActivities}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shrink-0 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وتثبيت تعديلات الصور</span>
                </button>
              </div>

              {activityFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" />
                  <span>{activityFeedback}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editableActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-num font-bold text-amber-400">
                          نشاط #{act.numberIndex}
                        </span>
                        <span className="text-[11px] text-slate-400">{act.categoryAr}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black">
                          <img
                            src={act.imageUrl}
                            alt={act.titleAr}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/15 text-amber-300 text-xs font-semibold cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            <span>رفع صورة بديلة من الجهاز لهذا النشاط</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleActivityImageUpload(e, act.id)}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            dir="ltr"
                            value={act.imageUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableActivities((prev) =>
                                prev.map((a) => (a.id === act.id ? { ...a, imageUrl: val } : a))
                              );
                            }}
                            placeholder="أو الصق رابط صورة بديل هنا..."
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-[11px] text-white font-mono-num"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            عنوان النشاط
                          </label>
                          <input
                            type="text"
                            value={act.titleAr}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableActivities((prev) =>
                                prev.map((a) => (a.id === act.id ? { ...a, titleAr: val } : a))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            وصف النشاط
                          </label>
                          <textarea
                            rows={2}
                            value={act.descriptionAr}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableActivities((prev) =>
                                prev.map((a) => (a.id === act.id ? { ...a, descriptionAr: val } : a))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            الإحصائية البارزة المعروضة
                          </label>
                          <input
                            type="text"
                            value={act.metricsAr}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableActivities((prev) =>
                                prev.map((a) => (a.id === act.id ? { ...a, metricsAr: val } : a))
                              );
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={handleBroadcastSubmit}
                className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4 h-fit"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span>بث رسالة ترحيب أو تنبيه للمستخدمين</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    أرسل رسالة ترحيب فورية لطمأنة المستخدمين والمنضمين الجدد، تظهر لهم مباشرة عبر علامة الجرس وشريط الترحيب.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    عنوان الرسالة <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="مثال: رسالة ترحيبية من المدير العام عيون Prince"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    نوع الإشعار
                  </label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white cursor-pointer"
                  >
                    <option value="welcome">🎉 رسالة ترحيب وطمأنة</option>
                    <option value="announcement">📢 إعلان وتوجيه عام</option>
                    <option value="urgent">⚠️ تنبيه إداري عاجل</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    نص الرسالة الترحيبية <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="اكتب رسالة الترحيب هنا..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                {broadcastFeedback && (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>{broadcastFeedback}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>بث رسالة الترحيب فوراً</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    الإشعارات ورسائل الترحيب المنشورة ({notifications.length})
                  </h3>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0F1424] border border-slate-800 text-center text-xs text-slate-400">
                    لا توجد إشعارات مسجلة حالياً.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{n.title}</h4>
                          <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
                            {n.type === 'welcome' ? 'ترحيب' : n.type === 'urgent' ? 'عاجل' : 'إعلان'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono-num">{n.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                        <span className="text-[11px] text-slate-400 block">المرسل: {n.senderName}</span>
                      </div>

                      {session.isGeneralManager && (
                        <button
                          type="button"
                          onClick={() => onDeleteNotification(n.id)}
                          className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                          title="حذف هذا الإشعار"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact_channels' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newChannelLabel.trim() || !newChannelValue.trim()) return;
                  const newChan: ContactChannel = {
                    id: `contact-${Date.now()}`,
                    type: newChannelType,
                    labelAr: newChannelLabel.trim(),
                    value: newChannelValue.trim(),
                    descriptionAr: newChannelDesc.trim() || 'قناة تواصل رسمية معتمدة من الإدارة العليا'
                  };
                  const updated = [...editableChannels, newChan];
                  setEditableChannels(updated);
                  onUpdateContactChannels(updated);
                  setNewChannelLabel('');
                  setNewChannelValue('');
                  setNewChannelDesc('');
                  setChannelFeedback('تمت إضافة وتثبيت القناة بنجاح في الموقع!');
                  setTimeout(() => setChannelFeedback(null), 3500);
                }}
                className="lg:col-span-5 p-6 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-4 h-fit"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <span>إضافة وتعديل أرقام الواتساب والتواصل الرسمي</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    يمكنك تغيير وتحديث أرقام الواتساب وعناوين البريد الإلكتروني في أي وقت لتظهر لكافة الزوار فوراً.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">نوع القناة</label>
                  <select
                    value={newChannelType}
                    onChange={(e) => setNewChannelType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  >
                    <option value="whatsapp">رقم واتساب رسمي (WhatsApp)</option>
                    <option value="email">عنوان بريد إلكتروني (Official Email)</option>
                    <option value="phone">خط هاتفي مباشر (Direct Phone)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    مسمى القناة أو الجهة <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newChannelLabel}
                    onChange={(e) => setNewChannelLabel(e.target.value)}
                    placeholder="مثال: واتساب الإدارة العليا (المدير العام عيون Prince)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    الرقم أو البريد الإلكتروني <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={newChannelValue}
                    onChange={(e) => setNewChannelValue(e.target.value)}
                    placeholder="+201200125746 أو البريد"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white font-mono-num"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    وصف مختصر للغرض من الرقم
                  </label>
                  <textarea
                    rows={2}
                    value={newChannelDesc}
                    onChange={(e) => setNewChannelDesc(e.target.value)}
                    placeholder="مثال: للتواصل الفوري واعتماد العقود وحل الشكاوى..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070913] border border-slate-800 text-xs text-white"
                  />
                </div>

                {channelFeedback && (
                  <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>{channelFeedback}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>تثبيت القناة في الموقع</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    أرقام الواتساب وعناوين التواصل المثبتة حالياً ({editableChannels.length})
                  </h3>
                </div>

                {editableChannels.map((chan, idx) => (
                  <div
                    key={chan.id}
                    className="p-5 rounded-2xl bg-[#0F1424] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={chan.labelAr}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableChannels((prev) =>
                              prev.map((c) => (c.id === chan.id ? { ...c, labelAr: val } : c))
                            );
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-[#070913] border border-slate-700 text-xs font-bold text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editableChannels.filter((c) => c.id !== chan.id);
                            setEditableChannels(updated);
                            onUpdateContactChannels(updated);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="حذف هذا الرقم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">الرقم / البريد:</label>
                        <input
                          type="text"
                          dir="ltr"
                          value={chan.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableChannels((prev) =>
                              prev.map((c) => (c.id === chan.id ? { ...c, value: val } : c))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#070913] border border-slate-700 text-xs font-mono-num text-amber-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">الوصف:</label>
                        <input
                          type="text"
                          value={chan.descriptionAr}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableChannels((prev) =>
                              prev.map((c) => (c.id === chan.id ? { ...c, descriptionAr: val } : c))
                            );
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#070913] border border-slate-700 text-xs text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateContactChannels(editableChannels);
                          setChannelFeedback('تم حفظ التعديلات على كافة الأرقام بنجاح!');
                          setTimeout(() => setChannelFeedback(null), 3000);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        حفظ التعديلات
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support_tickets' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    <span>لوحة شكاوى واستفسارات المستخدمين والمقدمين</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    تصل هنا كافة المشاكل والشكاوى المرسلة من نموذج الدعم المباشر، متضمنة كود التسجيل، الواتساب، والسبب.
                  </p>
                </div>
                <div className="text-xs text-slate-300">
                  إجمالي الشكاوى:{' '}
                  <strong className="text-white font-mono-num">{tickets.length}</strong>
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1424] border border-slate-800 text-slate-400 text-sm">
                  لا توجد شكاوى أو استفسارات حالياً.
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((tkt) => {
                    const isNew = tkt.status === 'new';
                    const isResolved = tkt.status === 'resolved';

                    return (
                      <div
                        key={tkt.id}
                        className={`p-6 rounded-2xl border space-y-4 ${
                          isNew
                            ? 'bg-amber-950/15 border-amber-500/40 shadow-lg'
                            : isResolved
                            ? 'bg-emerald-950/10 border-emerald-500/30 opacity-80'
                            : 'bg-[#0F1424] border-slate-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-white">{tkt.applicantOrUserName}</span>
                            {tkt.realFullNameOptional && (
                              <span className="text-xs text-slate-300">({tkt.realFullNameOptional})</span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                              {tkt.role}
                            </span>
                            <span className="text-xs text-amber-400 font-mono-num font-bold">
                              كود: {tkt.trackingCode}
                            </span>
                            <span className="text-xs text-slate-500 font-mono-num">{tkt.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                isNew
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : isResolved
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}
                            >
                              {isNew ? 'جديدة بانتظار الرد' : isResolved ? 'تم الحل والرد' : 'قيد المتابعة'}
                            </span>

                            <button
                              type="button"
                              onClick={() => onDeleteTicket(tkt.id)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                              title="حذف التذكرة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-[#070913] p-3 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 ml-1">وسيلة التواصل المدخلة:</span>
                            <span className="text-amber-300 font-mono-num font-bold" dir="ltr">
                              {tkt.whatsappOrEmail}
                            </span>
                          </div>
                          {tkt.whatsappOrEmail.includes('+') && (
                            <a
                              href={`https://wa.me/${tkt.whatsappOrEmail.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `مرحباً ${tkt.applicantOrUserName}، نتواصل معك من إدارة Vibers V العليا بخصوص طلبك رقم ${tkt.trackingCode}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>محادثة واتساب فورية</span>
                            </a>
                          )}
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-slate-400 block font-semibold mb-0.5">وصف المشكلة:</span>
                            <p className="text-slate-100 bg-[#070913] p-3 rounded-xl border border-slate-800 leading-relaxed">
                              {tkt.problemDescription}
                            </p>
                          </div>
                          {tkt.reasonOrDetails && (
                            <div>
                              <span className="text-slate-400 block font-semibold mb-0.5">السبب والتفاصيل:</span>
                              <p className="text-slate-300 bg-[#070913] p-3 rounded-xl border border-slate-800 leading-relaxed">
                                {tkt.reasonOrDetails}
                              </p>
                            </div>
                          )}
                          {tkt.adminReply && (
                            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                              <span className="text-emerald-400 font-bold block mb-1">رد الإدارة المسجل:</span>
                              <p className="text-emerald-100">{tkt.adminReply}</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800">
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={ticketReplyText[tkt.id] || ''}
                              onChange={(e) =>
                                setTicketReplyText((prev) => ({ ...prev, [tkt.id]: e.target.value }))
                              }
                              placeholder="اكتب رد الإدارة أو الحل هنا..."
                              className="w-full px-3 py-1.5 rounded-lg bg-[#070913] border border-slate-700 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const reply = ticketReplyText[tkt.id] || 'تمت مراجعة طلبك والتواصل معك.';
                                onUpdateTicketStatus(tkt.id, 'resolved', reply);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                            >
                              إرسال الرد وحل التذكرة
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onUpdateTicketStatus(tkt.id, 'in_progress')}
                              className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold cursor-pointer"
                            >
                              قيد المتابعة
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateTicketStatus(tkt.id, 'resolved')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer"
                            >
                              اعتبارها محلولة
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trash' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/30 via-[#0F1424] to-slate-900 border border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl shadow-rose-950/20">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <Trash2 className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
                        <span>سلة المهملات والمحذوفات</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono-num font-bold border border-rose-500/40">
                          {trashedApplications.length} عنصر محذوف
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        نظام الحفظ الآمن للمتقدمين المرفوضين والمستخدمين غير النشطين. عند الرغبة، يمكنك الضغط على <strong className="text-emerald-400 font-bold">"استرجاع إلى قائمة المتقدمين"</strong> ليعود المستخدم للظهور فوراً وسط المتقدمين النشطين.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
                  {trashedApplications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من رغبتك في تفريغ سلة المهملات نهائياً؟')) {
                          onEmptyTrash();
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>تفريغ السلة بالكامل</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer w-full sm:w-auto shadow-md"
                  >
                    <Users className="w-4 h-4" />
                    <span>العودة للمتقدمين النشطين</span>
                  </button>
                </div>
              </div>

              {trashedApplications.length === 0 ? (
                <div className="p-16 rounded-2xl bg-[#0F1424] border border-slate-800 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">سلة المهملات فارغة تماماً</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    لا توجد أي بيانات لمتقدمين محذوفين حالياً. عند قيامك بحذف أي مستخدم مرفوض أو غير نشط من النظام، سيتم حفظ بياناته هنا مع إمكانية استرجاعه في أي وقت بضغطة زر.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trashedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-6 rounded-2xl bg-[#0F1424] border border-rose-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-md transition-all hover:border-rose-500/50"
                    >
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <span>{app.realFullName}</span>
                            <button
                              type="button"
                              onClick={() => openApplicantDetail(app)}
                              className="p-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white cursor-pointer transition-colors"
                              title="رؤية ومعاينة تفاصيل ووثائق المتقدم"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-amber-400 font-normal">
                              (اللقب: {app.nickname})
                            </span>
                          </h4>

                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40">
                            {app.trashedReason || 'محذوف من السيستم'}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              app.registrationTrack === 'official'
                                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                                : 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                            }`}
                          >
                            {app.registrationTrack === 'official' ? 'مسار رسمي 100%' : 'مسار مختصر 50%'}
                          </span>

                          <span className="text-xs font-mono-num text-slate-500">
                            تاريخ الحذف: {app.trashedAt}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-[#070913] p-3.5 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-500 block mb-0.5">الهاتف والواتساب:</span>
                            <span className="font-mono-num text-emerald-400 font-semibold" dir="ltr">
                              {app.whatsappPhone || app.fullPhone}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">البريد الإلكتروني:</span>
                            <span className="font-mono-num text-white" dir="ltr">
                              {app.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">الوظائف المسجلة:</span>
                            <span className="text-blue-400 font-semibold">
                              {app.selectedRoles.map(getRoleLabel).join(' + ')}
                            </span>
                          </div>
                        </div>

                        {app.bio && (
                          <div className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 line-clamp-1">
                            <span className="text-slate-500">النبذة: </span>
                            <span>{app.bio}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0 w-full lg:w-auto">
                        <button
                          type="button"
                          onClick={() => openApplicantDetail(app)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-cyan-400" />
                          <span>رؤية الملف كاملاً</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRestoreTrashedApplication(app.id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 border border-emerald-400/40 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                          title="استرجاع هذا المستخدم ليظهر مرة أخرى وسط المتقدمين النشطين"
                        >
                          <RotateCcw className="w-4 h-4 animate-spin-once" />
                          <span>استرجاع إلى قائمة المتقدمين</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من الحذف النهائي لبيانات ${app.realFullName}؟`)) {
                              onDeleteTrashedPermanently(app.id);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                          title="حذف نهائي لا يمكن استرجاعه من السيرفر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف نهائي</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedApplicant && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-[#0F1424] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedApplicant.realFullName}</h3>
                <p className="text-xs text-amber-400 font-mono-num">
                  اللقب: {selectedApplicant.nickname} · مسار:{' '}
                  {selectedApplicant.registrationTrack === 'official'
                    ? 'التسجيل الرسمي 100%'
                    : 'التسجيل الفرعي 50%'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-1">
              {selectedApplicant.registrationTrack === 'official' && (
                <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 text-sm">بيانات الهوية والعنوان</h4>
                  <p>رقم الهوية / الجواز: <strong className="text-white font-mono-num">{selectedApplicant.nationalIdNumber || 'غير مدخل'}</strong></p>
                  <p>العنوان: {selectedApplicant.residenceAddress}</p>
                  <p>الشارع: {selectedApplicant.streetName || '-'} · رقم المنزل: {selectedApplicant.houseNumber || '-'}</p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {selectedApplicant.idFrontImage && (
                      <div>
                        <span className="block mb-1 text-[11px] text-slate-400">صورة الوجه الأمامي:</span>
                        <img
                          src={selectedApplicant.idFrontImage}
                          alt="صورة الوجه الأمامي"
                          className="max-h-28 rounded-lg border border-slate-700 object-contain bg-black"
                        />
                      </div>
                    )}
                    {selectedApplicant.idBackImage && (
                      <div>
                        <span className="block mb-1 text-[11px] text-slate-400">صورة الوجه الخلفي:</span>
                        <img
                          src={selectedApplicant.idBackImage}
                          alt="صورة الوجه الخلفي"
                          className="max-h-28 rounded-lg border border-slate-700 object-contain bg-black"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#070913] border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm">التواصل والوظائف</h4>
                <p>الهاتف: <span className="font-mono-num text-emerald-400" dir="ltr">{selectedApplicant.fullPhone}</span></p>
                <p>الواتساب: <span className="font-mono-num text-emerald-400" dir="ltr">{selectedApplicant.whatsappPhone || selectedApplicant.fullPhone}</span></p>
                <p>البريد: <span className="font-mono-num text-white" dir="ltr">{selectedApplicant.email}</span></p>
                <p>العمر: {selectedApplicant.age} سنة · الجنس: {selectedApplicant.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                <p>الوظائف: {selectedApplicant.selectedRoles.map(getRoleLabel).join(' + ')}</p>
                {selectedApplicant.managedBdCount && (
                  <p className="text-amber-300">
                    فريق الـ BD: {selectedApplicant.managedBdCount} مطور أعمال ({selectedApplicant.managedBdNamesOrCodes || 'مرفق بالأعلى'})
                  </p>
                )}
                <p>النبذة: {selectedApplicant.bio}</p>
              </div>

              {(session.isGeneralManager || permissions.canEvaluateCandidates) && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-200">
                      تقييم درجة وكفاءة المتقدم (1 إلى 7 نجوم):
                    </label>
                    <span className="font-mono-num text-amber-400 font-bold">{candidateRating}/7★</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCandidateRating(num)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            num <= candidateRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-200">ملاحظات الإدارة على الطلب:</label>
                    <textarea
                      rows={2}
                      value={candidateNotes}
                      onChange={(e) => setCandidateNotes(e.target.value)}
                      placeholder="ملاحظات المراجعة وتاريخ المقابلة..."
                      className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              {session.isGeneralManager && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteApplication(selectedApplicant.id);
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold cursor-pointer"
                >
                  حذف الملف نهائياً
                </button>
              )}

              <div className="flex items-center gap-2">
                {(session.isGeneralManager || permissions.canBanUsers) && (
                  <button
                    type="button"
                    onClick={() => saveCandidateEvaluation('banned')}
                    className="px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold cursor-pointer"
                  >
                    حظر المتقدم
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => saveCandidateEvaluation('waitlist')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white text-xs font-bold cursor-pointer"
                >
                  تعيين كقائمة انتظار (50%)
                </button>
                {(session.isGeneralManager || permissions.canApproveApplicants) && (
                  <button
                    type="button"
                    onClick={() => saveCandidateEvaluation('approved')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    اعتماد وموافقة 100%
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
