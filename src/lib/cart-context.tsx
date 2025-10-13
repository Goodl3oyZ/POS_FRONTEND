// lib/cart-context.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

export type ModifierChoice = { id: string; name: string; price: number };

export type CartItem = {
  uniqueId: string;
  menuItemId: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  modifiers: ModifierChoice[];
  note?: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

export type AddItemInput = {
  menuItemId: string;
  name: string;
  imageUrl?: string;
  basePrice: number;
  modifiers?: ModifierChoice[];
  note?: string;
  quantity?: number;
};

type Action =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: CartItem }
  | { type: "UPDATE_QTY"; uniqueId: string; quantity: number }
  | { type: "REMOVE"; uniqueId: string }
  | { type: "CLEAR" };

const STORAGE_KEY = "pos.cart.v1";
const INITIAL: CartState = { items: [], subtotal: 0, itemCount: 0 };

const normalizeNote = (s?: string) => (s || "").trim().toLowerCase();
const uniqueIdOf = (
  menuItemId: string,
  modifiers: ModifierChoice[] = [],
  note?: string
) => {
  const modKey = [...modifiers]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => `${m.id}:${Number(m.price).toFixed(2)}`)
    .join("|");
  return `${menuItemId}__${modKey}__${normalizeNote(note)}`;
};

const unitPrice = (i: Omit<CartItem, "uniqueId">) =>
  i.basePrice + (i.modifiers?.reduce((s, m) => s + (m.price || 0), 0) || 0);

const recalc = (items: CartItem[]): CartState => {
  const subtotal = items.reduce((s, i) => s + unitPrice(i) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  return { items, subtotal, itemCount };
};

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE": {
      return recalc(action.items || []);
    }
    case "ADD": {
      const idx = state.items.findIndex(
        (x) => x.uniqueId === action.item.uniqueId
      );
      const items =
        idx >= 0
          ? state.items.map((x, i) =>
              i === idx
                ? { ...x, quantity: x.quantity + action.item.quantity }
                : x
            )
          : [...state.items, action.item];
      return recalc(items);
    }
    case "UPDATE_QTY": {
      const items = state.items
        .map((x) =>
          x.uniqueId === action.uniqueId
            ? { ...x, quantity: action.quantity }
            : x
        )
        .filter((x) => x.quantity > 0);
      return recalc(items);
    }
    case "REMOVE": {
      return recalc(state.items.filter((x) => x.uniqueId !== action.uniqueId));
    }
    case "CLEAR": {
      return INITIAL;
    }
    default:
      return state;
  }
}

type Ctx = {
  state: CartState;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  addItem: (input: AddItemInput) => void;
  updateQty: (uniqueId: string, quantity: number) => void;
  removeItem: (uniqueId: string) => void;
  clearCart: () => void;
  buildOrderPayload: (opts: {
    channel: "DINEIN" | "TAKEAWAY";
    tableId?: string | null;
  }) => {
    channel: string;
    table_id?: string | null;
    items: Array<{
      menu_item_id: string;
      quantity: number;
      modifiers: { id: string }[];
      note?: string;
    }>;
  };
};

const CartContext = createContext<Ctx | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const hydrated = useRef(false);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const items = Array.isArray(parsed?.items)
          ? (parsed.items as CartItem[])
          : [];
        dispatch({ type: "HYDRATE", items });
      }
    } catch (e) {
      console.warn("cart hydrate failed", e);
    } finally {
      hydrated.current = true;
    }
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch (e) {
      console.warn("cart persist failed", e);
    }
  }, [state.items]);

  const addItem = useCallback((input: AddItemInput) => {
    const modifiers = input.modifiers || [];
    const uniqueId = uniqueIdOf(input.menuItemId, modifiers, input.note);
    dispatch({
      type: "ADD",
      item: {
        uniqueId,
        menuItemId: input.menuItemId,
        name: input.name,
        imageUrl: input.imageUrl,
        basePrice: Number(input.basePrice),
        modifiers,
        note: input.note,
        quantity: Math.max(1, input.quantity || 1),
      },
    });
  }, []);

  const updateQty = useCallback((uniqueId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", uniqueId, quantity });
  }, []);

  const removeItem = useCallback((uniqueId: string) => {
    dispatch({ type: "REMOVE", uniqueId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const buildOrderPayload: Ctx["buildOrderPayload"] = useCallback(
    (opts) => ({
      channel: opts.channel,
      table_id: opts.channel === "DINEIN" ? opts.tableId || null : null,
      items: state.items.map((i) => ({
        menu_item_id: i.menuItemId,
        quantity: i.quantity,
        modifiers: (i.modifiers || []).map((m) => ({ id: m.id })),
        note: i.note || undefined,
      })),
    }),
    [state.items]
  );

  const value = useMemo<Ctx>(
    () => ({
      state,
      items: state.items,
      subtotal: state.subtotal,
      itemCount: state.itemCount,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      buildOrderPayload,
    }),
    [state, addItem, updateQty, removeItem, clearCart, buildOrderPayload]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
