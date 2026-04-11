"use client";

import { useEffect } from "react";
import axios from "axios";
import Head from "next/head";
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
    <Head>
  <title>Party Services in India | Decoration, Catering, Photography & More | HORA</title>
  <meta
    name="description"
    content="Book party decoration, catering, photography & chef services for birthdays, anniversaries & events across India. 1000+ designs, verified vendors & easy booking. Plan your perfect party with HORA today!"
  />
  <meta
    name="keywords"
    content="party services India, balloon decoration, catering services, chef at home, party photography, birthday decoration, anniversary decoration, event services India"
  />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="canonical" href="https://horaservices.com/" />

  <meta
    property="og:title"
    content="Party Services in India | Decoration, Catering & More | HORA"
  />
  <meta
    property="og:description"
    content="Book decoration, catering, photography & chef services for your events across India."
  />
  <meta property="og:url" content="https://horaservices.com/" />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Party Services in India | HORA"
  />
  <meta
    name="twitter:description"
    content="Book decoration, catering, photography & chef services for your events across India."
  />
  <meta
    name="twitter:image"
    content="https://horaservices.com/api/uploads/attachment-1711520474508.png"
  />

  <link
    rel="icon"
    href="https://horaservices.com/api/uploads/logo-icon.png"
    type="image/x-icon"
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "HORA",
        url: "https://horaservices.com/",
        logo: "https://horaservices.com/api/uploads/logo-icon.png",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "1000",
        },
      }),
    }}
  />
</Head>
      <HomeContent />
       <div>
        <VisitorTracker/>
      </div> 
    </>
  );
}
