import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/new_logo_light.png" />
        <link rel="icon" href="/new_logo_light.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.pwaDeferredPrompt = null;
      window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        window.pwaDeferredPrompt = e;
        console.log('🔥 [Early] beforeinstallprompt event captured');
      });
    `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Register service worker for A2HS */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/firebase-messaging-sw.js')
                    .then(reg => console.log(' SW registered:', reg.scope))
                    .catch(err => console.error('❌ SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}
