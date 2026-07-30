import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, User } from 'lucide-react';
import { fetchPublicArticles, Article } from '@/features/articles/services/articles.service';



export const TechBlogSection: React.FC = () => {
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadArticles = async () => {
      try {
        const data = await fetchPublicArticles();
        if (isMounted) {
          setArticlesList(data || []);
        }
      } catch (err) {
        console.warn('Could not fetch articles from Supabase:', err);
        if (isMounted) {
          setArticlesList([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadArticles();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="relative w-full py-24 z-10 font-outfit" id="blog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 gap-4" dir="rtl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-wide font-alexandria"
          >
            المدونة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">التقنية</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl text-sm md:text-base font-alexandria leading-relaxed mb-4"
          >
            مقالات حصرية من خبراء Elite، تغطي أحدث تقنيات البرمجة، أنظمة الذكاء الاصطناعي، وتوجهات تصميم الواجهات.
          </motion.p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
                <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
                <div className="h-6 bg-white/10 rounded w-5/6 mb-2" />
                <div className="h-4 bg-white/10 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : articlesList.length === 0 ? (
          <div className="text-center text-white/50 py-12 font-alexandria">
            لا توجد مقالات متاحة حالياً.
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
            {articlesList.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col card-flat cursor-pointer rounded-2xl bg-[#09090b] border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative w-full h-52 overflow-hidden bg-white/5">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img 
                    src={article.image || article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Category Badge over image */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${article.categoryColor || article.category_color} font-alexandria`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex flex-col flex-1 p-6 relative">
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4 font-alexandria">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime || article.read_time}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors duration-300 font-alexandria line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-white/50 leading-relaxed font-alexandria flex-1 mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Author Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <img 
                      src={article.authorAvatar || article.author_avatar || 'https://i.pravatar.cc/150'} 
                      alt={article.author || article.author_name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-white/80 font-semibold font-alexandria">{article.author || article.author_name}</span>
                      <span className="text-xs text-white/40 font-alexandria">خبير تقني</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
