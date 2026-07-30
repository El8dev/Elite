import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';

interface ContactAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactAgencyModal: React.FC<ContactAgencyModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10 pointer-events-auto relative"
              dir="rtl"
            >
              {/* Background ambient glow inside modal */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 md:p-10 relative z-10">
                
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/50">
                      <Sparkles className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-alexandria">تم إرسال طلبك بنجاح!</h3>
                    <p className="text-white/50 font-alexandria">سيتواصل معك فريقنا التقني في أقرب وقت ممكن لدراسة متطلبات مشروعك.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-alexandria">ابدأ مشروعك مع النخبة</h2>
                      <p className="text-sm text-white/50 font-alexandria">أخبرنا عن فكرتك، وسنقوم بتحويلها إلى واقع رقمي مبهر.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/70 font-alexandria">الاسم الكريم</label>
                          <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-alexandria text-sm" placeholder="محمد أحمد" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/70 font-alexandria">البريد الإلكتروني</label>
                          <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-alexandria text-sm" placeholder="email@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 font-alexandria">نوع المشروع</label>
                        <select required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-alexandria text-sm appearance-none">
                          <option value="" className="bg-[#0a0a0c]">اختر نوع المشروع...</option>
                          <option value="web" className="bg-[#0a0a0c]">تطوير موقع ويب تفاعلي</option>
                          <option value="app" className="bg-[#0a0a0c]">تطوير تطبيق هواتف ذكية</option>
                          <option value="system" className="bg-[#0a0a0c]">بناء نظام إداري (ERP/CRM)</option>
                          <option value="ai" className="bg-[#0a0a0c]">حلول الذكاء الاصطناعي</option>
                          <option value="uiux" className="bg-[#0a0a0c]">تصميم واجهات (UI/UX)</option>
                          <option value="other" className="bg-[#0a0a0c]">استشارة تقنية / أخرى</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 font-alexandria">تفاصيل الفكرة / المشروع</label>
                        <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-alexandria text-sm resize-none" placeholder="اشرح لنا فكرتك باختصار..." />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] font-alexandria disabled:opacity-50 mt-4"
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">جاري إرسال الطلب...</span>
                        ) : (
                          <>
                            إرسال طلب التسعير <Send className="w-4 h-4 mr-2" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
