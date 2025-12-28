if (!self.define) {
  let registry = {};
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return (
      registry[uri] ||
      new Promise((resolve) => {
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

    if (registry[uri]) return;

    let exports = {};
    const require = (depUri) => singleRequire(depUri, uri);

    const specialDeps = {
      module: { uri },
      exports,
      require,
    };

    registry[uri] = Promise.all(
      depsNames.map((depName) => specialDeps[depName] || require(depName))
    ).then((deps) => {
      factory(...deps);
      return exports;
    });
  };
}

define(["./workbox-e43f5367"], function (workbox) {
  "use strict";

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();

  // IGNORE Socket.IO
  self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/socket.io")) {
      return;
    }

    if (event.request.headers.get("upgrade") === "websocket") {
      return;
    }
  });

  //  NORMAL CACHING RULES
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
                headers: response.headers,
              });
            }
            return response;
          },
        },
      ],
    }),
    "GET"
  );

  workbox.registerRoute(
    ({ url }) => !url.pathname.startsWith("/socket.io"),
    new workbox.NetworkOnly({
      cacheName: "dev",
    }),
    "GET"
  );

  // Handle push event
  self.addEventListener("push", function (event) {
    try {
      const payload = event.data
        ? event.data.json()
        : { title: "New", body: "You have a notification" };

      const title = payload.title || "New message";

      const options = {
        body: payload.body,
        icon: payload.icon || "/new_logo_light.png",
        badge: payload.badge || "/new_logo_light.png",
        data: payload.data || {},
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } catch (e) {
      console.error("Push event error:", e);
    }
  });

  // Handle notification click
  self.addEventListener("notificationclick", function (event) {
    const data = event.notification.data || {};
    const urlToOpen = data.url || `/chat?room=${data.roomId}`;

    event.notification.close();

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === urlToOpen && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) return clients.openWindow(urlToOpen);
        })
    );
  });
});
