import React, { useState } from 'react';
import {
  Phone,
  X,
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { ContactChannel } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactChannels: ContactChannel[];
  onOpenSupportModal?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactChannels,
  onOpenSupportModal
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="أرقام الواتساب المعتمدة وقنوات التواصل الرسمية"
    >
      <div className="w-full max-w-xl bg-[#0F1424] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                أرقام الواتساب المثبتة وقنوات التواصل الرسمية
              </h3>
              <p className="text-xs text-slate-400">
                قنوات معتمدة رسمياً ومحدثة من لوحة تحكم المسؤول (Vibers V Global)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels List */}
        <div className="space-y-4">
          {contactChannels.map((channel) => {
            const isWhatsapp = channel.type === 'whatsapp';
            const isEmail = channel.type === 'email';

            return (
              <div
                key={channel.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  channel.isPrimary
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-[#070913] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{channel.labelAr}</span>
                      {channel.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          الخط الرئيسي المباشر
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{channel.descriptionAr}</p>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {isWhatsapp ? (
                      <Phone className="w-4 h-4 text-emerald-400" />
                    ) : isEmail ? (
                      <Mail className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Phone className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 bg-[#0F1424] px-4 py-2.5 rounded-xl border border-slate-800">
                  <span className="text-sm font-mono-num font-bold text-amber-300" dir="ltr">
                    {channel.value}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(channel.id, channel.value)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                      title="نسخ الرقم أو البريد"
                    >
                      {copiedId === channel.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">نسخ</span>
                        </>
                      )}
                    </button>

                    {isWhatsapp ? (
                      <a
                        href={`https://wa.me/${channel.value.replace(/\D/g, '')}?text=${encodeURIComponent(
                          'مرحباً إدارة Vibers V العالمية، أتواصل معكم بخصوص استفسارات الانضمام وخدمات المنظومة.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>محادثة واتساب</span>
                      </a>
                    ) : isEmail ? (
                      <a
                        href={`mailto:${channel.value}?subject=${encodeURIComponent(
                          'استفسار رسمي إلى إدارة Vibers V العالمية'
                        )}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>إرسال بريد</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* In-Platform Support Alternative */}
        {onOpenSupportModal && (
          <div className="p-4 rounded-2xl bg-[#070913] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-right w-full sm:w-auto">
              <span className="text-xs font-bold text-white block">هل تواجه مشكلة أو ترغب في إرسال شكوى؟</span>
              <p className="text-[11px] text-slate-400">
                يمكنك أيضاً مراسلة الإدارة عبر نافذة الدردشة والدعم الداخلي.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSupportModal();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال طلب / شكوى داخلية</span>
            </button>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-slate-500">
          إشراف وإدارة المدير العام والمدير التنفيذي: <strong className="text-amber-400">عيون Prince</strong>
        </div>
      </div>
    </div>
  );
};
