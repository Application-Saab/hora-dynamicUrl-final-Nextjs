// components/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import '../app/globals.css';
import { useRouter } from "next/router";


const PageLayout = ({ children }) => {

    // document.addEventListener('contextmenu', function(event) {
    //     event.preventDefault();
    // });
 
    const router = useRouter();
    const { catValue } = router.query;
    const hideHeader = router.pathname === `/balloon-decoration/[catValue]`;
  
  return (
    <div className="page-container container-fluid p-0">
      {!hideHeader && <Header/>}
      <main className="page-main row m-0">
        <section
          // style={{ backgroundColor: getBackgroundColor() }}
          className="p-0"
        >
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
