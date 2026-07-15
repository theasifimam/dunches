"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/lib/store";
import { hydrateCart } from "@/features/cart/cartSlice";

// Inner component so it can use useDispatch inside the Provider
function CartHydrator({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hydrateCart());
  }, [dispatch]);
  return children;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
}
