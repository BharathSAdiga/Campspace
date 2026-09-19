import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Sparkles } from 'lucide-react';

// Google Multicolor "G" Logo
export const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleAuthButton = ({
  text = 'Continue with Google',
  onSuccess,
  onError,
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devEmail, setDevEmail] = useState('');
  const [devName, setDevName] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleClick = async () => {
    // If real Google Client ID is configured, trigger Google Identity Services
    if (clientId && window.google?.accounts?.id) {
      setLoading(true);
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const res = await loginWithGoogle({ credential: response.credential });
              if (onSuccess) onSuccess(res);
            } catch (err) {
              if (onError) onError(err);
            } finally {
              setLoading(false);
            }
          },
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        setLoading(false);
        if (onError) onError(err);
      }
      return;
    }

    // Otherwise, show the quick Google One-Click Sandbox modal
    setShowDevModal(true);
  };

  const handleDevSubmit = async (selectedEmail, selectedName) => {
    const emailToUse = selectedEmail || devEmail.trim() || 'student.google@campus.edu';
    const nameToUse = selectedName || devName.trim() || 'Google Campus Scholar';

    setLoading(true);
    setShowDevModal(false);
    try {
      const res = await loginWithGoogle({
        userInfo: {
          email: emailToUse,
          name: nameToUse,
          picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          googleId: `google_sim_${Date.now()}`,
        },
      });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative group overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
          e.currentTarget.style.borderColor = 'rgba(255, 140, 66, 0.35)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 140, 66, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        }}
      >
        {/* Glow ambient highlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 140, 66, 0.12) 0%, transparent 70%)',
          }}
        />

        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
        ) : (
          <GoogleIcon size={20} />
        )}
        <span className="relative z-10 font-semibold tracking-wide">
          {loading ? 'Authenticating with Google...' : text}
        </span>
      </button>

      {/* Development Google Simulation Modal */}
      {showDevModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowDevModal(false)}
        >
          <div
            className="w-full max-w-md p-6 rounded-2xl relative"
            style={{
              background: '#0d1117',
              border: '1px solid rgba(255, 140, 66, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 140, 66, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <GoogleIcon size={28} />
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Google Sign-In
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-normal">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Select a Google campus account or enter your custom email
                </p>
              </div>
            </div>

            {/* Fast Quick-Select Accounts */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                onClick={() => handleDevSubmit('alex.rivera@campus.edu', 'Alex Rivera')}
                className="w-full text-left p-3 rounded-xl border border-white/10 hover:border-orange-500/40 hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                      Alex Rivera
                    </div>
                    <div className="text-xs text-neutral-400">alex.rivera@campus.edu</div>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-neutral-500 group-hover:text-orange-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleDevSubmit('jordan.lee@stanford.edu', 'Jordan Lee')}
                className="w-full text-left p-3 rounded-xl border border-white/10 hover:border-orange-500/40 hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    JL
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                      Jordan Lee
                    </div>
                    <div className="text-xs text-neutral-400">jordan.lee@stanford.edu</div>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-neutral-500 group-hover:text-orange-400 transition-colors" />
              </button>
            </div>

            {/* Custom Google Email Input */}
            <div className="pt-2 border-t border-white/10">
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Or enter custom Google account:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your.name@campus.edu"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => handleDevSubmit()}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-lg hover:brightness-110 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[11px] text-neutral-500">
              <span>Client ID: {clientId ? 'Configured' : 'Dev Simulation Mode'}</span>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
