import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { EliteLogo } from '@/components/common/EliteLogo';
import { ThemeLanguageToggle } from '@/components/common/ThemeLanguageToggle';
import { useTranslation } from 'react-i18next';

// ──────────────────────────────────────────────────────────────────────────────
// FloatingLabel Input
// ──────────────────────────────────────────────────────────────────────────────
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}
const FloatingInput: React.FC<FloatingInputProps> = ({ label, id, ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = String(props.value || '').length > 0;
  const lifted = focused || hasValue;

  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full pt-6 pb-2.5 px-4 rounded-xl bg-muted/40 border transition-all font-outfit text-foreground placeholder-transparent focus:outline-none peer ${
          focused
            ? 'border-purple-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]'
            : 'border-border hover:border-foreground/20'
        } ${props.className ?? ''}`}
        placeholder={label}
        aria-label={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 font-outfit transition-all duration-200 pointer-events-none ${
          lifted
            ? 'top-2 text-xs md:text-sm font-semibold tracking-widest uppercase text-purple-400'
            : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Login Page
// ──────────────────────────────────────────────────────────────────────────────
const Login: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUp) {
      const { error } = await signUpWithUsername(username, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg(t('auth.account_created'));
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error } = await signInWithUsername(username, password);
      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen bg-transparent flex items-center justify-center p-4 font-outfit relative overflow-hidden ${isRTL ? 'rtl font-alexandria' : ''}`} dir={i18n.dir()}>
      
      {/* Top Controls */}
      <div className={`absolute top-6 z-50 ${isRTL ? 'left-6' : 'right-6'}`}>
        <ThemeLanguageToggle />
      </div>
      {/* ── Dynamic ambient glow ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-500"
        style={{
          background: `radial-gradient(700px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.05), rgba(34,211,238,0.03), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Floating ambient orbs ── */}
      <div
        className="pointer-events-none fixed -top-1/4 -left-1/4 w-[60vmax] h-[60vmax] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 50%)',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-1/4 -right-1/4 w-[50vmax] h-[50vmax] rounded-full animate-float-delayed"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 50%)',
          willChange: 'transform'
        }}
        aria-hidden="true"
      />

      {/* ── Login Card ── */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      >
        <div
          className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{
            background: 'var(--card)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-hover)',
          }}
        >
          {/* Card top shine */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(34,211,238,0.3), transparent)',
            }}
            aria-hidden="true"
          />

          {/* ── Brand Header ── */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="relative mb-4"
              animate={{
                filter: ['drop-shadow(0 0 12px rgba(139,92,246,0.5))', 'drop-shadow(0 0 20px rgba(34,211,238,0.4))', 'drop-shadow(0 0 12px rgba(139,92,246,0.5))'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <EliteLogo className="w-12 h-12" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <h1 className={`text-2xl font-bold text-foreground tracking-tight ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                  {isSignUp ? t('auth.create_account') : t('auth.welcome_back')}
                </h1>
                <p className={`text-muted-foreground text-xs mt-1.5 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                  {isSignUp ? t('auth.join_community') : t('auth.signin_dashboard')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center font-medium overflow-hidden"
                  role="alert"
                >
                  {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center font-medium overflow-hidden"
                  role="status"
                >
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              id="username"
              label={t('auth.username')}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <FloatingInput
              id="password"
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-border bg-muted/20 text-purple-600 focus:ring-purple-500/20"
                    aria-label={t('auth.remember_me')}
                  />
                  {t('auth.remember_me')}
                </label>
                <a
                  href="#"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors font-semibold"
                  data-cursor-color="violet"
                >
                  {t('auth.forgot_password')}
                </a>
              </div>
            )}

            {/* Submit button — gradient shimmer */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #22D3EE 100%)',
                backgroundSize: '200% 100%',
                backgroundPosition: loading ? '100% 0' : '0% 0',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(139,92,246,0.35)',
                transition: 'background-position 0.5s ease, box-shadow 0.3s ease',
              }}
              data-cursor-text={loading ? '' : isSignUp ? t('auth.sign_up') : t('auth.sign_in')}
              aria-busy={loading}
            >
              {/* Shimmer overlay */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: loading ? 'none' : 'shimmer-sweep 2s linear infinite',
                }}
                aria-hidden="true"
              />
              <span className={`relative z-10 tracking-wide ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
                {loading
                  ? (isSignUp ? t('auth.creating_account') : t('auth.signing_in'))
                  : (isSignUp ? t('auth.create_account') : t('auth.sign_in'))}
              </span>
            </button>

          </form>

          {/* ── Sign Up Toggle & Back to Main ── */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className={`text-sm text-muted-foreground ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
              {isSignUp ? t('auth.already_have_account') : t('auth.dont_have_account')}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-semibold transition-colors focus:outline-none focus:underline"
                data-cursor-color="violet"
              >
                {isSignUp ? t('auth.sign_in') : t('auth.sign_up')}
              </button>
            </p>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              {t('auth.back_to_main', 'Back to Main')}
            </button>
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className={`text-center text-xs md:text-sm text-muted-foreground mt-5 ${isRTL ? 'font-alexandria' : 'font-jetbrains'}`}>
          {t('auth.built_in_iraq')}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

