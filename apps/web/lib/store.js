import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '@/features/cart/cartSlice';
import menuReducer from '@/features/menu/menuSlice';
import restaurantReducer from '@/features/restaurant/restaurantSlice';
import userReducer from '@/features/user/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    menu: menuReducer,
    restaurant: restaurantReducer,
    user: userReducer,
  },
});
