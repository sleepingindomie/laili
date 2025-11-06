/**
 * Notification Types
 */

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'order' | 'coaching' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  read_at: string | null;
  action_url: string | null;
  action_label: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export type NotificationHandler = (notification: Notification) => void;

export type NotificationType = Notification['type'];
export type NotificationPriority = Notification['priority'];
