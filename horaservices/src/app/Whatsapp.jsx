import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whatsppicon from "../assets/whatsapp-new.webp";

const WhatsAppIcon = ({ router }) => {
  const { pathname, query } = router;
  const { catValue, productName } = query;

  const handleWhatsAppClick = () => {
    console.log(pathname, "pathname");
    let eventName = '';
    let productNameEvent = '';

    switch (pathname) {
      case '/balloon-decoration':
        eventName = 'decoration_page_whatsappclick';
        productNameEvent = 'decoration page whatsapp button clicked';
        break;
      case '/book-chef-cook-for-party':
        eventName = 'chefforparty_page_whatsappclick';
        productNameEvent = 'chef for party page whatsapp button clicked';
        break;
      case '/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedpage_whatsapp_click';
        productNameEvent = `decoration_productlist_categorypage_whatsapp_click_${catValue}`;
        break;
      case '/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productpage_whatsapp_click';
        productNameEvent = `decoration_productpage_whatsapp_click_${productName}`;
        break;
      case '/[city]/balloon-decoration':
        eventName = 'decoration_citypage_whatsappclick';
        productNameEvent = 'decoration page whatsapp button clicked';
        break;
      case '/[city]/balloon-decoration/[catValue]':
        eventName = 'decoration_productlistedcitypage_whatsapp_click';
        productNameEvent = `decoration_productlistedcitypage_whatsapp_click`;
        break;
      case '/[city]/balloon-decoration/[catValue]/product/[productName]':
        eventName = 'decoration_productcitypage_whatsapp_click';
        productNameEvent = `decoration_productcitypage_whatsapp_click`;
        break;
      default:
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

  return (
    <Link href="https://wa.me/+917338584828/?text=Hi%2CI%20saw%20your%20website%20and%20want%20to%20know%20more%20about%20the%20services" target="_blank">
      <Image
        className='whatappicon'
        src={whatsppicon}
        alt="WhatsApp Icon"
        onClick={handleWhatsAppClick}
      />
    </Link>
  );
};

export default WhatsAppIcon;