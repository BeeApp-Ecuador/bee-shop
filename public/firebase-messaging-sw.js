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

messaging.onBackgroundMessage(payload => {
  console.log('[SW] Data message', payload);
  console.log('[SW] Data message', payload);


  // self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  //   .then(clients => {
  //     clients.forEach(client => {
  //       client.postMessage({ type: 'NEW_ORDER' });
  //     });
  //   });
});



/**
 * Al hacer click en la notificación
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const TARGET_URL = `${self.location.origin}/shopv2/orders`;
  const SCOPE_PATH = '/shopv2/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then(clientList => {

      for (const client of clientList) {
        if (client.url.includes(SCOPE_PATH)) {
          client.focus();
          return client.navigate(TARGET_URL);
        }
      }

      return clients.openWindow(TARGET_URL);
    })
  );
});


