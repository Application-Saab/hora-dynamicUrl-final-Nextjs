import Head from "next/head";
import { isValidCitySlug, getCityNameFromSlug } from "@/utils/validCities";
import { getPageTitleCategory, getPageMetaDescriptionCategory } from "@/utils/Decorationcatseo";
import { weddingDecorationFAQData } from "@/utils/WeddingDecorationFAQData";
import { weddingDecorationDescription } from "@/utils/Weddingdecorationdescription";
import FAQSection from "@/components/FAQSection";
import SectionDescription from "@/components/Description";
import WeddingBanner from "@/components/WeddingBanner";
import weddingBannerImg from "@/assets/Wedding_banner.webp";

const SITE = "https://horaservices.com";
const CAT = "wedding-decoration";

export async function getServerSideProps(context) {
  const citySlug = context.params?.city?.toLowerCase();

  if (!isValidCitySlug(citySlug)) {
    return { notFound: true };
  }

  const cityName = getCityNameFromSlug(citySlug);

  return {
    props: {
      citySlug,
      cityName,
    },
  };
}

export default function WeddingDecorationCityPage({ citySlug, cityName }) {
  const title = getPageTitleCategory(CAT, cityName);
  const description = getPageMetaDescriptionCategory(CAT, cityName);
  const canonical = `${SITE}/${citySlug}/${CAT}`;
  const faqs = weddingDecorationFAQData();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://horaservices.com/api/uploads/attachment-1706520980436.png"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Hora Services" />
        <link
          rel="icon"
          href="https://horaservices.com/api/uploads/logo-icon.png"
          type="image/x-icon"
        />
      </Head>

      <WeddingBanner
        image={weddingBannerImg}
        title="Wedding"
        script="Decorations"
        tagline={cityName ? `Beautiful decoration for every function in ${cityName}` : "Beautiful decoration for every wedding celebration"}
      />

      <SectionDescription sections={weddingDecorationDescription} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqs} />
      </div>
    </>
  );
}
