import React from "react";
import Head from "next/head";

const PrivacyPolicy = () => {
  const styles = {
    textCenter: {
      textAlign: "center",
    },
    entryContent: {
      padding: "0 20%",
    },
    heading: {
      color: "rgb(157, 74, 147)",
      marginBottom: "0px",
    },
    paragraph: {
      marginTop: "0px",
    },
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | HORA Services</title>

        <meta
          name="description"
          content="Read the Privacy Policy of HORA Services to understand how we collect, use, protect and handle your personal information."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href="https://horaservices.com/privacy-policy"
        />
      </Head>

      <main>
        <div className="container occation-intro-inner col-lg-12 row justify-content-center d-flex align-items-center">
          <h3 style={styles.textCenter}>
            Privacy Policy
          </h3>

          <div style={styles.entryContent}>
            <h3 style={styles.heading}>
              How do we use your information
            </h3>

            <p style={styles.paragraph}>
              In the process of buying and selling, we collect personal
              information such as your name, address, and email address.
              This information is necessary to complete transactions.
            </p>

            <p>
              When you browse our store, we collect your computer’s IP
              address to understand more about your browser and operating
              system.
            </p>

            <p>
              We may also send you promotional emails if you provide
              consent.
            </p>

            <h3 style={styles.heading}>
              Consent
            </h3>

            <p style={styles.paragraph}>
              When you provide us with personal information for a
              transaction, we assume you consent to our use of that
              information for that specific purpose.
            </p>

            <p>
              For secondary reasons such as marketing, we will either ask
              for your explicit consent or provide an opportunity to
              decline.
            </p>

            <p>
              If you change your mind about providing consent, you may
              withdraw it at any time by contacting us.
            </p>

            <h3 style={styles.heading}>
              Disclosure
            </h3>

            <p style={styles.paragraph}>
              We will only share your personal information if required by
              law or if you violate our Terms of Use.
            </p>

            <h3 style={styles.heading}>
              Payment
            </h3>

            <p style={styles.paragraph}>
              We use Razorpay for payment processing, which adheres to
              industry standard security measures to protect your payment
              information. PCI-DSS Requirements are followed to ensure
              secure handling of credit card information.
            </p>

            <h3 style={styles.heading}>
              Third Party Services
            </h3>

            <p style={styles.paragraph}>
              Third party vendors that we use only collect, use and
              disclose your information as necessary to provide services
              to us. However, we encourage you to read their privacy
              policies to understand how they handle your information.
            </p>

            <h3 style={styles.heading}>
              Security
            </h3>

            <p style={styles.paragraph}>
              We take reasonable steps to protect your personal
              information from inappropriate use, access, disclosure,
              alteration or destruction.
            </p>

            <h3 style={styles.heading}>
              Cookies
            </h3>

            <p style={styles.paragraph}>
              We use cookies to maintain your users session and improve
              the user experience.
            </p>

            <h3 style={styles.heading}>
              Age Of Consent
            </h3>

            <p style={styles.paragraph}>
              By using this website, you represent that you are at least
              the age of majority in the state or province in which you
              reside.
            </p>

            <h3 style={styles.heading}>
              Changes To This Privacy Policy
            </h3>

            <p style={styles.paragraph}>
              We may update this Privacy Policy from time to time and
              will notify you of any material changes.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

/**
 * ================================
 * SERVER-SIDE RENDERING
 * ================================
 *
 * This forces Next.js Pages Router to
 * render this page on every request.
 */
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default PrivacyPolicy;