import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";
import cityNameToSlug from "@/utils/Citynametoslug.json";

import {
  messagesByCategory,
  productMessagesByCategory,
  checkoutMessagesByCategory,
  productMessagesByCategoryCity,
  chefMessage,
  photographyMessage,
  instagramMessage,
  defaultMessage,
  addCityToMessage,
  photographyProductMessage,
  photographyCheckOutMessage,
  instagramCategoryPageMessage,
  instagramProductPageMessage,
  googleMainMessage,
  googleCategoryMessage,
  googleProductMessage,
  googleCityMainMessage,
  googleCityCategoryMessage,
  googleCityProductMessage,
  foodDeliveryMessage,
  foodCategoryMainMessage,
  liveBuffetMessage,
  localityMainMessage,
  localityCategoryMessage,
  localityProductMessage,
  localityHomeMessage,
  cityPageMessage,
  youtubeDecorationMessage,
  chefForPartyMessage,
  chefOrderDetailsMessage,
  chefCheckoutMessage,
  chefCityPageMessage,
  foodSelectDateMessage,
  photographyMainMessage,
  photographyMessagesByCategory,
} from "@/utils/whatsappMessages";
import WhatsAppFloat from '@/components/WhatsAppFloat';

// ✅ Same slug list CityContext uses — deduped so "bengaluru"/"gurugram" etc. don't repeat
const CITY_LIST = [...new Set(Object.values(cityNameToSlug))];
const CITY_PATH_REGEX = new RegExp(`^/(${CITY_LIST.join("|")})(?=/|$)`, "i");

const slugToCityName = {
  delhi: "Delhi",
  mumbai: "Mumbai",
  bengaluru: "Bengaluru",
  noida: "Noida",
  ghaziabad: "Ghaziabad",
  gurugram: "Gurgaon",
  faridabad: "Faridabad",
  hyderabad: "Hyderabad",
  chennai: "Chennai",
  kolkata: "Kolkata",
  lucknow: "Lucknow",
  kanpur: "Kanpur",
  indore: "Indore",
  surat: "Surat",
  bhopal: "Bhopal",
  goa: "Goa",
  pune: "Pune",
};

