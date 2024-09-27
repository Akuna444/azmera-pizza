"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { restaurantLogin } from "../authActions/restaurantAuthActions";
import { getFromLocalStorage } from "@/lib/utils";

export interface restaurantUserData {
  id: number;
  full_name: string;
  email: string;
  accessToken: string;
  role: string; // For restaurant, the role can just be a string (e.g., "restaurant_manager")
  refreshToken: string;
  restaurantId: number; // Manager's associated restaurant
}

// Define types for the restaurant manager and state
export interface restaurantUser {
  data: restaurantUserData;
  token: string;
}

interface RestaurantAuthState {
  loading: boolean;
  managerData: restaurantUserData | undefined;
  token: string | undefined;
  error: string | undefined;
  success: boolean;
}

// Initialize restaurantUser from local storage
const restaurantUser: restaurantUser | null = getFromLocalStorage(
  "restaurantUser"
)
  ? JSON.parse(getFromLocalStorage("restaurantUser") as string)
  : null;

const initialState: RestaurantAuthState = {
  loading: false,
  managerData: restaurantUser,
  token: restaurantUser?.token,
  error: undefined,
  success: false,
};

const restaurantAuthSlice = createSlice({
  name: "restaurantUser",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("restaurantUser"); // Remove restaurant manager data from local storage
      state.loading = false;
      state.managerData = undefined;
      state.token = undefined;
      state.error = undefined;
    },
    login: (state, { payload }: PayloadAction<restaurantUser>) => {
      state.managerData = payload;
      state.token = payload.token;
    },
  },
  extraReducers: (builder) => {
    // Handle restaurant login
    builder.addCase(restaurantLogin.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(restaurantLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.managerData = payload;
      state.token = payload.token;
      state.success = true;
    });
    builder.addCase(restaurantLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

export const { logout, login } = restaurantAuthSlice.actions;
export default restaurantAuthSlice.reducer;
