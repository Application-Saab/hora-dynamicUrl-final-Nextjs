"use client";
import React, { useEffect } from "react";
import {
  BASE_URL,
  PAYMENT_STATUS,
  UPDATE_ORDER_STATUS,
} from "../utils/apiconstants";
import axios from "axios";
import whatsppicon from "../assets/whatsapp-icon.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";
import { SEOHead } from "./components/SEOHead";
import { HeroBanner } from "./components/HeroBanner";
import { FoodSection } from "./components/FoodSection";
import { CategorySection } from "./components/CategorySection";
import CustomerReview from "./components/CustomerReview";
import ServiceSection from "./components/ServiceSection";
import { sendGTMEvent } from "@next/third-parties/google";

export default function Home() {
  const router = useRouter();

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
      checkPaymentStatus(transactionId);
    }
  }, [router]);

  const openDecorationPage = () => {
    router.push("/balloon-decoration");
  };

  const handleTitleClick = (title, link) => {
    // Trigger GTM event when the user clicks on the title
    router.push(link);
    sendGTMEvent("event", "titleClicked", { value: title });
  };

  return (
    <>
      <SEOHead />
      <HeroBanner openDecorationPage={openDecorationPage} />
      <FoodSection handleTitleClick={handleTitleClick} />
      <ServiceSection />
      <CategorySection />
      <CustomerReview />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K3SCKLTZ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      <div>
        <Link
          href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services"
          target="_blank"
        >
          <Image
            className="whatappicon home"
            src={whatsppicon}
            alt="WhatsApp Icon"
            onClick={() => {
              dataLayer.push({
                event: "homepage_whatsapp_click",
                page_url: "/homepage",
                page_title: "This is home page WhatsApp click",
              });
            }}
          />
        </Link>
      </div>
    </>
  );
}
