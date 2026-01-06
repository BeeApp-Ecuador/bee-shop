/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBu_mVAFQK5es7GCTGrhmjMxVllOnQNlGk',
  authDomain: 'bee-web-873b3.firebaseapp.com',
  projectId: 'bee-web-873b3',
  storageBucket: 'bee-web-873b3.firebasestorage.app',
  messagingSenderId: '588020396981',
  appId: '1:588020396981:web:1971bb2dfa4eb8b614dffc',
});

const messaging = firebase.messaging();

/**
 * Notificaciones cuando la app
 * está minimizada o cerrada
 */
messaging.onBackgroundMessage(function (payload) {
  console.log('[SW] Background message ', payload);

  const title = payload.notification?.title || 'Nuevo pedido';
  const options = {
    body: payload.notification?.body || 'Tienes un nuevo pedido',
    icon: '/logo.png',
    badge: '/badge.png',
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

/**
 * Al hacer click en la notificación
 */
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/orders') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/orders');
      }
    })
  );
});
