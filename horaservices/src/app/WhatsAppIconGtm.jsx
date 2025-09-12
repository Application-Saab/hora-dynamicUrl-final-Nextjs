import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";

const WhatsAppIcon = ({ router }) => {
  const { pathname, query } = router;
  const { catValue, productName ,city } = query;
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
const queryCity = router?.query?.city;

const cityName = queryCity
  ? queryCity.charAt(0).toUpperCase() + queryCity.slice(1).toLowerCase()
  : null;

  const handleWhatsAppClick = () => {
    const phoneNumber = '7338584828';
    const message = encodeURIComponent('I want to customize a decoration');
    console.log(pathname, "pathname");
    let eventName = '';
    let productNameEvent = '';

    switch (pathname) {
      case '/balloon-decoration':
        console.log('inside');
        eventName = 'decoration_page_whatsappclick';
        productNameEvent = 'decoration page whatsapp button clicked';
window.open(
  "https://wa.me/+917338584828/?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20decoration%20services."
);
        break;
      case '/book-chef-cook-for-party':
        eventName = 'chefforparty_page_whatsappclick';
        productNameEvent = 'chef for party page whatsapp button clicked';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;

      case '/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedpage_whatsapp_click';
        productNameEvent = `decoration_productlist_categorypage_whatsapp_click_${catValue}`;

        const messagesByCategory = {
          "birthday-decoration": "Hi, I saw your birthday party decoration designs and want to know more about it.",
          "kids-birthday-decoration": "Hi, I saw your kids party decoration designs and want to know more about it.",
          "premium-decoration": "Hi, I saw your premium decoration designs and want to know more about it.",
          "baby-shower-decoration": "Hi, I saw your baby shower decoration designs and want to know more about it.",
          "welcome-baby-decoration": "Hi, I saw your baby welcome decoration designs and want to know more about it.",
          "anniversary-decoration": "Hi, I saw your anniversary decoration designs and want to know more about it.",
          "first-night-decoration": "Hi, I saw your first night decoration designs and want to know more about it.",
          "haldi-mehendi-decoration": "Hi, I saw your haldi & mehendi decoration designs and want to know more about it.",
          "wedding": "Hi, I saw your wedding decoration designs and want to know more about it.",
          "bachelorette-decoration": "Hi, I saw your bachelorette decoration designs and want to know more about it."
        };

        const msg = messagesByCategory[catValue]
          || "Hi, I saw your decoration designs and want to know more about it."; // fallback message
        window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(msg)}`);
        break;

      case '/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productpage_whatsapp_click';
        productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;

        const productMessagesByCategory = {
          "kids-birthday-decoration": "Hi, I liked your kids birthday decor design, can you help me in booking process.",
          "birthday-decoration": "Hi, I liked your birthday decor design, can you help me in booking process.",
          "anniversary-decoration": "Hi, I liked your anniversary decor design, can you help me in booking process.",
          "first-night-decoration": "Hi, I liked your first night decor design, can you help me in booking process.",
          "premium-decoration": "Hi, I liked your premium decor design, can you help me in booking process.",
          "baby-shower-decoration": "Hi, I liked your baby shower decor design, can you help me in booking process.",
          "welcome-baby-decoration": "Hi, I liked your baby welcome decor design, can you help me in booking process.",
          "haldi-mehendi-decoration": "Hi, I liked your haldi & mehendi decor design, can you help me in booking process.",
          "wedding-decoration": "Hi, I liked your wedding decor design, can you help me in booking process.",
          "bachelorette-decoration": "Hi, I liked your bachelorette decor design, can you help me in booking process."
        };

        const productMsg = productMessagesByCategory[catValue]
          || "Hi, I liked your decoration design, can you help me in booking process.";

        window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(productMsg)}`);
        break;

    case '/[city]/balloon-decoration':
  eventName = 'decoration_citypage_whatsappclick';
  productNameEvent = 'decoration page whatsapp button clicked';

 
  const message = `Hi, I saw your website and want to know more about decoration services in ${cityName}`;
  const encodedMsg = encodeURIComponent(message);

  window.open(
    `https://wa.me/+917338584828/?text=${encodedMsg}`,
    "_blank"
  );
  break;

      case '/[city]/balloon-decoration/[catValue]':
  eventName = 'decoration_productlistedcitypage_whatsapp_click';
  productNameEvent = 'decoration_productlistedcitypage_whatsapp_click';

  const cityMessages = {
    "birthday-decoration": `Hi, I saw your birthday party decoration designs and want to know more for ${queryCity}.`,
    "kids-birthday-decoration": `Hi, I saw your kids party decoration designs and want to know more for ${queryCity}.`,
    "premium-decoration": `Hi, I saw your premium decoration designs and want to know more for ${queryCity}.`,
    "baby-shower-decoration": `Hi, I saw your baby shower decoration designs and want to know more for ${queryCity}.`,
    "welcome-baby-decoration": `Hi, I saw your baby welcome decoration designs and want to know more for ${queryCity}.`,
    "anniversary-decoration": `Hi, I saw your anniversary decoration designs and want to know more for ${queryCity}.`,
    "first-night-decoration": `Hi, I saw your first night decoration designs and want to know more for ${queryCity}.`,
    "haldi-mehendi-decoration": `Hi, I saw your haldi & mehendi decoration designs and want to know more for ${queryCity}.`,
    "wedding": `Hi, I saw your wedding decoration designs and want to know more for ${queryCity}.`,
    "bachelorette-decoration": `Hi, I saw your bachelorette decoration designs and want to know more for ${queryCity}.`,
  };

  const messageWithCity = cityMessages[catValue] 
    || `Hi, I saw your decoration designs and want to know more for ${queryCity}.`;

  window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(messageWithCity)}`);
  break;
  
case '/[city]/balloon-decoration/[catValue]/product/[productName]':
  eventName = 'decoration_productcitypage_whatsapp_click';
  productNameEvent = `decoration_productcitypage_whatsapp_click_${productName}`;

  const productMessagesByCategoryCity = {
    "kids-birthday-decoration": "Hi, I liked your kids birthday decor design, can you help me in booking process",
    "birthday-decoration": "Hi, I liked your birthday decor design, can you help me in booking process",
    "anniversary-decoration": "Hi, I liked your anniversary decor design, can you help me in booking process",
    "first-night-decoration": "Hi, I liked your first night decor design, can you help me in booking process",
    "premium-decoration": "Hi, I liked your premium decor design, can you help me in booking process",
    "baby-shower-decoration": "Hi, I liked your baby shower decor design, can you help me in booking process",
    "welcome-baby-decoration": "Hi, I liked your baby welcome decor design, can you help me in booking process",
    "haldi-mehendi-decoration": "Hi, I liked your haldi & mehendi decor design, can you help me in booking process",
    "wedding-decoration": "Hi, I liked your wedding decor design, can you help me in booking process",
    "bachelorette-decoration": "Hi, I liked your bachelorette decor design, can you help me in booking process"
  };

  const productMsgCity =
    (productMessagesByCategoryCity[catValue] || "Hi, I liked your decoration design, can you help me in booking process") +
    ` for ${cityName}.`;

  window.open(
    `https://wa.me/+917338584828/?text=${encodeURIComponent(productMsgCity)}`,
    "_blank"
  );
  break;

      case '/checkout':
        eventName = 'decoration_checkoutpage_whatsapp_click';
        productNameEvent = 'decoration_checkoutpage_whatsapp_click';

        const checkoutMessagesByCategory = {
          "kids-birthday-decoration": "Hi, can you help me book a kids birthday decor design.",
          "birthday-decoration": "Hi, can you help me book a birthday decor design.",
          "anniversary-decoration": "Hi, can you help me book an anniversary decor design.",
          "baby-shower-decoration": "Hi, can you help me book a baby shower decor design.",
          "welcome-baby-decoration": "Hi, can you help me book a baby welcome decor design.",
          "first-night-decoration": "Hi, can you help me book a first night decor design.",
          "premium-decoration": "Hi, can you help me book a premium decor design.",
          "haldi-mehendi-decoration": "Hi, can you help me book a haldi & mehendi decor design.",
          "wedding-decoration": "Hi, can you help me book a wedding decor design.",
          "bachelorette-decoration": "Hi, can you help me book a bachelorette decor design."
        };

        const checkoutMsg = checkoutMessagesByCategory[catValue]
          || "Hi, I saw your website and want to know more about the services.";

        window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(checkoutMsg)}`);
        break;

      case '/[city]/[locality]/balloon-decoration':
        eventName = 'decoration_localitypage_whatsappclick';
        productNameEvent = 'decoration_localitypage_whatsappclick';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/[locality]/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedlocalitypage_whatsapp_click';
        productNameEvent = 'decoration_productlistedlocalitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/[locality]/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productlocalitypage_whatsapp_click';
        productNameEvent = 'decoration_productlocalitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/[locality]':
        eventName = 'decoration_homepagelocalitypage_whatsapp_click';
        productNameEvent = 'decoration_homepagelocalitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]':
        eventName = 'decoration_citypage_whatsapp_click';
        productNameEvent = 'decoration_citypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/book-chef-cook-for-party/order-details':
        eventName = 'chefforpartyorderdetailspage_whatsapp_click';
        productNameEvent = 'chefforpartyorderdetailspage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/book-chef-checkout':
        eventName = 'chefforparty_checkout_whatsapp';
        productNameEvent = 'chefforparty_checkout_whatsapp';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/book-chef-cook-for-party':
        eventName = 'chefforpartycitypage_whatsapp_click';
        productNameEvent = 'chefforpartycitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/party-food-delivery-live-catering-buffet-select-date/[selectedfoodCategory]':
        eventName = 'food&livecateringselectdatepage_whatsapp_click';
        productNameEvent = 'food&livecateringselectdatepage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/photography-page':
        eventName = 'photography_page_whatsappclick';
        productNameEvent = 'photography_page_whatsappclick';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20Photography%20services")
        break;
      case '/photography-checkout':
        eventName = 'photography_checkout_whatsappclick';
        productNameEvent = 'photography_checkout_whatsappclick';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20Photography%20services")
        break;
      case '/balloon-decoration-youtube':
        console.log('inside youtube page');
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/balloon-decoration-youtube/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/balloon-decoration-youtube/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-youtube':
        eventName = 'city_balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-youtube/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-youtube/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Youtube.%20Need%20details.', '_blank');
        break;
      case '/balloon-decoration-google-ads':
        console.log('inside youtube page');
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.', '_blank');
        break;
      case '/balloon-decoration-google-ads/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.', '_blank');
        break;
      case '/balloon-decoration-google-ads/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.', '_blank');
        break;
      case '/[city]/balloon-decoration-google-ads':
        eventName = 'city_balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_whatsapp_click';
        window.open(`https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.`, '_blank');
        break;
      case '/[city]/balloon-decoration-google-ads/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        window.open(`https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.`, '_blank');
        break;
      case '/[city]/balloon-decoration-google-ads/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        window.open(`https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.`, '_blank');
        break;
      case '/balloon-decoration-instagram':
        console.log('inside youtube page');
        eventName = 'balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/balloon-decoration-instagram/[catValue]':
        eventName = 'balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'balloon_decoration_youtube_product_list_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/balloon-decoration-instagram/[catValue]/product/[productName]':
        eventName = 'youtube_product_detail_decorwhatsapp_click';
        productNameEvent = 'youtube_product_detail_decorwhatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-instagram':
        eventName = 'city_balloon_decoration_youtube_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-instagram/[catValue]':
        eventName = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_list_whatsapp_click';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/[city]/balloon-decoration-instagram/[catValue]/product/[productName]':
        eventName = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        productNameEvent = 'city_balloon_decoration_youtube_product_detail_whatsapp_click';
        window.open(`https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Google.%20Need%20it%20for%20an%20event.`, '_blank');
        break;
      case '/party-food-delivery-live-catering-buffet/party-food-delivery':
        eventName = 'bulkfood_dishesselection_page_whatsappclick';
        productNameEvent = 'bulkfood_dishesselection_page_whatsappclick';
        window.open('https://wa.me/7338584828?text=Hi%2C%20Found%20your%20decoration%20on%20Instagram.%20Need%20details.', '_blank');
        break;
      case '/party-food-delivery-live-catering-buffet/':
        eventName = 'foodcategoriespage_whatsapp_click';
        productNameEvent = 'food&livecateringpage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services");
        break;
      case '/party-food-delivery-live-catering-buffet/party-live-buffet-catering':
        eventName = 'livecatering_dishesselection_whatsapp_click';
        productNameEvent = 'livecatering_dishesselection_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services");
        break;
      case pathname.startsWith('/photography-page/product/') && pathname:
        eventName = 'photographyProduct_page_whatsappclick';
        productNameEvent = 'photography_page_whatsappclick';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20Photography%20services");
        break;


      default:
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      pageUrl: window.location.href,
      productName: productNameEvent,
    });
    console.log(window.dataLayer, "windowdatalyer");
  };


  const shouldShowWhatsAppIcon = () => {
    return (
      !router.asPath.startsWith('/wonderland') &&
      router.asPath !== '/order-details' &&
      router.asPath !== '/orderlist' &&
      router.asPath !== '/photo-gallery' &&
      !router.asPath.startsWith('/chat') &&
      !router.asPath.startsWith('/accounts')
    );
  };
  return (
    <>
      {shouldShowWhatsAppIcon() && (
        <Image
          className='whatappicon gtmPage'
          src={whatsppicon}
          alt="WhatsApp Icon"
          onClick={handleWhatsAppClick} // Call handleWhatsAppClick on click
        />
      )}
    </>
  );
};

export default WhatsAppIcon;