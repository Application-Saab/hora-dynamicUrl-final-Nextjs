"use client";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import "../app/globals.css";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
// ✅ import karo
import ConsultationPopupProvider from "@/components/ConsultationPopupProvider";
import CitySelector from "@/components/Venue/CitySelector";
import cityNameToSlug from "@/utils/cityNameToSlug";

const PageLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  // ✅ city popup ab yaha se control hoga — jis bhi page par user direct aaye
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCity = sessionStorage.getItem("selectedCity");

    if (!savedCity) {
      setShowCityModal(true);
    } else {
      setShowCityModal(false);
    }
  }, []);

  const CITY_LIST = Object.values(cityNameToSlug);
  const CITY_PATH_REGEX = new RegExp(`^/(${CITY_LIST.join("|")})(?=/|$)`, "i");

  const handleCitySelect = (city) => {
    setShowCityModal(false);

    if (!city || city === "Others") {
      sessionStorage.removeItem("selectedCity");
      return;
    }

    const slug = cityNameToSlug[city] || city.toLowerCase();

    sessionStorage.setItem("selectedCity", slug);

    // current path se PURANI city (agar hai) strip karo, baaki path preserve karo
    const restOfPath = pathname.replace(CITY_PATH_REGEX, "");

    router.push(`/${slug}${restOfPath}`, { scroll: false });
  };

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
    // ✅ ConsultationPopupProvider se wrap karo — bas itna hi karna tha
    <ConsultationPopupProvider>
      <div className="page-container container-fluid p-0">
        <Head>
          <meta name="fast2sms" content="p8oFAZAbcm2E8mwWaW6YA5iS1ZYtRGJe" />
        </Head>

        {/* ✅ city selector ab har page par (agar city save nahi hai) */}
        {showCityModal && <CitySelector onSelect={handleCitySelect} />}

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

export default PageLayout;