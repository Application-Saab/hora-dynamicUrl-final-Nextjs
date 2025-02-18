// pages/_app.tsx
import { React, useEffect , useState} from "react";
import '../app/globals.css';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";
import { useRouter } from 'next/router'; // Import useRouter

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  const { catValue , productName} = router.query; 

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
      console.log('GTM Script Loaded'); // Debugging zlog
    })(window, document, 'script', 'dataLayer', 'GTM-K3SCKLTZ');
  }, [router.asPath]);

  const DecorationHandleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_page_whatsappclick",
      pageUrl: window.location.href,
      productName: "decoration page whatsapp button clicked",
    });
  };

  const ChefForPartyHandleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "chefforparty_page_whatsappclick", 
      pageUrl: window.location.href,          
      productName: "chef for party page whatsapp button clicked", 
    });
  };

  const DecorationCatergorypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productlistedpage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productlist_categorypage_whatsapp_click_${catValue}`, 
    });
  };

  const DecorationProductPagepagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productpage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productpage_whatsapp_click_${productName}`, 
    });
  }

  const DecorationcityhatsappClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "decoration_citypage_whatsappclick", 
      pageUrl: window.location.href,          
      productName: "decoration page whatsapp button clicked", 
    });
  }

  const DecorationCatergorycitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productlistedcitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productlistedcitypage_whatsapp_click`, 
    });
  };

  const DecorationProductPageCitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productcitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productcitypage_whatsapp_click`, 
    });
  }


  const DecorationlocalityhatsappClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_localitypage_whatsappclick',
      pageUrl: window.location.href,          
      productName: `decoration_localitypage_whatsappclick`, 
    });
  }


  const DecorationCheckoutpagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_checkoutpage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_checkoutpage_whatsapp_click`, 
    });
  }

  const DecorationCatergorylocalitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productlistedlocalitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productlistedlocalitypage_whatsapp_click`, 
    });
  };


  const DecorationProductPageLocalitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_productlocalitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_productlocalitypage_whatsapp_click`, 
    });
  }


  const DecorationHomepageLocalitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_homepagelocalitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_homepagelocalitypage_whatsapp_click`, 
    });
  }

  const DecorationHomepagecitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'decoration_citypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `decoration_citypage_whatsapp_click`, 
    });
  }

  const ChefForPartypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'chefforpartypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `chefforpartypage_whatsapp_click`, 
    });
  }

  const ChefForPartyOrderdetailspagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'chefforpartyorderdetailspage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `chefforpartyorderdetailspage_whatsapp_click`, 
    });
  }

  const ChefForPartyCheckoutpagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'chefforparty_checkout_whatsapp',
      pageUrl: window.location.href,          
      productName: `chefforparty_checkout_whatsapp`, 
    });
  }

  const ChefForPartycitypagewhatsppClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'chefforpartycitypage_whatsapp_click',
      pageUrl: window.location.href,          
      productName: `chefforpartycitypage_whatsapp_click`, 
    });
  }
  
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

  
            <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
              <Image 
              className='whatappicon'
               src={whatsppicon} 
               alt="WhatsApp Icon"
               onClick={() => {
                if (router.pathname === '/balloon-decoration') {
                  DecorationHandleClick();
                } else if (router.pathname === '/book-chef-cook-for-party') {
                  ChefForPartyHandleClick();
                } 
                else if (router.pathname === '/balloon-decoration/[catValue]'){
                  DecorationCatergorypagewhatsppClick();
                }
                else if (router.pathname === '/balloon-decoration/[catValue]/product/[productName]'){
                  DecorationProductPagepagewhatsppClick();
                }
                else if (router.pathname === '/[city]/balloon-decoration'){
                  DecorationcityhatsappClick();
                }
                else if (router.pathname === '/[city]/balloon-decoration/[catValue]'){
                  DecorationCatergorycitypagewhatsppClick();
                }
                else if (router.name === '/[city]/balloon-decoration/[catValue]/product/[productName]'){
                  DecorationProductPageCitypagewhatsppClick();
                } 
                else if (router.pathname === '/checkout'){
                  DecorationCheckoutpagewhatsppClick();
                }
                else if (router.pathname === '/[city]/[locality]/balloon-decoration'){
                  DecorationlocalityhatsappClick();
                }
                else if (router.pathname === '/[city]/[locality]/balloon-decoration/[catValue]'){
                  DecorationCatergorylocalitypagewhatsppClick();
                }
                else if (router.pathname === '/[city]/[locality]/balloon-decoration/[catValue]/product/[productName]'){
                  DecorationProductPageLocalitypagewhatsppClick();
                }
                else if (router.pathname === '/[city]/[locality]'){
                  DecorationHomepageLocalitypagewhatsppClick();
                }
                else if (router.pathname === '/[city]'){
                  DecorationHomepagecitypagewhatsppClick();
                }
                else if (router.pathname === '/book-chef-cook-for-party'){
                  ChefForPartypagewhatsppClick();
                }
                else if (router.pathname === '/book-chef-cook-for-party/order-details'){
                  ChefForPartyOrderdetailspagewhatsppClick();
                }
                else if (router.pathname === '/book-chef-checkout'){
                  ChefForPartyCheckoutpagewhatsppClick();
                }
                else if (router.pathname === '/[city]/book-chef-cook-for-party'){
                  ChefForPartycitypagewhatsppClick();
                }
              }}
                />
            </Link>
          </div>
        </PageLayout>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
