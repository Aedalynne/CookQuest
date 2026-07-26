import { supabase } from '../lib/supabase';
import { type UserProfile } from '../types/storage';

export async function fetchUserProfileFromSupabase(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching profile from Supabase:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    level: data.level ?? 1,
    totalXp: data.total_xp ?? 0,
    completedRecipeIds: data.completed_recipe_ids ?? [],
    groceryList: data.grocery_list ?? [],
    createdAt : data.created_at,
    updatedAt : data.updated_at,
  };
}

export async function saveUserProfileToSupabase(userId: string, profile: UserProfile) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      level: profile.level,
      total_xp: profile.totalXp,
      completed_recipe_ids: profile.completedRecipeIds || [],
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error saving profile to Supabase:', error);
  }
}