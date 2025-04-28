export const openWhatsappRedirection = () => {
    const phoneNumber = '+917338584828';
    const message = 'Hi, I saw your website and want to know more about the services';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
    window.open(whatsappUrl, '_blank');
  };
  