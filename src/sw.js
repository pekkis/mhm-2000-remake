/* global self */
/* eslint no-restricted-globals: ["off", "error"] */

// const { assets } = global.serviceWorkerOption;

// When the service worker is first added to a computer.
self.addEventListener("install", e => {
  console.log("Service worker install", e);
  return;
});

self.addEventListener("activate", e => {
  console.log("Service worker activate");
});
