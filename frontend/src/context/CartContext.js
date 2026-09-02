import { createContext, useContext, useMemo, useState } from "react";

// Shared cart "brain" — any screen can add/remove items.

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Each item: { ...product fields, qty }
  const [items, setItems] = useState([]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function increaseQty(productId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(productId) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getQty(productId) {
    return items.find((item) => item.id === productId)?.qty ?? 0;
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    getQty,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
