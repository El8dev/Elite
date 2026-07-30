import React from 'react';
import { motion } from 'motion/react';
import { Clock, User } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'كيف يغير الذكاء الاصطناعي مستقبل تطوير البرمجيات في 2026؟',
    excerpt: 'نظرة عميقة على تأثير نماذج الذكاء الاصطناعي المتقدمة في تسريع كتابة الأكواد، وتحسين جودة البرامج واكتشاف الثغرات الأمنية بشكل استباقي.',
    category: 'الذكاء الاصطناعي',
    categoryColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    date: '21 يوليو 2026',
    readTime: '5 دقائق',
    author: 'أحمد علي',
    authorAvatar: 'https://i.pravatar.cc/150?u=ahmed',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 2,
    title: 'دليل الشركات الشامل للانتقال إلى الأنظمة السحابية (Cloud ERP)',
    excerpt: 'لماذا يجب على الشركات المتوسطة والكبيرة الاستغناء عن السيرفرات المحلية والانتقال إلى الحلول السحابية الحديثة لضمان أمان وتوفر البيانات؟',
    category: 'أنظمة الأعمال',
    categoryColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    date: '15 يوليو 2026',
    readTime: '8 دقائق',
    author: 'سارة محمد',
    authorAvatar: 'https://i.pravatar.cc/150?u=sara',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450',
  },
  {
    id: 3,
    title: 'أهمية تجربة المستخدم (UI/UX) في زيادة مبيعات المتاجر الإلكترونية',
    excerpt: 'خطوات عملية لتحسين واجهات المتاجر الإلكترونية لتقليل معدلات التخلي عن السلة وزيادة ولاء العملاء والمبيعات بنسبة تصل إلى 40%.',
    category: 'UI/UX',
    categoryColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    date: '10 يوليو 2026',
    readTime: '4 دقائق',
    author: 'عمر خالد',
    authorAvatar: 'https://i.pravatar.cc/150?u=omar',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800&h=450',
  }
];

export const TechBlogSection: React.FC = () => {
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
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.2 }}
          >
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-sm font-alexandria">
              عرض جميع المقالات
              <span className="text-purple-400">&larr;</span>
            </a>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.15 }}
              className="group relative flex flex-col card-flat cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative w-full h-52 overflow-hidden bg-white/5 rounded-t-2xl">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover rounded-t-2xl transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Category Badge over image */}
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${article.categoryColor} font-alexandria`}>
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
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors duration-300 font-alexandria">
                  {article.title}
                </h3>
                
                <p className="text-sm text-white/50 leading-relaxed font-alexandria flex-1 mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Author Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <img 
                    src={article.authorAvatar} 
                    alt={article.author}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-white/80 font-semibold font-alexandria">{article.author}</span>
                    <span className="text-xs text-white/40 font-alexandria">خبير تقني</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
