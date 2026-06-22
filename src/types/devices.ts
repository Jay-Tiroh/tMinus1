export interface Device {
  id: string;
  userId: string;
  expoPushToken: string;
  platform: "ios" | "android";
  createdAt: string;
  lastSeenAt: string;
}

export interface DevicesResponse {
  data: Device[];
  meta: {
    requestId: string;
    count: number;
    pushNotificationsEnabled: boolean;
  };
}

export interface RegisterDeviceRequest {
  expoPushToken: string;
  platform: "ios" | "android";
}

export interface RegisterDeviceResponse {
  data: Device;
  meta: {
    requestId: string;
  };
}

export interface DeleteDeviceResponse {
  data: {
    deleted: boolean;
    deviceId: string;
  };
  meta?: {
    requestId: string;
  };
}
