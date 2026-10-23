import Head from "next/head";

import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import PhotographyLanding, {
  STANDARD_PACKAGE_TAG_ID,
} from "@/components/PhotographyLanding";
import seoData from "@/utils/photographyseodata.json";
import { getPhotographyOrganizationSchema } from "@/utils/schema";
import { SeoMain } from "@/utils/photoGraphyHead";
import { photographyFAQData } from "@/utils/PhotographyPagesfaqdata";
import { photographyDescription } from "@/utils/Photographydescription";
import { BASE_URL, GET_PHOTOGRAPHY_BY_TAG } from "@/utils/apiconstants.js";
import axiosApi from "@/utils/axiosApi";
import PhotographyHowItWorks from "@/components/PhotographyHowItWorks";
import PhotographyComparison from "@/components/PhotographyComparison";

const getDiscountedPrice = (price = 0) => {
  const discountedPrice = price / 0.78;
  const discountDifference = discountedPrice - price;
  const discount = ((discountDifference / discountedPrice) * 100).toFixed(0);
  return {
    discount: Number(discount),
    discountedPrice: Math.round(discountedPrice),
    discountDifference: Math.round(discountDifference),
  };
};

// ---------- SSR ----------
export async function getServerSideProps(context) {
  const { city, locality } = context.params || {};
  const query = context.query || {};

  const finalCity = city || query.city || null;
  const finalLocality = locality || query.locality || null;

  let standardPackages = [];

  try {
    const res = await axiosApi.get(
      `${BASE_URL}${GET_PHOTOGRAPHY_BY_TAG}${STANDARD_PACKAGE_TAG_ID}`,
    );

    standardPackages =
      res.data?.data?.map((item) => {
        const { discountedPrice, discountDifference } = getDiscountedPrice(
          item.price || 0,
        );
        return { ...item, discountedPrice, discountDifference };
      }) || [];
  } catch (err) {
    console.error("SSR photography packages fetch error:", err.message);
  }

  return {
    props: {
      city: finalCity,
      locality: finalLocality,
      initialPackages: standardPackages,
    },
  };
}

// ---------- Page ----------
const PhotographyIndexPage = ({ city, locality, initialPackages }) => {
  // const scriptTag = JSON.stringify(getPhotographyOrganizationSchema());
  // const seo = seoData.defaultSeo;
  // const pageUrl = "https://horaservices.com/photography";
  const scriptTag = getPhotographyOrganizationSchema();
  const cityKey = city ? String(city).toLowerCase() : null;
  const cityContent = cityKey ? CityPhotographyLandingPage[cityKey] : null;
  // City-specific FAQs (from city data) combined with general FAQs
  const cityFaqs = cityContent?.faqs || [];
  const generalFaqs = photographyFAQData();
  const combinedFaqs = cityFaqs.length > 0
    ? [...cityFaqs, ...generalFaqs.slice(0, Math.max(0, 9 - cityFaqs.length))]
    : generalFaqs;

  return (
    <>
      {/* <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: scriptTag }}
        />
      </Head> */}
      <SeoMain city={city} locality={locality} scriptTag={scriptTag} />

      <PhotographyLanding
        city={city}
        locality={locality}
        initialPackages={initialPackages}
      />
     
      <PhotographyComparison/>
      <PhotographyHowItWorks />

      <div style={{ maxWidth: "480px", margin: "auto" }}>
        <SectionDescription sections={photographyDescription} />

        <div className="tab-section-details-productpage">
          <FAQSection faqData={photographyFAQData()} heading="FAQ" />
        </div>
      </div>
    </>
  );
};

export default PhotographyIndexPage;