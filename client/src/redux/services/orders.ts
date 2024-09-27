import apiSlice from "./rootAPI";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: `/orders/all`,
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApiSlice;
