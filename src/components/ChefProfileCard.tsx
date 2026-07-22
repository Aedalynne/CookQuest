import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';
import { type UserProfile } from '../types/storage';

interface ChefProfileCardProps {
  profile: UserProfile;
  xpPerLevel?: number; // Defaults to 100 XP per level
}

export const ChefProfileCard: React.FC<ChefProfileCardProps> = ({
  profile,
  xpPerLevel = 100,
}) => {
  const currentLevelXp = profile.totalXp % xpPerLevel;
  const progressPercent = Math.min(
    Math.round((currentLevelXp / xpPerLevel) * 100),
    100
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 overflow-hidden w-full">
      {/* Top Row: Icon, Title & Total XP */}
      <div className="flex items-center justify-between gap-2">
        {/* Left Side: Icon + Title & Level */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-400 shrink-0">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight leading-tight whitespace-nowrap">
              Chef Profile
            </h1>
            <span className="text-[11px] text-amber-400 font-semibold uppercase block leading-tight">
              Level {profile.level} Novice
            </span>
          </div>
        </div>

        {/* Right Side: Total XP */}
        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-black font-mono text-amber-400 flex items-center justify-end">
            <Sparkles className="w-3.5 h-3.5 mr-1 fill-amber-400 shrink-0" />
            {profile.totalXp}
          </div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Total XP
          </div>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="space-y-1 pt-1">
        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
          <span>Level {profile.level} Progress</span>
          <span className="text-amber-400 font-mono">
            {currentLevelXp} / {xpPerLevel} XP
          </span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};