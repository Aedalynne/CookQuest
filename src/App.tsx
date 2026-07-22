import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RECIPES } from './data/recipes';
import { loadUserProfile, saveUserProfile } from './utils/storage';
import { createGroceryItems, removeRecipeFromGroceryItems } from './utils/grocery';
import { type UserProfile, type GroceryItem } from './types/storage';
import { type Recipe } from './types/cooking';

// Components
import { Dashboard } from './components/Dashboard';
import { GroceryList } from './components/GroceryList';
import { MiseEnPlace } from './components/MiseEnPlace';
import { FocusCook } from './components/FocusCook';
import { QuestComplete } from './components/QuestComplete';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [activeTab, setActiveTab] = useState<'quests' | 'grocery'>('quests');
  const [mode, setMode] = useState<'dashboard' | 'miseEnPlace' | 'cooking' | 'finished'>('dashboard');

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0]);
  const [checkedPrep, setCheckedPrep] = useState<Record<number, boolean>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  // Grocery Handlers
  const handleAddGroceryItems = (recipe: Recipe) => {
    const updatedList = createGroceryItems(profile.groceryList, recipe.ingredients, recipe.title);
    
    const updatedProfile: UserProfile = {
      ...profile,
      groceryList: updatedList,
    };
    
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleRemoveGroceryRecipe = (recipeTitle: string) => {
    const updatedList = removeRecipeFromGroceryItems(profile.groceryList, recipeTitle);
    const updatedProfile: UserProfile = {
      ...profile,
      groceryList: updatedList,
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleToggleGroceryItem = (id: string) => {
    const updatedList = profile.groceryList.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    const updatedProfile = { ...profile, groceryList: updatedList };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleClearCheckedGrocery = () => {
    const updatedList = profile.groceryList.filter((item) => !item.isChecked);
    const updatedProfile = { ...profile, groceryList: updatedList };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleClearAllGrocery = () => {
    const updatedProfile = { ...profile, groceryList: [] };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  // Recipe Flow Handlers
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCheckedPrep({});
    setStepIdx(0);
    setMode('miseEnPlace');
  };

  const handleNextStep = () => {
    const gained = selectedRecipe.steps[stepIdx].xpReward;
    setSessionXp((prev) => prev + gained);

    if (stepIdx < selectedRecipe.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMode('finished');
    }
  };

  const handleClaimRewards = () => {
    const newXp = profile.totalXp + sessionXp;
    const newLevel = Math.floor(newXp / 100) + 1;

    const updatedProfile: UserProfile = {
      ...profile,
      totalXp: newXp,
      level: newLevel,
      completedRecipeIds: profile.completedRecipeIds.includes(selectedRecipe.id)
        ? profile.completedRecipeIds
        : [...profile.completedRecipeIds, selectedRecipe.id],
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);

    setMode('dashboard');
    setStepIdx(0);
    setCheckedPrep({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 flex flex-col justify-between max-w-md mx-auto">
      {mode === 'dashboard' && (
        <div className="w-full max-w-md px-4 py-6 flex flex-col">
          {activeTab === 'quests' ? (
            <Dashboard
              profile={profile}
              recipes={RECIPES}
              onSelectRecipe={handleSelectRecipe}
              onAddGroceryItems={handleAddGroceryItems}
            />
          ) : (
            <GroceryList
              items={profile.groceryList}
              availableRecipes={RECIPES}
              onToggleItem={handleToggleGroceryItem}
              onClearChecked={handleClearCheckedGrocery}
              onClearAll={handleClearAllGrocery}
              onRemoveRecipe={handleRemoveGroceryRecipe}
              onAddRecipe={handleAddGroceryItems}
            />
          )}

          <BottomNav
            activeTab={activeTab}
            groceryCount={profile.groceryList.filter((i) => !i.isChecked).length}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      {mode === 'miseEnPlace' && (
        <MiseEnPlace
          recipe={selectedRecipe}
          checkedPrep={checkedPrep}
          onTogglePrep={(idx) => setCheckedPrep((prev) => ({ ...prev, [idx]: !prev[idx] }))}
          onStartCooking={() => {
            setSessionXp(10);
            setMode('cooking');
          }}
        />
      )}

      {mode === 'cooking' && (
        <FocusCook
          recipe={selectedRecipe}
          stepIdx={stepIdx}
          sessionXp={sessionXp}
          onNextStep={handleNextStep}
        />
      )}

      {mode === 'finished' && (
        <QuestComplete xpGained={sessionXp} onClaim={handleClaimRewards} />
      )}
    </div>
  );
}