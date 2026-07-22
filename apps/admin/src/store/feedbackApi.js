'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
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
  tagTypes: ['Feedback'],
  endpoints: (builder) => ({
    getFeedbacks: builder.query({
      query: ({ page = 1, limit = 20, type, source, startDate, endDate } = {}) => {
        let url = `/feedbacks?page=${page}&limit=${limit}`;
        if (type) url += `&type=${type}`;
        if (source) url += `&source=${source}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        return url;
      },
      providesTags: ['Feedback'],
      keepUnusedDataFor: 300,
    }),
    getFeedbackAnalytics: builder.query({
      query: ({ startDate, endDate, source } = {}) => {
        let url = `/feedbacks/analytics?`;
        if (startDate) url += `startDate=${startDate}&`;
        if (endDate) url += `endDate=${endDate}&`;
        if (source) url += `source=${source}&`;
        return url;
      },
      providesTags: ['Feedback'],
      keepUnusedDataFor: 300,
    }),
    createFeedback: builder.mutation({
      query: (data) => ({
        url: '/feedbacks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Feedback'],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useGetFeedbackAnalyticsQuery,
  useCreateFeedbackMutation,
} = feedbackApi;
