import { backendURL } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const addTokenToRequest = async (headers, { getState }) => {
  const state = getState();
  const token = state.userAuth.token;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Orders", "Toppings", "Pizzas", "Roles"],
  baseQuery: fetchBaseQuery({
    baseUrl: backendURL,
    prepareHeaders: (headers, { getState }) => {
      return addTokenToRequest(headers, { getState });
    },
  }),
  endpoints: (builder) => ({}),
  // this func will refetch the datas when page focused
  refetchOnFocus: true,
});

export default apiSlice;
