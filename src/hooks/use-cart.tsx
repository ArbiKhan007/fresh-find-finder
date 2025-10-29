import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  id: number; // product id
  productName: string;
  price: string; // store as string to match backend; convert when calculating
  discount: number;
  quantity: number;
  image?: string;
  category?: string;
  manufacturer?: string;
  shopId?: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number; // after discount
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + (item.quantity ?? 1) };
        return next;
      }
      return [
        ...prev,
        {
          id: item.id,
          productName: item.productName,
          price: item.price,
          discount: item.discount ?? 0,
          quantity: item.quantity ?? 1,
          image: item.image,
          category: item.category,
          manufacturer: item.manufacturer,
          shopId: item.shopId,
        },
      ];
    });
  };

  const removeItem = (productId: number) => setItems((prev) => prev.filter((i) => i.id !== productId));

  const updateQty = (productId: number, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity: Math.max(1, qty) } : i)));

  const clear = () => setItems([]);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => {
      const p = parseFloat(i.price);
      if (isNaN(p)) return sum;
      const discounted = p - (p * (i.discount || 0)) / 100;
      return sum + discounted * i.quantity;
    }, 0);
  }, [items]);

  const value = { items, addItem, removeItem, updateQty, clear, count, subtotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
