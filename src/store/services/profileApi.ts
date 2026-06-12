import {
  ProfileResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  SettingsResponse,
  UpdatePinRequest,
  UpdatePinResponse,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  UserSettings,
} from "@/types/profile";
import { baseApi } from "./baseApi";

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
      invalidatesTags: ["User"],
    }),
    updatePin: builder.mutation<UpdatePinResponse, UpdatePinRequest>({
      query: (pinData) => ({
        url: "/me/pin",
        method: "PATCH",
        body: pinData,
      }),
    }),
    registerDevice: builder.mutation<
      RegisterDeviceResponse,
      RegisterDeviceRequest
    >({
      query: (deviceData) => ({
        url: "/me/devices",
        method: "POST",
        body: deviceData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useProfileQuery,
  useSettingsQuery,
  useUpdateProfileMutation,
  useUpdateSettingsMutation,
  useUpdatePinMutation,
  useRegisterDeviceMutation,
} = profileApi;
