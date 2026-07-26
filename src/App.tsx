import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import { loadUserProfile, saveUserProfile } from './utils/storage';
import { createGroceryItems, removeRecipeFromGroceryItems } from './utils/grocery';
import { type UserProfile } from './types/storage';
import { fetchRecipesFromSupabase } from './services/recipeService';
import { fetchUserProfileFromSupabase, saveUserProfileToSupabase } from './services/profileService';
import {
  fetchGroceryItemsFromSupabase,
  addGroceryItemsToSupabase,
  toggleGroceryItemInSupabase,
  removeGroceryRecipeFromSupabase,
  clearCheckedGroceryItemsFromSupabase,
  clearAllGroceryItemsFromSupabase,
} from './services/groceryService';

import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { GroceryList } from './components/GroceryList';
import { MiseEnPlace } from './components/MiseEnPlace';
import { FocusCook } from './components/FocusCook';
import { QuestComplete } from './components/QuestComplete';
import { BottomNav } from './components/BottomNav';
import type { Recipe } from './types/cooking';

export default function App() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'quests' | 'grocery'>('quests');
  const [mode, setMode] = useState<'dashboard' | 'profile' | 'miseEnPlace' | 'cooking' | 'finished'>('dashboard');

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [checkedPrep, setCheckedPrep] = useState<Record<number, boolean>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  // Sync profile state locally & remote
  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile); // Local storage backup

    if (user) {
      saveUserProfileToSupabase(user.id, newProfile);
    }
  };

  // 1. Fetch initial recipes
  useEffect(() => {
    const getRecipes = async () => {
      try {
        setIsLoading(true);
        const fetchedRecipes = await fetchRecipesFromSupabase();
        setRecipes(fetchedRecipes);
        setSelectedRecipe(fetchedRecipes[0] ?? null);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getRecipes();
  }, []);

  // 2. Fetch or sync User Profile & Grocery Items when user logs in
  useEffect(() => {
    const syncUserData = async () => {
      if (user) {
        // Fetch profile stats & grocery items in parallel
        const [remoteProfile, remoteGroceries] = await Promise.all([
          fetchUserProfileFromSupabase(user.id),
          fetchGroceryItemsFromSupabase(user.id),
        ]);

        const mergedProfile: UserProfile = {
          level: remoteProfile?.level ?? profile.level,
          totalXp: remoteProfile?.totalXp ?? profile.totalXp,
          completedRecipeIds: remoteProfile?.completedRecipeIds ?? profile.completedRecipeIds ?? [],
          groceryList: remoteGroceries,
          createdAt: remoteProfile?.createdAt ?? profile.createdAt,
          updatedAt: remoteProfile?.updatedAt ?? profile.updatedAt,
          id: user.id,
          name: user.user_metadata.display_name
        };

        setProfile(mergedProfile);
        saveUserProfile(mergedProfile);

        if (!remoteProfile) {
          saveUserProfileToSupabase(user.id, mergedProfile);
        }
      }
    };

    syncUserData();
  }, [user]);

  const handleExitQuest = () => {
    setMode('dashboard');
    setSelectedRecipe(null);
    setStepIdx(0);
    setSessionXp(0);
    setCheckedPrep({});
  };

  // --- Grocery Handlers ---

  const handleAddGroceryItems = async (recipe: Recipe) => {
    const updatedList = createGroceryItems(profile.groceryList, recipe.ingredients, recipe.title);
    updateProfile({ ...profile, groceryList: updatedList });

    if (user) {
      // Passes full updated array directly to Supabase upsert
      await addGroceryItemsToSupabase(user.id, updatedList);
    }
  };

  const handleRemoveGroceryRecipe = async (recipeTitle: string) => {
    const updatedList = removeRecipeFromGroceryItems(profile.groceryList, recipeTitle);
    updateProfile({ ...profile, groceryList: updatedList });

    if (user) {
      await removeGroceryRecipeFromSupabase(user.id, recipeTitle);
    }
  };

  const handleToggleGroceryItem = async (id: string) => {
    const targetItem = profile.groceryList.find((item) => item.id === id);
    if (!targetItem) return;

    const newCheckedState = !targetItem.isChecked;
    const updatedList = profile.groceryList.map((item) =>
      item.id === id ? { ...item, isChecked: newCheckedState } : item
    );
    updateProfile({ ...profile, groceryList: updatedList });

    if (user) {
      await toggleGroceryItemInSupabase(id, newCheckedState);
    }
  };

  const handleClearCheckedGrocery = async () => {
    const updatedList = profile.groceryList.filter((item) => !item.isChecked);
    updateProfile({ ...profile, groceryList: updatedList });

    if (user) {
      await clearCheckedGroceryItemsFromSupabase(user.id);
    }
  };

  const handleClearAllGrocery = async () => {
    updateProfile({ ...profile, groceryList: [] });

    if (user) {
      await clearAllGroceryItemsFromSupabase(user.id);
    }
  };

  // --- Recipe Flow Handlers ---

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCheckedPrep({});
    setStepIdx(0);
    setSessionXp(0);
    setMode('miseEnPlace');
  };

  const handleNextStep = () => {
    if (!selectedRecipe) return;

    const gained = selectedRecipe.steps[stepIdx]?.xpReward ?? 10;
    setSessionXp((prev) => prev + gained);

    if (stepIdx < selectedRecipe.steps.length - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMode('finished');
    }
  };

  const handleClaimRewards = () => {
    if (!selectedRecipe) return;

    const currentCompleted = profile.completedRecipeIds || [];
    const newXp = profile.totalXp + sessionXp;
    const newLevel = Math.floor(newXp / 100) + 1;

    updateProfile({
      ...profile,
      totalXp: newXp,
      level: newLevel,
      completedRecipeIds: currentCompleted.includes(selectedRecipe.id)
        ? currentCompleted
        : [...currentCompleted, selectedRecipe.id],
    });

    setMode('dashboard');
    setStepIdx(0);
    setCheckedPrep({});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-100">
        Loading Quests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 flex flex-col justify-between max-w-md mx-auto">
      {mode === 'dashboard' && (
        <div className="w-full max-w-md px-4 py-6 flex flex-col">
          {activeTab === 'quests' ? (
            <Dashboard
              profile={profile}
              recipes={recipes}
              onSelectRecipe={handleSelectRecipe}
              onAddGroceryItems={handleAddGroceryItems}
              onOpenProfile={() => setMode('profile')}
            />
          ) : (
            <GroceryList
              items={profile.groceryList}
              availableRecipes={recipes}
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

      {mode === 'profile' && (
        <Profile
          profile={profile}
          onBack={() => setMode('dashboard')}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {mode === 'miseEnPlace' && selectedRecipe && (
        <MiseEnPlace
          recipe={selectedRecipe}
          checkedPrep={checkedPrep}
          onTogglePrep={(idx) => setCheckedPrep((prev) => ({ ...prev, [idx]: !prev[idx] }))}
          onStartCooking={() => {
            setSessionXp(10);
            setMode('cooking');
          }}
          onExit={handleExitQuest}
        />
      )}

      {mode === 'cooking' && selectedRecipe && (
        <FocusCook
          recipe={selectedRecipe}
          stepIdx={stepIdx}
          sessionXp={sessionXp}
          onNextStep={handleNextStep}
          onExit={handleExitQuest}
        />
      )}

      {mode === 'finished' && (
        <QuestComplete xpGained={sessionXp} onClaim={handleClaimRewards} />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}