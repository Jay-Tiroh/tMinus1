import {
  AuthResponse,
  AuthResponseData,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import { Notification, NotificationsResponse } from "@/types/notification";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://crypto-api-guwm.onrender.com",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseData, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),
    register: builder.mutation<AuthResponseData, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: AuthResponse) => response.data,
    }),
    notifications: builder.query<NotificationsResponse, void>({
      query: () => "/me/notifications",
      transformResponse: (response: NotificationsResponse) => response,
    }),
    markNotificationRead: builder.mutation<void, Notification>({
      query: (notification) => ({
        url: `/me/notifications/${notification.id}/read`,
        method: "POST",
      }),
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/me/notifications/read-all",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = baseApi;
