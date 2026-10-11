import React, { useState } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Ban,
  ShieldAlert,
  Copy,
  Check,
  Phone,
  MessageCircle,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { TeamApplication, ContactChannel } from '../types';

interface SearchCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: TeamApplication[];
  contactChannels: ContactChannel[];
  initialQuery?: string;
  onOpenSupportModal?: (prefilledCode?: string) => void;
}

export const SearchCodeModal: React.FC<SearchCodeModalProps> = ({
  isOpen,
  onClose,
  applications,
  contactChannels,
  initialQuery = '',
  onOpenSupportModal
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Search by tracking ID (e.g. VBR-101-SEC or 101), real name, nickname, or phone
  const searchResults = cleanQuery
    ? applications.filter((app) => {
        const idMatches = app.id.toLowerCase().includes(cleanQuery);
        const nameMatches = app.realFullName.toLowerCase().includes(cleanQuery);
        const nickMatches = app.nickname.toLowerCase().includes(cleanQuery);
        const phoneMatches = app.fullPhone.includes(cleanQuery) || app.phoneNumber.includes(cleanQuery);
        return idMatches || nameMatches || nickMatches || phoneMatches;
      })
    : [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const primaryWhatsapp = contactChannels.find((c) => c.type === 'whatsapp' && c.isPrimary) || contactChannels.find((c) => c.type === 'whatsapp');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="الاستعلام والبحث بكود التسجيل ورقم المتابعة"
    >
      <div className="w-full max-w-2xl bg-[#0F1424] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                شريط البحث والاستعلام عن كود الطلب وحالة الانضمام
              </h3>
              <p className="text-xs text-slate-400">
                ابحث برقم الكود التعريفي، الاسم، أو الهاتف لمعرفة قرار الإدارة فوراً
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق نافذة البحث"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="أدخل كود التسجيل (مثال: VBR-101-SEC) أو الاسم أو رقم الهاتف..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#070913] border border-slate-700 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono-num"
            />
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-4" />
          </div>
          <p className="text-[11px] text-slate-400">
            * ملحوظة مهمة: يتم استلام كود الطلب فور إرسال النموذج ويجب الاحتفاظ به للتحقق في أي وقت.
          </p>
        </div>

        {/* Search Results */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {cleanQuery && searchResults.length === 0 && (
            <div className="p-8 rounded-2xl bg-[#090D1A] border border-slate-800 text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">لم يتم العثور على طلب بهذا الكود أو الاسم</p>
              <p className="text-xs text-slate-400">
                يرجى التأكد من كتابة الكود بشكل صحيح أو تقديم طلب جديد عبر البوابة.
              </p>
            </div>
          )}

          {searchResults.map((app) => {
            const isApproved = app.status === 'approved';
            const isPending = app.status === 'pending';
            const isWaitlist = app.status === 'waitlist';
            const isRejected = app.status === 'rejected';
            const isBanned = app.status === 'banned';

            return (
              <div
                key={app.id}
                className={`p-6 rounded-2xl border space-y-5 transition-all ${
                  isApproved
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : isBanned
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40'
                    : isRejected
                    ? 'bg-red-950/20 border-red-500/40'
                    : isWaitlist
                    ? 'bg-cyan-950/20 border-cyan-500/40'
                    : 'bg-amber-950/15 border-amber-500/40'
                }`}
              >
                {/* Result Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{app.realFullName}</span>
                      <span className="text-xs text-amber-400 font-mono-num font-semibold">({app.nickname})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>كود الطلب الرسمي:</span>
                      <span className="px-2 py-0.5 rounded bg-[#070913] border border-slate-700 text-amber-300 font-mono-num font-bold">
                        {app.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(app.id)}
                        className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
                        title="نسخ الكود"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isApproved && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تمت الموافقة والاعتماد رسمياً (Approved)</span>
                      </span>
                    )}

                    {isPending && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>قيد الانتظار والتدقيق (24-48 ساعة)</span>
                      </span>
                    )}

                    {isWaitlist && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>قائمة الانتظار الأولية (احتمالية 50%)</span>
                      </span>
                    )}

                    {isRejected && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-red-500/20 border border-red-500 text-red-300 font-bold text-xs flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>تم رفض الطلب لعدم استيفاء الشروط</span>
                      </span>
                    )}

                    {isBanned && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/30 border border-rose-500 text-rose-200 font-bold text-xs flex items-center gap-1.5">
                        <Ban className="w-4 h-4 text-rose-400" />
                        <span>تم حظر الحساب ورفضه نهائياً بقرار إداري</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Guidance / Feedback */}
                <div className="space-y-3">
                  {isApproved && (
                    <div className="p-4 rounded-xl bg-[#070913] border border-emerald-500/30 space-y-2">
                      <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                        🎉 <strong>تهانينا!</strong> لقد تم قبول طلبك وتعيينك بنجاح ضمن قائمة أعضاء Vibers V العالمية. يظهر اسمك ورتبتك الآن في القائمة الرسمية المعتمدة للمنظومة.
                      </p>
                      {app.moderationNotes && (
                        <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-amber-400 font-semibold">ملاحظات الإدارة:</span> {app.moderationNotes}
                        </p>
                      )}
                    </div>
                  )}

                  {isPending && (
                    <div className="p-4 rounded-xl bg-[#070913] border border-amber-500/30 space-y-2">
                      <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                        ⏳ <strong>الطلب قيد المراجعة:</strong> يرجى الانتظار، سوف يتم التأكيد على طلبك بعد 24 إلى 48 ساعة كحد أقصى. سيتم إرسال إشعار القبول الرسمي عبر الواتساب أو البريد الإلكتروني.
                      </p>
                    </div>
                  )}

                  {isWaitlist && (
                    <div className="p-4 rounded-xl bg-[#070913] border border-cyan-500/30 space-y-2">
                      <p className="text-xs sm:text-sm text-cyan-200 leading-relaxed">
                        📋 <strong>في قائمة الانتظار (مسار الـ 50%):</strong> طلبك محفوظ بنجاح، ويمكنك التواصل مع الإدارة لاستكمال التوثيق بنسبة 100% لتسريع التعيين الفوري.
                      </p>
                    </div>
                  )}

                  {/* CRITICAL USER REQUIREMENT: If the account is BANNED or REJECTED permanently, show official management negotiation numbers! */}
                  {(isBanned || isRejected) && (
                    <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/60 space-y-4">
                      <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>تنبيه رسمي: تم رفض الحساب أو حظره نهائياً من الإدارة</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        في حال كنت تعتقد أن هذا القرار تم عن طريق الخطأ، أو ترغب في التفاوض وحل مشكلتك مع الإدارة العليا، يمكنك التواصل المباشر مع أرقام الإدارة الرسمية المعتمدة أدناه للتفاوض وإعادة مراجعة ملفك:
                      </p>

                      {/* Official Management Contact Numbers for Negotiation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {contactChannels.map((channel) => (
                          <div
                            key={channel.id}
                            className="p-3.5 rounded-xl bg-[#070913] border border-rose-500/30 flex items-center justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <span className="text-[11px] font-bold text-white block">{channel.labelAr}</span>
                              <span className="text-xs font-mono-num text-amber-400 font-bold" dir="ltr">
                                {channel.value}
                              </span>
                            </div>
                            {channel.type === 'whatsapp' ? (
                              <a
                                href={`https://wa.me/${channel.value.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `مرحباً إدارة Vibers V العليا، أود التفاوض بخصوص طلبي المحظور برقم الكود: ${app.id} (${app.realFullName})`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>واتساب</span>
                              </a>
                            ) : (
                              <a
                                href={`mailto:${channel.value}?subject=${encodeURIComponent(
                                  `طلب تفاوض وإعادة نظر بشأن الكود المحظور ${app.id}`
                                )}`}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <span>بريد</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Direct Ticket button */}
                      {onOpenSupportModal && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenSupportModal(app.id);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>فتح تذكرة استئناف وشكوى مباشرة داخل الموقع للإدارة</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Contact Reminder */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>دعم واستفسارات المتقدمين: المدير العام عيون Prince</span>
          {primaryWhatsapp && (
            <a
              href={`https://wa.me/${primaryWhatsapp.value.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب الإدارة المباشر: {primaryWhatsapp.value}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
