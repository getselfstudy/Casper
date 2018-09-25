importScripts("/assets/components/precache-manifest.594f3cac9a426cbdcbc20cf29d7ff837.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

/* eslint-disable no-undef */

// Write your own Service Worker related code here. You don't need to implement
// caching strategies, as Workbox will auto-inject that part when you build your
// project. This is the perfect place to implement other great SW features.
// (e.g. Web Push, etc...)
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.suppressWarnings();

// This part is needed by the webpack Workbox plugin to inject the precache manifest.
// See https://developers.google.com/web/tools/workbox/modules/workbox-precaching
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// See https://developers.google.com/web/tools/workbox/modules/workbox-routing
workbox.routing.registerNavigationRoute('/index.html');
workbox.routing.registerRoute(
    new RegExp('/assets/built/vendor/(?!.*loader).*.js$'),
    workbox.strategies.staleWhileRevalidate(),
    'GET'
);
workbox.routing.registerRoute(
    new RegExp('/'),
    ({url, event, params}) => {
        return fetch(event.request)
            .then((response) => {
                return response.text();
            })
            .then((responseBody) => {
                return new Response(`${responseBody} <!-- Look Ma. Added Content. -->`);
            });
    },
    'POST'
);

// Uncomment next line to enable offline Google Analytics
// workbox.googleAnalytics.initialize();

