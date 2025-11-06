/**
 * Service Worker for Push Notifications
 */

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notification', body: event.data.text() };
  }

  const title = data.title || 'Laili Brand';
  const options = {
    body: data.message || data.body || '',
    icon: '/LailiLogo.png',
    badge: '/LailiLogo.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      notificationId: data.id,
    },
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.priority === 'urgent' || data.priority === 'high',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there's already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);

  // Track notification close analytics here if needed
  const notificationId = event.notification.data?.notificationId;
  if (notificationId) {
    // Send analytics event
    console.log('Notification closed:', notificationId);
  }
});

// Handle background sync (optional - for offline support)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event);

  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    // Fetch new notifications when coming back online
    const response = await fetch('/api/notifications/sync');
    if (response.ok) {
      const data = await response.json();
      console.log('Synced notifications:', data);
    }
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}
