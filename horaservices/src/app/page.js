"use client";

import { useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { usePathname } from "next/navigation";
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
         <title>HORA : One-Stop Party Planning: Customise, Create, Book</title>
         <meta name="description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />
         <meta name="keywords" content="Personal chef, private chef to cook in home in India, home chef, book a cook near you, chef at home, Private cook in Mumbai, Book a cook for home near you, Hire Chef in Bangalore, Private Chef in Delhi, Catering service, balloon, decoration, celebration, party, birthday, anniversary, decorator, candle light dinner,  surprises, couples, bouquets , online caterers, catering services, best caterers, birthday party catering, birthday caterers, party catering, home catering, corporate catering, caterers for small parties, wedding caterers" />
     
         <meta property="og:title" content="HORA : One-Stop Party Planning: Customise, Create, Book" />
         <meta property="og:description" content="🍽️ Food (Live Catering | Bulk Food Delivery | Chef for Party) 🎨 Decoration (Balloon Decoration | Flower Decoration) | 📸 Photography 🎉 Entertainment. Discover the ultimate solution for party planning with Hora’s one-stop platform. Customise your party packages, create your ideal celebration, and book everything you need all in one place. We make planning effortless and enjoyable! 🎈✨" />
         
         <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1711520474508.png" />
         <meta property="og:image:alt" content="Elegant balloon decoration setup by Hora Decorations" />
     
         <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706459457063.png" />
         <meta property="og:image:alt" content="Beautiful floral arrangement for events by Hora Decorations" />
     
         <meta property="og:image" content="  https://horaservices.com/api/uploads/homepage_whatareu4.webp" />
         <meta property="og:image:alt" content="Beautiful food for events by Hora Caterers" />
     
         <meta property="og:image" content="https://horaservices.com/api/uploads/homepage_whatareu2.webp" />
         <meta property="og:image:alt" content="best food and chef for parties by Hora Kitchen" />
         <script type="application/ld+json">{scriptTag}</script>
         <meta name="robots" content="index, follow" />
         <meta name="author" content="Hora Services" />
         <meta property="og:url" content="https://horaservices.com" />
         <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
         <meta property="og:type" content="website" />
     </Head>

      <HomeContent />
    </>
  );
}
