import { timeAgo } from "@/helpers/functions";
import { Device } from "../types/devices";

export type DisplayDevice = Device & {
  name: string;
  details: string;
  status: string | null;
  isActive: boolean;
};

export const toDisplayDevice = (
  device: Device,
  mostRecentId: string,
): DisplayDevice => ({
  ...device,
  name: `${device.platform === "ios" ? "iOS" : "Android"} device`,
  details: `${device.platform === "ios" ? "iOS" : "Android"} · Last seen ${timeAgo(device.lastSeenAt)} · Push enabled`,
  status: device.id === mostRecentId ? "Current" : null,
  isActive: device.id === mostRecentId,
});
