import Head from "next/head";
import Decoration from "@/components/Decoration/Decoration";
import SectionDescription from "@/components/Description";
import FAQSection from "@/components/FAQSection";
import { decorationCityDescription } from "@/utils/DecorationDescription";
import { decorationCityFAQData } from "@/utils/DecorationCityFAQ";
import { getDecorationOrganizationSchema } from "@/utils/schema";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default function BalloonDecorationPage() {
  const orgSchema = getDecorationOrganizationSchema();

  // decorationCityDescription already { heading, blocks } shape mein hai,
  // isliye seedha use ho sakta hai — koi conversion nahi chahiye
  const descriptionSections = decorationCityDescription;

  // Generic FAQs, bina kisi city ke reference ke
  const faqData = decorationCityFAQData();

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </Head>

      <Decoration />

      <SectionDescription sections={descriptionSections} />

      <div className="tab-section-details-productpage">
        <FAQSection faqData={faqData} />
      </div>
    </>
  );
}
