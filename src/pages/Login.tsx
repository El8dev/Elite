import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { EliteLogo } from '@/components/common/EliteLogo';

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
        className={`w-full pt-6 pb-2.5 px-4 rounded-xl bg-white/[0.04] border transition-all font-outfit text-white placeholder-transparent focus:outline-none peer ${
          focused
            ? 'border-purple-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]'
            : 'border-white/10 hover:border-white/20'
        } ${props.className ?? ''}`}
        placeholder={label}
        aria-label={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 font-outfit transition-all duration-200 pointer-events-none ${
          lifted
            ? 'top-2 text-xs md:text-sm font-semibold tracking-widest uppercase text-purple-400/80'
            : 'top-1/2 -translate-y-1/2 text-sm text-white/35'
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
        setSuccessMsg('Account created! You can now sign in.');
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-outfit relative overflow-hidden">
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
          background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-1/4 -right-1/4 w-[50vmax] h-[50vmax] rounded-full animate-float-delayed"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.05), transparent 65%)',
          filter: 'blur(70px)',
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
            background: 'rgba(12,12,14,0.7)',
            backdropFilter: 'blur(32px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.065)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 64px rgba(0,0,0,0.65)',
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
                <h1 className="text-2xl font-bold text-white tracking-tight font-outfit">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-white/35 text-xs mt-1.5 font-outfit">
                  {isSignUp
                    ? 'Join the Elite engineering community'
                    : 'Sign in to your el8.dev dashboard'}
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
                  className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center font-medium overflow-hidden"
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
                  className="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center font-medium overflow-hidden"
                  role="status"
                >
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <FloatingInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-white/35 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500/20"
                    aria-label="Remember me"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                  data-cursor-color="violet"
                >
                  Forgot password?
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
              data-cursor-text={loading ? '' : isSignUp ? 'SIGN UP' : 'SIGN IN'}
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
              <span className="relative z-10 font-outfit tracking-wide">
                {loading
                  ? (isSignUp ? 'Creating Account…' : 'Signing In…')
                  : (isSignUp ? 'Create Account' : 'Sign In')}
              </span>
            </button>

            {/* Toggle mode */}
            <div className="text-center pt-3 border-t border-white/[0.05] mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-white/35 hover:text-white/70 transition-colors font-outfit"
                data-cursor-color="violet"
              >
                {isSignUp
                  ? 'Already have an account? '
                  : "Don't have an account? "}
                <span className="text-purple-400 font-semibold hover:text-purple-300">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-xs md:text-sm text-white/20 mt-5 font-jetbrains">
          el8.dev · Elite Tech IQ · بنيت في العراق
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
