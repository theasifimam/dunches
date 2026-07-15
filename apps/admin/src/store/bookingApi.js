'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Booking'],
    endpoints: (builder) => ({
        getAllBookings: builder.query({
            query: ({ page = 1, limit = 20, status, date, search }) => {
                let url = `/bookings?page=${page}&limit=${limit}`;
                if (status && status !== 'All Status' && status !== 'All') {
                    url += `&status=${status.toLowerCase()}`;
                }
                if (date) {
                    url += `&date=${date}`;
                }
                if (search) {
                    url += `&search=${encodeURIComponent(search)}`;
                }
                return url;
            },
            providesTags: ['Booking'],
        }),
        updateBookingStatus: builder.mutation({
            query: ({ id, bookingStatus, paymentStatus }) => ({
                url: `/bookings/${id}/status`,
                method: 'PATCH',
                body: { bookingStatus, paymentStatus },
            }),
            invalidatesTags: (result, error, { id }) => ['Booking', { type: 'Booking', id }],
        }),
        cancelBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, id) => ['Booking', { type: 'Booking', id }],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
    useUpdateBookingStatusMutation,
    useCancelBookingMutation,
} = bookingApi;
