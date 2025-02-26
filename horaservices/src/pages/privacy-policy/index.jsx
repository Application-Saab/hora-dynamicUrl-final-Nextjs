import React from 'react';
import contactusbanner from "../../assets/contactusbanner.png";

import Head from "next/head";

const PrivacyPolicy = () => {
  const styles = {
    textCenter: {
      textAlign: 'center',
    },
    entryContent: {
      padding: '0 20%',
    },
  };

  return (
    <main>
      <Head>
  <title>Privacy Policy - Hora Services</title>
  <meta name="description" content="Read the privacy policy of Hora Services. Learn how we collect, use, and protect your personal data when using our services for event planning, catering, and more." />
  <meta name="keywords" content="privacy policy, data protection, personal data, privacy policy Hora Services, event services privacy, catering privacy policy, balloon decoration privacy, chef for party privacy" />
  <meta property="og:title" content="Privacy Policy - Hora Services" />
  <meta property="og:description" content="Discover how Hora Services handles your privacy. Our privacy policy explains how we protect your personal information and ensure your data is secure when using our services." />
  <meta property="og:image" content="https://horaservices.com/api/uploads/logo-icon.png" />
  <meta property="og:image:alt" content="Privacy Policy page for Hora Services" />
  {/* <script type="application/ld+json">{scriptTag}</script> */}
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
  <meta property="og:url" content="https://horaservices.com/privacy-policy" />
  <meta property="og:type" content="website" />
</Head>

      <div className="container occation-intro-inner col-lg-12 row justify-content-center d-flex align-items-center">
        <h3 style={styles.textCenter}>Privay Policy</h3>
        <div style={styles.entryContent}>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>How do we use your information</h3>
          <p style={{marginTop:"0px"}}>In the process of buying and selling, we collect personal information such as your name, address, and email address. This information is necessary to complete transactions.</p>
          <p>When you browse our store, we collect your computer’s IP address to understand more about your browser and operating system.</p>
          <p>We may also send you promotional emails if you provide consent.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Consent</h3>
          <p style={{marginTop:"0px"}}>When you provide us with personal information for a transaction, we assume you consent to our use of that information for that specific purpose.</p>
          <p>For secondary reasons such as marketing, we will either ask for your explicit consent or provide an opportunity to decline.</p>
          <p>If you change your mind about providing consent, you may withdraw it at any time by contacting us.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Disclosure</h3>
          <p style={{marginTop:"0px"}}>We will only share your personal information if required by law or if you violate our Terms of Use.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Payment</h3>
          <p style={{marginTop:"0px"}}>We use Razorpay for payment processing, which adheres to industry standard security measures to protect your payment information. PCI-DSS Requirements are followed to ensure secure handling of credit card information.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Third Party Services</h3>
          <p style={{marginTop:"0px"}}>Third party vendors that we use only collect, use and disclose your information as necessary to provide services to us. However, we encourage you to read their privacy policies to understand how they handle your information.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Security</h3>
          <p style={{marginTop:"0px"}}>We take reasonable steps to protect your personal information from inappropriate use, access, disclosure, alteration or destruction.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Cookies</h3>
          <p style={{marginTop:"0px"}}>We use cookies to maintain your users session and improve the user experience.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Age Of Consent</h3>
          <p style={{marginTop:"0px"}}>By using this website, you represent that you are at least the age of majority in the state or province in which you reside.</p>
          <h3 style={{ color:"rgb(157, 74, 147)" , marginBottom:"0px"}}>Changes To This Privacy Policy</h3>
          <p style={{marginTop:"0px"}}>We may update this Privacy Policy from time to time and will notify you of any material changes.</p>
        </div>
      </div>
    </main>
  );
}

export default PrivacyPolicy;
