import apiSlice from "./rootAPI";

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => ({
        url: `/roles/all`,
      }),
      providesTags: ["Roles"],
    }),
    postRoles: builder.mutation({
      query: (data) => ({
        url: `/roles/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const { useGetAllRolesQuery, usePostRolesMutation } = rolesApiSlice;
