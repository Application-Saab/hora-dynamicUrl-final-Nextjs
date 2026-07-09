"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  BASE_URL,
  PAYMENT_STATUS,
  UPDATE_ORDER_STATUS,
} from "@/utils/apiconstants";
import { getHomeOrganizationSchema } from "@/utils/schema";
import HomeContent from "@/components/HomeContent";
import { getVisitorId, getDeviceInfo, getBrowserInfo } from "@/utils/analytics";
import VisitorTracker from "@/utils/VisitorTracker";
import CitySelector from "@/components/Venue/CitySelector";
import cityNameToSlug from "@/utils/cityNameToSlug";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async (transactionId) => {
      try {
        const storedUserID = await localStorage.getItem("userID");
        const apiUrl = BASE_URL + PAYMENT_STATUS + "/" + transactionId;

        const response = await axios.post(
          apiUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.message) {
          const message = response.data.message;

          if (message === "PAYMENT_SUCCESS") {
            const url = BASE_URL + UPDATE_ORDER_STATUS;

            const token = await localStorage.getItem("token");

            const requestData = {
              status: 1,
              _id: transactionId,
            };

            const response = await axios.post(url, requestData, {
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            });

            router.push("/Success");
          } else {
            router.push("/Failure");
          }
        } else {
          console.log("API response does not contain a message field");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        throw error; // Rethrow the error for the caller to handle
      }
    };

    const queryParams = new URLSearchParams(window.location.search);
    const transactionId = queryParams.get("transaction");
    if (transactionId) {
      router.replace(`/?transaction=${transactionId}`);
    }

    if (transactionId) {
      checkPaymentStatus(transactionId);
    }
  }, [router]);

  useEffect(() => {
    // Google Tag Manager script for GTM
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
      console.log("GTM Script Loaded"); // Debugging log
    })(window, document, "script", "dataLayer", "GTM-K3SCKLTZ");
  }, []);

  useLayoutEffect(() => {
    // reset any scroll lock
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.overflow = "";

    // force scroll to top
    window.scrollTo(0, 0);

    console.log("scrolling page");
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCity = sessionStorage.getItem("selectedCity");

    if (!savedCity) {
      setShowCityModal(true);
    }
  }, []);

  const handleCitySelect = (city) => {
    setShowCityModal(false);

    if (!city || city === "Others") {
      sessionStorage.removeItem("selectedCity");
      return;
    }

    const slug = cityNameToSlug[city] || city.toLowerCase();

    sessionStorage.setItem("selectedCity", slug);

    router.push(`/${slug}`);
  };

  return (
    <>
      {showCityModal && <CitySelector onSelect={handleCitySelect} />}
      <HomeContent />
      <div>
        <VisitorTracker />
      </div>
    </>
  );
}