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
      console.log(product)
      // Extract the product from the payload
      const existingItem = state.cartItems.find(item => item._id === product._id);
      if (existingItem) {
        // If the product is already in the cart, update its quantity
        existingItem.quantity++;
      } else {
        // If the product is not in the cart, add it with quantity 1
        state.cartItems.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      const itemToUpdate = state.cartItems.find(item => item._id === itemId);
      if (itemToUpdate) {
        itemToUpdate.quantity = newQuantity;
      }
    },
    removeFromCart: (state, action) => {
      const  itemId  = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== itemId);
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
