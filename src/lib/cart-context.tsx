"use client";

import { createContext, useContext, useReducer } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { id: number; name: string; price: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  total: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;

      if (action.payload.quantity === 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
          total: state.total - item.price * item.quantity,
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }
    case "REMOVE_ITEM": {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        total: state.total - item.price * item.quantity,
      };
    }
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  addItem: (item: { id: number; name: string; price: number }) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: { id: number; name: string; price: number }) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
