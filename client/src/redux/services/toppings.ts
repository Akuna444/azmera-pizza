import apiSlice from "./rootAPI";

export const toppingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllToppings: builder.query({
      query: () => ({
        url: `/toppings/all`,
      }),
      providesTags: ["Toppings"],
    }),
    postToppings: builder.mutation({
      query: (data) => ({
        url: `/toppings/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Toppings"],
    }),
  }),
});

export const { useGetAllToppingsQuery, usePostToppingsMutation } =
  toppingApiSlice;
