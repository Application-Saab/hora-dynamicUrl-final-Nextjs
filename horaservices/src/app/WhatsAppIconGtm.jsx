import React from "react";
import Image from "next/image";
import whatsppicon from "../assets/whatsapp-new.webp";

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
} from "@/utils/whatsappMessages";

const WhatsAppIcon = ({ router }) => {
  const { pathname, query, asPath } = router;
  const { catValue, productName, city } = query;

  const PHONE = "7338584828";

  /* ================= Utilities ================= */

  const openWhatsApp = (msg) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${PHONE}?text=${encoded}`, "_blank");
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

  const getCheckoutCity = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const fromPath = params.get("from");
    if (!fromPath) return "";
    return fromPath.split("/").filter(Boolean)[0] || "";
  };

  /* ================= Main Click Handler ================= */

  const handleWhatsAppClick = () => {
    let message = defaultMessage;
    let eventName = "whatsapp_click";
    let productNameEvent = "general_whatsapp_click";

    const formattedCity = capitalize(city);

    /* =========================================== Decoration Main ============================================== */

    if (pathname === "/balloon-decoration") {
      eventName = 'decoration_page_whatsappclick';
      productNameEvent = 'decoration page whatsapp button clicked';
      message =
        "Hi, I saw your website and want to know more about decoration services.";
    }

    else if (pathname === "/balloon-decoration/[catValue]") {
      eventName = 'decoration_productlistedpage_whatsapp_click';
      productNameEvent = `decoration_productlist_categorypage_whatsapp_click_${catValue}`;
      message =
        messagesByCategory[catValue] || defaultMessage;
    }

    else if (
      pathname ===
      "/balloon-decoration/[catValue]/product/[productName]"
    ) {
      eventName = 'decoration_productpage_whatsapp_click';
      productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;
      message = productMessagesByCategory[catValue] || defaultMessage;
    }
    /* ========= City Decoration ========= */

    else if (pathname === "/[city]/balloon-decoration") {
      eventName = 'decoration_citypage_whatsappclick';
      productNameEvent = `decoration page whatsapp button clicked ${formattedCity}`;

      message = addCityToMessage(
        "Hi, I saw your website and want to know more about decoration services ",
        formattedCity
      );
    }

    /* ========= City Category ========= */

    else if (pathname === "/[city]/balloon-decoration/[catValue]") {
      eventName = "decoration_productlistedcitypage_whatsapp_click";
      productNameEvent = `city_category_${catValue}`;
      const base =
        messagesByCategory[catValue] || defaultMessage;

      message = addCityToMessage(base, formattedCity);
    }

    /* ========= City Product ========= */

    else if (
      pathname ===
      "/[city]/balloon-decoration/[catValue]/product/[productName]"
    ) {
      eventName = 'decoration_productcitypage_whatsapp_click';

      productNameEvent = `city_product_${productName}`;

      const base =
        productMessagesByCategoryCity[catValue] || defaultMessage;

      message = addCityToMessage(base, formattedCity);
    }

    /* ========= City + Locality Decoration Main ========= */
    else if (pathname === '/[city]/[locality]/balloon-decoration') {

      eventName = 'decoration_localitypage_whatsappclick';
      productNameEvent = 'decoration_localitypage_whatsappclick';
      message = localityMainMessage;
    }

    /* ========= City + Locality Category ========= */
    else if (
      pathname === '/[city]/[locality]/balloon-decoration/[catValue]'
    ) {

      eventName = 'decoration_productlistedlocalitypage_whatsapp_click';
      productNameEvent = 'decoration_productlistedlocalitypage_whatsapp_click';
      message = localityCategoryMessage;
    }

    /* ========= City + Locality Product ========= */
    else if (
      pathname === '/[city]/[locality]/balloon-decoration/[catValue]/product/[productName]'
    ) {

      eventName = 'decoration_productlocalitypage_whatsapp_click';
      productNameEvent = 'decoration_productlocalitypage_whatsapp_click';
      message = localityProductMessage;
    }

    /* ========= City + Locality Homepage ========= */
    else if (pathname === '/[city]/[locality]') {

      eventName = 'decoration_homepagelocalitypage_whatsapp_click';
      productNameEvent = 'decoration_homepagelocalitypage_whatsapp_click';
      message = localityHomeMessage;
    }

    /* ========= City Page ========= */
    else if (pathname === '/[city]') {

      eventName = 'decoration_citypage_whatsapp_click';
      productNameEvent = 'decoration_citypage_whatsapp_click';
      message = cityPageMessage;
    }

    /* ========= Checkout ========= */

    else if (pathname === "/checkout") {
      eventName = 'decoration_checkoutpage_whatsapp_click';
      productNameEvent = 'decoration_checkoutpage_whatsapp_click';


      const checkoutCity = capitalize(getCheckoutCity());

      const base =
        checkoutMessagesByCategory[catValue] ||
        "Hi, I need help completing my booking.";

      message = addCityToMessage(base, checkoutCity);
    }

    /* ========= Chef ========= */

    else if (pathname.startsWith("/book-chef")) {
      eventName = "chef_whatsapp_click";
      productNameEvent = "chef_whatsapp_click";
      message = chefMessage;
    }

    /* =========================================== Photography ================================================== */

    else if (pathname.startsWith("/photography")) {
      eventName = "photography_whatsapp_click";
      productNameEvent = "photography_whatsapp_click";
      message = photographyMessage;
    }

    else if (pathname.startsWith("/photography-page/product/")) {
      eventName = "photographyProduct_page_whatsappclick";
      productNameEvent = "photographyProduct_page_whatsappclick";
      message = photographyProductMessage;
    }

    /* -------- Photography Checkout -------- */
    else if (pathname === "/photography-checkout") {
      eventName = "photography_checkout_whatsappclick";
      productNameEvent = "photography_checkout_whatsappclick";
      message = photographyCheckOutMessage;
    }

    /* ================================================== YouTube =============================================== */

    else if (pathname === "/balloon-decoration-youtube") {

      eventName = "balloon_decoration_youtube_whatsapp_click";
      productNameEvent = "balloon_decoration_youtube_whatsapp_click";
      message = youtubeDecorationMessage;
    }

    else if (pathname === "/balloon-decoration-youtube/[catValue]") {

      eventName = "balloon_decoration_youtube_product_list_whatsapp_click";
      productNameEvent = "balloon_decoration_youtube_product_list_whatsapp_click";
      message = youtubeDecorationMessage;
    }
    else if (
      pathname === "/balloon-decoration-youtube/[catValue]/product/[productName]"
    ) {

      eventName = "youtube_product_detail_decorwhatsapp_click";
      productNameEvent = "youtube_product_detail_decorwhatsapp_click";
      message = youtubeDecorationMessage;
    }
    else if (pathname === "/[city]/balloon-decoration-youtube") {

      eventName = "city_balloon_decoration_youtube_whatsapp_click";
      productNameEvent = "city_balloon_decoration_youtube_whatsapp_click";
      message = youtubeDecorationMessage;
    }
    else if (
      pathname === "/[city]/balloon-decoration-youtube/[catValue]"
    ) {

      eventName = "city_balloon_decoration_youtube_product_list_whatsapp_click";
      productNameEvent = "city_balloon_decoration_youtube_product_list_whatsapp_click";
      message = youtubeDecorationMessage;
    }
    else if (
      pathname === "/[city]/balloon-decoration-youtube/[catValue]/product/[productName]"
    ) {

      eventName = "city_balloon_decoration_youtube_product_detail_whatsapp_click";
      productNameEvent = "city_balloon_decoration_youtube_product_detail_whatsapp_click";
      message = youtubeDecorationMessage;
    }

    /* ==================================================== Google Ads============================================ */


    else if (pathname === "/balloon-decoration-google-ads") {
      eventName = "balloon_decoration_youtube_whatsapp_click";
      productNameEvent = "balloon_decoration_youtube_whatsapp_click";

      message = googleMainMessage;
    }

    /* ========= Google Ads Category ========= */
    else if (
      pathname === "/balloon-decoration-google-ads/[catValue]"
    ) {
      eventName = "balloon_decoration_youtube_product_list_whatsapp_click";
      productNameEvent =
        "balloon_decoration_youtube_product_list_whatsapp_click";

      message = googleCategoryMessage;
    }

    /* ========= Google Ads Product ========= */
    else if (
      pathname ===
      "/balloon-decoration-google-ads/[catValue]/product/[productName]"
    ) {
      eventName = "youtube_product_detail_decorwhatsapp_click";
      productNameEvent = "youtube_product_detail_decorwhatsapp_click";

      message = googleProductMessage;
    }

    /* ========= Google Ads City Main ========= */
    else if (pathname === "/[city]/balloon-decoration-google-ads") {
      eventName = "city_balloon_decoration_youtube_whatsapp_click";
      productNameEvent = "city_balloon_decoration_youtube_whatsapp_click";

      message = googleCityMainMessage
    }

    /* ========= Google Ads City Category ========= */
    else if (
      pathname === "/[city]/balloon-decoration-google-ads/[catValue]"
    ) {
      eventName =
        "city_balloon_decoration_youtube_product_list_whatsapp_click";
      productNameEvent =
        "city_balloon_decoration_youtube_product_list_whatsapp_click";

      message =
        googleCityCategoryMessage;
    }

    /* ========= Google Ads City Product ========= */
    else if (
      pathname ===
      "/[city]/balloon-decoration-google-ads/[catValue]/product/[productName]"
    ) {
      eventName =
        "city_balloon_decoration_youtube_product_detail_whatsapp_click";
      productNameEvent =
        "city_balloon_decoration_youtube_product_detail_whatsapp_click";

      message =
        googleCityProductMessage
    }

    /* ===================================== Instagram =========================================================== */

    /* ========= Main Instagram ========= */
    else if (pathname === '/balloon-decoration-instagram') {
      eventName = 'balloon_decoration_instagram_whatsapp_click';
      productNameEvent = 'balloon_decoration_instagram_whatsapp_click';
      message = instagramMessage;
    }

    /* ========= Category Page ========= */
    else if (pathname === '/balloon-decoration-instagram/[catValue]') {
      eventName = 'balloon_decoration_instagram_product_list_whatsapp_click';
      productNameEvent = `balloon_decoration_instagram_category_${catValue}`;
      message = instagramCategoryPageMessage;
    }

    /* ========= Product Detail ========= */
    else if (
      pathname === '/balloon-decoration-instagram/[catValue]/product/[productName]'
    ) {
      eventName = 'instagram_product_detail_decor_whatsapp_click';
      productNameEvent = `instagram_product_${productName}`;
      message = instagramProductPageMessage;
    }

    /* ========= City Main ========= */
    else if (pathname === '/[city]/balloon-decoration-instagram') {
      eventName = 'city_balloon_decoration_instagram_whatsapp_click';
      productNameEvent = `city_balloon_decoration_instagram_${city}`;
      message = instagramMessage;
    }

    /* ========= City Category ========= */
    else if (
      pathname === '/[city]/balloon-decoration-instagram/[catValue]'
    ) {
      eventName =
        'city_balloon_decoration_instagram_product_list_whatsapp_click';
      productNameEvent = `city_instagram_category_${catValue}`;
      message = instagramMessage;
    }

    /* ========= City Product ========= */
    else if (
      pathname ===
      '/[city]/balloon-decoration-instagram/[catValue]/product/[productName]'
    ) {
      eventName =
        'city_balloon_decoration_instagram_product_detail_whatsapp_click';
      productNameEvent = `city_instagram_product_${productName}`;
      message = instagramMessage;
    }


    /* ============================================== Catering ============================================= */

    /* ========= Party Food Delivery ========= */
    else if (pathname === '/party-food-delivery-live-catering-buffet/party-food-delivery') {

      eventName = 'bulkfood_dishesselection_page_whatsappclick';
      productNameEvent = 'bulkfood_dishesselection_page_whatsappclick';
      message = foodDeliveryMessage;
    }

    /* ========= Catering Main Page ========= */
    else if (pathname === '/party-food-delivery-live-catering-buffet/') {

      eventName = 'foodcategoriespage_whatsapp_click';
      productNameEvent = 'food&livecateringpage_whatsapp_click';
      message = foodCategoryMainMessage;
    }

    /* ========= Live Buffet Catering ========= */
    else if (pathname === '/party-food-delivery-live-catering-buffet/party-live-buffet-catering') {

      eventName = 'livecatering_dishesselection_whatsapp_click';
      productNameEvent = 'livecatering_dishesselection_whatsapp_click';
      message = liveBuffetMessage;
    }
    else if (pathname === "/book-chef-cook-for-party") {

      eventName = "chefforparty_page_whatsappclick";
      productNameEvent = "chef for party page whatsapp button clicked";
      message = chefForPartyMessage;
    }


    /* ========= Execute ========= */

    openWhatsApp(message);
    pushToDataLayer(eventName, productNameEvent);
  };

  /* ================= Hide Conditions ================= */

  const shouldShowIcon = () => {
    return (
      !asPath.startsWith("/wonderland") &&
      !asPath.startsWith("/templates") &&
      !asPath.startsWith("/chat") &&
      !asPath.startsWith("/accounts") &&
      !asPath.startsWith("/services") &&
      asPath !== "/order-details" &&
      asPath !== "/orderlist" &&
      asPath !== "/photo-gallery"
    );
  };

  if (!shouldShowIcon()) return null;

  /* ================= Render ================= */

  return (
    <Image
      src={whatsppicon}
      alt="WhatsApp Icon"
      className="whatappicon gtmPage"
      onClick={handleWhatsAppClick}
      priority
    />
  );
};

export default WhatsAppIcon;
