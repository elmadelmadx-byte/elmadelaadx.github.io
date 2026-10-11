import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, Bell, Sparkles, Search, Phone, MessageCircle } from 'lucide-react';
import {
  BannerSlide,
  TeamApplication,
  UserRatingComment,
  LivePlatformStats,
  RoleId,
  StatCardCustomization,
  SubAdminAccount,
  ActiveAdminSession,
  ActivityShowcase,
  BroadcastNotification,
  ContactChannel,
  SupportTicket,
  TrashedApplication
} from './types';
import {
  INITIAL_BANNERS,
  INITIAL_ACTIVITIES,
  INITIAL_STATS,
  INITIAL_CUSTOMIZABLE_CARDS,
  INITIAL_APPLICATIONS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONTACT_CHANNELS,
  INITIAL_TICKETS
} from './data/initialData';
import { api } from './services/api';
import { HeroSlider } from './components/HeroSlider';
import { LiveStatsAndActivities } from './components/LiveStatsAndActivities';
import { TeamApplicationForm } from './components/TeamApplicationForm';
import { RatingsAndComments } from './components/RatingsAndComments';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NotificationModal } from './components/NotificationModal';
import { ContactModal } from './components/ContactModal';
import { SearchCodeModal } from './components/SearchCodeModal';
import { SupportChatModal } from './components/SupportChatModal';

const STORAGE_KEYS = {
  BANNERS: 'vibers_v_banners_v2',
  APPLICATIONS: 'vibers_v_applications_v2',
  COMMENTS: 'vibers_v_comments_v2',
  BANNED_HANDLES: 'vibers_v_banned_handles_v2',
  STATS: 'vibers_v_stats_v2',
  CUSTOM_CARDS: 'vibers_v_custom_cards_v2'
};

