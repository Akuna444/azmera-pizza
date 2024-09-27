import apiSlice from "./rootAPI";

export const toppingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPizzas: builder.query({
      query: () => ({
        url: `/pizzas/all`,
      }),
      providesTags: ["Pizzas"],
    }),
    postPizzas: builder.mutation({
      query: (data) => ({
        url: `/pizzas/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pizzas"],
    }),
  }),
});

export const { useGetAllPizzasQuery, usePostPizzasMutation } = toppingApiSlice;
