/**
 * React Hook for Notifications
 */

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getNotificationRealtime } from '@/lib/notifications/realtime';
import type { Notification } from '@/lib/notifications/types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  // Fetch notifications from database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch notifications
      const { data: notifs, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notifError) throw notifError;

      setNotifications(notifs || []);

      // Get unread count
      const { data: count, error: countError } = await supabase
        .rpc('get_unread_notification_count', { p_user_id: user.id });

      if (countError) throw countError;

      setUnreadCount(count || 0);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [supabase]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .rpc('mark_all_notifications_read', { p_user_id: user.id });

      if (error) throw error;

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, [supabase]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Update unread count if it was unread
      const wasUnread = notifications.find((n) => n.id === notificationId && !n.read);
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [supabase, notifications]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  }, [supabase]);

  // Subscribe to realtime notifications
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch initial data
      await fetchNotifications();

      // Setup realtime subscription
      const realtime = getNotificationRealtime();

      const handleNewNotification = (notification: Notification) => {
        // Add to notifications list
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/LailiLogo.png',
            tag: notification.id,
          });
        }
      };

      realtime.addHandler(handleNewNotification);
      await realtime.subscribe(user.id);

      // Cleanup
      return () => {
        realtime.removeHandler(handleNewNotification);
        realtime.unsubscribe();
      };
    };

    setupRealtime();
  }, [fetchNotifications, supabase]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  };
}
