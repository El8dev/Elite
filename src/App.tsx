import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import AmbientBackground from '@/components/common/AmbientBackground';
import { ParticlesBackground } from '@/components/common/ParticlesBackground';
import { FilmGrain } from '@/components/common/FilmGrain';

import CustomCursor from '@/components/common/CustomCursor';
import ScrollToTopButton from '@/components/common/ScrollToTopButton';
import { CommandMenu } from '@/components/common/CommandMenu';
import { LiveChatWidget } from '@/components/common/LiveChatWidget';
import { ContactModal } from '@/components/common/ContactModal';
import { ProjectsModal } from '@/components/common/ProjectsModal';

import { routes } from './routes';
import ProjectModalRoute from './pages/ProjectModalRoute';
import { HelmetProvider } from 'react-helmet-async';
import CinematicIntro from '@/features/landing/components/CinematicIntro';

// ── Premium page transition variants ────────────────────────────────────────
// Uses only `opacity` for 0 Paint invalidations and to prevent breaking `position: fixed` headers.
const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] as any },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: [0.25, 1, 0.5, 1] as any },
  },
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <AuthProvider>
      <RouteGuard>
        <CustomCursor />
        <ScrollToTopButton />
        {/* Fixed ambient background & particles — sits below everything */}
        <AmbientBackground />
        <ParticlesBackground />

        <FilmGrain />
        <CommandMenu />
        <LiveChatWidget />

        <IntersectObserver />

        <Suspense fallback={null}>
          <CinematicIntro>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes location={backgroundLocation || location} key={(backgroundLocation || location).pathname}>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <motion.div
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={pageVariants}
                          className="w-full min-h-screen"
                          style={{ willChange: 'opacity' }}
                        >
                          {route.element}
                        </motion.div>
                      }
                    />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>

              {/* Modal Routes */}
              {backgroundLocation && (
                <Routes>
                  <Route path="/project/:projectId" element={<ProjectModalRoute />} />
                </Routes>
              )}
            </main>
          </div>
          </CinematicIntro>
        </Suspense>

        <ContactModal />
        <ProjectsModal />
        <Toaster />
      </RouteGuard>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
};

export default App;
