import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v1/users',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/',
            providesTags: ['User'],
        }),
        getUserById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'User', id }],
        }),
        createUser: builder.mutation({
            query: (body) => ({
                url: '/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => ['User', { type: 'User', id }],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = userApi;
