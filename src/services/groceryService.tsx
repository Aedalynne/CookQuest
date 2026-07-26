import { supabase } from '../lib/supabase';
import type { GroceryItem } from '../types/storage';

// Fetch user's grocery items from Supabase
export async function fetchGroceryItemsFromSupabase(userId: string): Promise<GroceryItem[]> {
  const { data, error } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching grocery items:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    unit: item.unit ?? '',
    category: (item.category as GroceryItem['category']) || 'Other',
    recipeTitle: item.recipe_title ?? '',
    recipeBreakdowns: item.recipe_breakdowns || [],
    isChecked: item.is_checked,
  }));
}

// Add or Upsert new grocery items
export async function addGroceryItemsToSupabase(userId: string, items: GroceryItem[]) {
  const rows = items.map((item) => ({
    id: item.id, // Direct client ID mapping
    user_id: userId,
    name: item.name,
    amount: item.amount,
    unit: item.unit,
    category: item.category,
    recipe_title: item.recipeTitle,
    recipe_breakdowns: item.recipeBreakdowns,
    is_checked: item.isChecked ?? false,
  }));

  const { error } = await supabase.from('grocery_items').upsert(rows);
  if (error) console.error('Error saving grocery items:', error);
}

// Toggle an item's checked state
export async function toggleGroceryItemInSupabase(itemId: string, isChecked: boolean) {
  const { error } = await supabase
    .from('grocery_items')
    .update({ is_checked: isChecked })
    .eq('id', itemId);

  if (error) console.error('Error toggling grocery item:', error);
}

// Remove items by recipe title
export async function removeGroceryRecipeFromSupabase(userId: string, recipeTitle: string) {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_title', recipeTitle);

  if (error) console.error('Error removing recipe groceries:', error);
}

// Clear checked items
export async function clearCheckedGroceryItemsFromSupabase(userId: string) {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('user_id', userId)
    .eq('is_checked', true);

  if (error) console.error('Error clearing checked items:', error);
}

// Clear all items
export async function clearAllGroceryItemsFromSupabase(userId: string) {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('user_id', userId);

  if (error) console.error('Error clearing all grocery items:', error);
}