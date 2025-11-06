/**
 * Supabase Realtime Integration for Notifications
 */

import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Notification, NotificationHandler } from './types';

// Re-export types for convenience
export type { Notification, NotificationHandler } from './types';

class NotificationRealtime {
  private channel: RealtimeChannel | null = null;
  private handlers: Set<NotificationHandler> = new Set();
  private userId: string | null = null;

  /**
   * Subscribe to realtime notifications
   */
  async subscribe(userId: string): Promise<void> {
    if (this.channel) {
      console.warn('Already subscribed to notifications');
      return;
    }

    this.userId = userId;
    const supabase = createClient();

    // Create channel for user's notifications
    this.channel = supabase.channel(`notifications:${userId}`);

    // Listen for INSERT events
    this.channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('New notification received:', payload);
        const notification = payload.new as Notification;
        this.notifyHandlers(notification);
      }
    );

    // Subscribe to channel
    this.channel.subscribe((status) => {
      console.log('Notification subscription status:', status);
    });

    console.log(`Subscribed to notifications for user ${userId}`);
  }

  /**
   * Unsubscribe from realtime notifications
   */
  async unsubscribe(): Promise<void> {
    if (this.channel) {
      const supabase = createClient();
      await supabase.removeChannel(this.channel);
      this.channel = null;
      this.userId = null;
      console.log('Unsubscribed from notifications');
    }
  }

  /**
   * Add notification handler
   */
  addHandler(handler: NotificationHandler): void {
    this.handlers.add(handler);
  }

  /**
   * Remove notification handler
   */
  removeHandler(handler: NotificationHandler): void {
    this.handlers.delete(handler);
  }

  /**
   * Notify all handlers
   */
  private notifyHandlers(notification: Notification): void {
    this.handlers.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    });
  }

  /**
   * Check if subscribed
   */
  isSubscribed(): boolean {
    return this.channel !== null;
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }
}

// Singleton instance
let notificationRealtimeInstance: NotificationRealtime | null = null;

export function getNotificationRealtime(): NotificationRealtime {
  if (!notificationRealtimeInstance) {
    notificationRealtimeInstance = new NotificationRealtime();
  }
  return notificationRealtimeInstance;
}

export default NotificationRealtime;
