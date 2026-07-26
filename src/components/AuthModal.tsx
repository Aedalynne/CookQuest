import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
            display_name: username.trim(), // Stored as display_name in Supabase Auth!
            },
        },
        });
        if (error) throw error;

        setSuccessMsg(
          `Welcome aboard, ${username.trim() || 'Adventurer'}! Please check your email (${email}) to confirm your account.`
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        handleClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Confirmation View */}
        {successMsg ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Verification Link Sent!</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              {successMsg}
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all mt-2"
            >
              Got it!
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                {isSignUp ? (
                  <UserPlus className="w-5 h-5 text-amber-400" />
                ) : (
                  <LogIn className="w-5 h-5 text-amber-400" />
                )}
                {isSignUp ? 'Create Adventurer' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp
                  ? 'Sign up to sync your CookQuest progress!'
                  : 'Log in to continue your cooking quests.'}
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input (Only on Sign Up) */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ChefMaster99"
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chef@cookquest.com"
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
              </button>
            </form>

            {/* Toggle Sign Up / Login */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  resetForm();
                }}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                {isSignUp
                  ? 'Already have an account? Log In'
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};