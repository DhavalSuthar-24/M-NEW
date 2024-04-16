import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  cartVisible: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload; 
      const existingItemIndex = state.cartItems.findIndex(item => item._id === product._id && item.size === product.size);
      
      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex].quantity++;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
    },
    
    updateQuantity: (state, action) => {
      const { itemId, newQuantity, size } = action.payload;
      const itemToUpdate = state.cartItems.find(item => item._id === itemId && item.size === size);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
      }
    },
    
    removeFromCart: (state, action) => {
      const { itemId, size } = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== itemId || item.size !== size);
    },
    
    toggleCartVisibility: (state) => {
      state.cartVisible = !state.cartVisible;
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.cartVisible = false;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, toggleCartVisibility, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
