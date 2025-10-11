"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: number;
  uniqueId: string;
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
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        uniqueId: string;
        quantity: number;
        options?: Record<string, string | number>;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { uniqueId: string; options?: Record<string, string | number> };
    }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (
    uniqueId: string,
    quantity: number,
    options?: Record<string, string | number>
  ) => void;
  removeItem: (
    uniqueId: string,
    options?: Record<string, string | number>
  ) => void;
  clearCart: () => void;
}>({
  state: { items: [], total: 0 },
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // หา item ที่เหมือนกันทั้ง id และ options
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

      const newTotal = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((i) => {
        if (i.uniqueId === action.payload.uniqueId) {
          // ไม่ให้ต่ำกว่า 1
          const newQty = Math.max(1, action.payload.quantity);
          return { ...i, quantity: newQty };
        }
        return i;
      });

      const newTotal = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (i) => i.uniqueId !== action.payload.uniqueId
      );

      const newTotal = newItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      return { items: newItems, total: newTotal };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (item: CartItem) =>
    dispatch({ type: "ADD_ITEM", payload: item });
  const updateQuantity = (
    uniqueId: string,
    quantity: number,
    options?: Record<string, string | number>
  ) =>
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { uniqueId, quantity, options },
    });
  const removeItem = (
    uniqueId: string,
    options?: Record<string, string | number>
  ) => dispatch({ type: "REMOVE_ITEM", payload: { uniqueId, options } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ state, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
