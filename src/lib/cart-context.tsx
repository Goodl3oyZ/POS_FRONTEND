"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";

export interface CartItem {
  id: number;
  uniqueId: string; // unique ต่อเมนู+option
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string | number>;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type Action =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { uniqueId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { uniqueId: string } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  removeItem: (uniqueId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (i) => i.uniqueId === action.payload.uniqueId
      );

      let newItems;
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.items, action.payload];
      }

      const newTotal = Number(
        newItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
      );

      return { items: newItems, total: newTotal };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((i) =>
        i.uniqueId === action.payload.uniqueId
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      const newTotal = Number(
        newItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
      );
      return { items: newItems, total: newTotal };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (i) => i.uniqueId !== action.payload.uniqueId
      );
      const newTotal = Number(
        newItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
      );
      return { items: newItems, total: newTotal };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    case "SET_CART":
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // ✅ โหลดจาก localStorage เมื่อเปิดหน้า
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "SET_CART", payload: parsed });
      } catch {
        console.warn("Invalid cart data in storage");
      }
    }
  }, []);

  // ✅ บันทึกลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem = (item: CartItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });
  const updateQuantity = (uniqueId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { uniqueId, quantity } });
  const removeItem = (uniqueId: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { uniqueId } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ state, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
