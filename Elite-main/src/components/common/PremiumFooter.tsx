import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Github, MessageSquare, Facebook, ArrowLeft, Shield, Instagram } from 'lucide-react';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { useTranslation } from 'react-i18next';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.39-2.9 5.67-1.55 1.13-3.6 1.48-5.46 1.05-1.92-.44-3.56-1.74-4.44-3.51-.78-1.57-.92-3.41-.38-5.11.53-1.68 1.83-3.1 3.44-3.83 1.5-.68 3.25-.8 4.8-.46.03 1.34.02 2.68.03 4.02-1.07-.46-2.39-.41-3.4.24-.91.59-1.4 1.62-1.39 2.7.01 1.05.51 2.06 1.36 2.67.87.62 2.06.74 3.09.31.95-.4 1.66-1.28 1.84-2.31.08-.43.1-.88.09-1.32-.05-5.32-.02-10.64-.04-15.96z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.188-.61-.6.126-.89l10.814-4.17c.5-.188.937.108.846.858z" />
  </svg>
);
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
import { ContactAgencyModal } from '@/features/landing/components/ContactAgencyModal';
import { ClientTrackerModal } from '@/features/projects/components/ClientTrackerModal';

export const PremiumFooter: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const { playHoverTick } = useCinematicSound();

  return (
    <>
    <footer className="relative w-full bg-transparent pt-16 pb-8 overflow-hidden z-20 font-outfit">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6 mb-16">
          
          {/* Brand Column Card */}
          <div className={`rounded-2xl bg-card border border-border/50 p-6 md:p-8 backdrop-blur-md hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <h3 
                className="text-2xl font-bold tracking-widest text-foreground mb-4 select-none font-outfit"
              >
                ELITE
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {t('footer.brand_desc')}
              </p>
              <div className="flex flex-col gap-3 mb-8">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
                  className={`w-full max-w-sm flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 hover:border-purple-500 transition-all text-sm`}
                >
                  {t('footer.start_project')} {i18n.language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4 rotate-180" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
              <a href="https://instagram.com/el8dev" target="_blank" rel="noopener noreferrer" onMouseEnter={() => { if (playHoverTick) playHoverTick(); }} className="w-9 h-9 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-border/40" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://github.com/el8dev" target="_blank" rel="noopener noreferrer" onMouseEnter={() => { if (playHoverTick) playHoverTick(); }} className="w-9 h-9 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-border/40" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://t.me/el8dev" target="_blank" rel="noopener noreferrer" onMouseEnter={() => { if (playHoverTick) playHoverTick(); }} className="w-9 h-9 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-border/40" aria-label="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com/@el8.dev" target="_blank" rel="noopener noreferrer" onMouseEnter={() => { if (playHoverTick) playHoverTick(); }} className="w-9 h-9 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-border/40" aria-label="TikTok">
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>


        </div>

        <div className={`border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}>
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
    <ContactAgencyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <ClientTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </>
  );
};
