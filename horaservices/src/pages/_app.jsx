// pages/_app.tsx
import { React, useEffect , useState} from "react";
import '../app/globals.css';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-icon.png";
import { useRouter } from 'next/router'; // Import useRouter

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl , setCurrentUrl] = useState('');
  useEffect(() => {
    setCurrentUrl(router.asPath);
    // Google Tag Manager script
    (function (w, d, s, l, i) {
      console.log('run', router.pathname);
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' , pageName: router.pathname,  });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log('GTM Script Loade22d'); // Debugging zlog
    })(window, document, 'script', 'dataLayer', 'GTM-K3SCKLTZ');
  }, [router.asPath]);

  const DecorationHandleClick = () => {
    console.log('decorationclicked');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_page_whatsappclick",
      pageUrl: window.location.href,
      productName: "decoration page whatsapp button clicked",
    });
    console.log(window.dataLayer, "chefforpartyhandleclick");
  };

  const ChefForPartyHandleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "chefforparty_page_whatsappclick", 
      pageUrl: window.location.href,          
      productName: "chef for party page whatsapp button clicked", 
    });
    console.log(window.dataLayer, "chefforpartyhandleclick");
  };

  // const loginWhatsppClick = () => {
  //   window.dataLayer = window.dataLayer || [];
  //   window.dataLayer.push({
  //     event: "login_page_whatsappclick", 
  //     pageUrl: window.location.href,          
  //     productName: "login whatsapp button clicked", 
  //   });
  //   console.log(window.dataLayer, "login wahtsapp click");
  // }

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

            {

            }
            <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
              <Image 
              className='whatappicon'
               src={whatsppicon} 
               alt="WhatsApp Icon"
              onClick={
                  currentUrl === '/balloon-decoration'  ? DecorationHandleClick 
                  : currentUrl === '/book-chef-cook-for-party' ? ChefForPartyHandleClick
                  // : currentUrl === '/login' ? loginWhatsppClick
                  : ''
                }
                />
            </Link>
          </div>
        </PageLayout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
