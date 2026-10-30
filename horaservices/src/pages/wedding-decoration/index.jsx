import Head from "next/head";
import { getPageTitleCategory, getPageMetaDescriptionCategory } from "@/utils/Decorationcatseo";
import { weddingDecorationFAQData } from "@/utils/WeddingDecorationFAQData";
import { weddingDecorationDescription } from "@/utils/Weddingdecorationdescription";
import FAQSection from "@/components/FAQSection";
import SectionDescription from "@/components/Description";

const SITE = "https://horaservices.com";
const CAT = "wedding-decoration";

export default function WeddingDecorationPage() {
  const title = getPageTitleCategory(CAT);
  const description = getPageMetaDescriptionCategory(CAT);
  const canonical = `${SITE}/${CAT}`;
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

      <SectionDescription sections={weddingDecorationDescription} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqs} />
      </div>
    </>
  );
}
