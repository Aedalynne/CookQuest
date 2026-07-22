import { type Ingredient } from './cooking';

export interface RecipeBreakdown {
  recipeTitle: string;
  amount: number;
  unit: string;
  count?: number;
}

export interface GroceryItem extends Ingredient {
  id: string;
  recipeTitle: string;
  recipeBreakdowns: RecipeBreakdown[];
  category: 'Produce' | 'Dairy & Fridge' | 'Pantry & Dry Goods' | 'Other';
  isChecked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  totalXp: number;
  level: number;
  completedRecipeIds: string[];
  groceryList: GroceryItem[],
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  id: 'local-guest',
  name: 'Chef Novice',
  totalXp: 0,
  level: 1,
  completedRecipeIds: [],
  groceryList: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};