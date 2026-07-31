import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, Smartphone, Database, Check, Calculator, Clock, Cpu, ShoppingCart, Layout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getProjectTypes = (t: any) => [
  { id: 'web', title: t('cost_estimator.types.web'), icon: <Monitor className="w-6 h-6" />, basePrice: 2000 },
  { id: 'app', title: t('cost_estimator.types.app'), icon: <Smartphone className="w-6 h-6" />, basePrice: 4000 },
  { id: 'system', title: t('cost_estimator.types.system'), icon: <Database className="w-6 h-6" />, basePrice: 6000 },
];

const getFeatures = (t: any) => [
  { id: 'ecommerce', title: t('cost_estimator.features_list.ecommerce'), icon: <ShoppingCart className="w-5 h-5" />, price: 1500 },
  { id: 'ai', title: t('cost_estimator.features_list.ai'), icon: <Cpu className="w-5 h-5" />, price: 2500 },
  { id: 'dashboard', title: t('cost_estimator.features_list.dashboard'), icon: <Layout className="w-5 h-5" />, price: 1000 },
];

const getTimelines = (t: any) => [
  { id: 'relaxed', title: t('cost_estimator.timelines.relaxed'), multiplier: 1 },
  { id: 'normal', title: t('cost_estimator.timelines.normal'), multiplier: 1.2 },
  { id: 'urgent', title: t('cost_estimator.timelines.urgent'), multiplier: 1.5 },
];

export const CostEstimator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const PROJECT_TYPES = getProjectTypes(t);
  const FEATURES = getFeatures(t);
  const TIMELINES = getTimelines(t);

  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0].id);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[1].id);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    // Calculate cost
    const type = PROJECT_TYPES.find(t => t.id === selectedType);
    let total = type ? type.basePrice : 0;

    selectedFeatures.forEach(fId => {
      const feature = FEATURES.find(f => f.id === fId);
      if (feature) total += feature.price;
    });

    const timeline = TIMELINES.find(t => t.id === selectedTimeline);
    if (timeline) total = total * timeline.multiplier;

    setEstimatedCost(Math.round(total));
  }, [selectedType, selectedFeatures, selectedTimeline, PROJECT_TYPES, FEATURES, TIMELINES]);

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative w-full py-24 bg-black z-10 font-outfit overflow-hidden" id="estimator">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0a0a0c] to-[#030303] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16" dir={i18n.dir()}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-5xl font-bold text-white mb-4 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
          >
            {t('cost_estimator.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{t('cost_estimator.title2')}</span>
          </motion.h2>
          <p className={`text-white/50 max-w-xl mx-auto text-sm md:text-base ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
            {t('cost_estimator.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir={i18n.dir()}>
          
          {/* Options Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Project Type */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className={`text-lg font-bold text-white mb-4 flex items-center gap-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                <span className="flex items-center justify-center w-6 h-6 rounded bg-purple-500/20 text-purple-400 text-xs">1</span> 
                {t('cost_estimator.project_type')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PROJECT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 font-alexandria ${
                      selectedType === type.id 
                        ? 'bg-purple-500/10 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <div className={`mb-3 ${selectedType === type.id ? 'text-purple-400' : 'text-white/40'}`}>
                      {type.icon}
                    </div>
                    <span className="text-sm font-semibold">{type.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h3 className={`text-lg font-bold text-white mb-4 flex items-center gap-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 text-xs">2</span> 
                {t('cost_estimator.features')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {FEATURES.map(feature => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 font-alexandria text-right ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-white/20'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{feature.title}</span>
                        <span className="text-xs opacity-60">+{feature.price}$</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className={`text-lg font-bold text-white mb-4 flex items-center gap-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                <span className="flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 text-xs">3</span> 
                {t('cost_estimator.timeline')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIMELINES.map(timeline => (
                  <button
                    key={timeline.id}
                    onClick={() => setSelectedTimeline(timeline.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 font-alexandria text-right ${
                      selectedTimeline === timeline.id 
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.2)]' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    <Clock className={`w-5 h-5 ${selectedTimeline === timeline.id ? 'text-emerald-400' : 'text-white/40'}`} />
                    <span className="text-sm font-semibold">{timeline.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Result Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 w-full bg-[#09090b] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
              
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Calculator className="w-8 h-8 text-white/80" />
              </div>
              
              <h4 className={`text-sm font-bold text-white/60 mb-2 uppercase tracking-wider ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {t('cost_estimator.est_cost')}
              </h4>
              
              <div className="flex items-start justify-center gap-1 mb-8" dir="ltr">
                <span className="text-2xl text-cyan-400 mt-2 font-jetbrains">$</span>
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={estimatedCost}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 font-jetbrains"
                  >
                    {estimatedCost.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />
              
              <p className={`text-xs text-white/40 mb-8 leading-relaxed ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {t('cost_estimator.disclaimer')}
              </p>

              <button className={`w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-purple-400 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {t('cost_estimator.request_quote')}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
