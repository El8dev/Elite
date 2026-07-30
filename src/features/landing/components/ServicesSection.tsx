import React from 'react';
import { motion } from 'motion/react';
import { Code2, MonitorSmartphone, BrainCircuit, Layout } from 'lucide-react';
import { useCinematicSound } from '@/hooks/useCinematicSound';

const services = [
  {
    id: 1,
    title: 'تطوير الويب والتطبيقات',
    description: 'نمتلك خبرة متقدمة في بناء تطبيقات حديثة ومواقع ويب متجاوبة وسريعة تضمن لك أداءً فائقاً وتجربة مستخدم لا تُنسى.',
    icon: Code2,
    color: 'from-blue-500 to-cyan-400',
    image: '/images/services/service-1.png'
  },
  {
    id: 2,
    title: 'الأنظمة الإدارية والتجارية',
    description: 'نوفر حلولاً برمجية متكاملة للشركات والمؤسسات (ERP, CRM) لتسهيل إدارة الموارد البشرية والمبيعات بكفاءة عالية.',
    icon: MonitorSmartphone,
    color: 'from-purple-500 to-pink-500',
    image: '/images/services/service-3.png'
  },
  {
    id: 3,
    title: 'تصميم تجربة وواجهة المستخدم',
    description: 'نقدم تصاميم عصرية واحترافية (UI/UX) تركز على جمالية الواجهة وسهولة الاستخدام لرفع معدلات التحويل وإرضاء عملائك.',
    icon: Layout,
    color: 'from-emerald-400 to-teal-500',
    image: '/images/services/service-2.png'
  },
  {
    id: 4,
    title: 'الذكاء الاصطناعي والبيانات',
    description: 'نوظف أحدث خوارزميات الذكاء الاصطناعي لتحليل بياناتك، وتقديم تنبؤات وحلول ذكية تدعم اتخاذ القرارات لشركتك.',
    icon: BrainCircuit,
    color: 'from-orange-400 to-rose-400',
    image: '/images/services/service-5.png'
  }
];

export const ServicesSection: React.FC = () => {
  const { playHoverTick } = useCinematicSound();

  return (
    <section className="relative w-full py-24 z-10 font-outfit" id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10" dir="rtl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-wide font-alexandria"
          >
            خدمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">النخبة</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto text-sm md:text-base font-alexandria leading-relaxed"
          >
            نقدم مجموعة متكاملة من الحلول التقنية الحديثة المصممة خصيصاً لتلبية احتياجات الشركات والأفراد لدفع عجلة الابتكار.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" dir="rtl">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
              className="group relative p-8 card-flat flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              
              <div className="w-full flex justify-center mb-8 relative z-10">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              </div>

              <div className="relative z-10 flex items-start gap-6">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} bg-opacity-10 border border-white/10 transition-transform duration-500`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 font-alexandria">{service.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-alexandria">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

