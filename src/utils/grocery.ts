import { type Ingredient } from '../types/cooking';
import { type GroceryItem, type RecipeBreakdown } from '../types/storage';

export const categorizeIngredient = (name: string): GroceryItem['category'] => {
  const lower = name.toLowerCase();
  if (lower.includes('avocado') || lower.includes('lemon') || lower.includes('garlic')) {
    return 'Produce';
  }
  if (lower.includes('cheese') || lower.includes('butter') || lower.includes('egg') || lower.includes('parmesan')) {
    return 'Dairy & Fridge';
  }
  return 'Pantry & Dry Goods';
};

export const formatUnit = (unit: string): string => {
  if (unit === 'piece') return 'x ';
  return `${unit} `;
};

export const createGroceryItems = (
  existingItems: GroceryItem[],
  newIngredients: Ingredient[],
  recipeTitle: string
): GroceryItem[] => {
  const list = [...existingItems];

  for (const ing of newIngredients) {
    const key = ing.name.toLowerCase().trim();
    const matchIdx = list.findIndex(
      (item) => item.name.toLowerCase().trim() === key && !item.isChecked
    );

    if (matchIdx !== -1) {
      const existing = list[matchIdx];
      const existingBreakdowns: RecipeBreakdown[] = existing.recipeBreakdowns || [
        { recipeTitle: existing.recipeTitle, amount: existing.amount, unit: existing.unit, count: 1 },
      ];

      const bdIdx = existingBreakdowns.findIndex((bd) => bd.recipeTitle === recipeTitle);
      let updatedBreakdowns: RecipeBreakdown[];

      if (bdIdx !== -1) {
        updatedBreakdowns = existingBreakdowns.map((bd, idx) =>
          idx === bdIdx
            ? {
                ...bd,
                amount: bd.amount + ing.amount,
                count: (bd.count || 1) + 1,
              }
            : bd
        );
      } else {
        updatedBreakdowns = [
          ...existingBreakdowns,
          { recipeTitle, amount: ing.amount, unit: ing.unit, count: 1 },
        ];
      }

      const updatedRecipeTitleStr = updatedBreakdowns.map((b) => b.recipeTitle).join(', ');

      list[matchIdx] = {
        ...existing,
        amount: existing.amount + ing.amount,
        recipeTitle: updatedRecipeTitleStr,
        recipeBreakdowns: updatedBreakdowns,
      };
    } else {
      list.push({
        ...ing,
        id: `${recipeTitle}-${ing.name}-${Date.now()}-${Math.random()}`,
        recipeTitle,
        recipeBreakdowns: [{ recipeTitle, amount: ing.amount, unit: ing.unit, count: 1 }],
        category: categorizeIngredient(ing.name),
        isChecked: false,
      });
    }
  }

  return list;
};

// Removes one instance or all instances of a recipe from the grocery list
export const removeRecipeFromGroceryItems = (
  existingItems: GroceryItem[],
  recipeTitleToRemove: string
): GroceryItem[] => {
  const updatedItems: GroceryItem[] = [];

  for (const item of existingItems) {
    if (!item.recipeBreakdowns || item.recipeBreakdowns.length === 0) {
      if (item.recipeTitle === recipeTitleToRemove) continue; // Skip item completely
      updatedItems.push(item);
      continue;
    }

    // Filter/subtract the specified recipe breakdown
    const targetBd = item.recipeBreakdowns.find((bd) => bd.recipeTitle === recipeTitleToRemove);

    if (!targetBd) {
      updatedItems.push(item);
      continue;
    }

    // Calculate remaining amount and count
    const singleRecipeAmount = targetBd.amount / (targetBd.count || 1);
    const newCount = (targetBd.count || 1) - 1;
    const newTotalAmount = item.amount - singleRecipeAmount;

    if (newTotalAmount <= 0) {
      // Entire item is no longer needed
      continue;
    }

    let updatedBreakdowns: RecipeBreakdown[];
    if (newCount > 0) {
      updatedBreakdowns = item.recipeBreakdowns.map((bd) =>
        bd.recipeTitle === recipeTitleToRemove
          ? { ...bd, amount: bd.amount - singleRecipeAmount, count: newCount }
          : bd
      );
    } else {
      updatedBreakdowns = item.recipeBreakdowns.filter(
        (bd) => bd.recipeTitle !== recipeTitleToRemove
      );
    }

    updatedItems.push({
      ...item,
      amount: newTotalAmount,
      recipeTitle: updatedBreakdowns.map((b) => b.recipeTitle).join(', '),
      recipeBreakdowns: updatedBreakdowns,
    });
  }

  return updatedItems;
};