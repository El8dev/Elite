import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle, ArrowRight, ShieldCheck, FileText, Code2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ClientTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS_KEYS = [
  { id: 1, titleKey: 'step1_title', icon: <FileText className="w-5 h-5" />, status: 'completed', dateKey: 'step1_date' },
  { id: 2, titleKey: 'step2_title', icon: <CheckCircle className="w-5 h-5" />, status: 'completed', dateKey: 'step2_date' },
  { id: 3, titleKey: 'step3_title', icon: <Code2 className="w-5 h-5" />, status: 'current', dateKey: 'step3_date' },
  { id: 4, titleKey: 'step4_title', icon: <ShieldCheck className="w-5 h-5" />, status: 'pending', dateKey: 'step4_date' },
  { id: 5, titleKey: 'step5_title', icon: <Rocket className="w-5 h-5" />, status: 'pending', dateKey: 'step5_date' }
];

export const ClientTrackerModal: React.FC<ClientTrackerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'files'>('timeline');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
              <div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col h-[80vh] md:h-auto max-h-[800px]"
              dir={i18n.dir()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold text-white mb-1 flex items-center gap-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t('client_tracker.title')}
                  </h2>
                  <p className={`text-sm text-white/50 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{t('client_tracker.subtitle')}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5 px-6">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`py-4 px-4 text-sm font-semibold transition-colors border-b-2 ${isRTL ? 'font-alexandria' : 'font-outfit'} ${activeTab === 'timeline' ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                  {t('client_tracker.timeline')}
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`py-4 px-4 text-sm font-semibold transition-colors border-b-2 ${isRTL ? 'font-alexandria' : 'font-outfit'} ${activeTab === 'files' ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                  {t('client_tracker.files')}
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-transparent to-purple-900/5">
                
                {activeTab === 'timeline' && (
                  <div className="space-y-8 relative">
                    <div className={`absolute top-4 bottom-4 ${isRTL ? 'right-[23px]' : 'left-[23px]'} w-0.5 bg-white/10`} />

                    {STEPS_KEYS.map((step, idx) => (
                      <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative flex gap-6"
                      >
                        {/* Step Icon */}
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-[#09090b] shrink-0 ${
                          step.status === 'completed' ? 'border-emerald-500 text-emerald-400' :
                          step.status === 'current' ? 'border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
                          'border-white/10 text-white/20'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.icon}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-base font-bold ${isRTL ? 'font-alexandria' : 'font-outfit'} ${step.status === 'pending' ? 'text-white/40' : 'text-white'}`}>
                              {t(`client_tracker.${step.titleKey}`)}
                            </h3>
                            <span className={`text-xs text-white/40 ${isRTL ? 'font-alexandria' : 'font-outfit'} bg-white/5 px-2 py-1 rounded`}>
                              {t(`client_tracker.${step.dateKey}`)}
                            </span>
                          </div>
                          
                          {step.status === 'current' && (
                            <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                              <p className={`text-sm text-purple-200/70 ${isRTL ? 'font-alexandria' : 'font-outfit'} mb-3 leading-relaxed`}>
                                {t('client_tracker.dev_note')}
                              </p>
                              <div className="flex items-center justify-between text-xs text-purple-300 font-jetbrains mb-1">
                                <span>{t('client_tracker.progress')}</span>
                                <span>65%</span>
                              </div>
                              <div className="w-full h-1.5 bg-purple-900/50 rounded-full overflow-hidden" dir="ltr">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '65%' }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-purple-500 rounded-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <FileText className="w-12 h-12 text-white/20 mb-4" />
                    <h3 className={`text-lg font-bold text-white/50 ${isRTL ? 'font-alexandria' : 'font-outfit'} mb-2`}>{t('client_tracker.no_files')}</h3>
                    <p className={`text-sm text-white/30 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>{t('client_tracker.no_files_desc')}</p>
                  </div>
                )}
              </div>
              
              {/* Footer CTA */}
              <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center">
                <button 
                  onClick={onClose}
                  className={`flex items-center gap-2 px-6 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
                >
                  {t('client_tracker.back')}
                </button>
                <button className={`flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                  {t('client_tracker.contact_manager')}
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
