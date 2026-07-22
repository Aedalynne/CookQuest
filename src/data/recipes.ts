import { type Recipe } from '../types/cooking';

export const RECIPES: Recipe[] = [
  {
    id: 'quesadilla-01',
    title: 'Level 1 Cheesy Quesadilla',
    description: 'Learn basic stovetop heat control, cheese melting timing, and safe flipping.',
    totalXp: 50,
    prepItems: [
      '1 Wheat or Flour Tortilla',
      '50g Shredded Cheese (Gouda, Cheddar, or Mozzarella)',
      '10g Butter or 10ml Olive Oil',
      'Non-stick Skillet & Spatula'
    ],
    ingredients: [
      { name: 'Tortilla', amount: 1, unit: 'piece' },
      { name: 'Shredded Cheese', amount: 50, unit: 'g' },
      { name: 'Butter or Olive Oil', amount: 10, unit: 'g' },
    ],
    steps: [
      {
        instruction: 'Place your skillet on the stove over medium heat (Setting 5–6). Melt 10g butter or heat 10ml oil in the pan.',
        xpReward: 10,
        ingredientsNeeded: ['10g Butter or 10ml Olive Oil']
      },
      {
        instruction: 'Place the tortilla flat in the pan. Distribute 50g of shredded cheese evenly over ONE half of the tortilla.',
        xpReward: 10,
        ingredientsNeeded: ['1 Tortilla', '50g Shredded Cheese']
      },
      {
        instruction: 'Let it heat until the cheese starts melting, then use your spatula to fold the empty half over the cheese.',
        xpReward: 15
      },
      {
        instruction: 'Cook for 2 minutes until the bottom is golden brown and crisp, then carefully flip.',
        xpReward: 15,
        timerSeconds: 120
      }
    ]
  },
  {
    id: 'avocado-toast-01',
    title: 'Level 1 Loaded Avocado Toast',
    description: 'Master basic bread toasting, mashing, citrus balancing, and egg frying.',
    totalXp: 60,
    prepItems: [
      '2 Slices Sourdough or Whole Wheat Bread',
      '1 Ripe Avocado',
      '1 Large Egg',
      '5ml Lemon Juice',
      '10g Butter or 10ml Oil',
      'Salt, Black Pepper, and Chili Flakes'
    ],
    ingredients: [
      { name: 'Bread Slices', amount: 2, unit: 'piece' },
      { name: 'Ripe Avocado', amount: 1, unit: 'piece' },
      { name: 'Egg', amount: 1, unit: 'piece' },
      { name: 'Lemon Juice', amount: 5, unit: 'ml' },
      { name: 'Butter/Oil', amount: 10, unit: 'g' }
    ],
    steps: [
      {
        instruction: 'Toast your bread slices until golden and crisp. Halve the avocado, scoop the flesh into a bowl, and mash with 5ml lemon juice, salt, and pepper.',
        xpReward: 15,
        ingredientsNeeded: ['2 Bread Slices', '1 Ripe Avocado', '5ml Lemon Juice']
      },
      {
        instruction: 'Heat 10g butter or oil in a skillet over medium heat. Crack the egg into the pan and fry for 2–3 minutes until whites are set but yolk is runny.',
        xpReward: 20,
        timerSeconds: 150,
        ingredientsNeeded: ['1 Large Egg', '10g Butter or 10ml Oil']
      },
      {
        instruction: 'Spread the mashed avocado evenly across both slices of toast, top with the fried egg, and sprinkle with chili flakes.',
        xpReward: 25
      }
    ]
  },
  {
    id: 'garlic-butter-pasta-01',
    title: 'Level 2 Garlic Butter Pasta',
    description: 'Learn pasta boiling timing, emulsifying pasta water with butter, and garlic aroma control.',
    totalXp: 75,
    prepItems: [
      '100g Spaghetti or Penne',
      '2 Cloves Garlic (minced or finely sliced)',
      '25g Butter',
      '15g Shredded Parmesan Cheese',
      '1.5L Water',
      '1 Pinch Salt'
    ],
    ingredients: [
      { name: 'Spaghetti/Penne', amount: 100, unit: 'g' },
      { name: 'Garlic Cloves', amount: 2, unit: 'piece' },
      { name: 'Butter', amount: 25, unit: 'g' },
      { name: 'Parmesan', amount: 15, unit: 'g' }
    ],
    steps: [
      {
        instruction: 'Bring 1.5L of water to a rolling boil in a pot. Add a generous pinch of salt, then add 100g pasta and boil for 9 minutes until al dente.',
        xpReward: 20,
        timerSeconds: 540,
        ingredientsNeeded: ['100g Spaghetti or Penne', '1.5L Water', '1 Pinch Salt']
      },
      {
        instruction: 'Before draining, scoop out ~50ml of starchy pasta water and set aside! Drain the rest of the pasta.',
        xpReward: 15
      },
      {
        instruction: 'In the empty pot over low heat, melt 25g butter and cook minced garlic for 1 minute until fragrant (do not let it turn brown).',
        xpReward: 15,
        timerSeconds: 60,
        ingredientsNeeded: ['2 Cloves Garlic', '25g Butter']
      },
      {
        instruction: 'Toss in drained pasta, reserved 50ml pasta water, and 15g parmesan. Stir vigorously for 1 minute until a silky sauce forms!',
        xpReward: 25,
        ingredientsNeeded: ['15g Shredded Parmesan Cheese']
      }
    ]
  }
];

// Backwards compatibility for starter recipe
export const STARTER_RECIPE = RECIPES[0];