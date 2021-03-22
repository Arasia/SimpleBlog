---
layout: compress
---

/* Registering Service Worker */
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('{{ "/sw.js" | relative_url }}').then(
    (registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      console.log('ServiceWorker registration failed: ', err);
  });
};
