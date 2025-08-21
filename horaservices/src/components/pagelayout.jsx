// components/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import '../app/globals.css';
import Head from "next/head"; 
import { usePathname } from "next/navigation";

const PageLayout = ({ children }) => {

    // document.addEventListener('contextmenu', function(event) {
    //     event.preventDefault();
    // });
  const pathname = usePathname();
  const isWonderlandPath = pathname?.startsWith('/wonderland');
  
  return (
    <div className="page-container container-fluid p-0">
        <Head>
            <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe"/>
        </Head>
      <Header />
      <main className="page-main row m-0">
        <section
          // style={{ backgroundColor: getBackgroundColor() }}
          className="p-0"
        >
          {children}
        </section>
      </main>
      {!isWonderlandPath && <Footer />}
    </div>
  );
};

export default PageLayout;
