import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { SupportTicket, ContactChannel } from '../types';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactChannels: ContactChannel[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  prefilledCode?: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  contactChannels,
  onSubmitTicket,
  prefilledCode = ''
}) => {
  const [userName, setUserName] = useState('');
  const [realNameOptional, setRealNameOptional] = useState('');
  const [role, setRole] = useState('متقدم / عضو');
  const [whatsappOrEmail, setWhatsappOrEmail] = useState('');
  const [trackingCode, setTrackingCode] = useState(prefilledCode);
  const [problemDescription, setProblemDescription] = useState('');
  const [reasonOrDetails, setReasonOrDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!userName.trim() || userName.trim().length < 2) {
      newErrors.userName = 'يرجى كتابة اسمك (الاسم المستخدم أو الاسم الحقيقي الثلاثي).';
    }

    if (!whatsappOrEmail.trim() || whatsappOrEmail.trim().length < 5) {
      newErrors.whatsappOrEmail = 'يرجى إدخال رقم الواتساب الخاص بك أو بريدك الإلكتروني للتواصل.';
    }

    if (!problemDescription.trim() || problemDescription.trim().length < 6) {
      newErrors.problemDescription = 'يرجى كتابة وصف المشكلة التي تواجهها بوضوح (6 أحرف على الأقل).';
    }

    if (!reasonOrDetails.trim() || reasonOrDetails.trim().length < 4) {
      newErrors.reasonOrDetails = 'يرجى إضافة سبب المشكلة أو توضيح إضافي للطلب.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    const success = await onSubmitTicket({
      trackingCode: trackingCode.trim() || `VBR-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantOrUserName: userName.trim(),
      realFullNameOptional: realNameOptional.trim() || undefined,
      role,
      whatsappOrEmail: whatsappOrEmail.trim(),
      problemDescription: problemDescription.trim(),
      reasonOrDetails: reasonOrDetails.trim()
    });

    setIsSubmitting(false);
    if (success) setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setUserName('');
    setRealNameOptional('');
    setWhatsappOrEmail('');
    setProblemDescription('');
    setReasonOrDetails('');
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="دردشة ومراسلة الإدارة العليا وإرسال الشكاوى"
    >
      <div className="w-full max-w-3xl bg-[linear-gradient(135deg,#0b1120_0%,#0f172a_55%,#0b1324_100%)] border border-cyan-500/30 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_24px_70px_rgba(14,116,144,0.22)] text-right">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">منظومة الدردشة والدعم المباشر</h3>
              <p className="text-xs text-slate-400">أرسل وصف مشكلتك أو طلبك لتصل فوراً إلى لوحة تحكم المسؤول</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-[22px] bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(147,197,253,0.06),rgba(15,23,42,0.9))] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>خدمة العملاء الرسمية للإدارة العليا قبل إرسال الطلب</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            يمكنك التواصل المباشر مع خدمة عملاء الإدارة العليا عبر أرقام الواتساب المعتمدة أو ملء النموذج أدناه ليصل طلبك إلى لوحة التحكم فوراً.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {contactChannels.map((c) => (
              <span
                key={c.id}
                className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-700 text-[11px] font-mono-num text-sky-200 flex items-center gap-1.5"
                dir="ltr"
              >
                {c.type === 'whatsapp' ? <Phone className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3 text-blue-400" />}
                <span>{c.value}</span>
              </span>
            ))}
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-[26px] bg-slate-950/80 border border-emerald-500/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">تم إرسال طلبك بنجاح إلى الإدارة العليا!</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              وصلت مشكلتك إلى لوحة تحكم المدير العام عيون Prince وفريق المشرفين، وسيتم التواصل معك عبر الواتساب أو البريد المدخل.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="primary-action px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              تم، العودة إلى الموقع
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">الاسم المستخدم أو الاسم الحقيقي <span className="text-amber-400">*</span></label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="الاسم الذي استخدمته في تسجيل الدخول أو اللقب..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {errors.userName && <p className="text-[11px] text-rose-400">{errors.userName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">الاسم الحقيقي الثلاثي <span className="text-slate-400 text-[10px]">(اختياري)</span></label>
                <input
                  type="text"
                  value={realNameOptional}
                  onChange={(e) => setRealNameOptional(e.target.value)}
                  placeholder="اختياري: اكتب اسمك الثلاثي الكامل..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">دورك في المنظومة <span className="text-amber-400">*</span></label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="متقدم جديد">متقدم جديد</option>
                  <option value="سوبر أدمن (Super Admin)">سوبر أدمن (Super Admin)</option>
                  <option value="أدمن (Admin)">أدمن (Admin)</option>
                  <option value="مطور أعمال (BD)">مطور أعمال (BD)</option>
                  <option value="وكيل شحن معتمد">وكيل شحن معتمد</option>
                  <option value="وكيل مضيفين">وكيل مضيفين</option>
                  <option value="مستخدم / زائر للموقع">مستخدم / زائر للموقع</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">رقم الواتساب أو البريد الإلكتروني <span className="text-amber-400">*</span></label>
                <input
                  type="text"
                  dir="ltr"
                  value={whatsappOrEmail}
                  onChange={(e) => setWhatsappOrEmail(e.target.value)}
                  placeholder="مثال: +966512345678 أو البريد الإلكتروني..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-num"
                />
                {errors.whatsappOrEmail && <p className="text-[11px] text-rose-400">{errors.whatsappOrEmail}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">كود الطلب الخاص بك <span className="text-slate-400 text-[10px]">(اختياري)</span></label>
              <input
                type="text"
                dir="ltr"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="مثال: app-101 أو اتركه فارغاً"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white font-mono-num placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">وصف المشكلة <span className="text-amber-400">*</span></label>
              <textarea
                rows={4}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="اكتب مشكلة أو استفسارًا واضحًا..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errors.problemDescription && <p className="text-[11px] text-rose-400">{errors.problemDescription}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">سبب المشكلة أو تفاصيل إضافية <span className="text-amber-400">*</span></label>
              <textarea
                rows={3}
                value={reasonOrDetails}
                onChange={(e) => setReasonOrDetails(e.target.value)}
                placeholder="ما الذي تحتاجه؟ هل تريد دعمًا فنيًا أو توضيحًا حول طلبك؟"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {errors.reasonOrDetails && <p className="text-[11px] text-rose-400">{errors.reasonOrDetails}</p>}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="secondary-action w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="primary-action w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
