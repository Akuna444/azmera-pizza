import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "../authSlice/userAuthSlice";
import { backendURL } from "@/lib/utils";

// Define types for login credentials and response data
interface LoginCredentials {
  email: string;
  password: string;
}

// LOGIN ACTION
export const userLogin = createAsyncThunk<
  User, // Return type
  LoginCredentials, // Thunk argument type
  { rejectValue: string } // rejectWithValue type
>(
  "auth/login",
  async ({ email, password, isAdmin }, { rejectWithValue, dispatch }) => {
    try {
      // Configure header's Content-Type as JSON
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post<User>(
        `${backendURL}/api/auth/${isAdmin ? "admin-login" : "login"}`,
        { email, password },
        config
      );

      // Check if response is successful
      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch(login(response.data));
        return response.data;
      }

      throw new Error("Failed to login!"); // Status is not in success range
    } catch (error) {
      console.error("Error during login", error);

      // Handle AxiosError specifically
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to login";
        return rejectWithValue(message); // Use rejectWithValue for error handling
      }

      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(
      `${backendURL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );

    // Dispatch a logout action to your Redux store (optional, depending on your implementation)
    dispatch(logout());
  } catch (error) {
    console.error("Logout error:", error);
  }
};
