import React from 'react';
import { useAuth } from '../context/AuthContext';
import { type UserProfile } from '../types/storage';
import { ArrowLeft, LogOut, LogIn, User, ShieldCheck, Trophy, ChefHat } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onBack: () => void;
  onOpenAuth: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onBack, onOpenAuth }) => {
  const { user, signOut } = useAuth();

  const displayName = user
    ? user.user_metadata?.display_name || user.email?.split('@')[0]
    : 'Guest Adventurer';

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Top Nav Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white">Adventurer Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
        <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
          <ChefHat className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{displayName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {user ? user.email : 'Playing locally as guest'}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Level {profile.level} Culinary Questor</span>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{profile.totalXp}</div>
          <div className="text-xs text-slate-400">Total XP</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <ChefHat className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{profile.completedRecipeIds.length}</div>
          <div className="text-xs text-slate-400">Quests Finished</div>
        </div>
      </div>

      {/* Auth Actions */}
      <div className="pt-4">
        {user ? (
          <button
            onClick={async () => {
              await signOut();
              onBack();
            }}
            className="w-full py-3 bg-red-950/40 border border-red-800/60 hover:bg-red-900/50 text-red-300 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In / Create Account</span>
          </button>
        )}
      </div>
    </div>
  );
};