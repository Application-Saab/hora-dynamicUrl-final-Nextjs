"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav"; 
import "../app/globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";

const PageLayout = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");

  // Get userID from localStorage on client side
  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  // Show BottomNav only on these paths
  const showBottomNav =
    pathname === "/wonderland" ||
    pathname?.startsWith("/chat") || // covers /chat?id=123 also
    pathname === "/about" || pathname === '/accounts';

  const isWonderlandPath = pathname?.startsWith("/wonderland");

  return (
    <div className="page-container container-fluid p-0">
      <Head>
        <meta
          name="fast2sms"
          content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe"
        />
      </Head>

      <Header />

      <main className="page-main row m-0">
        <section className="p-0">{children}</section>
      </main>

      {/*  Show BottomNav on selected pages, passing userId */}
      {showBottomNav ? <BottomNav id={userId} /> : !isWonderlandPath && <Footer />}
    </div>
  );
};

export default PageLayout;
