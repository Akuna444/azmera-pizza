import apiSlice from "./rootAPI";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: `/orders/all`,
      }),
      providesTags: ["Orders"],
    }),
    postOrder: builder.mutation({
      query: (data) => ({
        url: `/orders/add`,
        method: "POST",
        body: status,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation({
      query: ({ status, id }) => ({
        url: `/orders/update/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  usePostOrderMutation,
} = orderApiSlice;