const WhatsAppIcon = ({ router }) => {
const getPathFromWindow = () => {
    if (typeof window === "undefined") return router.asPath || "/";
    return window.location.pathname + window.location.search;
  };

  const [currentPath, setCurrentPath] = useState(getPathFromWindow());

  const syncPath = useCallback(() => {
    setCurrentPath(getPathFromWindow());
  }, []);

  useEffect(() => {
   window.addEventListener("city:changed", syncPath);
   window.addEventListener("popstate", syncPath);
    return () => {
      window.removeEventListener("city:changed", syncPath);
      window.removeEventListener("popstate", syncPath);
    };
  }, [syncPath]);

  useEffect(() => {
    syncPath();
  }, [router.asPath]);

  const pathnameOnly = currentPath.split("?")[0] || "/";

 const cityMatch = pathnameOnly.match(CITY_PATH_REGEX);
  const citySlugFromUrl = cityMatch ? cityMatch[1].toLowerCase() : "";
  const cityFromUrl = slugToCityName[citySlugFromUrl] || citySlugFromUrl || "";

  const { pathname, query } = router;
  const { catValue, productName } = query;
  const city = cityFromUrl; 

  const getCheckoutCity = () => {
    if (typeof window === "undefined") return "";

    const params = new URLSearchParams(window.location.search);
    const fromPath = params.get("from");

    if (!fromPath) return "";

    const parts = fromPath.split("/").filter(Boolean);
    return parts[0] || "";
  };

  const pushToDataLayer = (eventName, productNameEvent) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      pageUrl: window.location.href,
      productName: productNameEvent,
    });
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const formattedCity = capitalize(city);
  const formattedCatValue = catValue?.toLowerCase();

  const handleWhatsAppClick = () => {
    const PHONE = "7338584828";
    let eventName = "whatsapp_click";
    let productNameEvent = "general_whatsapp_click";
    let message = defaultMessage;

    const openWhatsApp = (msg) => {
      const encoded = encodeURIComponent(msg);
      window.open(`https://wa.me/${PHONE}?text=${encoded}`, "_blank");
    };

    switch (pathname) {
      case "/balloon-decoration":
        eventName = "decoration_page_whatsappclick";
        productNameEvent = "decoration page whatsapp button clicked";
        message =
          "Hi, I saw your website and want to know more about decoration services.";
        break;

      case '/book-chef-cook-for-party':
        eventName = 'chefforparty_page_whatsappclick';
        productNameEvent = 'chef for party page whatsapp button clicked';
        message = "Hi, I saw your website and want to know more about the services";
        break;

      case '/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedpage_whatsapp_click';
        productNameEvent = `decoration_productlist_categorypage_whatsapp_click_${catValue}`;
        message = messagesByCategory[catValue] || defaultMessage;
        break;

      case '/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productpage_whatsapp_click';
        productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;
        message = productMessagesByCategory[catValue] || defaultMessage;
        break;

      case '/[city]/balloon-decoration': {
        eventName = 'decoration_citypage_whatsappclick';
        productNameEvent = 'decoration page whatsapp button clicked';
        message = addCityToMessage(
          "Hi, I saw your website and want to know more about decoration services ",
          formattedCity
        );
        break;
      }

      case '/[city]/balloon-decoration/[catValue]': {
        eventName = 'decoration_productlistedcitypage_whatsapp_click';
        productNameEvent = 'decoration_productlistedcitypage_whatsapp_click';
        const base = messagesByCategory[catValue] || defaultMessage;
        message = addCityToMessage(base, formattedCity);
        break;
      }

      case '/[city]/balloon-decoration/[catValue]/product/[productName]': {
        eventName = 'decoration_productcitypage_whatsapp_click';
        productNameEvent = `decoration_productcitypage_whatsapp_click_${productName}`;
        const base1 = productMessagesByCategoryCity[catValue] || defaultMessage;
        message = addCityToMessage(base1, formattedCity);
        break;
      }

      case '/checkout': {
        eventName = 'decoration_checkoutpage_whatsapp_click';
        productNameEvent = 'decoration_checkoutpage_whatsapp_click';
        const checkoutCity = capitalize(getCheckoutCity());
        const base2 =
          checkoutMessagesByCategory[catValue] ||
          "Hi, I need help completing my booking.";
        message = addCityToMessage(base2, checkoutCity);
        break;
      }

      case '/[city]/[locality]/balloon-decoration':
        eventName = 'decoration_localitypage_whatsappclick';
        productNameEvent = 'decoration_localitypage_whatsappclick';
        message = addCityToMessage(localityMainMessage, formattedCity);
        break;

      case '/[city]/[locality]/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedlocalitypage_whatsapp_click';
        productNameEvent = 'decoration_productlistedlocalitypage_whatsapp_click';
        message = addCityToMessage(localityCategoryMessage, formattedCity);
        break;

      case '/[city]/[locality]/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productlocalitypage_whatsapp_click';
        productNameEvent = 'decoration_productlocalitypage_whatsapp_click';
        message = addCityToMessage(localityProductMessage, formattedCity);
        break;

      case '/[city]/[locality]':
        eventName = 'decoration_homepagelocalitypage_whatsapp_click';
        productNameEvent = 'decoration_homepagelocalitypage_whatsapp_click';
        message = addCityToMessage(localityHomeMessage, formattedCity);
        break;

      case '/[city]':
        eventName = 'decoration_citypage_whatsapp_click';
        productNameEvent = 'decoration_citypage_whatsapp_click';
        message = addCityToMessage(cityPageMessage, formattedCity);
        break;

      case '/book-chef-cook-for-party/order-details':
        eventName = 'chefforpartyorderdetailspage_whatsapp_click';
        productNameEvent = 'chefforpartyorderdetailspage_whatsapp_click';
        message = chefOrderDetailsMessage;
        break;

      case '/book-chef-checkout':
        eventName = 'chefforparty_checkout_whatsapp';
        productNameEvent = 'chefforparty_checkout_whatsapp';
        message = chefCheckoutMessage;
        break;

      case '/[city]/book-chef-cook-for-party':
        eventName = 'chefforpartycitypage_whatsapp_click';
        productNameEvent = 'chefforpartycitypage_whatsapp_click';
        message = addCityToMessage(chefCityPageMessage, formattedCity);
        break;

      case '/party-food-delivery-live-catering-buffet-select-date/[selectedfoodCategory]':
        eventName = 'food_livecatering_selectdatepage_whatsapp_click';
        productNameEvent = 'food_livecatering_selectdatepage_whatsapp_click';
        message = foodSelectDateMessage;
        break;

      case '/photography-page':
        eventName = 'photography_page_whatsappclick';
        productNameEvent = 'photography_page_whatsappclick';
        message = photographyMainMessage;
        break;

      case '/photography-page/[catValue]':
        eventName = 'photography_productlistedpage_whatsapp_click';
        productNameEvent = `photography_productlist_categorypage_whatsapp_click_${catValue}`;
        message = photographyMessagesByCategory[formattedCatValue] || defaultMessage;
        break;
 case '/photography-page/[catValue]/product/[productName]':
        eventName = 'photography_productpage_whatsapp_click';
        productNameEvent = `photography_productpage_whatsapp_click_${productName}`;
        message = photographyProductMessage || defaultMessage;
        break;
            case '/[city]/photography-page':
        eventName = 'photography_citypage_whatsappclick';
        productNameEvent = 'photography_citypage_whatsappclick';
        message = addCityToMessage(photographyMainMessage, formattedCity);
        break;
 
      case '/[city]/photography-page/[catValue]': {
        eventName = 'photography_productlistedcitypage_whatsapp_click';
        productNameEvent = `photography_productlist_categorycitypage_whatsapp_click_${catValue}`;
        const photoBase = photographyMessagesByCategory[formattedCatValue] || defaultMessage;
        message = addCityToMessage(photoBase, formattedCity);
        break;
      }
 
      case '/[city]/photography-page/[catValue]/product/[productName]':
        eventName = 'photography_productcitypage_whatsapp_click';
        productNameEvent = `photography_productcitypage_whatsapp_click_${productName}`;
        message = addCityToMessage(photographyProductMessage || defaultMessage, formattedCity);
        break;
      case '/photography-checkout':
        eventName = 'photography_checkout_whatsappclick';
        productNameEvent = 'photography_checkout_whatsappclick';
        message = photographyCheckOutMessage;
        break;

      case '/balloon-decoration-youtube':
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        message = youtubeDecorationMessage;
        break;

      case '/balloon-decoration-youtube/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        message = youtubeDecorationMessage;
        break;

      case '/balloon-decoration-youtube/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        message = youtubeDecorationMessage;
        break;

      case '/[city]/balloon-decoration-youtube':
        eventName = 'city_balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_whatsapp_click';
        message = addCityToMessage(youtubeDecorationMessage, formattedCity);
        break;

      case '/[city]/balloon-decoration-youtube/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        message = addCityToMessage(youtubeDecorationMessage, formattedCity);
        break;

      case '/[city]/balloon-decoration-youtube/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        message = addCityToMessage(youtubeDecorationMessage, formattedCity);
        break;

      case '/balloon-decoration-google-ads':
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        message = googleMainMessage;
        break;

      case '/balloon-decoration-google-ads/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        message = googleCategoryMessage;
        break;

      case '/balloon-decoration-google-ads/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        message = googleProductMessage;
        break;

      case '/[city]/balloon-decoration-google-ads':
        eventName = 'city_balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_whatsapp_click';
        message = addCityToMessage(googleCityMainMessage, formattedCity);
        break;

      case '/[city]/balloon-decoration-google-ads/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        message = addCityToMessage(googleCityCategoryMessage, formattedCity);
        break;

      case '/[city]/balloon-decoration-google-ads/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        message = addCityToMessage(googleCityProductMessage, formattedCity);
        break;

      case '/balloon-decoration-instagram':
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        message = instagramMessage;
        break;

      case '/balloon-decoration-instagram/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        message = instagramCategoryPageMessage;
        break;

      case '/balloon-decoration-instagram/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        message = instagramProductPageMessage;
        break;

      case '/[city]/balloon-decoration-instagram':
        eventName = 'city_balloon_decoration_instagram_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_instagram_whatsapp_click';
        message = addCityToMessage(instagramMessage, formattedCity);
        break;

      case '/[city]/balloon-decoration-instagram/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        message = addCityToMessage(
          instagramCategoryPageMessage || instagramMessage,
          formattedCity
        );
        break;

      case '/[city]/balloon-decoration-instagram/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        message = addCityToMessage(
          instagramProductPageMessage || instagramMessage,
          formattedCity
        );
        break;

      case '/party-food-delivery-live-catering-buffet/party-food-delivery':
        eventName = 'bulkfood_dishesselection_page_whatsappclick';
        productNameEvent = 'bulkfood_dishesselection_page_whatsappclick';
        message = foodDeliveryMessage;
        break;

      case '/party-food-delivery-live-catering-buffet/':
        eventName = 'foodcategoriespage_whatsapp_click';
        productNameEvent = 'food&livecateringpage_whatsapp_click';
        message = foodCategoryMainMessage;
        break;

      case '/party-food-delivery-live-catering-buffet/party-live-buffet-catering':
        eventName = 'livecatering_dishesselection_whatsapp_click';
        productNameEvent = 'livecatering_dishesselection_whatsapp_click';
        message = liveBuffetMessage;
        break;

      default:
        if (pathnameOnly.startsWith('/photography-page/product/')) {
          eventName = 'photographyProduct_page_whatsappclick';
          productNameEvent = 'photography_page_whatsappclick';
          message = photographyMessage;
        } else {
          message = defaultMessage;
        }
        break;
    }

    openWhatsApp(message);
    pushToDataLayer(eventName, productNameEvent);
  };

  const shouldShowWhatsAppIcon = () => {
    return (
      !router.asPath.startsWith('/wonderland') &&
      !router.asPath.startsWith('/venue-list') &&
      !router.asPath.startsWith('/wonderlandinternational') &&
      !router.asPath.startsWith('/templates') &&
      !router.asPath.startsWith('/chat') &&
      router.asPath !== '/order-details' &&
      router.asPath !== '/orderlist' &&
      router.asPath !== '/photo-gallery' &&
      !router.asPath.startsWith('/accounts') &&
      !router.asPath.startsWith('/services') &&
      !router.asPath.startsWith('/photo-gallery')
    );
  };

  return (
    <>
      {shouldShowWhatsAppIcon() && (
        <WhatsAppFloat
          shouldShow={shouldShowWhatsAppIcon()}
          handleWhatsAppClick={handleWhatsAppClick}
        />
      )}
    </>
  );
};

export default WhatsAppIcon;