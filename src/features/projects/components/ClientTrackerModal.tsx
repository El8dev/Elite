import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Circle, ArrowRight, ShieldCheck, FileText, Code2, Rocket } from 'lucide-react';

interface ClientTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, title: 'تحليل المتطلبات', icon: <FileText className="w-5 h-5" />, status: 'completed', date: '01 يوليو' },
  { id: 2, title: 'تصميم الواجهات (UI/UX)', icon: <CheckCircle className="w-5 h-5" />, status: 'completed', date: '10 يوليو' },
  { id: 3, title: 'تطوير البرمجيات (Coding)', icon: <Code2 className="w-5 h-5" />, status: 'current', date: 'جاري العمل' },
  { id: 4, title: 'الفحص الأمني والجودة', icon: <ShieldCheck className="w-5 h-5" />, status: 'pending', date: 'المرحلة القادمة' },
  { id: 5, title: 'الإطلاق الرسمي', icon: <Rocket className="w-5 h-5" />, status: 'pending', date: 'متوقع في أغسطس' }
];

export const ClientTrackerModal: React.FC<ClientTrackerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'files'>('timeline');

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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col h-[80vh] md:h-auto max-h-[800px]"
              dir="rtl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1 font-alexandria flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    بوابة العملاء
                  </h2>
                  <p className="text-sm text-white/50 font-alexandria">لوحة تحكم مشروع: "منصة ألفا الإلكترونية"</p>
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
                  className={`py-4 px-4 text-sm font-semibold transition-colors border-b-2 font-alexandria ${activeTab === 'timeline' ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                  الخط الزمني (Timeline)
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`py-4 px-4 text-sm font-semibold transition-colors border-b-2 font-alexandria ${activeTab === 'files' ? 'border-purple-500 text-purple-400' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                  الملفات والمرفقات
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-transparent to-purple-900/5">
                
                {activeTab === 'timeline' && (
                  <div className="space-y-8 relative">
                    <div className="absolute top-4 bottom-4 right-[23px] w-0.5 bg-white/10" />

                    {STEPS.map((step, idx) => (
                      <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative flex gap-6"
                      >
                        {/* Step Icon */}
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 bg-[#09090b] ${
                          step.status === 'completed' ? 'border-emerald-500 text-emerald-400' :
                          step.status === 'current' ? 'border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
                          'border-white/10 text-white/20'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.icon}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-base font-bold font-alexandria ${step.status === 'pending' ? 'text-white/40' : 'text-white'}`}>
                              {step.title}
                            </h3>
                            <span className="text-xs text-white/40 font-alexandria bg-white/5 px-2 py-1 rounded">
                              {step.date}
                            </span>
                          </div>
                          
                          {step.status === 'current' && (
                            <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                              <p className="text-sm text-purple-200/70 font-alexandria mb-3 leading-relaxed">
                                فريق المطورين يعمل حالياً على برمجة الواجهات الخلفية (Backend) وتجهيز قواعد البيانات وربطها مع تصميمات الـ UI/UX.
                              </p>
                              <div className="flex items-center justify-between text-xs text-purple-300 font-jetbrains mb-1">
                                <span>Progress</span>
                                <span>65%</span>
                              </div>
                              <div className="w-full h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
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
                    <h3 className="text-lg font-bold text-white/50 font-alexandria mb-2">لا توجد ملفات حالياً</h3>
                    <p className="text-sm text-white/30 font-alexandria">سيتم إضافة روابط التصميمات ومسودات العقود هنا.</p>
                  </div>
                )}
              </div>
              
              {/* Footer CTA */}
              <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center">
                <button 
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-alexandria text-sm"
                >
                  رجوع
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-alexandria text-sm">
                  التواصل مع مدير المشروع
                </button>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
