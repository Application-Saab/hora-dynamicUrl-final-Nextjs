"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Head from "next/head";
import {
  BASE_URL,
  PAYMENT_STATUS,
  UPDATE_ORDER_STATUS,
} from "@/utils/apiconstants";
import { getHomeOrganizationSchema } from "@/utils/schema";
import HomeContent from "@/components/HomeContent";
import HomeSeoContent, { HOME_FAQS } from "@/components/HomePageComponent/HomeSeoContent";
import { getVisitorId, getDeviceInfo, getBrowserInfo } from "@/utils/analytics";
import VisitorTracker from "@/utils/VisitorTracker";
import axiosApi from "@/utils/axiosApi";
import { safeGetItem } from "@/utils/safeStorage";

const HOME_URL = "https://horaservices.com/";
const HOME_TITLE =
  "HORA: Party Decoration, Venues, Chefs & Photographers";
const HOME_DESCRIPTION =
  "Book balloon decoration, party venues, chefs, catering and photographers in Delhi NCR, Bangalore, Mumbai and Hyderabad. Upfront prices, same-day slots.";
const HOME_OG_IMAGE =
  "https://horaservices.com/api/uploads/attachment-1711520474508.png";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const schemaOrg = getHomeOrganizationSchema();
  const scriptTag = JSON.stringify(schemaOrg);
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  useEffect(() => {
    const checkPaymentStatus = async (transactionId) => {
      try {
        const apiUrl = BASE_URL + PAYMENT_STATUS + "/" + transactionId;

        const response = await axiosApi.post(
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

            const token = safeGetItem("token");

            const requestData = {
              status: 1,
              _id: transactionId,
            };

            const response = await axiosApi.post(url, requestData, {
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
        <title>{HOME_TITLE}</title>
        <meta name="description" content={HOME_DESCRIPTION} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={HOME_URL} />

        <meta property="og:title" content={HOME_TITLE} />
        <meta property="og:description" content={HOME_DESCRIPTION} />
        <meta property="og:url" content={HOME_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HORA" />
        <meta property="og:image" content={HOME_OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={HOME_TITLE} />
        <meta name="twitter:description" content={HOME_DESCRIPTION} />
        <meta name="twitter:image" content={HOME_OG_IMAGE} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: scriptTag }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      </Head>
      <HomeContent />
      <HomeSeoContent />
      <div>
        <VisitorTracker />
      </div>
    </>
  );
}