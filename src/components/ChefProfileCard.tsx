import React from 'react';
import { type UserProfile } from '../types/storage';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChefHat } from 'lucide-react';

interface ChefProfileCardProps {
  profile: UserProfile;
}

export const ChefProfileCard: React.FC<ChefProfileCardProps> = ({ profile }) => {
  const { user } = useAuth();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'Novice Chef (Guest)';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:border-amber-500/40 transition-all shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 font-bold text-lg">
          Lvl {profile.level}
        </div>
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-1.5">
            {displayName}
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">Total XP: {profile.totalXp} Points</p>
        </div>
      </div>
      <div className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
        Profile
      </div>
    </div>
  );
};