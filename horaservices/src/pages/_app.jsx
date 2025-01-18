// pages/_app.tsx
import React, { useState, useEffect } from "react";
import '../app/globals.css';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-icon.png";

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log('GTM Script Loade22d'); 
    })(window, document, 'script', 'dataLayer', 'GTM-K3SCKLTZ');
  }, []);

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
          </div>
          <div>
            {/* <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
              <Image className='whatappicon' src={whatsppicon} alt="WhatsApp Icon" />
            </Link> */}
          </div>
        </PageLayout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
