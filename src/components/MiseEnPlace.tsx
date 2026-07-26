import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { type Recipe } from '../types/cooking';

interface MiseEnPlaceProps {
  recipe: Recipe;
  checkedPrep: Record<number, boolean>;
  onTogglePrep: (idx: number) => void;
  onStartCooking: () => void;
  onExit: () => void;
}

export const MiseEnPlace: React.FC<MiseEnPlaceProps> = ({
  recipe,
  checkedPrep,
  onTogglePrep,
  onStartCooking,
  onExit,
}) => {
  const allChecked = recipe.prepItems.every((_, idx) => checkedPrep[idx]);

  return (
    <div className="flex flex-col min-h-full space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Exit Quest</span>
        </button>

        <span className="text-xs font-bold text-amber-400 truncate max-w-[180px]">
          {recipe.title}
        </span>
      </div>

      <div className="my-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
            Step 0: Preparation Gate
          </span>
          <h2 className="text-2xl font-bold mt-2">Gather Your Station</h2>
          <p className="text-slate-400 text-xs mt-1">Check off items as you put them on your counter!</p>
        </div>

        <div className="space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
          {recipe.prepItems.map((item, idx) => (
            <label
              key={idx}
              onClick={() => onTogglePrep(idx)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${
                checkedPrep[idx]
                  ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedPrep[idx]}
                onChange={() => {}}
                className="w-5 h-5 accent-emerald-500 mr-3"
              />
              <span className={`text-sm ${checkedPrep[idx] ? 'line-through opacity-70' : ''}`}>{item}</span>
            </label>
          ))}
        </div>

        <button
          disabled={!allChecked}
          onClick={onStartCooking}
          className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-1 transition-all ${
            allChecked
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Start Cooking (+10 XP) <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};