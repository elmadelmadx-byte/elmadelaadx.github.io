import {
  TeamApplication,
  BannerSlide,
  UserRatingComment,
  LivePlatformStats,
  StatCardCustomization,
  SubAdminAccount,
  ActivityShowcase,
  BroadcastNotification,
  ContactChannel,
  SupportTicket,
  TrashedApplication
} from '../types';

export interface FullBackendState {
  applications: TeamApplication[];
  banners: BannerSlide[];
  activities?: ActivityShowcase[];
  notifications?: BroadcastNotification[];
  comments: UserRatingComment[];
  bannedHandles: string[];
  stats: LivePlatformStats;
  customCards: StatCardCustomization[];
  subAdmins?: SubAdminAccount[];
  contactChannels?: ContactChannel[];
  tickets?: SupportTicket[];
  isRatingsLocked?: boolean;
  trashedApplications?: TrashedApplication[];
}

export const api = {
  async getState(): Promise<FullBackendState | null> {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend fetch /api/state failed, falling back to local storage:', err);
      return null;
    }
  },

  async recordLoginHit(): Promise<void> {
    try {
      await fetch('/api/stats/login-hit', { method: 'POST' });
    } catch {}
  },

  async submitApplication(app: TeamApplication): Promise<boolean> {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to submit application to /api/applications:', err);
      return false;
    }
  },

  async updateApplicationStatus(
    id: string,
    status: 'approved' | 'rejected' | 'waitlist' | 'banned' | 'pending',
    moderationNotes?: string,
    candidateRating?: number
  ): Promise<boolean> {
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, moderationNotes, candidateRating })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update status on /api/applications:', err);
      return false;
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete application on /api/applications:', err);
      return false;
    }
  },

  async addComment(comment: UserRatingComment): Promise<boolean> {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to add comment on /api/comments:', err);
      return false;
    }
  },

  async deleteComment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete comment on /api/comments:', err);
      return false;
    }
  },

  async banUser(commentId: string, authorHandle: string): Promise<boolean> {
    try {
      const res = await fetch('/api/comments/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, authorHandle })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to ban user on /api/comments/ban:', err);
      return false;
    }
  },

  async unbanUser(authorHandle: string): Promise<boolean> {
    try {
      const res = await fetch('/api/comments/unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorHandle })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to unban user on /api/comments/unban:', err);
      return false;
    }
  },

  async addBanner(banner: BannerSlide): Promise<boolean> {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to add banner on /api/banners:', err);
      return false;
    }
  },

  async updateBanner(id: string, updatedFields: Partial<BannerSlide>): Promise<boolean> {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update banner on /api/banners:', err);
      return false;
    }
  },

  async deleteBanner(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete banner on /api/banners:', err);
      return false;
    }
  },

  async updateCustomCards(customCards: StatCardCustomization[]): Promise<boolean> {
    try {
      const res = await fetch('/api/custom-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customCards })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update custom cards on /api/custom-cards:', err);
      return false;
    }
  },

  async createSubAdmin(subAdmin: Omit<SubAdminAccount, 'id' | 'createdAt'>): Promise<boolean> {
    try {
      const res = await fetch('/api/sub-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subAdmin)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to create sub-admin on /api/sub-admins:', err);
      return false;
    }
  },

  async deleteSubAdmin(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/sub-admins/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete sub-admin on /api/sub-admins:', err);
      return false;
    }
  },

  async sendBroadcastNotification(notif: BroadcastNotification): Promise<boolean> {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notif)
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to broadcast notification:', err);
      return false;
    }
  },

  async deleteBroadcastNotification(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete notification:', err);
      return false;
    }
  },

  async updateActivities(activities: ActivityShowcase[]): Promise<boolean> {
    try {
      const res = await fetch('/api/activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update activities on /api/activities:', err);
      return false;
    }
  },

  async updateStats(stats: Partial<LivePlatformStats>): Promise<boolean> {
    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update stats on /api/stats:', err);
      return false;
    }
  },

  async updateContactChannels(channels: ContactChannel[]): Promise<boolean> {
    try {
      const res = await fetch('/api/contact-channels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channels })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update contact channels:', err);
      return false;
    }
  },

  async submitTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<SupportTicket | null> {
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
      if (res.ok) {
        const data = await res.json();
        return data.ticket || null;
      }
      return null;
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      return null;
    }
  },

  async updateTicketStatus(id: string, status: SupportTicket['status'], adminReply?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminReply })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      return false;
    }
  },

  async deleteTicket(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      return false;
    }
  },

  async toggleRatingsLock(isRatingsLocked: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/ratings-lock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRatingsLocked })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to toggle ratings lock:', err);
      return false;
    }
  },

  async trashApplication(id: string, reason?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/applications/${id}/trash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to trash application:', err);
      return false;
    }
  },

  async trashInactiveApplications(): Promise<{ success: boolean; movedCount: number }> {
    try {
      const res = await fetch('/api/applications/trash-inactive', {
        method: 'POST'
      });
      if (!res.ok) return { success: false, movedCount: 0 };
      const data = await res.json();
      return { success: true, movedCount: data.movedCount || 0 };
    } catch (err) {
      console.error('Failed to trash inactive applications:', err);
      return { success: false, movedCount: 0 };
    }
  },

  async restoreTrashedApplication(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/trash/${id}/restore`, {
        method: 'POST'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to restore trashed application:', err);
      return false;
    }
  },

  async restoreAllTrashed(): Promise<boolean> {
    try {
      const res = await fetch('/api/trash/restore-all', {
        method: 'POST'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to restore all trashed applications:', err);
      return false;
    }
  },

  async deleteTrashedPermanently(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/trash/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete trashed application permanently:', err);
      return false;
    }
  },

  async emptyTrash(): Promise<boolean> {
    try {
      const res = await fetch('/api/trash', {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to empty trash:', err);
      return false;
    }
  }
};
