import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";

const WhatsAppIcon = ({ router }) => {
  const { pathname, query } = router;
  const { catValue, productName, city ,productId} = query;
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  const queryCity = router?.query?.city;

  const cityName = queryCity
    ? queryCity.charAt(0).toUpperCase() + queryCity.slice(1).toLowerCase()
    : null;

  const handleWhatsAppClick = () => {
    const phoneNumber = '7338584828';
    const message = encodeURIComponent('I want to customize a decoration');
    let eventName = '';
    let productNameEvent = '';

    switch (pathname) {
      case '/balloon-decoration':
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


  const formatCategoryName = (value) => {
    return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableName = formatCategoryName(catValue);

  const msg = `Hi, I saw your ${readableName} designs and want to know more about it.`;

  window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(msg)}`);
  break;

case '/balloon-decoration/[catValue]/product/[productName]':
  eventName = 'decoration_productpage_whatsapp_click';
  productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;


  const formatCategoryName1 = (value) => {
      return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableName1 = formatCategoryName1(catValue);

  const productMsg = `Hi, I liked your ${readableName1} decor design, can you help me in booking process.`;

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


  const formatCategoryName2 = (value) => {
       return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableCategory5 = formatCategoryName2(catValue);
  const readableCity5 = queryCity
    ? queryCity.charAt(0).toUpperCase() + queryCity.slice(1)
    : 'your city';

  const messageWithCity2 = `Hi, I saw your ${readableCategory5} designs and want to know more for ${readableCity5}.`;

  window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(messageWithCity2)}`);
  break;

 
case '/[city]/balloon-decoration/[catValue]/product/[productName]':
  eventName = 'decoration_productcitypage_whatsapp_click';
  productNameEvent = `decoration_productcitypage_whatsapp_click_${productName}`;

  const formatCategoryName3 = (value) => {
        return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableCategory3= formatCategoryName3(catValue);
  const readableCity3 = cityName
    ? cityName.charAt(0).toUpperCase() + cityName.slice(1)
    : 'your city';

  const productMsgCity = `Hi, I liked your ${readableCategory3} decor design, can you help me in booking process for ${readableCity3}.`;

  window.open(
    `https://wa.me/+917338584828/?text=${encodeURIComponent(productMsgCity)}`,
    '_blank'
  );
  break;

case '/checkout':
  eventName = 'decoration_checkoutpage_whatsapp_click';
  productNameEvent = 'decoration_checkoutpage_whatsapp_click';


  const formatCategoryName4 = (value) => {
       return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableCategory4= formatCategoryName4(catValue);

  const checkoutMsg = readableCategory4
    ? `Hi, can you help me book a ${readableCategory4} decor design.`
    : `Hi, I saw your website and want to know more about the services.`;

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

         case '/[city]/photography-page':
        eventName = 'photography-page_citypage_whatsappclick';
        productNameEvent = 'photography-page whatsapp button clicked';


        const message1 = `Hi, I saw your website and want to know more about the photography services in ${cityName}`;
        const encodedMsg1 = encodeURIComponent(message1);

        window.open(
          `https://wa.me/+917338584828/?text=${encodedMsg1}`,
          "_blank"
        );
        break;

case '/photography-page/[catValue]':
  eventName = 'photography_productlistedpage_whatsapp_click';
  productNameEvent = `photography_productlist_categorypage_whatsapp_click_${catValue}`;


  const formatPhotoCategory = (value) => {
        return value
      ?.replace(/-/g, ' ')    
      ?.replace(/\b\w/g, (l) => l.toUpperCase()); 
  };

  const readableCategory6 = formatPhotoCategory(catValue);

  const msg5 = readableCategory6
    ? `Hi, I saw your ${readableCategory6} photography packages & want to know more about them.`
    : `Hi, I saw your photography services and want to know more about them.`;

  window.open(`https://wa.me/+917338584828/?text=${encodeURIComponent(msg5)}`);
  break;

      case '/photography-checkout':
        eventName = 'photography_checkout_whatsappclick';
        productNameEvent = 'photography_checkout_whatsappclick';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20Photography%20services")
        break;
      
   
      case '/balloon-decoration-youtube':
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
    

case '/photography-page/[catValue]/product/[productName]': {
  eventName = 'photography-page_product_page_whatsapp_click';
  productNameEvent = 'photography-page_product_page_whatsapp_click';

  const formattedProductName = productName
    ? productName.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Photography Package";

  const msg = city
    ? `Hi, I saw your  ${formattedProductName} package for ${city} & want to know more about it.`
    : `Hi, I saw your  ${formattedProductName} package & want to know more about it.`;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    product_name: formattedProductName,
    city: city || "Not specified",
  });

  
  window.open(
    `https://wa.me/7338584828?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  break;
}



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
  };


  const shouldShowWhatsAppIcon = () => {
    return (
      !router.asPath.startsWith('/wonderland') &&
      !router.asPath.startsWith('/templates') &&
      !router.asPath.startsWith('/chat') &&
      router.asPath !== '/order-details' &&
      router.asPath !== '/orderlist' &&
      router.asPath !== '/photo-gallery' &&
      !router.asPath.startsWith('/chat') &&
      !router.asPath.startsWith('/accounts')&&
       !router.asPath.startsWith('/services')
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