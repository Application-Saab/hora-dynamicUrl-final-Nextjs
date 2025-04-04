import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";

const WhatsAppIcon = ({ router }) => {
  const { pathname, query } = router;
  const { catValue, productName } = query;

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
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/book-chef-cook-for-party':
        eventName = 'chefforparty_page_whatsappclick';
        productNameEvent = 'chef for party page whatsapp button clicked';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedpage_whatsapp_click';
        productNameEvent = `decoration_productlist_categorypage_whatsapp_click_${catValue}`;
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productpage_whatsapp_click';
        productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/balloon-decoration':
        eventName = 'decoration_citypage_whatsappclick';
        productNameEvent = 'decoration page whatsapp button clicked';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedcitypage_whatsapp_click';
        productNameEvent = 'decoration_productlistedcitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/[city]/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productcitypage_whatsapp_click';
        productNameEvent = 'decoration_productcitypage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
        break;
      case '/checkout':
        eventName = 'decoration_checkoutpage_whatsapp_click';
        productNameEvent = 'decoration_checkoutpage_whatsapp_click';
        window.open("https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services")
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
    return router.pathname !== '/order-details' && router.pathname !== '/orderlist' && router.pathname !== '/photo-gallery';
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