export function App() {
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      return saved ? JSON.parse(saved) : INITIAL_BANNERS;
    } catch {
      return INITIAL_BANNERS;
    }
  });

  const [applications, setApplications] = useState<TeamApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [comments, setComments] = useState<UserRatingComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [bannedHandles, setBannedHandles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNED_HANDLES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<LivePlatformStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [customCards, setCustomCards] = useState<StatCardCustomization[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMIZABLE_CARDS;
    } catch {
      return INITIAL_CUSTOMIZABLE_CARDS;
    }
  });

  const [activities, setActivities] = useState<ActivityShowcase[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_activities_v2');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [notifications, setNotifications] = useState<BroadcastNotification[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_notifs_v2');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [contactChannels, setContactChannels] = useState<ContactChannel[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_contacts_v2');
      return saved ? JSON.parse(saved) : INITIAL_CONTACT_CHANNELS;
    } catch {
      return INITIAL_CONTACT_CHANNELS;
    }
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_tickets_v2');
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [isRatingsLocked, setIsRatingsLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_ratings_locked_v2');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [trashedApplications, setTrashedApplications] = useState<TrashedApplication[]>(() => {
    try {
      const saved = localStorage.getItem('vibers_v_trash_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [preselectedRole, setPreselectedRole] = useState<RoleId | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeAdminSession, setActiveAdminSession] = useState<ActiveAdminSession | null>(null);
  const [subAdmins, setSubAdmins] = useState<SubAdminAccount[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isSupportChatModalOpen, setIsSupportChatModalOpen] = useState(false);
  const [supportPrefilledCode, setSupportPrefilledCode] = useState('');
  const [welcomeToast, setWelcomeToast] = useState<BroadcastNotification | null>(null);
  const [liveNewAlert, setLiveNewAlert] = useState<string | null>(null);

  const prevApplicationsCountRef = useRef(applications.length);

  useEffect(() => {
    const welcome = notifications.find((n) => n.type === 'welcome');
    if (welcome && !sessionStorage.getItem('vibers_welcomed')) {
      setWelcomeToast(welcome);
      sessionStorage.setItem('vibers_welcomed', 'true');
    }
  }, [notifications]);

  useEffect(() => {
    api.recordLoginHit();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSync = async () => {
      const remote = await api.getState();
      if (!remote || !isMounted) return;

      if (Array.isArray(remote.applications)) {
        if (remote.applications.length > prevApplicationsCountRef.current) {
          const newest = remote.applications[0];
          if (newest && newest.realFullName) {
            setLiveNewAlert(`وصول طلب جديد الآن من: ${newest.realFullName} (${newest.nickname})!`);
            setTimeout(() => setLiveNewAlert(null), 6000);
          }
        }
        prevApplicationsCountRef.current = remote.applications.length;
        setApplications(remote.applications);
      }

      if (Array.isArray(remote.banners)) setBanners(remote.banners);
      if (Array.isArray(remote.activities)) setActivities(remote.activities);
      if (Array.isArray(remote.notifications)) setNotifications(remote.notifications);
      if (Array.isArray(remote.comments)) setComments(remote.comments);
      if (Array.isArray(remote.bannedHandles)) setBannedHandles(remote.bannedHandles);
      if (remote.stats) setStats(remote.stats);
      if (Array.isArray(remote.customCards)) setCustomCards(remote.customCards);
      if (Array.isArray(remote.subAdmins)) setSubAdmins(remote.subAdmins);
      if (Array.isArray(remote.contactChannels)) setContactChannels(remote.contactChannels);
      if (Array.isArray(remote.tickets)) setTickets(remote.tickets);
      if (typeof remote.isRatingsLocked === 'boolean') setIsRatingsLocked(remote.isRatingsLocked);
      if (Array.isArray(remote.trashedApplications)) setTrashedApplications(remote.trashedApplications);
    };

    fetchSync();
    const interval = setInterval(fetchSync, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vibers_v_ratings_locked_v2', JSON.stringify(isRatingsLocked));
    } catch {}
  }, [isRatingsLocked]);

  useEffect(() => {
    try {
      localStorage.setItem('vibers_v_trash_v2', JSON.stringify(trashedApplications));
    } catch {}
  }, [trashedApplications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    } catch {}
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    } catch {}
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANNED_HANDLES, JSON.stringify(bannedHandles));
    } catch {}
  }, [bannedHandles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(customCards));
    } catch {}
  }, [customCards]);

  const handleToggleRatingsLock = async (locked: boolean) => {
    setIsRatingsLocked(locked);
    try {
      localStorage.setItem('vibers_v_ratings_locked_v2', JSON.stringify(locked));
    } catch {}
    await api.toggleRatingsLock(locked);
  };

  const handleNavigate = (targetSelector: string) => {
    const el = document.querySelector(targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRoleAndScroll = (roleId: string) => {
    setPreselectedRole(roleId as RoleId);
    handleNavigate('#join-team');
  };

  const handleSubmitApplication = async (
    newApp: Omit<TeamApplication, 'id' | 'status' | 'submittedAt'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const entry: TeamApplication = {
      ...newApp,
      id: `app-${Date.now()}`,
      status: newApp.registrationTrack === 'quick' ? 'waitlist' : 'pending',
      submittedAt: formattedDate
    };

    setApplications((prev) => [entry, ...prev]);
    prevApplicationsCountRef.current = prevApplicationsCountRef.current + 1;

    setStats((st) => ({
      ...st,
      officialRegistrations: newApp.registrationTrack === 'official' ? st.officialRegistrations + 1 : st.officialRegistrations,
      quickRegistrations: newApp.registrationTrack === 'quick' ? st.quickRegistrations + 1 : st.quickRegistrations
    }));

    await api.submitApplication(entry);
  };

  const handleUpdateApplicationStatus = async (
    id: string,
    status: TeamApplication['status'],
    notes?: string,
    rating?: number
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        if (app.status !== 'approved' && status === 'approved') {
          setStats((st) => ({
            ...st,
            superAdmins: app.selectedRoles.includes('super_admin') ? st.superAdmins + 1 : st.superAdmins,
            admins: app.selectedRoles.includes('admin') ? st.admins + 1 : st.admins,
            bds: app.selectedRoles.includes('bd') ? st.bds + 1 : st.bds,
            shippingAgents: app.selectedRoles.includes('shipping_agent') ? st.shippingAgents + 1 : st.shippingAgents,
            hostAgents: app.selectedRoles.includes('host_agent') ? st.hostAgents + 1 : st.hostAgents
          }));
        }

        return {
          ...app,
          status,
          moderationNotes: notes !== undefined ? notes : app.moderationNotes,
          candidateRating: rating !== undefined ? rating : app.candidateRating
        };
      })
    );

    await api.updateApplicationStatus(id, status, notes, rating);
  };

  const handleTrashApplication = async (id: string, reason?: string) => {
    const target = applications.find((a) => a.id === id);
    if (!target) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    const trashed: TrashedApplication = {
      ...target,
      trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      trashedReason: reason || (target.status === 'rejected' ? 'مرفوض من الإدارة' : 'نقل إلى سلة المهملات'),
      originalStatusBeforeTrash: target.status
    };
    setTrashedApplications((prev) => [trashed, ...prev]);
    await api.trashApplication(id, reason);
  };

  const handleTrashInactiveApplications = async () => {
    const inactive = applications.filter((a) => a.status === 'rejected' || a.status === 'waitlist' || a.status === 'banned');
    if (inactive.length === 0) return;
    const inactiveIds = new Set(inactive.map((a) => a.id));
    setApplications((prev) => prev.filter((a) => !inactiveIds.has(a.id)));
    const newlyTrashed: TrashedApplication[] = inactive.map((app) => ({
      ...app,
      trashedAt: new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }),
      trashedReason: app.status === 'rejected' ? 'مرفوض بقرار الإدارة' : app.status === 'banned' ? 'محظور من المنظومة' : 'غير نشط / قائمة الانتظار',
      originalStatusBeforeTrash: app.status
    }));
    setTrashedApplications((prev) => [...newlyTrashed, ...prev]);
    await api.trashInactiveApplications();
  };

  const handleRestoreTrashedApplication = async (id: string) => {
    const target = trashedApplications.find((a) => a.id === id);
    if (!target) return;
    setTrashedApplications((prev) => prev.filter((a) => a.id !== id));
    const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
    const restoredApp: TeamApplication = {
      ...originalApp,
      status: originalStatusBeforeTrash || 'pending'
    };
    setApplications((prev) => [restoredApp, ...prev]);
    await api.restoreTrashedApplication(id);
  };

  const handleRestoreAllTrashed = async () => {
    if (trashedApplications.length === 0) return;
    const restoredItems: TeamApplication[] = trashedApplications.map((target) => {
      const { trashedAt, trashedReason, originalStatusBeforeTrash, ...originalApp } = target;
      return {
        ...originalApp,
        status: originalStatusBeforeTrash || 'pending'
      };
    });
    setApplications((prev) => [...restoredItems, ...prev]);
    setTrashedApplications([]);
    await api.restoreAllTrashed();
  };

  const handleDeleteTrashedPermanently = async (id: string) => {
    setTrashedApplications((prev) => prev.filter((a) => a.id !== id));
    await api.deleteTrashedPermanently(id);
  };

  const handleEmptyTrash = async () => {
    setTrashedApplications([]);
    await api.emptyTrash();
  };

  const handleDeleteApplication = async (id: string) => {
    await handleTrashApplication(id);
  };

  const handleAddBanner = async (bannerData: Omit<BannerSlide, 'id'>) => {
    const created: BannerSlide = {
      ...bannerData,
      id: `banner-${Date.now()}`
    };
    setBanners((prev) => [created, ...prev]);
    await api.addBanner(created);
  };

  const handleDeleteBanner = async (id: string) => {
    if (banners.length <= 1) return;
    setBanners((prev) => prev.filter((b) => b.id !== id));
    await api.deleteBanner(id);
  };

  const handleUpdateBanner = async (id: string, updatedFields: Partial<BannerSlide>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
    await api.updateBanner(id, updatedFields);
  };

  const handleCreateSubAdmin = async (sub: Omit<SubAdminAccount, 'id' | 'createdAt'>) => {
    const created: SubAdminAccount = {
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSubAdmins((prev) => [created, ...prev]);
    await api.createSubAdmin(sub);
  };

  const handleDeleteSubAdmin = async (id: string) => {
    setSubAdmins((prev) => prev.filter((s) => s.id !== id));
    await api.deleteSubAdmin(id);
  };

  const handleUpdateActivities = async (updated: ActivityShowcase[]) => {
    setActivities(updated);
    try {
      localStorage.setItem('vibers_v_activities_v2', JSON.stringify(updated));
    } catch {}
    await api.updateActivities(updated);
  };

  const handleSendBroadcast = async (
    notifData: Omit<BroadcastNotification, 'id' | 'createdAt' | 'isActive'>
  ) => {
    const created: BroadcastNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      createdAt: 'الآن',
      isActive: true
    };
    setNotifications((prev) => [created, ...prev]);
    setWelcomeToast(created);
    await api.sendBroadcastNotification(created);
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await api.deleteBroadcastNotification(id);
  };

  const handleAddComment = async (entry: {
    authorName: string;
    authorHandle: string;
    stars: number;
    comment: string;
    activityType: string;
  }) => {
    const created: UserRatingComment = {
      id: `rev-${Date.now()}`,
      authorName: entry.authorName,
      authorHandle: entry.authorHandle,
      stars: entry.stars,
      comment: entry.comment,
      activityType: entry.activityType,
      createdAt: 'الآن'
    };
    setComments((prev) => [created, ...prev]);
    await api.addComment(created);
  };

  const handleDeleteComment = async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    await api.deleteComment(id);
  };

  const handleBanUserByComment = async (commentId: string, authorHandle: string) => {
    const normalized = authorHandle.toLowerCase();
    if (!bannedHandles.includes(normalized)) {
      setBannedHandles((prev) => [...prev, normalized]);
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId || c.authorHandle.toLowerCase() === normalized ? { ...c, isBannedUser: true } : c
      )
    );
    await api.banUser(commentId, authorHandle);
  };

  const handleUnbanHandle = async (handle: string) => {
    const normalized = handle.toLowerCase();
    setBannedHandles((prev) => prev.filter((h) => h !== normalized));
    setComments((prev) =>
      prev.map((c) =>
        c.authorHandle.toLowerCase() === normalized ? { ...c, isBannedUser: false } : c
      )
    );
    await api.unbanUser(handle);
  };

  const handleUpdateCardCustomization = async (updated: StatCardCustomization[]) => {
    setCustomCards(updated);
    await api.updateCustomCards(updated);
  };

  const handleUpdateContactChannels = async (updated: ContactChannel[]) => {
    setContactChannels(updated);
    await api.updateContactChannels(updated);
  };

  const handleSubmitTicket = async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const created = await api.submitTicket(ticket);
    if (created) {
      setTickets((prev) => [created, ...prev]);
      return true;
    }
    return false;
  };

  const handleUpdateTicketStatus = async (id: string, status: SupportTicket['status'], adminReply?: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status, adminReply: adminReply || t.adminReply } : t)));
    await api.updateTicketStatus(id, status, adminReply);
  };

  const handleDeleteTicket = async (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTicket(id);
  };

  const openExecutiveAccess = () => {
    if (isAdminAuthenticated && activeAdminSession) {
      setIsDashboardModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#070913] text-slate-100 overflow-x-hidden">
      {liveNewAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 p-0.5 animate-pulse sticky top-0 z-50">
          <div className="bg-[#0B0F1C] px-4 py-2.5 sm:px-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-amber-300 text-xs sm:text-sm font-bold">
              <Bell className="w-4 h-4 animate-bounce text-amber-400 shrink-0" />
              <span className="break-words">{liveNewAlert}</span>
            </div>
            <button
              type="button"
              onClick={openExecutiveAccess}
              className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-lg font-bold cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              فتح لوحة التحكم فوراً
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070d1a]/80 backdrop-blur-xl px-4 py-3 sm:px-6 md:px-8 shadow-[0_12px_32px_rgba(2,6,23,0.2)] flex flex-wrap items-center justify-between gap-3 md:gap-8 md:py-0 md:h-16">
        <a href="#" className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white font-display flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-blue-900/40">V</span>
          <span>Vibers V Global</span>
          {pendingAppsCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono-num font-bold cursor-pointer"
              onClick={openExecutiveAccess}
              title="طلبات انضمام جديدة بانتظار المدير"
            >
              {pendingAppsCount} جديد
            </span>
          )}
        </a>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
          <a href="#stats" className="rounded-full border border-transparent px-3 py-1.5 transition-all hover:border-sky-400/25 hover:bg-sky-500/10 hover:text-white">الإحصائيات</a>
          <a href="#activities" className="rounded-full border border-transparent px-3 py-1.5 transition-all hover:border-violet-400/25 hover:bg-violet-500/10 hover:text-white">أنشطة الشركة</a>
          <a href="#join-team" className="rounded-full border border-transparent px-3 py-1.5 transition-all hover:border-emerald-400/25 hover:bg-emerald-500/10 hover:text-white">التسجيل</a>
          <a href="#reviews" className="rounded-full border border-transparent px-3 py-1.5 transition-all hover:border-amber-400/25 hover:bg-amber-500/10 hover:text-white">التقييمات</a>
        </nav>

        <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
          <button
            type="button"
            onClick={() => {
              setSearchInitialQuery('');
              setIsSearchModalOpen(true);
            }}
            aria-label="الاستعلام والبحث بكود التسجيل"
            className="secondary-action p-2 rounded-xl flex items-center justify-center gap-1.5 sticky top-16 z-30 md:static"
            title="الاستعلام بكود الطلب (مقبول / قيد الانتظار / مرفوض)"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline text-xs font-semibold">بحث</span>
          </button>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsContactModalOpen(true)}
              aria-label="أرقام الواتساب المعتمدة"
              className="secondary-action p-2 rounded-xl flex items-center gap-1.5"
              title="أرقام الواتساب المعتمدة للإدارة العليا"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline text-xs font-semibold">واتساب</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSupportChatModalOpen(true)}
              aria-label="الدردشة والدعم المباشر"
              className="secondary-action p-2 rounded-xl flex items-center gap-1.5"
              title="مراسلة الإدارة وإرسال شكوى أو مشكلة"
            >
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline text-xs font-semibold">الدعم</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              aria-label="مركز الإشعارات والترحيب"
              className="relative secondary-action p-2 rounded-xl"
              title="الإشعارات ورسائل الترحيب الملكية"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-mono-num font-bold text-[10px] flex items-center justify-center shadow-md animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          <a href="#join-team" className="primary-action px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap shrink-0">
            تقديم طلب
          </a>
        </div>
      </header>

      <main className="flex-1">
        <HeroSlider banners={banners} onNavigate={handleNavigate} />

        <LiveStatsAndActivities
          stats={stats}
          activities={activities}
          customCards={customCards}
          onSelectRoleAndScroll={handleSelectRoleAndScroll}
        />

        <TeamApplicationForm
          preselectedRole={preselectedRole}
          onSubmitApplication={handleSubmitApplication}
          onOpenSearchModal={(code) => {
            setSearchInitialQuery(code);
            setIsSearchModalOpen(true);
          }}
        />

        <RatingsAndComments
          comments={comments}
          bannedHandles={bannedHandles}
          isRatingsLocked={isRatingsLocked}
          onAddComment={handleAddComment}
        />
      </main>

      <div className="fixed bottom-4 right-4 left-4 z-40 hidden sm:flex sm:left-auto sm:right-6 sm:bottom-6 flex-col items-stretch sm:items-end gap-2.5">
        <button
          type="button"
          onClick={() => setIsSupportChatModalOpen(true)}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-900/60 flex items-center justify-center gap-2 cursor-pointer border border-cyan-400/40 transition-transform hover:scale-[1.02]"
          title="الدردشة ومراسلة الإدارة وإرسال الشكاوى"
        >
          <MessageCircle className="w-5 h-5 text-white animate-pulse" />
          <span>مراسلة الإدارة والشكاوى</span>
        </button>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/80 bg-[#070d1a]/95 backdrop-blur-xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(2,6,23,0.35)] sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setIsNotificationModalOpen(true)}
            aria-label="الإشعارات"
            className="relative flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 px-2 py-2.5 text-[10px] font-bold text-amber-300"
            title="الإشعارات"
          >
            <Bell className="w-5 h-5 text-amber-400" />
            <span>الإشعارات</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-mono-num font-bold flex items-center justify-center px-1 shadow-md animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSupportChatModalOpen(true)}
            aria-label="الدردشة"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 px-2 py-2.5 text-[10px] font-bold text-cyan-300"
            title="الدردشة"
          >
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <span>الدردشة</span>
          </button>

          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            aria-label="دعم العملاء"
            className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 px-2 py-2.5 text-[10px] font-bold text-emerald-300"
            title="دعم العملاء"
          >
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>الدعم</span>
          </button>
        </div>
      </nav>

      <footer className="border-t border-slate-800/80 bg-[#05070F] py-8 px-4 sm:px-6 md:px-8 pb-28 sm:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="text-base font-bold text-white">
              Vibers V العالمية لتنمية التطبيقات ودعم تطبيقات الدردشة الصوتية
            </div>
            <p className="text-xs text-slate-400">
              المدير العام والمدير التنفيذي: <span className="text-amber-400 font-semibold">عيون Prince</span> · جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button
              type="button"
              onClick={openExecutiveAccess}
              className="primary-action px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap shrink-0"
              title="الدخول الخاص بالمدير العام عيون Prince"
            >
              {isAdminAuthenticated && activeAdminSession ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    لوحة التحكم ({activeAdminSession.name} - {pendingAppsCount} بانتظار الإجراء)
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                  <span>دخول الإدارة العليا</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        subAdmins={subAdmins}
        onSuccessLogin={(session) => {
          setActiveAdminSession(session);
          setIsAdminAuthenticated(true);
          setIsLoginModalOpen(false);
          setIsDashboardModalOpen(true);
        }}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        session={activeAdminSession}
        onSendBroadcast={handleSendBroadcast}
        onDeleteNotification={handleDeleteNotification}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactChannels={contactChannels}
        onOpenSupportModal={() => setIsSupportChatModalOpen(true)}
      />

      <SearchCodeModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        applications={applications}
        contactChannels={contactChannels}
        initialQuery={searchInitialQuery}
        onOpenSupportModal={(code) => {
          setSupportPrefilledCode(code || '');
          setIsSupportChatModalOpen(true);
        }}
      />

      <SupportChatModal
        isOpen={isSupportChatModalOpen}
        onClose={() => setIsSupportChatModalOpen(false)}
        contactChannels={contactChannels}
        onSubmitTicket={handleSubmitTicket}
        prefilledCode={supportPrefilledCode}
      />

      {welcomeToast && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md bg-[#0F1424] border-2 border-amber-500/60 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>{welcomeToast.title}</span>
              </h5>
              <button
                type="button"
                onClick={() => setWelcomeToast(null)}
                className="text-slate-500 hover:text-white p-1 text-xs cursor-pointer"
                title="إغلاق التنبيه"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">{welcomeToast.message}</p>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setWelcomeToast(null);
                  setIsNotificationModalOpen(true);
                }}
                className="text-[11px] text-amber-400 hover:underline font-bold cursor-pointer"
              >
                فتح مركز الإشعارات
              </button>
              <span className="text-[10px] text-slate-500">من: {welcomeToast.senderName}</span>
            </div>
          </div>
        </div>
      )}

      {activeAdminSession && (
        <AdminDashboardModal
          isOpen={isDashboardModalOpen}
          onClose={() => setIsDashboardModalOpen(false)}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            setActiveAdminSession(null);
            setIsDashboardModalOpen(false);
          }}
          session={activeAdminSession}
          banners={banners}
          onAddBanner={handleAddBanner}
          onDeleteBanner={handleDeleteBanner}
          onUpdateBanner={handleUpdateBanner}
          activities={activities}
          onUpdateActivities={handleUpdateActivities}
          notifications={notifications}
          onSendBroadcast={handleSendBroadcast}
          onDeleteNotification={handleDeleteNotification}
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onDeleteApplication={handleDeleteApplication}
          comments={comments}
          bannedHandles={bannedHandles}
          onDeleteComment={handleDeleteComment}
          onBanUserByComment={handleBanUserByComment}
          onUnbanHandle={handleUnbanHandle}
          customCards={customCards}
          onUpdateCardCustomization={handleUpdateCardCustomization}
          subAdmins={subAdmins}
          onCreateSubAdmin={handleCreateSubAdmin}
          onDeleteSubAdmin={handleDeleteSubAdmin}
          dailyActiveLogins={stats.dailyActiveLogins || 42890}
          contactChannels={contactChannels}
          onUpdateContactChannels={handleUpdateContactChannels}
          tickets={tickets}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onDeleteTicket={handleDeleteTicket}
          isRatingsLocked={isRatingsLocked}
          onToggleRatingsLock={handleToggleRatingsLock}
          trashedApplications={trashedApplications}
          onTrashApplication={handleTrashApplication}
          onTrashInactiveApplications={handleTrashInactiveApplications}
          onRestoreTrashedApplication={handleRestoreTrashedApplication}
          onRestoreAllTrashed={handleRestoreAllTrashed}
          onDeleteTrashedPermanently={handleDeleteTrashedPermanently}
          onEmptyTrash={handleEmptyTrash}
        />
      )}
    </div>
  );
}

export default App;
