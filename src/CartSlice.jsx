import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      const { id, name, emoji, priceEur } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) existing.quantity += 1;
      else state.items.push({ id, name, emoji, priceEur, quantity: 1 });
    },
    removeItem: (state, action) => { state.items = state.items.filter((item) => item.id !== action.payload.id); },
    updateQuantity: (state, action) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing && Number.isInteger(action.payload.quantity) && action.payload.quantity > 0) {
        existing.quantity = action.payload.quantity;
      }
    },
  },
});
export const { addItem, removeItem, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
