/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

if (!self.define) {
  let registry = {};
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] ||
      (
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        }).then(() => {
          let promise = registry[uri];
          if (!promise) {
            throw new Error(`Module ${uri} didn’t register its module`);
          }
          return promise;
        })
      );
  };

  self.define = (depsNames, factory) => {
    const uri =
      nextDefineUri ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;

    if (registry[uri]) {
      return;
    }

    let exports = {};
    const require = depUri => singleRequire(depUri, uri);

    const specialDeps = {
      module: { uri },
      exports,
      require
    };

    registry[uri] = Promise.all(
      depsNames.map(depName => specialDeps[depName] || require(depName))
    ).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}

define(['./workbox-e43f5367'], function (workbox) {
  'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();

  // ✅ SOCKET.IO BYPASS (MAIN FIX)
  self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // ignore socket.io requests completely
    if (url.pathname.startsWith("/socket.io")) {
      return; // LET BROWSER HANDLE WEBSOCKET
    }

    // ignore websocket protocol upgrade
    if (event.request.headers.get("upgrade") === "websocket") {
      return;
    }
  });

  // ✅ normal caching rules
  workbox.registerRoute(
    "/",
    new workbox.NetworkFirst({
      cacheName: "start-url",
      plugins: [
        {
          cacheWillUpdate: async ({ response }) => {
            if (response && response.type === "opaqueredirect") {
              return new Response(response.body, {
                status: 200,
                statusText: "OK",
                headers: response.headers
              });
            }
            return response;
          }
        }
      ]
    }),
    "GET"
  );

  // ✅ all other GET requests network only
  workbox.registerRoute(
    ({ url }) => !url.pathname.startsWith("/socket.io"),
    new workbox.NetworkOnly({
      cacheName: "dev"
    }),
    "GET"
  );

});
