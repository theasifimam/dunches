import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  desc?: string;
}

interface CartState {
  items: CartItem[];
}

const initialCartState: CartState = {
  items: [
    {
      id: 'c1',
      name: 'Royale Biryani',
      price: 24.00,
      quantity: 1,
      size: 'Large',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'c2',
      name: 'Shish Kebabs',
      price: 18.00,
      quantity: 2,
      size: 'Medium',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1000&auto=format&fit=crop',
    },
  ],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ id: string, size: string }>) => {
      state.items = state.items.filter(item => !(item.id === action.payload.id && item.size === action.payload.size));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string, size: string, delta: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id && item.size === action.payload.size);
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.delta);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  tier: string;
  ordersCount: number;
  points: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const { loginSuccess, logout, updateProfile } = authSlice.actions;

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
