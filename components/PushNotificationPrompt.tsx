'use client';

import { useEffect, useState } from 'react';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  requestNotificationPermission,
  isPushNotificationSupported,
  getPushNotificationPermission,
} from '@/lib/notifications/push';

export default function PushNotificationPrompt() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const supported = isPushNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      const perm = getPushNotificationPermission();
      setPermission(perm);

      // Check if already subscribed
      if (perm === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }

      // Show prompt if not asked before
      if (perm === 'default') {
        // Wait a bit before showing prompt (not on first load)
        setTimeout(() => {
          const hasAsked = localStorage.getItem('push-notification-asked');
          if (!hasAsked) {
            setShowPrompt(true);
          }
        }, 5000);
      }
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        setIsSubscribed(true);
        setPermission('granted');
        setShowPrompt(false);
        localStorage.setItem('push-notification-asked', 'true');
      } else {
        alert('Gagal mengaktifkan notifikasi. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const success = await unsubscribeFromPushNotifications();
      if (success) {
        setIsSubscribed(false);
        alert('Notifikasi telah dinonaktifkan');
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
      alert('Gagal menonaktifkan notifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push-notification-asked', 'true');
  };

  if (!isSupported) {
    return null;
  }

  // Floating prompt
  if (showPrompt && permission === 'default') {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-sm">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">Aktifkan Notifikasi</h3>
                <p className="text-purple-100 text-sm">Dapatkan update terbaru</p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white hover:text-purple-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-gray-700 text-sm mb-4">
              Aktifkan notifikasi untuk mendapatkan update pembayaran, pesanan, dan informasi penting lainnya secara real-time.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Memproses...' : 'Aktifkan'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Notification status badge (always visible)
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isSubscribed ? (
        <button
          onClick={handleDisableNotifications}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          title="Notifikasi aktif - Klik untuk menonaktifkan"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-sm font-medium">Notifikasi Aktif</span>
        </button>
      ) : permission === 'denied' ? (
        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-full shadow-lg text-sm font-medium">
          Notifikasi Diblokir
        </div>
      ) : null}
    </div>
  );
}
