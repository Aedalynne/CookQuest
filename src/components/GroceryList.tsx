import React, { useState } from 'react';
import { ShoppingBag, Trash2, CheckCircle2, ChevronDown, ChevronUp, Plus, Minus, AlertTriangle } from 'lucide-react';
import { type GroceryItem } from '../types/storage';
import { type Recipe } from '../types/cooking';
import { formatUnit } from '../utils/grocery';

interface GroceryListProps {
  items: GroceryItem[];
  availableRecipes: Recipe[];
  onToggleItem: (id: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onRemoveRecipe: (recipeTitle: string) => void;
  onAddRecipe: (recipe: Recipe) => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  items,
  availableRecipes,
  onToggleItem,
  onClearChecked,
  onClearAll,
  onRemoveRecipe,
  onAddRecipe,
}) => {
  const [showRecipes, setShowRecipes] = useState(true);
  const [pendingDeleteTitle, setPendingDeleteTitle] = useState<string | null>(null);

  const categories: GroceryItem['category'][] = ['Produce', 'Dairy & Fridge', 'Pantry & Dry Goods', 'Other'];

  if (items.length === 0) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 min-h-[60vh]">
        {/* Icon Container */}
        <div className="bg-slate-800/60 border border-slate-700/50 p-5 rounded-2xl mb-4 shadow-inner">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Your Grocery List is Empty
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xs leading-relaxed">
            Browse available cooking quests and tap the shopping bag to add ingredients!
        </p>
        </div>
    );
  }

  // Extract unique active recipes and their total counts
  const activeRecipesMap: { [title: string]: number } = {};
  items.forEach((item) => {
    const breakdowns = item.recipeBreakdowns || [
      { recipeTitle: item.recipeTitle, amount: item.amount, unit: item.unit, count: 1 },
    ];
    breakdowns.forEach((bd) => {
      activeRecipesMap[bd.recipeTitle] = bd.count || 1;
    });
  });

  const activeRecipeEntries = Object.entries(activeRecipesMap);
  const checkedCount = items.filter((i) => i.isChecked).length;

  const handleDecrement = (title: string, count: number) => {
    if (count === 1) {
      setPendingDeleteTitle(title);
    } else {
      onRemoveRecipe(title);
    }
  };

  const confirmRemoval = () => {
    if (pendingDeleteTitle) {
      onRemoveRecipe(pendingDeleteTitle);
      setPendingDeleteTitle(null);
    }
  };

  return (
    <div className="space-y-6 text-left pb-20 w-full relative">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Supermarket List</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {checkedCount} of {items.length} items checked
          </p>
        </div>
        <div className="flex gap-2">
          {checkedCount > 0 && (
            <button
              onClick={onClearChecked}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700"
            >
              Clear Done
            </button>
          )}
          <button
            onClick={onClearAll}
            className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg"
            title="Clear entire list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Quests Control Panel */}
      {activeRecipeEntries.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
          <button
            onClick={() => setShowRecipes(!showRecipes)}
            className="w-full flex justify-between items-center text-xs font-semibold text-amber-400"
          >
            <span>Active Quests ({activeRecipeEntries.length})</span>
            {showRecipes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRecipes && (
            <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
              {activeRecipeEntries.map(([title, count]) => {
                const recipeObject = availableRecipes.find((r) => r.title === title);

                return (
                  <div
                    key={title}
                    className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300"
                  >
                    <span className="font-medium text-slate-200">{title}</span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg border border-slate-800 px-1 py-0.5">
                      <button
                        onClick={() => handleDecrement(title, count)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                        title={`Remove 1 ${title}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-bold text-amber-400 px-1 min-w-[1.2rem] text-center">
                        {count}x
                      </span>

                      <button
                        onClick={() => {
                          if (recipeObject) onAddRecipe(recipeObject);
                        }}
                        disabled={!recipeObject}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded transition-colors disabled:opacity-30"
                        title={`Add 1 ${title}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Grouped Aisle Lists */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat} className="space-y-2 text-left">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 px-1 text-left">
                {cat}
              </h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-lg">
                {catItems.map((item) => {
                  const breakdowns = item.recipeBreakdowns || [
                    { recipeTitle: item.recipeTitle, amount: item.amount, unit: item.unit, count: 1 },
                  ];

                  return (
                    <label
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`flex items-start justify-between p-4 cursor-pointer transition-all ${
                        item.isChecked ? 'bg-slate-950/60 text-slate-500' : 'text-slate-100 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 text-left">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={() => {}}
                          className="w-5 h-5 accent-emerald-500 rounded cursor-pointer shrink-0 mt-0.5"
                        />
                        <div className="text-left">
                          <span className={`text-sm font-bold block ${item.isChecked ? 'line-through opacity-60' : 'text-white'}`}>
                            {item.amount > 0 ? `${item.amount}${formatUnit(item.unit)}` : ''}
                            {item.name}
                          </span>

                          <div className="mt-1 space-y-0.5">
                            {breakdowns.map((bd, i) => {
                              const countPrefix = bd.count && bd.count > 1 ? `${bd.count}x ` : '';
                              return (
                                <span key={i} className="block text-xs text-slate-400 font-medium leading-tight">
                                  • {bd.amount > 0 ? `${bd.amount}${formatUnit(bd.unit)}` : ''}
                                  ({countPrefix}{bd.recipeTitle})
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {item.isChecked && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {pendingDeleteTitle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Remove Quest?</h3>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Are you sure you want to remove <strong className="text-white">{pendingDeleteTitle}</strong> from your active quests? This will remove its ingredients from your grocery list.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPendingDeleteTitle(null)}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoval}
                className="flex-1 py-2.5 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold text-xs rounded-xl transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};