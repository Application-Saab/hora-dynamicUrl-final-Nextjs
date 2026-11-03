// pages/_app.jsx
import '../app/globals.css';
import { useEffect, useState } from 'react';
import PageLayout from '@/components/pagelayout';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { store, persistor } from '../store/store';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-icon.webp";

const GTM_ID = "GTM-K3SCKLTZ";

function MyApp({ Component, pageProps }) {
  // Pages that read the URL query or localStorage while rendering set
  // `Page.clientOnly = true`; they keep rendering in the browser only, while
  // every other page is prerendered with its real content.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const page = Component.clientOnly && !mounted
    ? <div style={{ minHeight: "70vh" }} aria-busy="true" />
    : <Component {...pageProps} />;

  return (
    <Provider store={store}>
      {/*
        PersistGate used to render `loading={null}` until the saved state was
        restored in the browser, so every page was exported as an empty body.
        With a function child it always renders the page; the persisted values
        (subCategory, product, ...) simply arrive a moment later.
      */}
      <PersistGate persistor={persistor}>
        {() => (
          <PageLayout>
            {page}
            <div>
              <Link
                href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
              >
                <Image className='whatappicon' src={whatsppicon} alt="" width={60} height={60} />
              </Link>
            </div>
          </PageLayout>
        )}
      </PersistGate>
      {/* Loaded once for every page, after hydration (was only on one city catering page). */}
      <GoogleTagManager gtmId={GTM_ID} />
    </Provider>
  );
}

export default MyApp;
