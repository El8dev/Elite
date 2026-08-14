import React from 'react';
import { motion } from 'motion/react';
import { Code2, MonitorSmartphone, BrainCircuit, Layout } from 'lucide-react';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { useTranslation } from 'react-i18next';

const getServices = (t: any) => [
  {
    id: 1,
    title: t('services_section.web_dev'),
    description: t('services_section.web_dev_desc'),
    icon: Code2,
    color: 'from-blue-500 to-cyan-400',
    image: '/images/services/service-1.png'
  },
  {
    id: 2,
    title: t('services_section.business_sys'),
    description: t('services_section.business_sys_desc'),
    icon: MonitorSmartphone,
    color: 'from-purple-500 to-pink-500',
    image: '/images/services/service-3.png'
  },
  {
    id: 3,
    title: t('services_section.uiux'),
    description: t('services_section.uiux_desc'),
    icon: Layout,
    color: 'from-emerald-400 to-teal-500',
    image: '/images/services/service-2.png'
  },
  {
    id: 4,
    title: t('services_section.ai_data'),
    description: t('services_section.ai_data_desc'),
    icon: BrainCircuit,
    color: 'from-orange-400 to-rose-400',
    image: '/images/services/service-5.png'
  }
];

export const ServicesSection: React.FC = () => {
  const { playHoverTick } = useCinematicSound();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const services = getServices(t);

  return (
    <section className="relative w-full py-24 z-10 font-outfit" id="services">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10" dir={i18n.dir()}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className={`text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-wide ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
          >
            {t('services_section.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{t('services_section.title2')}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: 0.1 }}
            className={`text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
          >
            {t('services_section.subtitle')}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" dir={i18n.dir()}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
              className="group relative p-8 bg-card/40 backdrop-blur-md border border-border/50 shadow-xl shadow-primary/5 transition-all rounded-3xl flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              
              <div className="w-full flex justify-center mb-8 relative z-10">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                />
              </div>

              <div className="relative z-10 flex items-start gap-6">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} bg-opacity-10 border border-border/50 transition-transform duration-500`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <div>
                  <h3 className={`text-xl font-bold text-foreground mb-3 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{service.title}</h3>
                  <p className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
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

