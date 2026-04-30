"use client";

import { useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  BASE_URL,
  PAYMENT_STATUS,
  UPDATE_ORDER_STATUS,
} from "@/utils/apiconstants";
import { getHomeOrganizationSchema } from "@/utils/schema";
import HomeContent from "@/components/HomeContent";
import { useLayoutEffect } from "react";
import { getVisitorId, getDeviceInfo  , getBrowserInfo} from "@/utils/analytics";
import VisitorTracker from "@/utils/VisitorTracker";

export default function Home() {
  const router = useRouter();
const pathname = usePathname();
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);

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
  const transactionId = queryParams.get("transaction")
  if(transactionId) {
        router.replace(`/?transaction=${transactionId}`)
      }
  
  if (transactionId) {
    checkPaymentStatus(transactionId);
  }
  }, [router]);

  //  useEffect(() => {
  //     console.log("visitor cliced");
  //     const visitorId = getVisitorId();
  //     console.log('visitor id' , visitorId);
  //     const { device, os } = getDeviceInfo();
  //     const browser = getBrowserInfo();
  //     console.log(JSON.stringify({
  //         visitorId,
  //         device,
  //         os,
  //         browser, 
  //         page: window.location.pathname, // 👈 include page path
  //       }))
  
  //     // Track daily visit with page info
  //     fetch("https://horaservices.com:3000/api/analytics/track-daily-visit", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         visitorId,
  //         device,
  //         os,
  //         browser, 
  //         page: window.location.pathname, // 👈 include page path
  //       }),
  //     });
  //   }, []);
  
  useEffect(() => {
    // Google Tag Manager script for GTM
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
      console.log('GTM Script Loaded'); // Debugging log
    })(window,document,'script','dataLayer','GTM-K3SCKLTZ');
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
  
  return (
    <>
  
      <HomeContent />
       <div>
        <VisitorTracker/>
      </div> 
    </>
  );
}
