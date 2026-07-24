import { createSlice, createSelector } from '@reduxjs/toolkit';

const mockDishes = [
  {
    id: '1',
    name: 'Classic Himalayan Pink Salt Makhāna',
    slug: 'classic-himalayan-pink-salt-makhana',
    description: 'Slow-roasted to a delicate crunch, lightly tossed in hand-harvested pink Himalayan salt and premium cold-pressed olive oil.',
    price: 120,
    category: 'Classic',
    image: '/images/makhana_salt.png',
    ingredients: ['Organic Makhana (Lotus Seeds)', 'Pink Himalayan Salt', 'Cold-Pressed Olive Oil', 'White Pepper'],
    brand: 'makhāna',
    sku: 'MKH-CPS-01',
    netWeight: 80,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 350, protein: 9.7, carbohydrates: 77.0, fat: 0.1, fiber: 14.5 },
    stock: 45
  },
  {
    id: '2',
    name: 'Smoked Chili & Zesty Lime Makhāna',
    slug: 'smoked-chili-zesty-lime-makhana',
    description: 'A vibrant kick of fiery Kashmiri red chili flakes tempered by fresh tangy key lime zest. Bold and refreshing.',
    price: 135,
    category: 'Spicy',
    image: '/images/makhana_chili.png',
    ingredients: ['Organic Makhana', 'Smoked Kashmiri Chili', 'Key Lime Zest', 'Dehydrated Lime Juice', 'Olive Oil'],
    brand: 'makhāna',
    sku: 'MKH-SCL-02',
    netWeight: 80,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 362, protein: 9.4, carbohydrates: 75.8, fat: 0.3, fiber: 14.0 },
    stock: 28
  },
  {
    id: '3',
    name: 'Toasted Sesame & Black Pepper Makhāna',
    slug: 'toasted-sesame-black-pepper-makhana',
    description: 'Coated in freshly ground Tellicherry black pepper and nutty toasted black and white sesame seeds. Comfortingly savory.',
    price: 130,
    category: 'Savory',
    image: '/images/makhana_pepper.png',
    ingredients: ['Organic Makhana', 'Tellicherry Black Pepper', 'Toasted White Sesame', 'Toasted Black Sesame', 'Sesame Oil'],
    brand: 'makhāna',
    sku: 'MKH-TSB-03',
    netWeight: 80,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 358, protein: 9.8, carbohydrates: 76.2, fat: 0.5, fiber: 14.2 },
    stock: 32
  },
  {
    id: '4',
    name: 'Organic Jaggery & Fennel Seed Makhāna',
    slug: 'organic-jaggery-fennel-seed-makhana',
    description: 'Slow-glazed with warm organic sugarcane jaggery (gud) and infused with crushed sweet green fennel seeds.',
    price: 150,
    category: 'Sweet',
    image: '/images/makhana_jaggery.png',
    ingredients: ['Organic Makhana', 'Sugarcane Jaggery', 'Green Fennel Seeds', 'Dry Ginger Powder', 'Pure A2 Cow Ghee'],
    brand: 'makhāna',
    sku: 'MKH-OJF-04',
    netWeight: 100,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 385, protein: 8.5, carbohydrates: 84.0, fat: 1.2, fiber: 12.0 },
    stock: 15
  },
  {
    id: '5',
    name: 'Cooling Mint & Mountain Herb Makhāna',
    slug: 'cooling-mint-mountain-herb-makhana',
    description: 'Infused with powdered wild mint leaves, earthy oregano, and a touch of tangy mango powder for a refreshing after-taste.',
    price: 130,
    category: 'Savory',
    image: '/images/makhana_mint.png',
    ingredients: ['Organic Makhana', 'Dried Mint Leaves', 'Oregano', 'Dry Mango Powder (Amchur)', 'Olive Oil'],
    brand: 'makhāna',
    sku: 'MKH-CMM-05',
    netWeight: 80,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 348, protein: 9.6, carbohydrates: 76.5, fat: 0.2, fiber: 14.6 },
    stock: 40
  },
  {
    id: '6',
    name: 'Creamy Cheddar & Basil Dust Makhāna',
    slug: 'creamy-cheddar-basil-dust-makhana',
    description: 'Dusted with mature cheddar cheese powder and sweet Mediterranean sweet basil leaves. A rich cheese gourmet treat.',
    price: 145,
    category: 'Savory',
    image: '/images/makhana_cheese.png',
    ingredients: ['Organic Makhana', 'Cheddar Cheese Powder', 'Dried Sweet Basil', 'Garlic Powder', 'Coconut Oil'],
    brand: 'makhāna',
    sku: 'MKH-CCB-06',
    netWeight: 80,
    shelfLife: '6 Months',
    nutritionalValues: { calories: 370, protein: 10.2, carbohydrates: 73.0, fat: 2.1, fiber: 13.5 },
    stock: 12
  },
  {
    id: '7',
    name: 'Wellness Assortment Makhāna Box',
    slug: 'wellness-assortment-makhana-box',
    description: 'A premium, eco-friendly curation of our four signature flavors packed in beautiful airtight glass canisters. Ideal for gifting.',
    price: 499,
    category: 'Assortments',
    image: 'https://images.unsplash.com/photo-1549488344-c6b75825da11?q=80&w=800&auto=format&fit=crop',
    ingredients: ['Classic Salt Jar (80g)', 'Chili Lime Jar (80g)', 'Jaggery Fennel Jar (80g)', 'Mint Herb Jar (80g)'],
    brand: 'makhāna',
    sku: 'MKH-WAB-07',
    netWeight: 320,
    shelfLife: '9 Months',
    nutritionalValues: { calories: 361, protein: 9.3, carbohydrates: 78.2, fat: 0.5, fiber: 13.8 },
    stock: 25
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

export const selectFilteredMenu = createSelector(
  [selectMenu, selectSelectedCategory],
  (items, category) => {
    if (category === 'All') return items;
    return items.filter((item) => item.category === category);
  }
);

export const selectDishById = (state, dishId) =>
  state.menu.items.find(item => item.id === dishId);

export const selectDishBySlug = (state, slug) =>
  state.menu.items.find(item => item.slug === slug);

export default menuSlice.reducer;
