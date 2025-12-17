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

  // Get userID from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (storedId) setUserId(storedId);
  }, []);

  /* ---------------- ROUTE CHECKS ---------------- */

  // Chat detail page → /chat/[id]
  const isChatDetailPage =
    pathname?.startsWith("/chat/") && pathname !== "/chat";

  // Wonderland paths
  const isWonderlandPath = pathname?.startsWith("/wonderland");

  // BottomNav sirf in exact pages par
  const showBottomNav =
    pathname === "/chat" ||
    pathname === "/wonderland" ||
    pathname === "/wonderland/create-invite-template" ||
    pathname === "/wonderland/invite" ||
    pathname === "/templates" ||
    pathname === "/about" ||
    pathname === "/accounts" ||
    pathname === "/services";

  /* ------------------------------------------------ */

  return (
    <div className="page-container container-fluid p-0">
      <Head>
        <meta
          name="fast2sms"
          content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe"
        />
      </Head>

      {/* Header */}
      {!isChatDetailPage && pathname !== "/services" && <Header />}

      <main className="page-main row m-0">
        <section className="p-0">{children}</section>
      </main>

      {/* BottomNav / Footer */}
      {!isChatDetailPage && showBottomNav ? (
        <BottomNav id={userId} />
      ) : !isChatDetailPage && !isWonderlandPath ? (
        <Footer />
      ) : null}
    </div>
  );
};

export default PageLayout;
