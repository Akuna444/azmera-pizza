import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure for an order item
interface OrderItem {
  pizzaId: string;
  quantity: number;
  customToppings: string[];
}

// Define the cart state structure
interface CartState {
  orderItems: OrderItem[];
}

// Initial state for the cart
const initialState: CartState = {
  orderItems: [],
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add an item to the cart
    addItemToCart: (
      state,
      action: PayloadAction<{ pizzaId: string; quantity: number; customToppings: string[] }>
    ) => {
      const { pizzaId, quantity, customToppings } = action.payload;
      const existingItem = state.orderItems.find((item) => item.pizzaId === pizzaId);

      if (existingItem) {
        // If the item already exists, update the quantity and toppings
        existingItem.quantity += quantity;
        existingItem.customToppings = customToppings;
      } else {
        // Otherwise, add the new item to the cart
        state.orderItems.push({ pizzaId, quantity, customToppings });
      }
    },

    // Action to remove an item from the cart
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.orderItems = state.orderItems.filter((item) => item.pizzaId !== action.payload);
    },

    // Action to clear the entire cart
    clearCart: (state) => {
      state.orderItems = [];
    },
  },
});

// Export the actions
export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;

// Export the reducer
export default cartSlice.reducer;
