import React from 'react';
import { Flame, CheckCircle2, ShoppingBag } from 'lucide-react';
import { type UserProfile } from '../types/storage';
import { type Recipe } from '../types/cooking';
import { ChefProfileCard } from './ChefProfileCard';

interface DashboardProps {
  profile: UserProfile;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onAddGroceryItems: (recipe: Recipe) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  recipes,
  onSelectRecipe,
  onAddGroceryItems,
}) => {
  return (
    <div className="space-y-6 w-full pb-6">
      {/* Standalone Chef Profile Card Component */}
      <ChefProfileCard profile={profile} />

      {/* Quest Gallery Title */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Available Cooking Quests
        </h2>
        <span className="text-xs text-slate-500 font-mono">{recipes.length} Quests</span>
      </div>

      {/* Recipe List */}
      <div className="space-y-4">
        {recipes.map((recipe) => {
          const isCompleted = profile.completedRecipeIds.includes(recipe.id);

          return (
            <div
              key={recipe.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-3 transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-slate-900/80'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Quest Available'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                  +{recipe.totalXp} XP
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {recipe.title}
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">{recipe.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectRecipe(recipe)}
                  className={`flex-1 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${isCompleted ? 'text-slate-400' : 'fill-slate-950'}`} />
                  {isCompleted ? 'Replay Quest' : 'Start Quest'}
                </button>

                <button
                  onClick={() => onAddGroceryItems(recipe)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 rounded-xl transition-all active:scale-[0.98]"
                  title="Add ingredients to grocery list"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};