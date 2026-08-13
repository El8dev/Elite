import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Star, MessageSquareQuote, Loader2 } from 'lucide-react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

interface Review {
  id: string;
  name: string;
  rating: number;
  content: string;
  created_at: string;
}

export const CustomerReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotionPref();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('customer_reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(9); // Limit to top 9 recent approved reviews for the grid

        if (error) throw error;

        // Map data in case column names differ slightly
        const mappedReviews = (data || []).map(r => ({
          id: r.id,
          name: r.name || r.reviewer_name || 'Anonymous',
          rating: r.rating || 5,
          content: r.content || r.review || '',
          created_at: r.created_at
        }));

        setReviews(mappedReviews);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative overflow-hidden flex justify-center items-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show the section if there are no approved reviews
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6 font-alexandria">
              Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Developers</span>
            </h2>
            <p className="text-lg text-muted-foreground font-alexandria">
              See what our community has to say about their experience.
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              whileHover={reduceMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
              className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <MessageSquareQuote size={40} className="text-primary/10 absolute top-6 right-6 -z-10 group-hover:scale-110 transition-transform duration-300" />
              
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-muted text-muted'} drop-shadow-sm`} 
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow font-alexandria italic">
                "{review.content}"
              </p>
              
              <div className="flex items-center mt-auto border-t border-border/50 pt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-foreground font-alexandria text-sm">{review.name}</h4>
                  <p className="text-xs text-muted-foreground">Verified User</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
