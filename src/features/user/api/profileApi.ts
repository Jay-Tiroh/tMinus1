import {
  ProfileResponse,
  SettingsResponse,
  UpdatePinRequest,
  UpdatePinResponse,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  UserSettings,
} from "@/features/user/types/profile";
import { baseApi } from "@/core/store/services/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query<ProfileResponse, void>({
      query: () => "/me",
      providesTags: ["User", "Kyc"],
    }),
    settings: builder.query<UserSettings, void>({
      query: () => "/me/settings",
      transformResponse: (response: SettingsResponse) => response.data,
      providesTags: ["User", "Kyc"],
    }),
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileRequest>({
      query: (updateData) => ({
        url: "/me",
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: ["User", "Kyc"],
    }),
    updateSettings: builder.mutation<UserSettings, UpdateSettingsRequest>({
      query: (updateData) => ({
        url: "/me/settings",
        method: "PATCH",
        body: updateData,
      }),
      transformResponse: (response: SettingsResponse) => response.data,
      invalidatesTags: ["User", "Wallet", "Kyc", "Notifications"],
    }),
    updatePin: builder.mutation<UpdatePinResponse, UpdatePinRequest>({
      query: (pinData) => ({
        url: "/me/pin",
        method: "PATCH",
        body: pinData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useProfileQuery,
  useSettingsQuery,
  useUpdateProfileMutation,
  useUpdateSettingsMutation,
  useUpdatePinMutation,
} = profileApi;
