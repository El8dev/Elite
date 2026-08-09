import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { fetchApprovedReviews, CustomerReview } from '@/features/reviews/services/reviews.service';
import { ReviewFormModal } from './ReviewFormModal';
import { MessageSquare, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export const CustomerReviewsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchApprovedReviews();
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews', error);
      }
    };
    loadReviews();
  }, []);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="relative py-24 bg-[#0a0a0c] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6"
            >
              <MessageSquare className="w-4 h-4" />
              <span className={`text-sm font-medium ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {isRTL ? 'آراء العملاء' : 'Customer Reviews'}
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`text-4xl md:text-5xl font-bold text-white mb-4 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
            >
              {isRTL ? 'ماذا يقول عملاؤنا؟' : 'What Our Clients Say?'}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all text-white flex items-center gap-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
            >
              <Star className="w-4 h-4 text-purple-400" />
              {isRTL ? 'أضف مراجعتك' : 'Add Your Review'}
            </button>
          </motion.div>
        </div>

        {reviews.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef} dir={i18n.dir()}>
              <div className="flex -ml-4" style={{ marginLeft: isRTL ? 0 : '-1rem', marginRight: isRTL ? '-1rem' : 0 }}>
                {reviews.map((review, idx) => (
                  <div key={review.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4" style={{ paddingLeft: isRTL ? 0 : '1rem', paddingRight: isRTL ? '1rem' : 0 }}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex flex-col hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex gap-1 text-purple-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      
                      <p className={`text-white/80 flex-1 mb-8 leading-relaxed ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                        "{review.review_text}"
                      </p>
                      
                      <div className="flex items-center gap-4 mt-auto">
                        {review.avatar_url ? (
                          <img src={review.avatar_url} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/20">
                            <span className="text-purple-400 font-bold text-lg">{review.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <h4 className={`text-white font-bold ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{review.name}</h4>
                          <div className="flex gap-2 mt-1">
                            {review.social_links.map((link, i) => (
                              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-purple-400 transition-colors text-xs">
                                {link.platform}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            {reviews.length > 3 && (
              <div className="flex justify-center gap-4 mt-12">
                <button onClick={scrollPrev} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                  {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
                <button onClick={scrollNext} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all">
                  {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className={`text-white/50 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
              {isRTL ? 'لا توجد مراجعات حتى الآن. كن أول من يضيف مراجعة!' : 'No reviews yet. Be the first to leave one!'}
            </p>
          </div>
        )}
      </div>

      <ReviewFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
