"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/lib/store";
import { hydrateCart } from "@/features/cart/cartSlice";
import { fetchBanners } from "@/features/banner/bannerSlice";

// Inner component so it can use useDispatch inside the Provider
function AppHydrator({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateCart());
    dispatch(fetchBanners());
  }, [dispatch]);
  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AppHydrator>{children}</AppHydrator>
    </Provider>
  );
}
