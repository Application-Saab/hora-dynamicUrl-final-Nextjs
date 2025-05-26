// pages/_app.tsx
import { React, useEffect, useState } from "react";
// import '../app/globals.css';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { useRouter } from 'next/router'; // Import useRouter
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../app/custom.css";
import Link from "next/link";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  const { catValue, productName } = router.query;

  // useEffect(() => {
  //   setCurrentUrl(router.asPath);
  //   // Google Tag Manager script
  //   (function (w, d, s, l, i) {
  //     console.log('run', router.pathname);
  //     w[l] = w[l] || [];
  //     w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js', pageName: router.pathname });
  //     var f = d.getElementsByTagName(s)[0],
  //       j = d.createElement(s),
  //       dl = l != 'dataLayer' ? '&l=' + l : '';
  //     j.async = true;
  //     j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  //     f.parentNode.insertBefore(j, f);
  //     console.log('GTM Script Loaded'); // Debugging log
  //   })(window, document, 'script', 'dataLayer', 'GTM-K3SCKLTZ');
  // }, [router.asPath]);




  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PageLayout>
          <Component {...pageProps} />
          <div>
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<iframe 
                       src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
                       height="0" 
                       width="0" 
                       style="display:none;visibility:hidden"
                     ></iframe>`,
              }}
            />
            <Script
              id="gtm-script"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K3SCKLTZ');
          `,
              }}
            />
            <Link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"/>
          </div>
        </PageLayout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;