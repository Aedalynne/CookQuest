import { supabase } from '../lib/supabase';
import { type Recipe } from '../types/cooking';

export const fetchRecipesFromSupabase = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading CookQuest recipes:', error.message);
    throw error;
  }

  // Maps database snake_case columns directly to Recipe type
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    totalXp: row.total_xp,
    prepItems: row.prep_items,
    ingredients: row.ingredients,
    steps: row.steps,
  }));
};