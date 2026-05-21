import {
  ProfileResponse,
  SettingsResponse,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  UserSettings,
} from "@/types/profile";
import { baseApi } from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query<ProfileResponse, void>({
      query: () => "/me",
      providesTags: ["User"], // <-- Add this here just in case
    }),
    settings: builder.query<UserSettings, void>({
      query: () => "/me/settings",
      transformResponse: (response: SettingsResponse) => response.data,
      providesTags: ["User"], // <-- ADD THIS LINE! This links the cache to the tag
    }),
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (updateData) => ({
        url: "/me",
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["User"],
    }),
    updateSettings: builder.mutation<UserSettings, UpdateSettingsRequest>({
      query: (updateData) => ({
        url: "/me/settings",
        method: "PATCH",
        body: updateData,
      }),
      transformResponse: (response: SettingsResponse) => response.data,
      invalidatesTags: ["User"], // This now successfully triggers a refetch of `settings`
    }),
  }),
  overrideExisting: false,
});

export const {
  useProfileQuery,
  useSettingsQuery,
  useUpdateProfileMutation,
  useUpdateSettingsMutation,
} = profileApi;
