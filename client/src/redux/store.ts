import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/redux/services/rootAPI";
import restuarantAuthSliceReducer from "./features/authSlice/restuarantAuthSlice";
import userAuthSliceReducer from "./features/authSlice/userAuthSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    userAuth: userAuthSliceReducer,
    restaurantAuth: restuarantAuthSliceReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
