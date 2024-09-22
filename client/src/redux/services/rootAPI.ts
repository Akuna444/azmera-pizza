import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const addTokenToRequest = async (headers, { getState }) => {
  const state = getState();
  const token = state.auth.userData.accessToken;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      return addTokenToRequest(headers, { getState });
    },
  }),
  endpoints: (builder) => ({}),
  // this func will refetch the datas when page focused
  refetchOnFocus: true,
});

export default apiSlice;
