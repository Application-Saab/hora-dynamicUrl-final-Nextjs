import React, { useEffect, useState } from "react";
import '../app/globals.css';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import Link from 'next/link';
import { useRouter } from 'next/router'; 
import WhatsAppIcon from "../app/Whatsapp";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(router.asPath);

    // Google Tag Manager script
    (function (w, d, s, l, i) {
      console.log('run', router.pathname);
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js', pageName: router.pathname });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log('GTM Script Loaded'); // Debugging log
    })(window, document, 'script', 'dataLayer', 'GTM-K3SCKLTZ');
  }, [router.asPath]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageLayout>
          <Component {...pageProps} />
          <div>
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>

            {/* whatapp icon */}
            <WhatsAppIcon router={router} />
          </div>
        </PageLayout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;