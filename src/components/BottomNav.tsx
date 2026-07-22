import React from 'react';
import { ChefHat, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'quests' | 'grocery';
  groceryCount: number;
  onTabChange: (tab: 'quests' | 'grocery') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  groceryCount,
  onTabChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2 max-w-md mx-auto z-50">
      <div className="flex justify-around items-center">
        <button
          onClick={() => onTabChange('quests')}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
            activeTab === 'quests' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Quests</span>
        </button>

        <button
          onClick={() => onTabChange('grocery')}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl relative transition-all ${
            activeTab === 'grocery' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {groceryCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {groceryCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Grocery</span>
        </button>
      </div>
    </div>
  );
};