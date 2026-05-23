import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // peut contenir quantity
      const existing = state.cart.find((i) => i.id === item.id);

      if (existing) {
        // On ajoute la quantité envoyée (ou 1 par défaut)
        existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      } else {
        state.cart.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((i) => i.id !== action.payload);
    },

    increaseQty: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.cart.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cart = state.cart.filter((i) => i.id !== action.payload);
      }
    },

    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
