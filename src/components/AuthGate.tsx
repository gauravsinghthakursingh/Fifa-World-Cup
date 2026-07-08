import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Shield, Globe } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  auth 
} from '../firebase';

interface AuthGateProps {
  onAuthenticated: (user: any) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill out all credentials.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthenticated(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthenticated(userCredential.user);
      }
    } catch (err: any) {
      console.error("Authentication Error:", err);
      // Clean up common error messages for user readability
      let friendlyMessage = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password must be stronger (at least 6 characters).';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      onAuthenticated(user);
    } catch (err: any) {
      console.error("Google SSO Error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Single-Sign-On failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#050A1A] flex items-center justify-center p-4 relative overflow-hidden"
      role="dialog"
      aria-labelledby="auth-title"
      aria-describedby="auth-subtitle"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00FF41_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#08122A] border-2 border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
        
        {/* StadiumOS Brand Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="bg-[#00FF41] text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-sm">
              FIFA WORLD CUP 2026
            </span>
          </div>
          <h1 id="auth-title" className="text-4xl font-black tracking-tighter uppercase leading-none text-white">
            STADIUM<span className="text-[#00FF41]">OS</span>
          </h1>
          <p id="auth-subtitle" className="text-zinc-400 font-mono text-[10px] uppercase tracking-wide mt-1">
            Operations & Multilingual Fan Support Gate
          </p>
        </div>

        {/* Error Notification Block */}
        {error && (
          <div 
            className="mb-4 bg-red-950/40 border border-red-500/50 p-3 rounded-lg text-xs text-red-400 font-mono flex items-start gap-2 animate-fadeIn"
            role="alert"
            aria-live="assertive"
          >
            <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1 font-bold">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500">
                <Mail className="w-4 h-4" aria-hidden="true" />
              </span>
              <input 
                id="auth-email"
                type="email" 
                placeholder="operator@stadiumos.fifa.com" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-black/60 border border-white/15 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1 font-bold">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-zinc-500">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </span>
              <input 
                id="auth-password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-black/60 border border-white/15 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                disabled={loading}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="animate-fadeIn">
              <label htmlFor="auth-confirm-password" className="block text-[10px] text-zinc-400 uppercase font-mono mb-1 font-bold">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </span>
                <input 
                  id="auth-confirm-password"
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full bg-black/60 border border-white/15 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                  disabled={loading}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#00FF41] hover:bg-[#00e037] text-black font-black uppercase text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00FF41]/10 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FF41]"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>{loading ? 'Registering...' : 'Create Account'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Divider line */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-mono">
            <span className="bg-[#08122A] px-2 text-zinc-500">Or use Secure Google SSO</span>
          </div>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
          aria-label="Sign in with your Google Account"
        >
          <Globe className="w-4 h-4 text-[#00FF41]" aria-hidden="true" />
          <span>{loading ? 'Opening Popup...' : 'Continue with Gmail / Google'}</span>
        </button>

        {/* Mode Toggle Switcher */}
        <p className="mt-5 text-center text-[11px] text-zinc-400">
          {isSignUp ? 'Already have an operations account?' : "Don't have an operations profile yet?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-[#00FF41] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF41] rounded"
          >
            {isSignUp ? 'Sign In Here' : 'Create Profile'}
          </button>
        </p>

        {/* Safety Note */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center text-[9px] font-mono text-zinc-500">
          🔒 Securing Estadio Azteca Venue Operations. Fully audited session controls active.
        </div>

      </div>
    </div>
  );
};
