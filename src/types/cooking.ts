export interface Ingredient {
  name: string;
  amount: number;
  unit: 'g' | 'ml' | 'tbsp' | 'tsp' | 'piece' | 'pinch';
}

export interface RecipeStep {
  instruction: string;
  xpReward: number;
  timerSeconds?: number;
  ingredientsNeeded?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  totalXp: number;
  prepItems: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}