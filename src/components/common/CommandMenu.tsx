import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, User, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

// Inline styles for the CommandMenu overlay
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '15vh',
};

export const CommandMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const navigate = useNavigate();
  const { playHoverTick } = useCinematicSound();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch initial data for search (simple approach for demo, fetching all approved)
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [projRes, devRes] = await Promise.all([
          supabase.from('projects').select('id, title, is_masterpiece').limit(20),
          supabase.from('profiles').select('id, full_name, username').eq('account_status', 'approved').limit(20),
        ]);
        
        if (projRes.data) setProjects(projRes.data);
        if (devRes.data) setDevelopers(devRes.data);
      } catch (err) {
        console.error('Search fetch error', err);
      }
    };
    if (open && projects.length === 0) {
      fetchSearchData();
    }
  }, [open]);

  // Audio typing effect
  useEffect(() => {
    if (search.length > 0) playHoverTick();
  }, [search]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="cmd-overlay"
        style={overlayStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <motion.div
          className="w-full max-w-[600px] bg-card text-card-foreground border border-border rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <Command
            className="w-full h-full flex flex-col font-outfit"
            shouldFilter={true}
          >
            <div className={`flex items-center px-4 py-4 border-b border-border ${isRTL ? 'font-alexandria' : 'font-outfit'}`} dir={i18n.dir()}>
              <Search className={`w-5 h-5 text-muted-foreground ${isRTL ? 'ml-3' : 'mr-3'}`} />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder={t('command_menu.search_placeholder')}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-lg w-full"
                autoFocus
              />
              <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-muted-foreground/60 tracking-widest font-jetbrains">
                <span>ESC</span>
              </div>
            </div>

            <Command.List className="max-h-[350px] overflow-y-auto p-2" dir={i18n.dir()}>
              <Command.Empty className={`py-10 text-center text-sm text-muted-foreground ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {t('command_menu.no_results', { search })}
              </Command.Empty>

              <Command.Group heading={t('command_menu.approved_devs')} className={`text-xs font-semibold text-muted-foreground px-2 py-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {developers.map(dev => (
                  <Command.Item
                    key={`dev-${dev.id}`}
                    value={dev.full_name || dev.username}
                    onSelect={() => {
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl cursor-pointer hover:bg-muted text-sm text-foreground transition-colors aria-selected:bg-muted"
                    onMouseEnter={playHoverTick}
                  >
                    <User className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>{dev.full_name || dev.username}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading={t('command_menu.projects')} className={`text-xs font-semibold text-muted-foreground px-2 py-2 mt-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {projects.map(proj => (
                  <Command.Item
                    key={`proj-${proj.id}`}
                    value={proj.title}
                    onSelect={() => {
                      setOpen(false);
                      if (proj.is_masterpiece) {
                        navigate('/masterpieces');
                      } else {
                        navigate('/');
                      }
                    }}
                    className="flex items-center justify-between px-3 py-3 mt-1 rounded-xl cursor-pointer hover:bg-muted text-sm text-foreground transition-colors aria-selected:bg-muted"
                    onMouseEnter={playHoverTick}
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                      <span>{proj.title}</span>
                    </div>
                    {proj.is_masterpiece && (
                      <span className="flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded font-bold font-jetbrains">
                        <Zap className="w-3 h-3" /> MASTERPIECE
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
