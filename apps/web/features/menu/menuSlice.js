import { createSlice } from '@reduxjs/toolkit';

const mockDishes = [
  {
    id: '1',
    name: 'Classic Himalayan Pink Salt Makhāna',
    description: 'Slow-roasted to a delicate crunch, lightly tossed in hand-harvested pink Himalayan salt and premium cold-pressed olive oil.',
    price: 120,
    category: 'Classic',
    image: '/images/makhana_salt.png',
    ingredients: ['Organic Makhana (Lotus Seeds)', 'Pink Himalayan Salt', 'Cold-Pressed Olive Oil', 'White Pepper'],
  },
  {
    id: '2',
    name: 'Smoked Chili & Zesty Lime Makhāna',
    description: 'A vibrant kick of fiery Kashmiri red chili flakes tempered by fresh tangy key lime zest. Bold and refreshing.',
    price: 135,
    category: 'Spicy',
    image: '/images/makhana_chili.png',
    ingredients: ['Organic Makhana', 'Smoked Kashmiri Chili', 'Key Lime Zest', 'Dehydrated Lime Juice', 'Olive Oil'],
  },
  {
    id: '3',
    name: 'Toasted Sesame & Black Pepper Makhāna',
    description: 'Coated in freshly ground Tellicherry black pepper and nutty toasted black and white sesame seeds. Comfortingly savory.',
    price: 130,
    category: 'Savory',
    image: '/images/makhana_pepper.png',
    ingredients: ['Organic Makhana', 'Tellicherry Black Pepper', 'Toasted White Sesame', 'Toasted Black Sesame', 'Sesame Oil'],
  },
  {
    id: '4',
    name: 'Organic Jaggery & Fennel Seed Makhāna',
    description: 'Slow-glazed with warm organic sugarcane jaggery (gud) and infused with crushed sweet green fennel seeds.',
    price: 150,
    category: 'Sweet',
    image: '/images/makhana_jaggery.png',
    ingredients: ['Organic Makhana', 'Sugarcane Jaggery', 'Green Fennel Seeds', 'Dry Ginger Powder', 'Pure A2 Cow Ghee'],
  },
  {
    id: '5',
    name: 'Cooling Mint & Mountain Herb Makhāna',
    description: 'Infused with powdered wild mint leaves, earthy oregano, and a touch of tangy mango powder for a refreshing after-taste.',
    price: 130,
    category: 'Savory',
    image: '/images/makhana_mint.png',
    ingredients: ['Organic Makhana', 'Dried Mint Leaves', 'Oregano', 'Dry Mango Powder (Amchur)', 'Olive Oil'],
  },
  {
    id: '6',
    name: 'Creamy Cheddar & Basil Dust Makhāna',
    description: 'Dusted with mature cheddar cheese powder and sweet Mediterranean sweet basil leaves. A rich cheese gourmet treat.',
    price: 145,
    category: 'Savory',
    image: '/images/makhana_cheese.png',
    ingredients: ['Organic Makhana', 'Cheddar Cheese Powder', 'Dried Sweet Basil', 'Garlic Powder', 'Coconut Oil'],
  },
  {
    id: '7',
    name: 'Wellness Assortment Makhāna Box',
    description: 'A premium, eco-friendly curation of our four signature flavors packed in beautiful airtight glass canisters. Ideal for gifting.',
    price: 499,
    category: 'Assortments',
    image: 'https://images.unsplash.com/photo-1549488344-c6b75825da11?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Classic Salt Jar (80g)', 'Chili Lime Jar (80g)', 'Jaggery Fennel Jar (80g)', 'Mint Herb Jar (80g)'],
  }
];

const initialState = {
  items: mockDishes,
  categories: ['All', 'Classic', 'Savory', 'Spicy', 'Sweet', 'Assortments'],
  selectedCategory: 'All',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setCategory } = menuSlice.actions;

export const selectMenu = (state) => state.menu.items;
export const selectCategories = (state) => state.menu.categories;
export const selectSelectedCategory = (state) => state.menu.selectedCategory;

export const selectFilteredMenu = (state) => {
  const items = state.menu.items;
  const category = state.menu.selectedCategory;
  if (category === 'All') return items;
  return items.filter(item => item.category === category);
};

export const selectDishById = (state, dishId) =>
  state.menu.items.find(item => item.id === dishId);

export default menuSlice.reducer;
