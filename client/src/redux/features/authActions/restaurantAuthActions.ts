import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../authSlice/restuarantAuthSlice";

// Define types for login and registration credentials and response data
interface RestaurantLoginCredentials {
  email: string;
  password: string;
}

interface User {
  name: string;
  role: string;
}

const backendURL = "http://localhost:5000/api";

// RESTAURANT LOGIN ACTION
export const restaurantLogin = createAsyncThunk<
  User, // Return type
  RestaurantLoginCredentials, // Thunk argument type
  { rejectValue: string } // rejectWithValue type
>(
  "auth/restaurantLogin",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      // Configure header's Content-Type as JSON
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post<User>(
        `${backendURL}/auth/admin-login`,
        { email, password },
        config
      );

      console.log(response.data, "dayta");

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("restaurantUser", JSON.stringify(response.data));
        dispatch(login(response.data));
        return response.data;
      }

      throw new Error("Failed to login!"); // Status is not in success range
    } catch (error) {
      console.log(error, "Error during restaurant login");
      if (error instanceof AxiosError) {
        if (error.response && error.response.data?.message) {
          return rejectWithValue(error.response.data.message);
        } else {
          return rejectWithValue("An unexpected error occurred.");
        }
      }

      return rejectWithValue("An unexpected error occurred.");
    }
  }
);
