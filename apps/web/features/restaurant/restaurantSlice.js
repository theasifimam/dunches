import { createSlice } from "@reduxjs/toolkit";

const initialRestaurants = [
  {
    id: "dunches-spicy",
    name: "Dunches",
    rawName:
      "[Dunches](https://dunches.com)",
    mapRefUrl: "",
    extraMapRefUrl: "",
    address: "Fiery Roasted Spice Kitchen",
    rating: 4.9,
    phone_number: "+91 98765 43210",
    opening_hours: {
      Monday: "9:00 AM - 9:00 PM",
      Tuesday: "9:00 AM - 9:00 PM",
      Wednesday: "9:00 AM - 9:00 PM",
      Thursday: "9:00 AM - 9:00 PM",
      Friday: "9:00 AM - 9:00 PM",
      Saturday: "9:00 AM - 9:00 PM",
      Sunday: "9:00 AM - 9:00 PM",
    },
    url: "https://dunches.com",
    colors: {
      light: "#C83E2D",
      dark: "#E86553",
    },
  }
];

const initialState = {
  restaurants: initialRestaurants,
  activeRestaurantIndex: 0,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setActiveRestaurantIndex: (state, action) => {
      state.activeRestaurantIndex = action.payload;
    },
  },
});

export const { setActiveRestaurantIndex } = restaurantSlice.actions;

export const selectAllRestaurants = (state) => state.restaurant.restaurants;
export const selectActiveRestaurantIndex = (state) =>
  state.restaurant.activeRestaurantIndex;
export const selectActiveRestaurant = (state) =>
  state.restaurant.restaurants[state.restaurant.activeRestaurantIndex];

export default restaurantSlice.reducer;
