import apiSlice from "../rootAPI";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: `/users`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllUsersQuery } = userApiSlice;
