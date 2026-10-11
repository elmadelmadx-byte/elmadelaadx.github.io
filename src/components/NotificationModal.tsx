import React, { useState } from 'react';
import {
  Bell,
  X,
  Send,
  Trash2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { BroadcastNotification, ActiveAdminSession } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: BroadcastNotification[];
  session: ActiveAdminSession | null;
  onSendBroadcast: (notif: Omit<BroadcastNotification, 'id' | 'createdAt' | 'isActive'>) => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  session,
  onSendBroadcast,
  onDeleteNotification
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'welcome' | 'urgent' | 'announcement'>('welcome');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    onSendBroadcast({
      title: broadcastTitle.trim() || 'إشعار ترحيبي رسمي',
      message: broadcastMessage.trim(),
      senderName: session ? session.name : 'المدير العام عيون Prince',
      type: broadcastType
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
    setFeedbackMsg('تم نشر رسالة الترحيب لكافة الزوار والمستخدمين بنجاح!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const typeTone = {
    welcome: 'from-amber-500/15 to-yellow-500/5 border-amber-500/30 text-amber-100',
    urgent: 'from-rose-500/15 to-red-500/5 border-rose-500/30 text-rose-100',
    announcement: 'from-sky-500/15 to-cyan-500/5 border-sky-500/30 text-sky-100'
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="مركز الإشعارات ورسائل الترحيب"
    >
      <div className="w-full max-w-3xl rounded-[28px] border border-slate-700/80 bg-[#0a1120] shadow-[0_20px_80px_rgba(15,23,42,0.7)] overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-6 py-5 bg-[linear-gradient(135deg,#111827_0%,#0f172a_30%,#111827_100%)] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>مركز الإشعارات والرسائل المباشرة</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[11px] font-mono-num border border-amber-500/30">
                  {notifications.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                بنية تواصل حديثة ومحادثة مباشرة للشركات والضيوف الجدد
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة الإشعارات"
            className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {session && (
            <div className="rounded-[24px] border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-900 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>بث رسالة ترحيب أو تنبيه إلى المستخدمين الجدد</span>
                </div>
                <span className="text-[11px] font-bold text-amber-200 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/30">
                  صلاحية القيادة
                </span>
              </div>
              <p className="text-xs text-slate-300">
                اكتب رسالة ترحيبية أو تنبيهًا مباشرًا لتظهر فوراً في أعلى الشاشة وتجربة المستخدم الحالية.
              </p>

              <form onSubmit={handleSend} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">عنوان الرسالة</label>
                    <input
                      type="text"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="مثال: رسالة ترحيب ملكية من الإدارة"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">نوع الإشعار</label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value as 'welcome' | 'urgent' | 'announcement')}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="welcome">🎉 رسالة ترحيب</option>
                      <option value="announcement">📢 إعلان رسمي</option>
                      <option value="urgent">⚠️ تنبيه عاجل</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    نص الرسالة <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="أهلاً وسهلاً بك في Vibers V العالمية! تم استلام طلبك بنجاح..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {feedbackMsg && (
                  <p className="text-xs text-emerald-300 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{feedbackMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-action w-full py-3 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>بث الآن</span>
                </button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.18em]">
              سجل التنبيهات المعتمدة
            </h4>

            {notifications.length === 0 ? (
              <div className="p-8 text-center rounded-[22px] bg-slate-900/70 border border-slate-800 text-slate-400 text-xs space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-600" />
                <p>لا توجد إشعارات حالياً.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const tone = typeTone[n.type] || typeTone.announcement;
                const icon =
                  n.type === 'welcome' ? <Sparkles className="w-4 h-4" /> : n.type === 'urgent' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />;

                return (
                  <article
                    key={n.id}
                    className={`p-4 rounded-[22px] border bg-gradient-to-r ${tone} flex items-start justify-between gap-4`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-2xl bg-slate-950/50 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white">
                        {icon}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{n.title}</h5>
                          <span className="text-[10px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700">
                            {n.senderName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono-num">{n.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{n.message}</p>
                      </div>
                    </div>

                    {session?.isGeneralManager && (
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(n.id)}
                        className="text-slate-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-slate-900/70 transition-colors cursor-pointer shrink-0"
                        title="حذف هذا الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            منظومة Vibers V العالمية · تحديث وتزامن فوري 24/7 · برعاية المدير العام عيون Prince
          </p>
        </div>
      </div>
    </div>
  );
};
