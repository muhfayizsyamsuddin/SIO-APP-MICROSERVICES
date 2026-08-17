self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'SIO Restaurant',
      {
        body: data.body || 'Ada pemberitahuan baru',
        icon: '/vite.svg',
        data: data.data || {}
      }
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((clientList) => {
        for (const client of clientList) {
        if ('focus' in client) {
            return client.focus();
        }
        }

        if (self.clients.openWindow) {
        return self.clients.openWindow('/');
        }
    })
    );
});