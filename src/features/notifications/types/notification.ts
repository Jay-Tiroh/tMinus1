// types/notification.ts
export type NotificationType =
  | "kyc"
  | "trade"
  | "deposit"
  | "withdrawal"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationMeta {
  count: number;
  unread: number;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: NotificationMeta;
}
