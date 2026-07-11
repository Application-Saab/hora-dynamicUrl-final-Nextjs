"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import "../app/globals.css";
import Head from "next/head";
import { usePathname } from "next/navigation";
import ConsultationPopupProvider from "@/components/ConsultationPopupProvider";
import { safeGetItem } from "@/utils/safeStorage";
import CitySelector from "@/components/Venue/CitySelector";
import { CityProvider, useCity } from "@/utils/cityContext";

// 👇 inner component, kyunki useCity() sirf CityProvider ke andar chalega
const LayoutInner = ({ children }) => {
  const pathname = usePathname();
  const [userId, setUserId] = useState("");
  const { showCityModal, selectCity } = useCity();

  useEffect(() => {
    const storedId = safeGetItem("userID");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const showBottomNav =
    pathname === "/wonderland" ||
    pathname === "/wonderlandinternational" ||
    pathname === "/wonderland/create-invite-template" ||
    pathname === "/wonderlandinternational/create-invite-template" ||
    pathname === "/templates" ||
    (pathname?.startsWith("/chat") && !pathname?.startsWith("/chat/room")) ||
    (pathname?.startsWith("/wonderlandinternational/chat") &&
      !pathname?.startsWith("/wonderlandinternational/chat/room")) ||
    pathname === "/about" ||
    pathname === "/accounts" ||
    pathname === "/wonderlandinternational/accounts" ||
    pathname === "/services" ||
    pathname === "/wonderland/invite" ||
    pathname === "/wonderlandinternational/invite";

  const isWonderlandPath =
    pathname?.startsWith("/wonderland") ||
    pathname?.startsWith("/wonderlandinternational");

  return (
    <ConsultationPopupProvider>
      <div className="page-container container-fluid p-0">
        <Head>
          <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe" />
        </Head>

        {/* ✅ SIRF EK modal — Header aur PageLayout dono isi state ko control karte hain */}
        {showCityModal && <CitySelector onSelect={selectCity} />}

        {pathname !== "/services" && <Header />}
        <main className="page-main row m-0">
          <section className="p-0">{children}</section>
        </main>

        {showBottomNav ? (
          <BottomNav id={userId} />
        ) : (
          !isWonderlandPath &&
          !pathname?.startsWith("/chat/room") &&
          !pathname?.startsWith("/wonderlandinternational/chat/room") && (
            <Footer />
          )
        )}
      </div>
    </ConsultationPopupProvider>
  );
};

const PageLayout = ({ children }) => {
  return (
    <CityProvider>
      <LayoutInner>{children}</LayoutInner>
    </CityProvider>
  );
};

export default PageLayout;