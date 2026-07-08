import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Shield, Globe, LogOut, CheckCircle, Award, HelpCircle } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  logoutUser,
  auth,
  User 
} from '../firebase';

interface SideAuthPanelProps {
  user: User | null;
  onAuthenticated: (user: User) => void;
  onLogout: () => void;
}

export const SideAuthPanel: React.FC<SideAuthPanelProps> = ({ user, onAuthenticated, onLogout }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all security fields. / Kripya saari details bharein.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match. / Dono Password alag hain.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Security code must be at least 6 characters. / Password kam se kam 6 characters ka hona chahiye.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Account created successfully! / Account safalta-purvak ban gaya hai!');
        onAuthenticated(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Successfully authenticated! / Login safal raha!');
        onAuthenticated(userCredential.user);
      }
    } catch (err: any) {
      console.error("Auth panel error:", err);
      let friendlyMessage = err.message || 'Authentication failed.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'Invalid email or password. / Galat email ya password.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already in use. / Yeh email pehle se registered hai.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please input a valid email. / Kripya sahi email dalein.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Key too weak (at least 6 chars required). / Password kam se kam 6 aksaro ka rakhein.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const u = await signInWithGoogle();
      setSuccess('Authenticated with Google! / Google se log-in safal!');
      onAuthenticated(u);
    } catch (err: any) {
      console.error("Google auth error:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render Logged In state: Sleek, high-tech operator profile with easy controls
  if (user) {
    const displayName = user.displayName || user.email?.split('@')[0] || 'Operator';
    const emailStr = user.email || 'operator@stadiumos.fifa.com';

    return (
      <div 
        id="side-auth-panel"
        className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden"
        role="region"
        aria-label="Active Operator Profile"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF41]/5 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#00FF41] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" />
            Active Operator / एक्टिव ऑपरेटर
          </h3>
          <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase font-black">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            CONNECTED
          </span>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded text-[11px] text-emerald-400 font-mono leading-relaxed">
          ✅ <strong>Sahi Authentication!</strong> Aap log-in ho chuke hain. Safe command panel active hai.
        </div>

        <div className="flex items-center gap-3 bg-black/40 p-3 rounded border border-white/5">
          <div className="w-12 h-12 rounded-full bg-[#00FF41]/10 border-2 border-[#00FF41]/40 flex items-center justify-center shrink-0 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-[#00FF41] font-black text-lg capitalize">{displayName[0]}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate capitalize leading-tight">{displayName}</p>
            <p className="text-[10px] font-mono text-zinc-400 truncate leading-tight mt-0.5" title={emailStr}>{emailStr}</p>
          </div>
        </div>

        {/* Operational clearance info */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-zinc-500 uppercase text-[8px] font-bold">Clearance Level</p>
            <p className="text-white font-bold flex items-center gap-1 mt-0.5 text-[#00FF41]">
              <Award className="w-3 h-3 text-[#00FF41]" />
              L4-Commander
            </p>
          </div>
          <div className="bg-black/20 p-2 rounded border border-white/5">
            <p className="text-zinc-500 uppercase text-[8px] font-bold">Assigned Hub</p>
            <p className="text-white font-bold mt-0.5">Azteca-North</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 font-bold uppercase text-[10px] rounded transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
          aria-label="Terminate active operator session"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Log Out / लॉग आउट करें</span>
        </button>
      </div>
    );
  }

  // Render Login / Sign-up state: Side column widget
  return (
    <div 
      id="side-auth-panel"
      className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden"
      role="region"
      aria-label="Access Security Gate"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#00FF41] flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#00FF41]" aria-hidden="true" />
          Gate login / लॉगिन गेट
        </h3>
        <span className="text-[9px] font-mono text-amber-500 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase font-bold">
          Free Access
        </span>
      </div>

      {/* Helpful Hint banner to make it ultra understandable */}
      <div className="bg-blue-950/20 border border-blue-500/30 p-2.5 rounded text-[11px] text-zinc-300 leading-relaxed">
        💡 <strong>Quick Access Hint:</strong> Aap direct niche diye gaye <strong>"Continue with Google"</strong> button par click karke turant bina password ke sign-in kar sakte hain!
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-500/40 p-2.5 rounded text-[11px] font-mono text-red-400 flex items-start gap-1.5 leading-tight">
          <Shield className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded text-[11px] font-mono text-emerald-400 flex items-start gap-1.5 leading-tight">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{success}</span>
        </div>
      )}

      {/* Secure Google SSO Button first for supreme convenience */}
      <div>
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[11px] rounded-lg border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00FF41] shadow-md shadow-black/40"
          aria-label="Secure Sign-In with Gmail / Google account"
        >
          <Globe className="w-4 h-4 text-[#00FF41]" aria-hidden="true" />
          <span>Google se direct Sign In karein</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-[9px] uppercase font-mono">
          <span className="bg-[#0c1426] px-2 text-zinc-500">Ya Email se login karein</span>
        </div>
      </div>

      {/* Mini credentials form */}
      <form onSubmit={handleEmailAuth} className="space-y-3">
        <div>
          <label htmlFor="side-email" className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
            Email ID / ईमेल आईडी
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2.5 text-zinc-500">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </span>
            <input 
              id="side-email"
              type="email" 
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="side-password" className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
            Password / पासवर्ड
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-2.5 text-zinc-500">
              <Lock className="w-4 h-4" aria-hidden="true" />
            </span>
            <input 
              id="side-password"
              type="password" 
              placeholder="Min. 6 characters" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
              disabled={loading}
              required
            />
          </div>
        </div>

        {isSignUp && (
          <div className="animate-fadeIn">
            <label htmlFor="side-confirm-password" className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
              Confirm Password / पासवर्ड दोबारा डालें
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-zinc-500">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </span>
              <input 
                id="side-confirm-password"
                type="password" 
                placeholder="Repeat password" 
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                className="w-full bg-black/50 border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#00FF41] focus:outline-none focus:ring-1 focus:ring-[#00FF41]"
                disabled={loading}
                required={isSignUp}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-[#00FF41] hover:bg-[#00e037] text-black font-extrabold uppercase text-xs rounded transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" aria-hidden="true" />
                <span>{loading ? 'Creating...' : 'Register Profile (बनाएं)'}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{loading ? 'Entering...' : 'Sign In (प्रवेश)'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toggle */}
      <p className="text-center text-[11px] text-zinc-400 mt-2 border-t border-white/5 pt-2">
        {isSignUp ? 'Already registered?' : 'Naya account banana hai?'}{' '}
        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
          className="text-[#00FF41] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none rounded"
        >
          {isSignUp ? 'Sign In Here' : 'Create Profile Here'}
        </button>
      </p>
    </div>
  );
};
