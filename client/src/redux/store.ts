import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/redux/services/rootAPI";
import userAuthSliceReducer from "./features/authSlice/userAuthSlice";

export const store = configureStore({
  reducer: {
    userAuth: userAuthSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
