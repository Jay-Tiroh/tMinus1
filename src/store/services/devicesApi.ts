import {
  DeleteDeviceResponse,
  DevicesResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
} from "@/types/devices";
import { baseApi } from "./baseApi";

const devicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<DevicesResponse, void>({
      query: () => "/me/devices",
      providesTags: ["Devices"],
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
      invalidatesTags: ["Devices"],
    }),
    deleteDevice: builder.mutation<DeleteDeviceResponse, string>({
      query: (deviceId) => ({
        url: `/me/devices/${deviceId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Devices"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDevicesQuery,
  useRegisterDeviceMutation,
  useDeleteDeviceMutation,
} = devicesApi;
