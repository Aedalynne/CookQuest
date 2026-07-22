import React from 'react';
import { Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface QuestCompleteProps {
  xpGained: number;
  onClaim: () => void;
}

export const QuestComplete: React.FC<QuestCompleteProps> = ({
  xpGained,
  onClaim,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 w-full max-w-sm mx-auto my-auto space-y-6">
      {/* Trophy / Victory Badge */}
      <div className="relative">
        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-slate-900 border-2 border-amber-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl text-amber-400">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 animate-bounce" />
        </div>
      </div>

      {/* Main Titles */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Quest Accomplished!
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Delicious Victory
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-[260px] mx-auto leading-relaxed">
          You cooked up a masterpiece and earned extra chef experience!
        </p>
      </div>

      {/* XP Reward Box */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="text-left">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Reward
          </p>
          <p className="text-sm font-bold text-slate-200">Quest Completion</p>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-mono font-black text-xl sm:text-2xl">
          <Sparkles className="w-5 h-5 fill-amber-400 shrink-0" />
          <span>+{xpGained} XP</span>
        </div>
      </div>

      {/* Claim Reward Button */}
      <button
        onClick={onClaim}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <span>Claim Experience</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};