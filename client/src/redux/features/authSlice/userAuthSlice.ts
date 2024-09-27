import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogin } from "../authActions/userAuthActions";
import { getFromLocalStorage } from "@/lib/utils";

interface UserData {
  id: number;
  full_name: string;
  gender: string;
  email: string;
  username: string;
  accessToken: string;
  profilePicture: string; // Image URL as a string
  role: string;
  token: string; // role is an object containing role_name
  refreshToken: string;
  department: string;
}

// Define types for the user and state

interface AuthState {
  loading: boolean;
  userData: UserData | undefined;
  role: string | undefined;
  token: string | undefined;
  error: string | undefined;
  success: boolean;
}

// Initialize userToken from local storage
const user: UserData | null = getFromLocalStorage("user")
  ? JSON.parse(getFromLocalStorage("user") as string)
  : null;

const initialState: AuthState = {
  loading: false,
  userData: user, // Access role_name from the role object
  token: user?.token,
  role: user?.role,
  error: undefined,
  success: false,
};

const userAuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user"); // Remove user data from local storage
      state.loading = false;
      state.userData = undefined;
      state.token = undefined;
      state.role = undefined;
      state.error = undefined;
    },
    login: (state, { payload }: PayloadAction<UserData>) => {
      state.userData = payload;
      state.role = payload.role; // Access role_name from role object
      state.token = payload.token;
    },
  },
  extraReducers: (builder) => {
    // Handle user login
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.userData = payload;
      state.token = payload.token;
      state.role = payload.role; // Access role_name from role object
      state.success = true;
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload as string;
    });
  },
});

export const { logout, login } = userAuthSlice.actions;
export default userAuthSlice.reducer;
