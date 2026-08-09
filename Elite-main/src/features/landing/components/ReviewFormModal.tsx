import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitReview, SocialLink } from '@/features/reviews/services/reviews.service';
import { supabase } from '@/lib/supabase';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: 'whatsapp', url: '' }]);

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: 'whatsapp', url: '' }]);
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let avatarUrl = '';
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('review_images')
          .upload(fileName, avatarFile);
          
        if (uploadError) {
          console.error("Upload error", uploadError);
        } else if (data) {
          const { data: publicUrlData } = supabase.storage
            .from('review_images')
            .getPublicUrl(fileName);
          avatarUrl = publicUrlData.publicUrl;
        }
      }

      await submitReview({
        name,
        review_text: reviewText,
        avatar_url: avatarUrl,
        social_links: socialLinks.filter(l => l.url.trim() !== '')
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // Reset form
        setName('');
        setReviewText('');
        setAvatarFile(null);
        setSocialLinks([{ platform: 'whatsapp', url: '' }]);
        onClose();
      }, 3000);
    } catch (error) {
       console.error("Submit error", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10 pointer-events-auto relative my-8"
              dir={i18n.dir()}
            >
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

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
                    <h3 className={`text-2xl font-bold text-white mb-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'شكراً لك!' : 'Thank you!'}</h3>
                    <p className={`text-white/50 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'تم إرسال مراجعتك بنجاح، وستظهر بعد موافقة الإدارة.' : 'Your review was submitted successfully and will appear after admin approval.'}</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'اترك مراجعة' : 'Leave a Review'}</h2>
                      <p className={`text-sm text-white/50 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'شاركنا رأيك في خدماتنا' : 'Share your feedback with us'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold text-white/70 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'الاسم' : 'Name'}</label>
                        <input value={name} onChange={e => setName(e.target.value)} required type="text" className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm ${isRTL ? 'font-alexandria' : 'font-outfit'}`} placeholder={isRTL ? 'اسمك الكريم' : 'Your name'} />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold text-white/70 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'الصورة الشخصية (اختياري)' : 'Profile Picture (Optional)'}</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 border-dashed rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                            <Upload className="w-4 h-4 text-white/50 mr-2" />
                            <span className="text-sm text-white/70">{avatarFile ? avatarFile.name : (isRTL ? 'اختر صورة...' : 'Choose image...')}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold text-white/70 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'حسابات التواصل' : 'Social Links'}</label>
                        {socialLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <select 
                              value={link.platform} 
                              onChange={e => handleSocialLinkChange(index, 'platform', e.target.value)}
                              className={`bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 text-sm ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
                            >
                              <option className="bg-[#0a0a0c]" value="whatsapp">Whatsapp</option>
                              <option className="bg-[#0a0a0c]" value="telegram">Telegram</option>
                              <option className="bg-[#0a0a0c]" value="linkedin">LinkedIn</option>
                              <option className="bg-[#0a0a0c]" value="instagram">Instagram</option>
                              <option className="bg-[#0a0a0c]" value="facebook">Facebook</option>
                              <option className="bg-[#0a0a0c]" value="phone">Phone</option>
                            </select>
                            <input 
                              type="text" 
                              value={link.url}
                              onChange={e => handleSocialLinkChange(index, 'url', e.target.value)}
                              className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 text-sm ${isRTL ? 'font-alexandria' : 'font-outfit'}`} 
                              placeholder={isRTL ? 'الرابط أو الرقم...' : 'Link or Number...'} 
                            />
                            {socialLinks.length > 1 && (
                              <button type="button" onClick={() => handleRemoveSocialLink(index)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={handleAddSocialLink} className="text-xs text-purple-400 hover:text-purple-300">
                          {isRTL ? '+ إضافة حساب آخر' : '+ Add another link'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-xs font-semibold text-white/70 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{isRTL ? 'المراجعة' : 'Review Text'}</label>
                        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm resize-none ${isRTL ? 'font-alexandria' : 'font-outfit'}`} placeholder={isRTL ? 'اكتب رأيك هنا...' : 'Write your feedback here...'} />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 mt-4 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
                      >
                        {isSubmitting ? (
                          <span className="animate-pulse">{isRTL ? 'جاري الإرسال...' : 'Sending...'}</span>
                        ) : (
                          <>
                            {isRTL ? 'إرسال المراجعة' : 'Submit Review'} <Send className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
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
